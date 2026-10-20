---
title: "Graph Algorithms"
slug: tistory-13
date: 2025-06-09
subcategory: algorithm
tags: ["Algorithm"]
tistory: https://chanhuy.tistory.com/13
---

Graph Algorithms, 그래프 알고리즘

우리가 하는 그 함수 그래프를 말하는 것이 아니고 객체 간의 짝을 이루는 관계를 모델링한 형태가 그래프인 것을 말한다. 

그래프의 형태는 여러가지가 있다고 하는데 그중에서 undirected(방향이 없음) simple(두 vertex 사이에 한 개의 edge만 있고 자기 자신에게 돌아오는 edge가 없는) graph(무향 그래프)를 이용한 algrithm을 다뤄보겠다.

Vertex(정점)의 집합 V와 edge(간선/관계)의 집합 E의 짝으로 이루어진 집합이 그래프

Neighbor: 주변에 있는 vertex (a의 Neighbor은 b, e)

degree: neighbor의 개수(=edge의 개수)

walk: vertex들간의 경로

path: 반복되는 vertex가 없는 walk

Reachability: 어떤 vertex에서 해당 vertex로 갈 수 있는지 => 두 vertex 사이에 path가 있다면 true

Connectedness: 모든 vertex 사이가 reachable한 상태(아래 그림은 떨어져 있는게 있어서 false임)

Closed walk: 시작점과 끝나는 점이 같은 경우(b, f, c, b)

Cycle: 반복되는 vertex가 없는 closed walk

acyclic: cycle이 없는 경우(ex: tree)

![[13-1.png]]

G=(V, E) => V가 n개일 때 E의 최대 개수는 n(n-1)/2

그래프를 저장하는 자료구조가 일반적으로 두가지 있는데, Adjacency List와 Adjacency Matrix가 있다.

![[13-2.png]]

*Adjacency List*

각 vertex의 Neighbor을 저장한 array이다 => O(V +E) 크기의 공간을 사용

![[13-3.png]]

*Adjacency Matrix*

v(v-1)/2 => 0<=E의 개수<=$v^2$ => 따라서 O($v^2$)크기의 공간을 사용

![[13-4.png]]

matrix가 공간은 많이 차지하지만 대부분의 연산에 대해 속도가 빠른 것을 볼 수 있다.

edge가 빽빽한 경우에는 matrix가 유리하고 듬성듬성하게 있으면 linked list가 유리하다

Spanning Tree(신장 트리)

모든 vertex를 포함하고 가장 적은 edge를 가진 simple undirected graph G의 부분 그래프

\=> G는 connected여야 spanning tree가 존재

\=> tree이므로 cycle 없음 => 가장 적은 edge를 가짐

Minimum Spanning Tree(최소 신장 트리)

weighte(가중치: 각 edge에 주어진 cost)의 합이 가장 작은 simple undirected graph

![[13-5.png]]

Kruskal’s Algorithm

Minimum Spanning Tree를 찾는 greedy algorithm, 각 edge를 최종 MST에 포함할지 말지 결정하며 문제를 해결

-   weight가 작은 edge를 우선 선택하여 추가
-   단, 추가했을 때 cycle을 만들면 안 됨

![[13-6.png]]

```bash
Kruskal(𝑉,𝐸)
 Sort 𝐸 by increasing weight
 Set 𝐹 ← (𝑉,∅)
 for 𝑖 = 1 to |𝐸|
   Let 𝑒 be the 𝑖-th lightest edge in 𝐸
   If 𝐹 + 𝑒 has no cycle, 
	Add 𝑒 to 𝐹
 return 𝐹
```

그렇다면 cycle이 생기는지 확인하려면 어떻게 해야 할까?

그냥 단순하게 전수조사하면 매번 O(EV)만큼 걸리기 때문에 오래걸린다

추가하려는 edge 양끝에 이미 연결된 경로가 있다면 추가하게 되면 cycle이 생기므로 이를 활용하자

위에서 F는 여ㅑ러개의 component로 이루어져 있는데 F + (u,v)\[추가할 edge\]에서 (u,v) 사이에 이미 path가 존재하면 cycle이 생길 것이다. 그 말은 u,v는 이미 F와 같은 component에 속해 있다는 것이다. 그렇다면 cycle test를 할 때 **두 vertex가 어떤 component에 있는지 확인**한다면 test가 가능할 것이다. 따라서 component 관계를 저장해야 한다.

최초에는 각 vertex들이 component => edge가 추가되면 연결된 vertex가 같은 component가 됨(그리고 component의 개수는 하나 줄어듦) => 두 vertex가 이미 같은 component에 속하면 cycle 생김

이 관계를 저장하기 위한 자료구조로 disjoint set을 사용하면 좋다

Disjoint Set Data Structure 

-   Initialize(𝑉) - create a set containing only 𝑣 for every 𝑣 ∈ V
-   Find(𝑣) - return the unique ID to the set containing 𝑣 The simplest method to scan the edge
-   Union(𝑢, 𝑣) - replace the sets containing 𝑢 and 𝑣 into their union

