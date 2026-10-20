---
title: "Dynamic Programming (동적계획법)"
slug: tistory-10
date: 2025-06-06
subcategory: algorithm
tags: ["Algorithm"]
tistory: https://chanhuy.tistory.com/10
---

지금까지 recursion을 사용해서 여러 문제를 풀었는데, 과연 recursion이 항상 최선이었을까?

당장 이전에 썼던 곱셈 문제도 더 빠른 방식이 존재했었다. (중복되는 recursion을 줄여서 속도를 올림)

그렇기 때문에 점화식과 이전의 결과값을 보고 더 빠른 방법이 있는지 찾는 것이 동적계획법이다.

(이름은 동적계획법인데 딱히 동적과는 관련은 없다)

Fibonacci 수열을 예로 보자

![[10-1.png]]

```bash
RecFIBO(n):
	if n=0
		return 0
	else if n=1
		return 1
	else 
		return RecFIBO(n-1) + RecFIBO(n-2)
```

이 코드를 점화식으로 나타내면 T(n) = T(n-1) + T(n-2) + O(1)

시간복잡도를 구하면 다음과 같다고 한다. (1.618...이게 황금비라고 한다)

![[10-2.png]]

이걸 트리 형태로 n=7일 때를 예시로 보면 recursion이 중복되는 것을 볼 수 있다

![[10-3.png]]

DP 기법을 적용해서 recursion이 쓸데없이 중복되는 것을 제거해보자

이전의 값을 저장해서 나중에 반복되는 것을 방지한다. (Memoization이라고 한다. 왜 memorization이 아닌건지;; 검색해보니까 그냥 구분되는 단어인듯하다)

```bash
MEMFIBO(n):
	if n=0
		return 0
	else if n=1
		return 1
	else 
		if F[n] is undefined
			F[n] = MEMFIBO(n-1) + MEMFIBO(n-2)
		return F[n]
```

![[10-4.png]]

F\[n\]에 존재하는지 확인하고 있으면 넘어가도록 한다. 그렇기 때문에 딱 봐도 연산의 수가 줄어든 것을 확인할 수 있다!

이렇게 DP는 다음과 같은 일반적인 과정을 거쳐서 해결한다

-   쓸모없는 반복을 없앤다
-   점화식을 찾고 점화식을 이용하여 table을 순서대로 채운다  
    \- 문제를 해결하는 recursive algorithm, 점화식을 찾음  
    \- base case 부터 답을 순서대로 table에 쌓아가는 방식으로 설계

이번에는 LIS(Longest Increasing Subsequence) 문제를 DP를 사용해서 해결해보자

이전에 Backtracking을 이용해서 문제를 해결했을 때는 시간복잡도가 O($2^n$) 이었다.

LISbigger 

\= 0 (j>n)  
\= LISbigger(i, j+1) (A\[i\] > A\[j\])  
\= max(LISbigger(i, j+1))  
 1 + max(LISbigger(j, j+1))

Memoization을 사용하여 값을 저장해서 보면

0≤ i ≤ n, 1 ≤ j ≤ n인 모든 (i, j)에 대하여 LISbigger\[0..n, 1..n\]을 그 2차배열이라고하자

![[10-5.png]]

이건 결국 최악의 경우 O($n^2$)

마지막으로 Subset Sum 문제를 DP로 해결해보자

```bash
//resusive algorithm -> O(2^n)
SUBSETSUM(X, i, T): //X에서 i까지
	if T=0
		return True
	else if T<0 or i=0
		return False
	else
		with = SUBSETSUM(X, i-1, T-X[i])//X[i]를 포함
		wout = SUBSETSUM(X, i-1, T)//X[i]를 버림
		return with or wout
```

1 ≤ i ≤ n+1 and 0 ≤ t ≤ T => i값과 T(포함하면 변하니까)를 기준으로 2x2 table 사용

2차배열S\[1..n+1, 0..T\]를 써서S\[i, t\]에 SS(i, t)를 기억  
i는 n일 때 base case -> 감소하는 방향  
t는 0일 때 base case -> 증가하는 방향

