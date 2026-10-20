---
title: "Recursion(재귀) algorithm 과 D&C(분할과 정복) 시간복잡도 분석"
slug: tistory-6
date: 2025-06-06
subcategory: algorithm
tags: ["Algorithm"]
tistory: https://chanhuy.tistory.com/6
---

recursion을 알기 전에 reduction에 대해 먼저 알아보자

일단 알고리즘에서 자주 사용하는 (거의) 유일한 기술이라고 수업에서 배웠다.

기술이라고하니 거창해 보이지만 단순하게 표현하면 black box라고 보면 된다.

이게 뭔 말이냐면 어떤 함수 Y에서 X라는 함수를 호출하는데 이 X를 black box라고 생각한다는 것이다. 즉 X는 안이 안보이고 그저 원하는 결과값이 나오는지만 확인하면 된다.

그렇다면 recursion은 무엇인가?

바로 같은 문제로 계속해서 reduction을 하는 것이다.

예를 들어서 Factorial를 점화식과 코드로 보면

n! =

-   n=0일 때 1
-   n>0일 때 nx(n-1)!

```
int fact(int n) {  
if(n==0)  
return 0;  
else  
return n*fact(n-1); //재귀, Reduction  
}  
```

점화식에서 보이는 것 같이 n>0일 때 다시 (n-1)! 팩토리얼 문제를 푼다. 즉 nx(n-1)!은 X 함수인 것이고 우리는 이 X함수가 안에서 어떤 일이 일어나는지 무시하고 결과로 다음 팩토리얼의 결과가 나온다는 것만 알고 있으면 된다. 그르면 n=5라면 4!이라는 결과가 나오고 4! 안에서 같은 내용의 문제를 계속해서 풀 것이니 무시하고 4!이 나온다는 것만 알면 된다. (이게 쓰면서 설명을 잘한지는 모르겠다)

이제 재귀 함수의 시간복잡도 분석에 대해서 알아보자

아주 유우명한 Hanoi Tower의 규칙을 간략하게 소개하자면

-   한 번에 하나의 디스크(disc)를 원래의 말뚝(peg)에서 다른 말뚝으로 옮긴다(move)
-   큰 디스크가 작은 디스크 위에 올라가서는 안된다

다음 규칙을 따르면서 n개의 디스크를 말뚝1에서 말뚝 3으로 옮기는 방법과 몇 번의 move가 필요한지 구한다

![[6-1.png]]

물론 하나씩 옮기면서 해보는 방법도 있지만 당연히 재귀를 활용할 것이다.

n개의 disc를 peg1에서 peg2로 옮기려면

1.  n-1개의 disc를 peg1에서 peg2로 옮긴다 (recursion)
2.  disc n을 peg1에서 peg3으로 이동(move)
3.  n-1개의 disc를 peg2에서 peg3으로 옮긴다 (recursion)

아까 recursion은 계속되는 같은 문제에 대해 reduction하는 것이라고 했다. 그리고 reduction은 그 안에서 무슨 일이 일어나는지 무시하고 결과만 본다고 했다. 즉 n-1개의 디스크를 옆 말뚝으로 옮기는 것은 계속해서 같은 문제를 반복할 것이기 때문에 그 재귀로 했다 치고 남은 제일 큰 디스크를 끝으로 옮긴 뒤 n-1개의 원판을 그 위로 재귀로 올리는 것이다. 머리속으로 대충 몇 번 하다 보면 계속해서 같은 행위를 하는 것을 알 수 있을 것이다.

이걸 수도코드로 보면

```
Hanoi(n, src, dst, tmp):
  if n>0
    Hanoi(n-1, src, tmp, dst) //recursion
    move disk n from src to dst
    Hanoi(n-1, tmp, dst, src) //recursion
```

그렇다면 시간 복잡도를 구하기 위해서는 move연산이 몇 번 수행되었는지를 고려해야 한다.

move는 n=1일 때 1번, n=2일 때 3번, n=3일 때 7번 ...이고

Hanoi(n) 함수를 실행했을 때 move연산 수행 횟수를 T(n)이라고 하면

T(0) = 0, T(1) = 1, T(2) = 3, T(3) = 7, ...이다. 이걸 활용해서 위의 코드를 점화식으로 표현하면

T(n) = T(n-1) + T(n-1) + 1(move) = ...(트리 형태로 계속 이어나감)

