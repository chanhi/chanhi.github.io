---
title: "[Git & Github] Git Commit Message 규칙"
slug: tistory-28
date: 2026-05-04
subcategory: git
tags: ["Git", "GitHub"]
tistory: https://chanhuy.tistory.com/28
---

### Commit Message의 7가지 규칙

1.  제목과 본문을 빈 행으로 구분한다.
2.  제목은 50글자 이내로 제한한다.
3.  제목의 첫 글자는 대문자로 작성한다.
4.  제목 끝에는 마침표를 넣지 않는다.
5.  제목은 명령문으로 사용하며 과거형을 사용하지 않는다.
6.  본문의 각 행은 72글자 내로 제한한다.
7.  어떻게 보다는 무엇과 왜를 설명한다.

### Commit Message 구조

```
//Header, Body, Footer는 빈 행으로 구분한다
Type(스코프): 주제(제목) // Header

본문 // Body

바닥글 // Footer
```

-   Header는 필수, 스코프는 생략 가능
-   Type은 해당 커밋의 성격을 나타내고 아래 중에 선택한다
    
    | 타입 이름 | 내용 |
    | --- | --- |
    | feat | 새로운 기능에 대한 commit |
    | fix | 버그 수정에 대한 commit |
    | build | 빌드 관련 파일 수정 or 모듈 설치 또는 삭제에 대한 commit |
    | chore | 기타 commit |
    | ci | ci 관련 설정 수정에 대한 commit |
    | docs | 문서 수정에 대한 commit |
    | refactor | 코드 리팩토링에 대한 commit |
    | test | 테스트 코드 수정에 대한 commit |
    | pref | 성능 개선에 대한 commit |
    
-   Body는 Header에서 표현 못한 상세한 설명을 적고, 필요 없다면 생략 가능하다
-   Footer는 바닥글로, 어떤 이슈에서 왔는지 같은 참조 정보들을 추가하는 용도로 사용한다
