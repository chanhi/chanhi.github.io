---
title: "ARM64 어셈블리로 퀵정렬 구현"
slug: arm64-assembly-quicksort
date: 2026-10-25
subcategory: system
tags: [Computer Architecture, ARM64, AArch64, Assembly, Quick Sort]
summary: C로 된 퀵정렬을 ARM64(LEGv8 표기) 어셈블리로 옮기면서 레지스터 사용 규약, 스택 프레임, 재귀 호출을 어떻게 처리했는지 정리했습니다.
source: D:/KGU/4-1/컴퓨터구조/과제/homework6.s
draft: false
---

## 개요

컴퓨터구조 과제로 퀵정렬을 ARM64 어셈블리로 작성했습니다. C로 된 `swap`과 `quickSort`가 주어지고, 같은 동작을 하는 어셈블리 함수 `swap`, `quick_sort`를 `homework6.s`에 작성해 C의 `main`에서 호출하는 형식입니다.

퀵정렬 자체보다는 **어셈블리에서 함수를 부르는 일**이 핵심입니다. `quick_sort`는 `swap`을 부르고 자기 자신을 두 번 재귀 호출하므로 다음을 직접 챙겨야 합니다.

1. 인자와 반환 주소가 어느 레지스터로 오가는지 (호출 규약)
2. 호출 후에도 살아 있어야 하는 값을 어디에 둘지 (callee-saved 레지스터)
3. 그 레지스터와 복귀 주소를 어떻게 저장·복원할지 (스택 프레임)

> [!note] 표기
> 명령어는 교재(Patterson & Hennessy, *Computer Organization and Design ARM Edition*)의 **LEGv8** 표기를 따랐습니다. `LDUR`/`STUR`(오프셋 기반 load/store), `BR LR`(복귀) 같은 형태입니다. GCC(GNU as)로 AArch64 환경에서 그대로 어셈블됩니다.

## 과제: C 코드와 호출 측

어셈블리로 옮길 원본 C 코드입니다. 배열 원소는 `long long`(8바이트)입니다.

```c title="원본 C 코드"
void swap(long long *a, long long *b) {
    long long temp = *a;
    *a = *b;
    *b = temp;
}

void quickSort(long long a[], long long start, long long end) {
    if (start >= end) return;
    long long key = start, i = start + 1, j = end;
    while (i <= j) {
        while (i <= end && a[i] <= a[key]) i++;
        while (j > start && a[j] >= a[key]) j--;
        if (i > j) swap(&a[key], &a[j]);
        else       swap(&a[i], &a[j]);
    }
    quickSort(a, start, j - 1);
    quickSort(a, j + 1, end);
}
```

`main.c`는 어셈블리 함수를 `extern`으로 선언하고 호출만 합니다.

```c title="main.c (발췌)"
extern void quick_sort(long long a[], long long start, long long end);

int main() {
    long long a[1000], n;
    /* n과 a[0..n-1]을 입력받음 */
    quick_sort(a, 0, n - 1);
    /* 정렬 결과 출력 */
}
```

```text title="실행 예"
n : 5
a[0] : 2
a[1] : 7
a[2] : 4
a[3] : 9
a[4] : 3
Sorted array:
2	3	4	7	9
```

## 레지스터 사용 규약

ARM64(AAPCS64)에서 함수 호출에 관련된 레지스터 규칙은 다음과 같습니다.

| 레지스터 | 용도 | 호출 후 보존 |
| --- | --- | --- |
| `X0`~`X7` | 인자 전달, `X0`은 반환값 | 보장 안 함 (caller-saved) |
| `X9`~`X15` | 임시 값 | 보장 안 함 (caller-saved) |
| `X19`~`X28` | 오래 살아야 하는 값 | **보장** (callee-saved: 쓰려면 피호출자가 저장·복원) |
| `X30` (`LR`) | 복귀 주소. `BL`이 여기에 덮어씀 | 보장 안 함 |
| `SP` | 스택 포인터. 16바이트 정렬 유지 | 보장 |

`quick_sort(a, start, end)`를 호출하면 `X0 = a`(배열 시작 주소), `X1 = start`, `X2 = end`가 들어옵니다. 문제는 이 함수가 중간에 `swap`과 자기 자신을 부른다는 점입니다. 그때마다 `X0`~`X2`에 새 인자를 넣어야 하고, 호출된 쪽은 `X0`~`X15`를 마음대로 써도 되므로 원래 값은 사라집니다.