```bash
FastSubsetSum(X[1..n], T):
	S[n+1, 0] = True
	for t=1..T
		S[n+1, t] = False
	for i=n..1
		S[i,o] = True
		for t=1..X[i]-1 //X[i]보다 작은 값
			S[i,t] = S[i+1, t] //행렬에서 오른쪽 값
		for t=X[i]..T
			S[i,t] = S[i+1, t] or S[i+1, t-X[i]]
	return S[1,T]
//O(nT)
```

예를 들어서 X={8, 6, 7, 5, 3, 10, 9}, T=15 -> $n+1 \\\* T$ 이면

<table style="letter-spacing: 0px; border-collapse: collapse; width: 100%; height: 289px;" border="1" data-ke-align="alignLeft"><tbody><tr style="height: 17px;"><td style="width: 11.1111%; height: 17px; text-align: center;">t/i</td><td style="width: 11.1111%; height: 17px; text-align: center;">1(8)</td><td style="width: 11.1111%; height: 17px; text-align: center;">2(6)</td><td style="width: 11.1111%; height: 17px; text-align: center;">3(7)</td><td style="width: 11.1111%; height: 17px; text-align: center;">4(5)</td><td style="width: 11.1111%; height: 17px; text-align: center;">5(3)</td><td style="width: 11.1111%; height: 17px; text-align: center;">6(10)</td><td style="width: 11.1111%; height: 17px; text-align: center;">7(9)</td><td style="width: 11.1111%; height: 17px; text-align: center;">8(n+1)</td></tr><tr style="height: 17px;"><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td></tr><tr style="height: 17px;"><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td></tr><tr style="height: 17px;"><td style="width: 11.1111%; height: 17px; text-align: center;">2</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td></tr><tr style="height: 17px;"><td style="width: 11.1111%; height: 17px; text-align: center;">3</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td></tr><tr style="height: 17px;"><td style="width: 11.1111%; height: 17px; text-align: center;">4</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td></tr><tr style="height: 17px;"><td style="width: 11.1111%; height: 17px; text-align: center;">5</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td></tr><tr style="height: 17px;"><td style="width: 11.1111%; height: 17px; text-align: center;">6</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td></tr><tr style="height: 17px;"><td style="width: 11.1111%; height: 17px; text-align: center;">7</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td></tr><tr style="height: 17px;"><td style="width: 11.1111%; height: 17px; text-align: center;">8</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td></tr><tr style="height: 17px;"><td style="width: 11.1111%; height: 17px; text-align: center;">9</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td></tr><tr style="height: 17px;"><td style="width: 11.1111%; height: 17px; text-align: center;">10</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td></tr><tr style="height: 17px;"><td style="width: 11.1111%; height: 17px; text-align: center;">11</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td></tr><tr style="height: 17px;"><td style="width: 11.1111%; height: 17px; text-align: center;">12</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td></tr><tr style="height: 17px;"><td style="width: 11.1111%; height: 17px; text-align: center;">13</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td></tr><tr style="height: 17px;"><td style="width: 11.1111%; height: 17px; text-align: center;">14</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">1</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td><td style="width: 11.1111%; height: 17px; text-align: center;">0</td></tr><tr style="height: 17px;"><td style="width: 11.1111%; text-align: center; height: 17px;">15</td><td style="width: 11.1111%; text-align: center; height: 17px;">1</td><td style="width: 11.1111%; text-align: center; height: 17px;">1</td><td style="width: 11.1111%; text-align: center; height: 17px;">1</td><td style="width: 11.1111%; text-align: center; height: 17px;">1</td><td style="width: 11.1111%; text-align: center; height: 17px;">0</td><td style="width: 11.1111%; text-align: center; height: 17px;">0</td><td style="width: 11.1111%; text-align: center; height: 17px;">0</td><td style="width: 11.1111%; text-align: center; height: 17px;">0</td></tr></tbody></table>

