---
title: "[CSTS] 테스트 분류와 테스팅 방법(2장~8장)"
slug: tistory-23
date: 2025-07-24
tags: ["CSTS"]
series: "CSTS"
tistory: https://chanhuy.tistory.com/23
---

테스트는 다음 세가지의 기준으로 분류된다

-   테스트 레벨(컴포넌트, 통합, 시스템, 인수)
-   테스트 유형(기능, 품질/비기능)
-   테스트 설계 기법(동적, 정적

![[23-1.png]]

### 테스트 레벨

-   컴포넌트(단위) 테스트: 단위 모듈이 테스트 대상, 개별 단위 모듈을 독립적으로 테스트
    -   개별 모듈을 실행하는 테스트 드라이버, 테스트 스텁이 필요
    -   FIRST 원칙
        -   Fast: 컴포넌트 테스트는 빠르게 수행되어야 함
        -   Isolated: 컴포넌트 테스트가 다른 컴포넌트 테스트에 의존하지 않도록 해야 함
        -   Repeatable: 테스트를 몇 번 실행해도 동이한 결과가 나와야 함
        -   Self-validating: 사람의 개입 없이 테스트가 통과되었는지 알수 있도록 작성
        -   Timely: 제 때 수행되어야 함
-   통합 테스트: 컴포넌트 간의 상호 연동이 제대로 수행되는지 검사
    -   상호작용에 초점 => 전송/수신된 데이터 중심, 기능에 초점 => 연결된 상황에서 전체적인 기능
    -   빅뱅 방식: 전체 컴포넌트를 한 번에 통합하여 테스트 => 어떤 컴포넌트가 문제인지 확인이 어려움
    -   점진적 통합 방식
        -   상향식 통합: 하위의 컴포넌트를 그룹화 후 테스트 드라이버를 작성하여 수행
            -   하위 컴포넌트를 충분하게 테스트 가능
            -   하향식 통합에 필요한 테스트 스텁을 제공하는 비용이 들지 않음
        -   하향식 통합: 상위에 있는 컴포넌트를 테스트 하기 위해 하위 컴포넌트를 테스트 스텁으로 대체한 후 수행
            -   테스트 스텁에서 실제 모듈로 대치되면 변경이 발생하므로 리그레션을 수행 => 새로운 모듈을 추가할 때 마다 리그레션 테스팅을 수행
            -   상위 컴포넌트의 결함을 빠르게 발견할 수 있음
            -   많은 수의 테스트 스텁이 필요 => 스텁 구현 비용이 높은 경우 비효율적
        -   샌드위치 통합: 상향식 + 하향식
-   시스템 테스트: 전체 시스템을 대상으로 요구사항 명세서에 명시된 방식으로 시스템이 동작하는지 확인
    -   기능 측면 뿐만 아니라 비기능적인 요구사항을 만족하는지도 검증
-   인수 테스트: 전체 시스템을 테스트, 시스템 테스트와 달리 고객 관점에서 확인
    -   알파테스트: 개발자 환경에서 통제된 상태로 수행
    -   베타테스트: 실제 환경, 실제 사용자가 수행하고 피드백

순서: 컴포넌트 => 통합 => 시스템 => 인수

테스트 레벨이 올라갈수록 테스트 범위도 넓어진다.

![[23-2.png]]

### 테스트 유형

-   기능 테스트: 기능 요구사항을 확인, 모든 테스트 수준(컴포넌트, 통합, 시스템, 인수)에서 진행
-   비기능 테스트: 성능, 보안성, 신뢰성 등 품질 요구사항을 확인, 일반적으로 시스템, 인수 테스트에서 진행

### 테스트 설계 기법

#### 정적 테스트: 테스트 대상을 실행하지 않음

-   리뷰: 결함을 검출하거나 프로젝트의 진행 상황을 점검, 전문가 그룹이 수행
    -   1)경영진 준비 2)리뷰계획 2)리뷰 절차 개요 설명 4)작업물 개요 설명 5)개별 준비 6)그룹검토 7)재작업 8) 후속작업
    -   관리 리뷰: 진행 상황을 모니터하고 계획과 현재 일정 상태를 평가
        -   그룹 검토 회의는 관리 스태프들이 참여하며 관리자가 주재
    -   기술 리뷰: 정의된 계획 및 명세를 준수하고 있는지 검토, 프로젝트의 기술적 상태를 확인
        -   대표 엔지니어가 주재
    -   인스펙션(inspection): 가장 형식화된 대표적인 리뷰 방식, 동료 검토  
        -   가능한 한 개발 초기에 검사, 팀은 두 명 이상
        -   주재자: 인스펙션을 계획, 회의 자료 전달/주재, 퍼실리테이터가 담당
        -   작성자: 회의에 필요한 자료를 제출, 작성자는 주재자가 될 수 없음
        -   낭독자: 회의를 이끄는 역할
        -   기록자: 모든 회의 논쟁/질문/답변을 기록, 작성자는 기록자가 될 수 없음, 주재자는 가능
        -   검토자: 관리자 직책을 담당하는 사람은 금지
        -   리뷰 계획 => 인스펙션 절자 개요 설명 => 인스펙션 작업물에 대한 개요 설명 => 준비 => 검토 회의 => 재작업 => 후속작업
    -   워크스루(walk-through): 결함을 검출할 뿐만 아니라 참가자들의 교육이나 지식 교육을 위해 수행
        -   인스펙션보다는 비형식적
        -   작성자 본인이 보통 회의를 주재, 기록자 역할도 가능
        -   관리자 직책은 팀 멤버로 참여 금지
    -   감사: 객관적인 표준과 규제에 대한 준수를 독립적으로 평가