```bash
Kruskal(𝑉,𝐸)
 Sort 𝐸 by increasing weight
 Set 𝐹 ← (𝑉,∅)
 Initialize(𝑉)   // for disjoint sets
 for 𝑖 = 1 to |𝐸|
   Let 𝑒 = (𝑢,𝑣) be the 𝑖-th lightest edge in 𝐸
   If Find(𝑢) ≠ Find(𝑣)    // 𝐹 +𝑒has no cycle
 	Add 𝑒 to 𝐹 and Union(𝑢, 𝑣)
 return F
```

Initialize(V)로 vertex 개수만큼 component 생성

Union(u, v)로 u가 포함된 집합과 v가 포함된 집합을 합집합 함

Find(u)로 u를 포함하고 있는 component ID를 리턴

시간복잡도는 정렬하는데 ElogE, 그런데 E<$V^2$이기 때문에 Elog$V^2$ = 2ElogV라고 쓸 수 있고 O(ElogV)만큼의 시간을 쓰고, initialize(V)는 O(V), 반복문은 disjoint set 특성상 logV보다도 적은 시간이 든다. 따라서 O(ElogV)

아까 O(EV) 걸린것 보다 빨라졌다.

다음은 Prim’s Algorithm에 대해서 알아보자

이것도 greedy algorithm이고 임의의 vertex를 root로 시작하여 tree를 키워나가는 방식으로 MST를 계산한다. 매 시점에서 현재 tree에 하나의 vertex와 edge를 추가하는데 추가되는 vertex는 현재 tree에 포함되지 않는 것 중 연결 비용이 가장 작은 것, 즉 weight가 가장 작은 edge와 연결된 것을 선택한다.

tree가 자라나는데 자라나는 방향이 weight가 작은 방향으로 자란다고 생각하면 된다.

![[13-7.png]]

여기서 실행 중간에 필요한 정보(저장할 변수)는 현재 tree(배열 T), MST로 포함되지 않은 vertex들(집합 Q), Q에 있는 vertex에 대해 현재 tree에 연결하기 위한 비용(배열 d)가 있다.

-   Q: 집합, 현재 tree에 포함되지 않은 vertex들(최초에는 Q=V, 마지막에는 Q=공집합)
-   d: 배열, d\[v\]는 v(Q에 있는 vertex)를 현재 확정 MST(T에 있는 v)에 연결하기 위한 edge중 최소 weight, 𝑣로가는edge가없는경우에는𝑑 𝑣 =∞
-   T: 배열, T\[v\]는 현재 tree에서 vertex v의 부모를 저장, 최종적인 결과는 여기 저장됨, 현재 MST에 포함된 vertex u에 대해 T\[v\] = u라면 d\[v\] = w(u,v), 𝑑 𝑣 =∞인 vertex v에 대해서는 T\[v\] = NULL

```bash
Prim(𝑉,𝐸,𝑟)     // returns an MST with root 𝑟
  for 𝑣 ∈ 𝑉
	𝑑[v] = ∞ and T[v] = NULL
   𝑄 ←𝑉
   𝑑[r] = 0 //root
   while 𝑄 ≠ ∅
 	Let 𝑢 ← the vertex in 𝑄 with smallest 𝑑-value
 	𝑄 ←𝑄−{𝑢}
 	for each 𝑣 ∈ 𝑉 such that (u,v) ∈𝐸
      if d[v] > w(u,v)
      	d[v] = w(u,v) and T[v] = u // update!
  return T
```

![[13-8.png]]

먼저 d, T, Q를 각각 조건에 맞게 초기화 한다

그리고 root 노드는 d 가중치를 0으로 초기화하고 Q가 공집합이 될 때까지 반복을 시작

먼저 Q에서 d의 값이 가장 작은 vertex를 T에 넣고 Q에서 뺀다.

그리고 d의 값이 간선의 가중치보다 크다면 그 가중치를 d의 값으로 바꾸고 해당 vertex를 T에 임시로 넣는다(트리에 포함된 것과 인접한 edge 중에서 간선의 가중치가 이전 d 값보다 작으면 임시로 d, T 업데이트)

여기서 집합 Q에 필요한 연산이 Q=V 초기화, d값이 가장 작은 걸 찾아 지우기(extract min), d 값을 변경하기

초기화 부분: O(V)

while: extractMin 연산을 |V|번 수행, update는 최대 |E|번

여기서 시간복잡도는 집합 Q를 어떤 자료구조를 사용하냐에 따라 달라진다.

Array로 구현을 하면 초기화에 O(V), ExtractMin은 O(V), Update O(1) => 총 O($V^2$ + E) = O($V^2$)

Binary Heap을 사용하면 insert에 O(logN), ExtractMin에 O(logN), Update에 O(logN)이므로 총 O(VlogV + VlogV + ElogV) = O(ElogV)

fibonacci Heap을 쓰면 O(E+VlogV)의 시간이 걸린다고 함

따라서 edge의 개수가 많아서 거의 V^2이면 array를 쓰고 아니면 heap을 쓰는게 유리할 것이다.