시간복잡도를 구하면  n x T 만큼의 배열이 필요하기 때문에 O(nT)

최단 경로 개수 세기 문제

m\*n 크기의 Grid에서 A(0.0)에서 B(m,n)까지의 최단 경로의 개수를 구하는 것을 DP로 풀어보자

P(i,j)를 (0,0)dptj (i,j)까지 가는 최단 경로 개수라 하면 P(i-1,j)와 P(i, j-1)의 합이 P(i,j)인 것을 활용해서 점화식을 세운다.

P(i,j) = P(i-1, j) + P(i, j-1)

        = 1 (base case: i=0 or j=0)

위 점화식에 따라서 i와 j가 증가하는 방향으로 Bottom-up하면서 값을 저장하며 풀어나가면 된다.

그렇기 때문에 배열의 크기만큼 시간이 필요하므로 시간복잡도는 O(mn)이다.

LCS( Longest Common Subsequence )

두개의 sequence에서 가장 길게 일치하는 부분열을 구하는 문제를 DP로 풀어보자.

예를 들어 AGGTAB 와GTAB 의LCS는 GTAB이고 길이는 4이다

A\[1..m\], B\[1..n\] 두 개의 sequence가 주어졌을 때 L(m, n)가 두 sequence 사이의 LCS의 길이라고 정의하자

규칙을 찾기 위해서 경우를 따져보면 임의의 값 i,j에 대해서 A\[i\] = B\[j\]이면 L(i-1, j-1) + 1이고 A\[i\] != B\[j\]이면 L(i, j-1) 와 L(j-1, j)로 recursion한다. 따라서 점화식으로 표현하면

A\[i\] = B\[j\]  => L(i,j) = max{ L(i-1, j-1) +1, L(i-1,j), L(i, j-1) }

A\[i\] != B\[j\] => L(i,j) = max{ L(i-1,j), L(i, j-1) }

L(i,j) = 0 (i=0 or j=0)

\=> 여기서 L(i-1, j-1) +1인 경우는 실제 부분열에 들어가게 되므로 따로 table에 index를 저장한다. 

![[10-6.png]]

여기서 LCS는 노란색으로 표시된 부분을 보면 된다. 서로 같은 값을 가지는 것중에서 table에 저장되는 것은 M(1,2), J(3,3), A(4,5), U(7,6)이다(대각선으로 값이 증가되는 부분을 유심히 보자)

다음은 어떤 문자열 A를 문자열 B로 바꾸기 위한 최소 횟수의 편집연산을 구하는 문제인 Edit Distance 문제를 DP로 해결해보자.

예를 들어 FOOD와 MONEY 사이의 edit distance는 (최대)4이다

FOOD => MOOD => MOND => MONED => MONEY

Edit(i,j)를 A\[1..i\], B\[1..j\] 사이의 edit distance로 정의하자.

edit의 경우는 Insert, delete, substitute, match 네가지 경우로 나누어서 연산할 수 있을 것이다.

insert의 경우 Edit(i,j) = Edit(i, j-1) + 1

delete의 경우 Edit(i,j) = Edit(i-1, j) + 1

substitute의 경우 그 부분 전부 변경하므로  Edit(i,j) = Edit(i-1, j-1) + 1

match의 경우 편집할 필요가 없기 때문에 Edit(i,j) = Edit(i-1, j-1) 

![[10-7.png]]

이걸 bottom-up으로 계산해서 table에 기록하며 계산하면 시간 복잡도는 테이블 크기일 테니 O(mn)

```bash
EditDistance(A[1..m], B[1..n]):
	for j=0 to n
    	Edit[0,j] = j
    for i=1 to m
    	Edit[i,o] = i
        for j=1 to n
        	ins = Edit[i,j-1] + 1
            del = Edit[i-1,j] + 1
            if A[i] = B[j]
            	rep = Edit[i-1, j-1]
            else
            	rep = Edit[i-1, j-1] + 1
            Edit[i,j] = min{ins, del, rep}
    return Edit[m,n]
```