-   정적 분석: 자동화된 방식으로 도구에 의해서 수행
    -   코딩 표준: 프로그램을 작성할 때 지켜야 하는 규약
        -   코딩 스타일: BSD, K&R, GNU
        -   MISRA-C: C 프로그래밍 언어의 코딩 가이드라인
    -   복잡도 측정
        -   McCabe의 순환 복잡도
            -   순환복잡도 = 간선 수 - 노드 수 + 2
            -   순환복잡도 = 닫힌 영역의 개수 + 1
            -   순환복잡도 = 분기 노드들의 개수 + 1
    -   자료 흐름 분석
        -   d: defined, k: killed, u:used, ~x: 모든 선행 행위와 x와 관련이 없음, ~x: x이후 행위들이 x와는 관련이 없음

<table style="border-collapse: collapse; width: 55.5814%; height: 567px;" border="1" data-ke-align="alignLeft"><tbody><tr style="height: 21px;"><td style="width: 34.3096%; height: 21px;">~d</td><td style="width: 65.6904%; height: 21px;">문제없음</td></tr><tr style="height: 21px;"><td style="width: 34.3096%; height: 21px;">du</td><td style="width: 65.6904%; height: 21px;">문제없음</td></tr><tr style="height: 21px;"><td style="width: 34.3096%; height: 21px;">dk</td><td style="width: 65.6904%; height: 21px;">잠재적 결함, 전혀 자료가 사용되지 않음</td></tr><tr style="height: 17px;"><td style="width: 34.3096%; height: 17px;">~u</td><td style="width: 65.6904%; height: 17px;">잠재적 결함, 정의되지 않고 바로 사용</td></tr><tr style="height: 17px;"><td style="width: 34.3096%; height: 17px;">ud</td><td style="width: 65.6904%; height: 17px;">문제없음</td></tr><tr style="height: 17px;"><td style="width: 34.3096%; height: 17px;">uk</td><td style="width: 65.6904%; height: 17px;">문제없음</td></tr><tr style="height: 17px;"><td style="width: 34.3096%; height: 17px;">~k</td><td style="width: 65.6904%; height: 17px;">잠재적 결함, 정의되지 않고 무효화 됨</td></tr><tr style="height: 17px;"><td style="width: 34.3096%; height: 17px;">ku</td><td style="width: 65.6904%; height: 17px;">심각한 결함, 무효화되었는데 사용</td></tr><tr style="height: 17px;"><td style="width: 34.3096%; height: 17px;">kd</td><td style="width: 65.6904%; height: 17px;">문제없음</td></tr><tr style="height: 17px;"><td style="width: 34.3096%; height: 17px;">dd</td><td style="width: 65.6904%; height: 17px;">잠재적 결함</td></tr><tr><td style="width: 34.3096%;">uu</td><td style="width: 65.6904%;">문제없음</td></tr><tr><td style="width: 34.3096%;">kk</td><td style="width: 65.6904%;">잠재적 결함</td></tr><tr><td style="width: 34.3096%;">d~</td><td style="width: 65.6904%;">잠재적 결함</td></tr><tr><td style="width: 34.3096%;">u~</td><td style="width: 65.6904%;">문제없음</td></tr><tr><td style="width: 34.3096%;">k~</td><td style="width: 65.6904%;">문제없음</td></tr></tbody></table>