T(n) =

-   0 (n=0)
-   2 x T(n-1) + 1 (n>0)

이번엔 Merge Sort를 예로 들어 보겠다.

Mergesort는 다음과 같이 recursion을 수행한다

1.  주어진 배열을 대략 절반으로 둘로 나눈다
2.  두 subarray를 각각 정렬한다
3.  정렬된 두 subarray를 merge해서 하나의 정렬된 배열로 만든다.

```bash
MergeSort(A[1..n]):
  if n>1
    m = [n/2]
    MergeSort(A[1..m]) //recursion
    MergeSort(A[m+1..n]) // recursion
    Merge(A[1..n], m)
```

이제 이 코드를 점화식으로 바꾸면 T(n) = T(n/2) + T(n/2) + O(n) = 2T(n/2) + O(n)

![[6-2.png]]

이 recursion tree를 보면 첫 루트 노드가 n번의 수행을 하고 두번째 줄도 다 합치면 n번, 계속해서 총 합이 n번의 수행을 한다. 그렇다면 총 수행 시간은 n x (tree의 깊이) 일 것이다. 트리의 깊이는 $log\_2 n$이기 때문에 상수는 무시하고 이 점화식의 시간복잡도를 구하면 O(nlogn)이 된다.

여기서 잠깐 Divide and Conquer(분할과 정복) 통칭 D&C 기법에 대해서 설명하겠다.

D&C는 말 그대로 어떤 문제를 더 작은 문제로 분할하고 그 작은 문제를 Recursion 요정에게 맞겨버리고 그 결과를 다시 결합하는 것이다.(수업 때 recursion 요정이 내 옆에 있다고 생각하라고 하셨던 것 같다.)

위의 mergesort recursion 풀이도 D&C로 볼 수 있다.

그리고 위에 recursion tree에 대해서 자세히 보자면 다음은 T(n) = rT(n/c) + f(n)의 recursion tree이다.

![[6-3.png]]

tree 깊이 = $log\_c n$

nodes(leaves) = $r^{log\_c n}$ = $n^{log\_c r}$

네모 안에 있는게 연산 수고 그걸 전부 합하면 걸린 시간이 된다. 그리고 그걸 추상화 하면 시간 복잡도가 되는 것이다.

근데 이걸 항상 tree를 그리면서 구하기는 귀찮기 때문에 특정 경우에 사용할 수 있는 공식이 있다

Master Theorem

점화식이 T(n) = rT(n/c) + O(f(n))의 형태일 때

case1. f(n) = Ω($𝑛^{log\_c r}$) 이면 T(n) = O(f(n))

case2. f(n) = Θ ($𝑛^{log\_c r}log^k n$) 이면 T(n) = O(f(n)logn)

case3. f(n) = O($𝑛^{log\_c r}$) 이면 T(n) = O( $𝑛^{log\_c r}$ )

이제 아까 Mergesort의 점화식인 T(n) = 2T(n/2) + O(n)을 Master Theorem로 풀이하면 $n^{log\_2 2}$  = n, f(n) = n이므로 case2 => O(nlogn)

연습을 조금 해보면

A(n) = 2A(n/4) + $\\sqrt{n}$ -> case2 -> O($\\sqrt{n}logn$)  
B(n) = 2B(n/4) +n -> case1 -> O(n)  
C(n) = 2C(n/4) + $n^2$ -> case1 -> O($n^2$)  
D(n) = 3D(n/3) + $\\sqrt{n}$ -> case3 -> O(n)  
E(n) = 3E(n/3) +n -> case2 -> O(nlogn)  
F(n) =3F(n/3) + $n^2$ -> case1 -> O($n^2$)  
G(n) =4G(n/2) + $\\sqrt{n}$ -> case3 -> O($n^2$)  
H(n) =4H(n/2) +n -> case3 -> O($n^2$)  
I(n) =4I(n/2) + $n^2$ -> case2 -> O($n^2logn$)

알고리즘 수업을 들으면서 가장 어려웠고 오래 이해 못했던 파트다. 사실 지금도 잘 이해하고 있는지는 모르겠다. 시간복잡도를 구하는 것은 알고리즘 공부의 시작이라고 느겼기 때문에 이부분은 계속 보강해야 할 듯하다.

문제 및 사진 출처 Algorithms by Jeff Erickson
