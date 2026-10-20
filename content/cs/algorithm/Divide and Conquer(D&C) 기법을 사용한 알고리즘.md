---
title: "Divide and Conquer(D&C) 기법을 사용한 알고리즘"
slug: tistory-8
date: 2025-06-06
subcategory: algorithm
tags: ["Algorithm"]
tistory: https://chanhuy.tistory.com/8
---

Divide and Conquer(D&C)?

분할&정복 기법, 말 그대로 문제를 분할해서 해결하는 기법이다

1\. 문제를 분할 해서 smaller instance로 만들기

2\. recursion을 사용해서 작은 문제에 대한 답을 얻음

3\. 병합해서 원래 문제에 대한 답을 도출

대충 이런식으로 문제를 해결하는 방식을 말한다.

Multiplication 문제

어떤 숫자 x 곱하기 y를 D&C로 풀어보자

일단 숫자를 갈라보자.

$x = 10^ma + b, y = 10^mc+d$ (m = (n/2))

$xy = 10^{2m}ac + 10^m(bc + ad) + bd$

```bash
DCMultiply(x, y, n):
  if n=1
    return x*y
  else
    m = n/2
    a = x/10^m, b = x mod 10^m
    c = y/10^m, d = y mod 10^m
    e = DCMultiply(a, c, m)
    f = DCMultiply(b, d, m)
    g = DCMultiply(b, c, m)
    h = DCMultiply(a, d, m)
    return 10^{2m}e + 10^m(g + h) + f
```

smaller instance: n/2 사이즈의 instance들을 4번 recursive

나머지 O(n)번 수행

점화식을 구하면 T(n) = 4T(n/2) + O(n)

마스터 정리를 쓰면 O(n^2)

사실 O(n^2)이면 그냥 반복문에 돌린거랑 마찬가지의 시간을 가진다. 그러면 더 빠른 방법을 찾기 위해서는 recursive연산을 줄여야 할 듯하다.

곱셈식에서 중복되는 것을 만들도록 변형해보자

$xy = 10^{2m}ac + 10^m(bc + ad) + bd$

$bc + ad = ac + bd - (a-b)(c-d)$

이러면 ac, bd, a, b, c, d의 값만 구해서 곱을 구할 수 있다.

```bash
FastDCMultiply(x, y, n):
  if n=1
    return x*y
  else
    m = n/2
    a = x/10^m, b = x mod 10^m
    c = y/10^m, d = y mod 10^m
    e = DCMultiply(a, c, m)
    f = DCMultiply(b, d, m)
    g = DCMultiply(a-b, c-d, m)
    return 10^{2m}e + 10^m(e+f-g) + f
```

점화식을 구하면 T(n) = 3T(n/2) + O(n), 마스터 정리를 쓰면 O($n^{log\_2 3}$), 약 O(n^{1.5xx})

결과적으로 좀 더 빨라졌다.

QuickSelect를 D&C로 구해보자

```bash
QuickSelect(A[1..n], k):
	if n = 1
		return A[1]
	else
		Choose a pivot element A[p]
		r = Partition(A[1..n], p) //pivot 크기의 위치 리턴
		if k < r
			return QuickSelect(A[1..r-1], k)
		else if k > r
			return QuickSelect(A[r + 1..n], k - r)
		else
			return A[r]
```

점화식: T(n) <= max{T(r-1), T(n-r)} + O(n)} (1<=r<=n)

최악의 경우는 r=1이거나 r=n일 때, T(n) <= T(n-1) + O(n), 즉 O(n^2) (pivot이 처음이거나 끝일 때)

그렇다면 그 외에 pivot이 있을 때가 더 빠르기 때문에 대략 중간 쯤에 위치하면 빠를 것이다.

Median-of-Medians 방법

-   배열 A\[1..n\]의 원소 n개를 5개씩 묶어 n/5개의 block으로 나눈다
-   각 block의 median을 계산한다(5개중3번째)
-   위에서 계산한 median들을 모아서 배열M\[1..n/5\]에 모은 후 이들의 median을 찾아서 그걸 pivot으로 사용한다
-   중간값들의 중간값

```bash
QuickSelect(A[1..n], k):
	if n <= 25
		use brute force //대충 이정도 안에서는 그냥 정렬해서 하는게 빠르단 소리
	else{
		m = n/5
        for i=1 to m
          M[i] = medianOfFive(A[5i-4..5i])
        mom = momSelect(M[1..m], [m/2])
		r = Partition(A[1..n], p)
		if k < r
			return QuickSelect(A[1..r-1], k)
		else if k > r
			return QuickSelect(A[r + 1..n], k - r)
		else
			return mom
    }
```

![[8-1.png]]

5 x (n/5)

MOM = n/10 열, 3번째 행

\-> MOM보다 큰 요소와 작은 요소가 3 x n/10개  
\-> 최대 7n/10을 가짐, 즉 3n/10 < r < 7n/10 (MOM이 이 사이에 있음)  
T(n) <= T(n/5)\[partition\] + T(7n/10)\[momselect의 크기가 최대가 되는 경우\] + O(n)\[나머지\]

![[8-2.png]]

  
\-> 점점 작아지는 tree를 가짐(n -> 9n/10 -> 81n/100 -> ...), 점점 수행시간이 줄어들음  
\-> 공비가 9/10 => 1/{1-9/10}10n => O(n) (어차피 앞에는 수렴하는 상수라 무시)
