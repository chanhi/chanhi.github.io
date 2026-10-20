---
title: "[CSTS] 테스트 개요"
slug: tistory-22
date: 2025-07-10
tags: ["CSTS"]
series: "CSTS"
tistory: https://chanhuy.tistory.com/22
---

1장 테스트 개요

### 1.1 테스트 목적

정해진 요구사항을 만족하는지 확인하고 주어진 표준 등을 준수하는지 검증하기 위해 테스트를 수행. 즉 **결함 검출**, **품질 평가**, **프로세스 개선**에 목적을 둔다

### 1.2 오류, 결함, 장애

장애(Failure) : 소프트웨어가 요구사항과 다르게 동작하는 경우

결함(Defect) : 소프트웨어 내에 장애를 유발할 수 있는 문제

오류(Error) : 결함이 생기게 한 개발자의 행위

오류 => 결함 => 장애

![[22-1.png]]

*모든 결함이 장애를 발생시키는 건 아님*

결함 유형

누락 : 요구 명세에 명시된 요구사항이 시스템의 구현에 반영되지 않은 결함

부정확한 구현 : 요구 명세에 명시된 요구사항이 소프트웨어에 부정확하게 반경된 결함

비관련: 요구 명세와 관련되지 않은 구현, 당장 장애를 유발하지 않을 수 있지만 이후에 문제가 될 가능성이 있음

개발 단계별 결함 발생 비율

요구분석(20%), 설계(25%), 코딩(35%), 문서화(12%), 결함해결오류(8%)

결함 해결 비용

요구분석 < 설계 < 코딩 < 단위테스팅 < 인수테스팅 < 유지보수

\=> 결함이 발생한 시점에 제거되지 않으면 이후 단계에서 그 결함을 제거하기 위해 더 많은 비용이 소요됨

테스팅: 소프트웨어의 실제 동작과 요구사항의 차이를 확인. 즉 장애 발생을 확인하여 결함의 발견을 목적으로 수행

디버깅: 테스팅으로 확인된 결함의 위치를 파악하고 이를 제거

재테스팅: 디버깅을 통해 실제로 결함이 제거되었는지 확인. 결함을 검출한 테스트 케이스를 이용하여 테스팅을 다시 수행

### 1.3 테스트의 현실/실제

실제로 모든 경우를 테스트하는 것은 너무 많기 때문에 불가능 함 => 이후에 나오는 여러 테스트 방식을 사용

\* 다익스트라: "프로그램 테스트는 결함이 있음을 보일 수는 있지만 결함이 없음을 보일 수는 없다."

테스트의 진화 과정

레벨1 : 테스트와 디버깅에 뚜렷한 차이가 없음

레벨2: 프로그램이 올바르게 동작하는 것을 입증하기 위해 테스트

레벨3: 결함이 존재함을 보이기 위해 테스트. 즉 잘 작동하지 않는 것을 보여주려는 의도

레벨4: 레벨3에서 범위가 시스템 전체로 커짐

레벨5: 결함을 미리 방지는 것을 목표

테스트 원칙

-   테스트는 반드시 프로그램을 개발한 프로그래머나 팀과는 무관한 그룹이 수행해야 한다.
-   결함이 발견되지 않으리라는 가정하에 테스트 계획을 수립해서는 안 된다.
-   타당한 경우뿐만 아니라 타당하지 않고 예상하지 못한 경우에 대해서도 테스트를 수행하라
-   프로그램의 어떤 부분에 결함이 남아있을 확률은 그 부분에서 이미 발견된 결함의 수에 비례한다
    -   파레토 원칙: "프로그램 결함의 80%는 20%의 모듈에서 발생한다'
-   테스트 케이스를 체계적으로 관리하라
-   각각의 테스트 결과를 철저하게 점검하라

### 1.4 테스트와 품질

ISO 25010의 소프트웨어 품질 특성 분류

\*기성호사신보유이