```cpp
if(...)//BSD
{
	doSometing();
}
if(...){//K&R
	doSometing();
}
if(...)//GNU
	{
		doSometing();
	}
```

#### 동적 테스트: 테스트 대상을 실행 => 테스트 케이스 생성 필요

-   테스트 비용을 절감하고 결함을 누락하지 않고 테스트 하기 위해 테스트 케이스를 잘 설계해야 함
-   명세 기반 테스트(블랙박스 테스트): 소스 코드를 참고하지 않고 테스트 케이스 결정
    -   동등분할, 분류 트리 기법, 경계값 분석, 조합 테스트, 상태 전이 테스트, 결정표 테스트...
-   구조 기반 테스트(화이트박스 테스트): 소스 코드를 참고하여 테스트 케이스 결정
    -   문장, 결정, 조건, 결정/조건, 다중조건, MCDC(변형된 조건/결정)
-   경험 기반 테스트: 기존의 경험을 바탕으로 수행하는 테스트
    -   오류추정: 테스터의 경험을 바탕으로 개발자가 범할 수 있는 실수를 추정하여 테스트 케이스 설계
    -   탐색적 테스트: 테스트 대상에 대한 이해, 설계, 실행을 병행하는 방식, 즉 문서화 없이 테스트 대상에 대한 이해를 바탕으로 즉석에서 테스트 케이스를 결정하여 수행

#### 테스트 자동화

테스트 도구를 선정하는 프로세스

요구사항 정의 => 도구조사 => 도구평가 => 파일럿 프로젝트(도구의 시험판 버전을 사용하거나 파일럿 프로젝트를 수행하여 도구의 품질을 평가) => 도구 선정 => 도구 도입

### 테스팅 방법

리그레션(regression) 테스트: 소프트웨어가 변경된 후 실행, 변경이 결함을 만들었는지와 요구사항을 충족시키는지 검증

-   수정이 발생하는 경우: 결함 수정 작업, 기능보강 작업, 적응 작업, 예방 작업 
-   Retest-all 전략: 모든 테스트 케이스를 사용하는 방식
-   선택적 리그레션 테스트 전략: 기존의 테스트 케이스 중에서 일부만 선정
-   테스트 최소화 전략: 중복된 테스트 케이스를 제거하여 테스트 케이스의 수를 줄이는 방식
-   테스트 우선 순위화 전략: 테스트 케이스에 우선순위를 두어 우선순위가 높은 케이스만 활용
    -   APFD: 우선순위의 효과성을 평가하는 척도/테스트 케이스 실행 수 대비 검출된 결함의 비율
-   소프트웨어가 변경되면 각 레벨 테스트 순서대로(컴포넌트, 통합, 시스템, 인수) 각각 리그레션 테스트를 수행

![[23-3.png]]

소프트웨어 생명 주기 모델과 테스트

-   순차적 개발 모델
    -   폭포수 모델: 테스트를 하나의 개발단계로 간주, 코딩 후에 테스트가 수행
    -   V-모델: 개발과 테스트를 동등하게 보고 구분, 개발 시작과 동시에 테스트 활동 시작
-   진화적 개발 모델: 이터레이션을 반복 수행
    -   나선형 모델: 우선 프로토타입을 개발 => 프로토타입에 대한 테스트 및 사용자 평가를 거쳐 다음 개발 주기 시작 => 새로운 개발 주기가 시작될 때마다 위험 분석을 수행, 매 단계에서 테스트를 수행 => 심각한 결함을 늦게 발견할 가능성이 낮음
    -   애자일 개발 모델
        -   애자일 선언 네가지 가치 
            -   사람 및 상호 의사 교환이 프로세스나 도구보다 우선
            -   동작하는 소프트웨어가 포괄적인 문서보다 우선
            -   고객과의 협력이 계약 협상보다 우선
            -   변화에 반응하는 것이 계획을 따르는 것보다 우선
        -   TDD(테스트 주도 개발): 테스트 케이스를 먼저 작성하고 테스트 케이스로 테스트 되는 실제 프로그램의 코드를 나중에 작성하는 방식, TDD를 수행하는 도중에 리팩토링 수행

