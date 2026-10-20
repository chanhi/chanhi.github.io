---
title: "시간 복잡도(Time Complexity)"
slug: tistory-5
date: 2025-06-05
subcategory: algorithm
tags: ["Algorithm"]
tistory: https://chanhuy.tistory.com/5
---

시간 복잡도?

모든 환경적인 요인(언어, 컴퓨터 스펙 등)은 고려하지 않고 오로지 알고리즘 자체에 대한 수행시간의 개념 = 시간 복잡도

Algorithm의 수행시간을 이론적으로 분석하기 위한 개념

왜 필요한가?

같은 문제를 푸는 여러 알고리즘 중에 가장 빠르게 해결할 수 있는 알고리즘은 무엇인가에 대한 기준으로 사용!

빅오 표기법(Big-Oh Notation)

두 함수 간의 관계를 나타내는 표기법

-   f(n) <= O(g(n)) -> worst
    -   함수f의 증가속도가 g보다 빠르지 않다(즉 비슷하거나 느리다)
    -   f가 아무리 늦어도 g보단 빠르다 -> 최소 g만큼의 성능
-   f(n) >= Ω(g(n)) -> best
    -   함수f의 증가속도가 g보다 느리지 않다(즉 비슷하거나 빠르다)
    -   f가 g만큼 될 수도 있다 -> 최대 g만큼의 성능
-   f(n) = Θ(g(n))
    -   함수f의 증가속도가 g와 비슷하다

만약 $f(n)=log n, g(n)=n^2$ 이라면 f는 g보다 증가하는 기울기가 작기 때문에 f(n) < g(n)이다. 그렇다면 f(n) = O(g(n))으로 쓸 수 있다

*함수의 빠르기*  
$$  
1 < log(log n) < log n < (log n)^2 < n^{1/2} < n < n log n < n^2 < n^3 < 2^n < n! < n^n  
$$

예를 들어 선택 정렬 알고리즘의 시간 복잡도를 분석해보면

```
void selection_sort(int A[], int n){
    for(int i=0; i<n-1; i++){ //3
        int indexMin = i;
        for(int j=i+1; j<n; j++){ //(n-i-1)*6 + 1
            if(A[j] < A[indexMin]) indexMin= j;
        }
        int temp = A[indexMin];
        A[indexMin] = A[i];
        A[i] = temp; //6
    }
}
```

worst case: 3 + (n-i+1)\*6 + 1 + 6 = $\\sum\_{i=0}^{n-2} 6(n-i)$ + 16 = 16(n-1) + 3n(n+1) -6

어차피 무한히 진행된다면 큰 수만 영향을 끼치기 때문에 빅오표기로 바꾸면 O($n^2$)

이런 연산을 줄이면 반복문은 n번의 수행을 하고 나머지는 상수의 수행을 한다고 생각해서 추상화하면 방금과 같이 n x n + 상수 이므로 O($n^2$)
