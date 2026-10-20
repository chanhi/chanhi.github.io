---
title: "Backtracking"
slug: tistory-9
date: 2025-06-06
subcategory: algorithm
tags: ["Algorithm"]
tistory: https://chanhuy.tistory.com/9
---

Backtracking 기법: recursion을 사용하는 기법으로 문제의 해를 찾다가 아니라는 것을 알면 되돌아가서 다른 해를 찾는 방식.

Subset Sum 문제

어떤 정수 집합 X의 부분집합 중에서 합이 T인 값이 있는지 확인하는 문제!

-   T=0이면 항상 True, T<0 이면 항상 False
-   집합 X의 원소를 x라고 정의할 때
-   총 합이 T인 X의 부분집합이 존재한다면
    -   x를 포함할 때
        -   총합이 T-x인 X-x의 부분집합이 존재
    -   x를 포함 안 할 때 
        -   총합이 T인 X-x의 부분집합이 존재

\= > 이 두 경우로 recursion 수행!

예를 들어서 X= {8, 6, 7, 5, 3, 10, 9}, T=15 일 때, 각 원소를 포함하거나 포함하지 않거나 두 경우가 있다.

이걸 recursion을 사용해서 두 경우를 모두 탐색하고 True인 경우를 return 하면 된다.

```bash
SubsetSum(X, i, T): //i는 X집합 몇번 인덱스까지 탐색할지
	if T=0
		return True
	else if T<0 or i=0
		return False
	else
		with <- SubsetSum(X, i-1, T-X[i])
		wout <- SubsetSum(X, i-1, T)
		return (with or wout)
```

해당 원소를 포함한다면 T에서 해당 원소만큼 뺀 값을 X에서 해당 원소를 제외한 집합에서 경우를 찾는 것과 같다. 그게 with이고, 해당 원소를 포함하지 않는다면 그대로 다시 recursion을 수행하면 된다(wout)

이제 이 알고리즘의 시간복잡도를 구하기 위해 점화식을 구해보면 recursoin을 with, wout 두 번 하기 때문에

A(n) <= 2A(n-1) + O(1), n이 하나 줄어들 때 마다 2배씩 늘어나니까 시간 복잡도는 O($n^2$)

즉 최악의 경우 전부 탐색하는 것이다

이런 식으로 Backtracking은 일반적으로 결정의 조건들을 만들고 그 조건들을 만족하는 recursion한 구조를 만들어 낸다.

(3,4,2,5,2)의 부분열(Subsequence)은 (2,5), (4,5), ...이다.

그렇다면 증가하는 숫자들로 이루어진 가장 긴 부분열을 구하려면 어떻게 해야할까?

이 문제를 LIS( Longest Increasing Subsequence)라고 한다.

(3,1,4,1,5,9,2,6,5,3,5,8)에서 LIS를 구하면 (1,4,5,6,8)이 된다.

이 문제를 Backtracking을 이용해서 해결해보자

LIS를 구하기 위해서는 부분열에 어떤 원소가 포함되고 포함되지 않을지 결정해야한다.

따라서 해당 원소를 포함하는 경우와 제외하는 경우를 recursion으로 구한다. 그리고 여기서 어차피 커지는 숫자들로 이루어져야 하기 때문에 가장 마지막 숫자보다만 크면 된다. 그러므로 recursion을 할 때 마지막 숫자만 넘겨주면 된다.

배열 A\[1..n\]의 LIS를 구하기

```bash
LISBigger(i, j): //i<j
	if j > n
    	return 0
    else if A[i] >= A[j]
    	return LISBigger(i, j+1)
    else
    	skip = LISBigger(i, j+1)
        take = LISBigger(j, j+1) + 1
        return max(skip, take)
```

![[9-1.png]]

위 점화식을 보면 최대로 수행하는 경우 2배씩 연산이 늘어나기 때문에 O($2^n$)