-   위험 기반 테스트
    -   피처에 대한 위험 분석을 바탕으로 테스트에 대한 계획과 설계, 실행 등의 활동 
    -   테스트 대상과 범위를 결정할 때는 테스트 미수행에 따른 위험을 고려해야 함
    -   즉 위험도가 낮으면 테스트에서 제외할 수 있고 높으면 반드시 포함
    -   위험도 산정 방식
        -   심각성, 긴급성, 발생가능성
    -   고강도 테스트: 매우 높은 위험도, 즉각적인 수정이 요구되는 결함에 가능한 많은 자원을 사용
    -   균형적 테스트: 프로젝트의 주어진 예산과 일정을 고려하여 효율적인 테스트를 수행
    -   부가적 테스트: 수행되는 테스트 활동에 일부 추가적인 작업
    -   결함 보고: 테스트 범위에 포함시키지 않음
-   모델 기반 테스트
    -   테스트 절차를 수행할 수 있는 정보가 자동으로 추출될 수 있을 정도록 정형화되고 상세한 모델을 바탕으로 수행
    -   대부분의 활동을 자동화 가능
    -   모델 자체에 존재할 수 있는 다양한 문제를 일찍 식별할 수 있음 => 장애가 발생하면 비용이 큰 곳에서 수행
    -   모델을 구축하는데 비용이 추가된다는 단점

### 품질 특성과 비기능 테스트