```bash
Prim(𝑉,𝐸,𝑟)     // returns an MST with root 𝑟
   for 𝑣 ∈ 𝑉
	𝑑[v] = ∞ and T[v] = NULL
    𝑄.insert(v, d[v])
   𝑑[r] = 0 and Q.Update(r, d[r]) //root
   while 𝑄 ≠ ∅
 	u = Q.ExtractMin()
 	for each 𝑣 ∈ 𝑉 such that (u,v) ∈𝐸
      if d[v] > w(u,v)
      	d[v] = w(u,v) and T[v] = u // update!
        Q.Update(v,d[v])
  return T
```

Shortest Paths

두 vertex 사이에 있는 path중에 weight가 가장 작은 path

Single-Source Shortest Path problem: 하나의 vertex를 받으면 그 vertex와 다른 vertex사이의 모든 shortest path를 구함

Shortest path tree: spanning tree에서 root s의 다른 vertex로 가는 shortest path의 집합

Dijkstra’s Algorithm

Single-Source Shortest Path 문제를 푸는 greedy algorithm으로 이전에 본 Prim’s Algorithm과 거의 똑같다. 주어진 vertex s를 root로 시작하여 tree를 키워나가는 방식으로 SPT를 계산한다. 다른 점은 greedy choice의 기준이 s로부터 가장 가까운 것을 선택하는 것이다.

```bash
Dijkstra(𝑉,𝐸,𝑠)     // returns an SPT for 𝑠
 Initialize 𝑄as a min-heap structure
 for 𝑣∈𝑉
 	𝑑𝑣←∞and𝑇𝑣←𝑁𝑈𝐿𝐿
 	𝑄.Insert(𝑣, 𝑑𝑣)          // key is 𝑑-value
 𝑑𝑠 ←0and 𝑄.Update (𝑠, 𝑑𝑠)    // root 
 while 𝑄≠∅
 	𝑢←𝑄.ExtractMin()    //smallest 𝑑-value
 	for each 𝑣∈𝑉such that 𝑢,𝑣 ∈𝐸
 		if 𝑑𝑣 >𝑑𝑢+𝑤(𝑢,𝑣)
	 		𝑑𝑣←𝑑𝑢+𝑤(𝑢,𝑣)and 𝑇𝑣←𝑢
 			𝑄.Update (𝑣, 𝑑𝑣)  // Update the key value for v
 return T
```

![[13-9.png]]

![[13-10.png]]

이후에는 g와 c를 확정시키면서 마무리된다.

Prim 알고리즘과 유사하기 때문에 시간복잡도도 똑같다.

• Adjacency Matrix + Array: O(V2)

• Adjacency List + Binary Heap: O(E log V)

• Adjacency List + Fibonacci Heap: O(E + V log V)

All-Pairs Shortest Paths 문제는 이제 모든 shortest path를 구해야 한다.

Floyd-Warshall Algorithm는 이 문제를 푸는 DP 알고리즘이다.

𝜋(𝑢,𝑣,𝑟): vertex u, v 사이의 최단경로인데 오직 1부터 r까지의 vertex만을 지나는 최단경로

𝑑𝑖𝑠𝑡(𝑢,𝑣,𝑟): 𝜋(𝑢,𝑣,𝑟)의 길이

base case: r=0  => (u,v) 바로 둘 사이 edge or 존재하지 않음

r이 양수면

r을 지날 때 => 𝜋(𝑢,𝑣,𝑟) = 𝜋(𝑢, 𝑟 ,𝑟-1)  ∪ 𝜋( 𝑟 ,𝑣,𝑟-1)

r을 지나지 않을 때 => 𝜋(𝑢,𝑣,𝑟) = 𝜋(𝑢,𝑣,𝑟-1)

![[13-11.png]]

```bash
FloydWarshall(𝑉,𝐸) // assume 𝑉={1,…,𝑛}
 for 𝑢=1to 𝑛
  for 𝑣=1to 𝑛
   𝑑𝑖𝑠𝑡[𝑢,𝑣,0]←𝑤(𝑢,𝑣) // 𝑤𝑢,𝑣 =∞if 𝑢,𝑣 ∉𝐸
 for 𝑟=1to 𝑛
  for 𝑢=1to 𝑛
   for 𝑣=1to 𝑛
    if 𝑑𝑖𝑠𝑡[𝑢,𝑣,𝑟−1]<𝑑𝑖𝑠𝑡[𝑢,𝑟,𝑟−1]+𝑑𝑖𝑠𝑡[𝑟,𝑣,𝑟−1]
     𝑑𝑖𝑠𝑡[𝑢,𝑣,0]←𝑑𝑖𝑠𝑡[𝑢,𝑣,𝑟−1]
    else
     𝑑𝑖𝑠𝑡[𝑢,𝑣,0]←𝑑𝑖𝑠𝑡[𝑢,𝑟,𝑟−1]+𝑑𝑖𝑠𝑡[𝑟,𝑣,𝑟−1]
```

시간: O($V^3$), 공간: O($V^3$)