그래서 **호출을 건너 살아 있어야 하는 값은 전부 callee-saved 레지스터로 옮겼습니다.**

| 레지스터 | C 변수 | 이유 |
| --- | --- | --- |
| `X19` | `a` | 모든 호출 뒤에도 배열 주소 필요 |
| `X20` | `start` | 두 번째 재귀 전까지, 그리고 피벗 위치로 사용 |
| `X21` | `end` | 바깥 루프 조건, 두 번째 재귀 인자 |
| `X22` | `i` | `swap` 호출 뒤에도 루프 계속 |
| `X23` | `j` | `swap` 호출 뒤에도 루프 계속, 재귀 인자 |
| `X24` | `a[key]` (피벗 값) | 루프 내내 비교에 사용 |
| `X9`, `X10` | 주소 계산, `a[i]`/`a[j]` 임시 값 | 호출 사이에서 바로 쓰고 버림 |

C 코드의 `key`는 항상 `start`이므로 별도 레지스터를 두지 않고, 피벗 **값**인 `a[start]`를 처음에 한 번 읽어 `X24`에 고정했습니다. 루프 안에서 `a[key]`를 매번 메모리에서 다시 읽지 않아도 됩니다.

## swap: 스택이 필요 없는 leaf 함수

```asm title="homework6.s — swap"
swap:
    LDUR X2, [X0, #0]   // temp = *a
    LDUR X3, [X1, #0]   // *b 값 읽기
    STUR X3, [X0, #0]   // *a = *b
    STUR X2, [X1, #0]   // *b = temp
    BR LR
```

`swap`은 다른 함수를 부르지 않는 **leaf 함수**입니다. `BL`을 하지 않으므로 `LR`이 덮어써질 일이 없고, 임시 값도 caller-saved인 `X2`, `X3`만 쓰므로 저장할 레지스터가 없습니다. 따라서 스택 프레임 없이 바로 `BR LR`로 돌아갑니다.

`X2`는 `quick_sort`의 `end` 인자가 들어오던 레지스터지만, `quick_sort`는 이미 `end`를 `X21`로 옮겨 두었기 때문에 `swap`이 덮어써도 문제가 없습니다. 규약을 지키면 이런 부분을 함수끼리 서로 신경 쓰지 않아도 됩니다.

## quick_sort: 스택 프레임

### 기저 조건을 프레임보다 먼저

```asm title="homework6.s — quick_sort 진입"
quick_sort:
    CMP X1, X2
    B.GE qs_exit          // start >= end 이면 바로 복귀
    SUB SP, SP, #64       // 프레임 할당
    STUR LR,  [SP, #56]
    STUR X19, [SP, #48]
    STUR X20, [SP, #40]
    STUR X21, [SP, #32]
    STUR X22, [SP, #24]
    STUR X23, [SP, #16]
    STUR X24, [SP, #8]

    MOV X19, X0           // a
    MOV X20, X1           // start
    MOV X21, X2           // end
```

`if (start >= end) return;` 검사를 프레임 할당보다 **먼저** 했습니다. 재귀 퀵정렬은 원소가 0~1개인 구간으로 자주 호출되는데, 이 경우 레지스터를 저장하고 복원하는 일 자체가 필요 없습니다. 아직 아무것도 건드리지 않았으므로 `qs_exit`에서 `BR LR`만 하면 됩니다.

비교에는 **부호 있는** 조건 `B.GE`를 썼습니다. `quick_sort(a, start, j - 1)`에서 `j = 0`이면 `end = -1`이 들어옵니다. 부호 없는 조건(`B.HS`)을 쓰면 `-1`이 아주 큰 양수로 해석되어 기저 조건을 통과해 버립니다.

### 프레임 구성

저장할 값은 `LR` + `X19`~`X24`로 7개, 56바이트입니다. ARM64는 `SP`를 **16바이트 배수**로 유지해야 하므로 64바이트를 잡고 맨 아래 8바이트는 비워 두었습니다.

```text title="quick_sort 스택 프레임 (높은 주소가 위)"
         ┌──────────────┐  ← 호출 전 SP
SP + 56  │  LR (X30)    │
SP + 48  │  X19         │
SP + 40  │  X20         │
SP + 32  │  X21         │
SP + 24  │  X22         │
SP + 16  │  X23         │
SP +  8  │  X24         │
SP +  0  │  (정렬용 빈칸) │
         └──────────────┘  ← 현재 SP
```