<table style="border-collapse: collapse; width: 100%;" border="1" data-ke-align="alignLeft"><tbody><tr><td width="104"><span><b>주특성<span></span></b></span></td><td width="170"><span><b>부특성<span></span></b></span></td><td width="327"><span><b>설명<span></span></b></span></td></tr><tr><td rowspan="3" width="104"><span>기능 적합성<span></span></span></td><td width="170"><span>기능 완전성<span></span></span></td><td width="327"><span>명시된 요구사항의 구현 정도<span></span></span></td></tr><tr><td width="170"><span>기능 정확성<span></span></span></td><td width="327"><span>정확하게 결과를 제공하는 정도<span></span></span></td></tr><tr><td width="170"><span>기능 적절성<span></span></span></td><td width="327"><span>사용자 목적 달성에 도움을 주는 정도<span></span></span></td></tr><tr><td rowspan="3" width="104"><span>성능 효율성<span></span></span></td><td width="170"><span>시간 반응성<span></span></span></td><td width="327"><span>기능 수행이 요구시간을 만족시키는지<span></span></span></td></tr><tr><td width="170"><span>자원 효율성<span></span></span></td><td width="327"><span>자원의 유형 및 양이 요구사항을 만족시키는지<span></span></span></td></tr><tr><td width="170"><span>수용성<span></span></span></td><td width="327"><span>시스템의 최대 한계가 요구사항을 만족시키는지<span></span></span></td></tr><tr><td rowspan="2" width="104"><span>호환성<span></span></span></td><td width="170"><span>공존성<span></span></span></td><td width="327"><span>다른 소프트웨어에 해로운 영향을 주지 않고 환경 및 자원을 공유하면서 요구된 기능을 수행하는지<span></span></span></td></tr><tr><td width="170"><span>상호 운영성<span></span></span></td><td width="327"><span>둘 이상의 시스템이 정보를 공유할 때 이상이 없는지<span></span></span></td></tr><tr><td rowspan="6" width="104"><span>사용성<span></span></span></td><td width="170"><span>적합 인식성<span></span></span></td><td width="327"><span>사용자의 요구에 적절한 기능인지<span></span></span></td></tr><tr><td width="170"><span>학습 용이성<span></span></span></td><td width="327"><span>사용자가 사용법을 익힐 수 있는지<span></span></span></td></tr><tr><td width="170"><span>운영 용이성<span></span></span></td><td width="327"><span>시스템을 작동 및 제어를 쉽게하는지<span></span></span></td></tr><tr><td width="170"><span>사용자 오류 방지성<span></span></span></td><td width="327"><span>시스템에서 발생한 오류로부터 사용자를 보호하는지<span></span></span></td></tr><tr><td width="170"><span>사용자 인터페이스 심미성<span></span></span></td><td width="327"><span>인터페이스가 만족스러운지<span></span></span></td></tr><tr><td width="170"><span>접근성<span></span></span></td><td width="327"><span>누구든 사용할 수 있는지<span></span></span></td></tr><tr><td rowspan="4" width="104"><span>신뢰성<span></span></span></td><td width="170"><span>성숙성<span></span></span></td><td width="327"><span>소프트웨어 구성요소가 표준적 환경에서 신뢰도 요구를 충족시키는지<span></span></span></td></tr><tr><td width="170"><span>가용성<span></span></span></td><td width="327"><span>사용자가 원하는 시간에 사용 및 접근이 가능한지<span></span></span></td></tr><tr><td width="170"><span>결점 허용성<span></span></span></td><td width="327"><span>결함이 존재하더라도 의도한대로 시스템이 작동하는지<span></span></span></td></tr><tr><td width="170"><span>회복 가능성<span></span></span></td><td width="327"><span>중단 및 실패 발생시 데이터를 복구할 수 있는지<span></span></span></td></tr><tr><td rowspan="5" width="104"><span>보안성<span></span></span></td><td width="170"><span>기밀성<span></span></span></td><td width="327"><span>권한이 있는 자만 데이터에 접근 가능<span></span></span></td></tr><tr><td width="170"><span>무결성<span></span></span></td><td width="327"><span>데이터가 무단으로 변경되지 않음<span></span></span></td></tr><tr><td width="170"><span>부인방지<span></span></span></td><td width="327"><span>사건 및 행동에 대해 부인하지 못하게<span></span></span></td></tr><tr><td width="170"><span>책임성<span></span></span></td><td width="327"><span>누가 책임을 져야 하는지 확인할 수 있어야 함<span></span></span></td></tr><tr><td width="170"><span>진본성<span>(</span>인증성<span>)</span></span></td><td width="327"><span>사건 및 행위에 대해 행위자임을 증명할 수 있는 정도<span></span></span></td></tr><tr><td rowspan="5" width="104"><span>유지보수성<span></span></span></td><td width="170"><span>모듈성<span></span></span></td><td width="327"><span>최소의 영향을 가진 개별 구성요소로 구성된 정도<span></span></span></td></tr><tr><td width="170"><span>재사용성<span></span></span></td><td width="327"><span>자산이 하나 이상의 시스템에 사용<span></span></span></td></tr><tr><td width="170"><span>분석성<span></span></span></td><td width="327"><span>변화에 대해 영향을 받는지 평가할 수 있는 정도<span></span></span></td></tr><tr><td width="170"><span>변경 용이성<span></span></span></td><td width="327"><span>시스템이 문제 없이 효과적으로 수정될 수 있는 정도<span></span></span></td></tr><tr><td width="170"><span>테스트 용이성<span></span></span></td><td width="327"><span>테스트 수행을 용이하게 하는 정도<span></span></span></td></tr><tr><td rowspan="3" width="104"><span>이식성<span></span></span></td><td width="170"><span>적용성<span></span></span></td><td width="327"><span>다른 환경에서도 잘 사용 가능한지<span></span></span></td></tr><tr><td width="170"><span>설치 용이성<span></span></span></td><td width="327"><span>잘 설치되고 제거될 수 있는지<span></span></span></td></tr><tr><td width="170"><span>대체 용이성<span></span></span></td><td width="327"><span>동일한 환경<span>, </span>동일한 목적을 위해 다른 소프트웨어에 대치될 수 있는 정도<span></span></span></td></tr></tbody></table>

성능 테스팅 종류

-   부하 테스팅: 부하를 게속 증가시키면서 임계점을 찾음
-   스트레스 테스팅: 임계점 이상의 부하를 가하여 비정상적인 상황에서의 처리를 테스트
-   스파이크 테스팅: 짧은 시간에 부하가 몰릴 때 시스템의 반응을 측정
-   내구성 테스팅: 오랜 시간 동안 시스템에 높은 부하를 가하여 시스템의 반응을 파악

![[23-4.png]]

사용성 평가 방법

-   휴리스틱 평가: 전문가가 체크리스트를 통해 사용성에 관한 문제점을 도출, 3~5명 정도의 적은 인원의 전문가를 활용하여 비교적 쉽게 실시, 효율적이로 빠르게 수행
-   FGI(Focus Group Interview): 그룹 인터뷰, 공통점이 있는 사용자들을 그룹별로 모아 의견을 나누고 정보를 수집
-   인지적 워크쓰루: 학습 용이성 분석에 중점을 둔 방법, 실제 사용자를 대상으로 사전 설명없이 주어진 과제를 달성하도록 함