<table style="border-collapse: collapse; width: 100%;" border="1" data-ke-align="alignLeft"><tbody><tr><td width="104"><span><b>주특성<span></span></b></span></td><td width="170"><span><b>부특성<span></span></b></span></td><td width="327"><span><b>설명<span></span></b></span></td></tr><tr><td rowspan="3" width="104"><span>기능 적합성<span></span></span></td><td width="170"><span>기능 완전성<span></span></span></td><td width="327"><span>명시된 요구사항의 구현 정도<span></span></span></td></tr><tr><td width="170"><span>기능 정확성<span></span></span></td><td width="327"><span>정확하게 결과를 제공하는 정도<span></span></span></td></tr><tr><td width="170"><span>기능 적절성<span></span></span></td><td width="327"><span>사용자 목적 달성에 도움을 주는 정도<span></span></span></td></tr><tr><td rowspan="3" width="104"><span>성능 효율성<span></span></span></td><td width="170"><span>시간 반응성<span></span></span></td><td width="327"><span>기능 수행이 요구시간을 만족시키는지<span></span></span></td></tr><tr><td width="170"><span>자원 효율성<span></span></span></td><td width="327"><span>자원의 유형 및 양이 요구사항을 만족시키는지<span></span></span></td></tr><tr><td width="170"><span>수용성<span></span></span></td><td width="327"><span>시스템의 최대 한계가 요구사항을 만족시키는지<span></span></span></td></tr><tr><td rowspan="2" width="104"><span>호환성<span></span></span></td><td width="170"><span>공존성<span></span></span></td><td width="327"><span>다른 소프트웨어에 해로운 영향을 주지 않고 환경 및 자원을 공유하면서 요구된 기능을 수행하는지<span></span></span></td></tr><tr><td width="170"><span>상호 운영성<span></span></span></td><td width="327"><span>둘 이상의 시스템이 정보를 공유할 때 이상이 없는지<span></span></span></td></tr><tr><td rowspan="6" width="104"><span>사용성<span></span></span></td><td width="170"><span>적합 인식성<span></span></span></td><td width="327"><span>사용자의 요구에 적절한 기능인지<span></span></span></td></tr><tr><td width="170"><span>학습 용이성<span></span></span></td><td width="327"><span>사용자가 사용법을 익힐 수 있는지<span></span></span></td></tr><tr><td width="170"><span>운영 용이성<span></span></span></td><td width="327"><span>시스템을 작동 및 제어를 쉽게하는지<span></span></span></td></tr><tr><td width="170"><span>사용자 오류 방지성<span></span></span></td><td width="327"><span>시스템에서 발생한 오류로부터 사용자를 보호하는지<span></span></span></td></tr><tr><td width="170"><span>사용자 인터페이스 심미성<span></span></span></td><td width="327"><span>인터페이스가 만족스러운지<span></span></span></td></tr><tr><td width="170"><span>접근성<span></span></span></td><td width="327"><span>누구든 사용할 수 있는지<span></span></span></td></tr><tr><td rowspan="4" width="104"><span>신뢰성<span></span></span></td><td width="170"><span>성숙성<span></span></span></td><td width="327"><span>소프트웨어 구성요소가 표준적 환경에서 신뢰도 요구를 충족시키는지<span></span></span></td></tr><tr><td width="170"><span>가용성<span></span></span></td><td width="327"><span>사용자가 원하는 시간에 사용 및 접근이 가능한지<span></span></span></td></tr><tr><td width="170"><span>결점 허용성<span></span></span></td><td width="327"><span>결함이 존재하더라도 의도한대로 시스템이 작동하는지<span></span></span></td></tr><tr><td width="170"><span>회복 가능성<span></span></span></td><td width="327"><span>중단 및 실패 발생시 데이터를 복구할 수 있는지<span></span></span></td></tr><tr><td rowspan="5" width="104"><span>보안성<span></span></span></td><td width="170"><span>기밀성<span></span></span></td><td width="327"><span>권한이 있는 자만 데이터에 접근 가능<span></span></span></td></tr><tr><td width="170"><span>무결성<span></span></span></td><td width="327"><span>데이터가 무단으로 변경되지 않음<span></span></span></td></tr><tr><td width="170"><span>부인방지<span></span></span></td><td width="327"><span>사건 및 행동에 대해 부인하지 못하게<span></span></span></td></tr><tr><td width="170"><span>책임성<span></span></span></td><td width="327"><span>누가 책임을 져야 하는지 확인할 수 있어야 함<span></span></span></td></tr><tr><td width="170"><span>진본성<span>(</span>인증성<span>)</span></span></td><td width="327"><span>사건 및 행위에 대해 행위자임을 증명할 수 있는 정도<span></span></span></td></tr><tr><td rowspan="5" width="104"><span>유지보수성<span></span></span></td><td width="170"><span>모듈성<span></span></span></td><td width="327"><span>최소의 영향을 가진 개별 구성요소로 구성된 정도<span></span></span></td></tr><tr><td width="170"><span>재사용성<span></span></span></td><td width="327"><span>자산이 하나 이상의 시스템에 사용<span></span></span></td></tr><tr><td width="170"><span>분석성<span></span></span></td><td width="327"><span>변화에 대해 영향을 받는지 평가할 수 있는 정도<span></span></span></td></tr><tr><td width="170"><span>변경 용이성<span></span></span></td><td width="327"><span>시스템이 문제 없이 효과적으로 수정될 수 있는 정도<span></span></span></td></tr><tr><td width="170"><span>테스트 용이성<span></span></span></td><td width="327"><span>테스트 수행을 용이하게 하는 정도<span></span></span></td></tr><tr><td rowspan="3" width="104"><span>이식성<span></span></span></td><td width="170"><span>적용성<span></span></span></td><td width="327"><span>다른 환경에서도 잘 사용 가능한지<span></span></span></td></tr><tr><td width="170"><span>설치 용이성<span></span></span></td><td width="327"><span>잘 설치되고 제거될 수 있는지<span></span></span></td></tr><tr><td width="170"><span>대체 용이성<span></span></span></td><td width="327"><span>동일한 환경<span>, </span>동일한 목적을 위해 다른 소프트웨어에 대치될 수 있는 정도<span></span></span></td></tr></tbody></table>

테스트와 품질 보증

\* 테스트 < V&V < 품질보증

V&V(Verification and Validation): 검증과 확인, 검증을 수행한 활동의 적합성 검사에 초점을 두고 확인은 결과물에 둔다

-   정형방법
    -   모델체킹, 정확성 증명
-   테스팅
    -   동적테스팅, 정적테스팅
-   V&V 분석
    -   시뮬레이션, 평가

품질 보증: 의도한 목적에 적합한 품질의 소프트웨어 제품을 개발하였는지, 프로세스가 적합한지에 대한 확신을 주기 위하여 수행되는 다앙한 활동