`LR`을 저장하는 이유는 함수 안에서 `BL swap`, `BL quick_sort`를 하기 때문입니다. `BL`은 복귀 주소를 `LR`에 덮어쓰므로, 저장해 두지 않으면 마지막 `BR LR`이 자기 자신 안의 엉뚱한 위치로 돌아갑니다.

> [!tip] 최적화하면 더 줄일 수 있는 부분
> `STP`/`LDP`(레지스터 쌍 저장·복원)를 쓰면 저장 명령 7개를 4개로 줄일 수 있습니다. 또 GCC가 만드는 코드는 보통 `X29`(프레임 포인터)도 함께 저장해 디버거가 호출 스택을 추적할 수 있게 합니다. 과제에서는 교재 표기에 맞춰 `STUR`만 썼고 프레임 포인터는 생략했습니다.

## 분할(partition) 루프

배열 원소 주소는 `a + i * 8`입니다. 곱셈 대신 왼쪽 시프트 3비트(`LSL #3`)로 8을 곱합니다.

```asm title="homework6.s — 피벗과 i, j 초기화"
    LSL X9, X20, #3       // start * 8
    ADD X9, X19, X9       // &a[start]
    LDUR X24, [X9, #0]    // pivot = a[start]
    ADD X22, X20, #1      // i = start + 1
    MOV X23, X21          // j = end
```

C의 `while` 두 개는 조건 검사 → 본문 → 처음으로 분기하는 구조로 옮겼습니다. `&&`로 묶인 조건은 앞 조건이 거짓이면 바로 루프를 빠져나가도록 두 번의 분기로 나눴습니다.

```asm title="homework6.s — 안쪽 while 두 개"
while_i:                  // while (i <= end && a[i] <= pivot) i++;
    CMP X22, X21
    B.GT while_j          // i > end 이면 종료
    LSL X9, X22, #3
    ADD X9, X19, X9
    LDUR X10, [X9, #0]    // X10 = a[i]
    CMP X10, X24
    B.GT while_j          // a[i] > pivot 이면 종료
    ADD X22, X22, #1
    B while_i

while_j:                  // while (j > start && a[j] >= pivot) j--;
    CMP X23, X20
    B.LE swap_check       // j <= start 이면 종료
    LSL X9, X23, #3
    ADD X9, X19, X9
    LDUR X10, [X9, #0]    // X10 = a[j]
    CMP X10, X24
    B.LT swap_check       // a[j] < pivot 이면 종료
    SUB X23, X23, #1
    B while_j
```

루프가 멈추면 `i`와 `j`의 위치를 비교해 어느 쪽을 교환할지 정합니다. `swap`의 인자로 두 원소의 **주소**를 `X0`, `X1`에 넣어 호출합니다.

```asm title="homework6.s — 교환"
swap_check:
    CMP X22, X23
    B.GT swap_pivot       // i > j: 교차했으므로 피벗을 제자리로
    LSL X9, X22, #3
    ADD X0, X19, X9       // X0 = &a[i]
    LSL X9, X23, #3
    ADD X1, X19, X9       // X1 = &a[j]
    BL swap
    B while_outer         // 다시 바깥 루프 조건 검사

swap_pivot:
    LSL X9, X20, #3
    ADD X0, X19, X9       // X0 = &a[start]
    LSL X9, X23, #3
    ADD X1, X19, X9       // X1 = &a[j]
    BL swap
```

`BL swap` 뒤에 `X22`, `X23`, `X24`를 그대로 다시 쓸 수 있는 것이 callee-saved 레지스터를 고른 효과입니다. 만약 `i`를 `X9` 같은 임시 레지스터에 두었다면, `swap`이 지금은 `X9`를 쓰지 않더라도 규약상 보존을 기대할 수 없으므로 호출 전후로 직접 저장해야 합니다.

> [!note] `while_outer`의 탈출 경로
> 바깥 루프는 `while_outer`에서 `i > j`를 검사해 `while_outer_end`로 빠지는 경로도 있지만, 실제로는 항상 `swap_check`에서 `i > j`를 만나 `swap_pivot`을 거쳐 빠져나옵니다. 처음 진입할 때는 `start < end`이므로 `i = start + 1 <= end = j`이고, `swap` 뒤에는 `i`, `j`를 바꾸지 않은 채 돌아오므로 `while_outer` 검사에서 곧바로 `i > j`가 되는 경우가 없기 때문입니다.

## 재귀 호출과 복귀

분할이 끝나면 피벗은 `j` 위치에 있습니다. 왼쪽 `[start, j-1]`과 오른쪽 `[j+1, end]`를 차례로 재귀 호출합니다.

```asm title="homework6.s — 재귀 호출과 에필로그"
while_outer_end:
    MOV X0, X19           // a
    MOV X1, X20           // start
    SUB X2, X23, #1       // j - 1
    BL quick_sort
    MOV X0, X19           // a
    ADD X1, X23, #1       // j + 1
    MOV X2, X21           // end
    BL quick_sort

qs_restore:
    LDUR LR,  [SP, #56]
    LDUR X19, [SP, #48]
    LDUR X20, [SP, #40]
    LDUR X21, [SP, #32]
    LDUR X22, [SP, #24]
    LDUR X23, [SP, #16]
    LDUR X24, [SP, #8]
    ADD SP, SP, #64       // 프레임 해제
qs_exit:
    BR LR
```

첫 번째 재귀 호출이 돌아온 뒤 두 번째 호출의 인자를 만들 때 `X19`, `X21`, `X23`을 다시 읽습니다. 재귀로 들어간 `quick_sort`도 같은 레지스터를 쓰지만, 진입할 때 스택에 저장하고 나올 때 복원하므로 호출한 쪽에서는 값이 그대로 남아 있습니다. **재귀 호출이 가능한 이유가 바로 이 저장·복원**입니다. 호출이 깊어질 때마다 64바이트 프레임이 하나씩 쌓이고, 돌아올 때 하나씩 풀립니다.

예제 입력 `[2, 7, 4, 9, 3]`으로 따라가 보면 다음과 같습니다.

| 호출 | 피벗 | 분할 과정 | 결과 배열 | 다음 호출 |
| --- | --- | --- | --- | --- |
| `qs(0, 4)` | 2 | `i`는 7에서 멈춤(i=1), `j`는 0까지 내려감 → `i > j`, `a[0]`과 `a[0]` 교환 | `[2, 7, 4, 9, 3]` | `qs(0,-1)`, `qs(1,4)` |
| `qs(0,-1)` | - | `start >= end` → 프레임 없이 복귀 | | |
| `qs(1, 4)` | 7 | i=3(9), j=4(3) → 9와 3 교환 → i=4, j=3 → `a[1]`과 `a[3]` 교환 | `[2, 3, 4, 7, 9]` | `qs(1,2)`, `qs(4,4)` |
| `qs(1, 2)` | 3 | i=2(4), j=1 → `a[1]`과 `a[1]` 교환 | `[2, 3, 4, 7, 9]` | `qs(1,0)`, `qs(2,2)` |

`qs(0, -1)`처럼 `end`가 음수가 되는 호출이 실제로 나오므로, 앞에서 말한 부호 있는 비교(`B.GE`)가 꼭 필요합니다.

## 정리

- 인자는 `X0`~`X2`로 받고, **호출을 건너 살아야 하는 값은 `X19`~`X24`(callee-saved)로 옮겨** 썼습니다. 루프 안에서 잠깐 쓰는 값만 `X9`, `X10`에 둡니다.
- 다른 함수를 부르는 함수는 `BL`이 `LR`을 덮어쓰므로 `LR`과 사용한 callee-saved 레지스터를 스택에 저장합니다. `SP`는 16바이트 정렬을 지켜 64바이트를 할당했습니다.
- `swap` 같은 leaf 함수는 `LR`을 건드리지 않고 caller-saved 레지스터만 쓰면 스택 프레임이 필요 없습니다.
- 기저 조건을 프레임 할당 전에 검사해 빈 구간 호출 비용을 줄였고, `end = -1`이 들어올 수 있으므로 부호 있는 분기(`B.GE`)를 썼습니다.

##### 참조

- David A. Patterson, John L. Hennessy, *Computer Organization and Design ARM Edition*, Chapter 2 (LEGv8 명령어, 프로시저 호출)
- [Arm — Procedure Call Standard for the Arm 64-bit Architecture (AAPCS64)](https://github.com/ARM-software/abi-aa/blob/main/aapcs64/aapcs64.rst)
- [Arm A64 Instruction Set Architecture](https://developer.arm.com/documentation/ddi0602/latest)
