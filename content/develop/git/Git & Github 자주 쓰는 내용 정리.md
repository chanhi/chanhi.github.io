---
title: "[Git & Github] 자주 쓰는 내용 정리"
slug: tistory-38
date: 2026-07-25
subcategory: git
tags: ["Git", "GitHub"]
tistory: https://chanhuy.tistory.com/38
---

예전에 git & github를 배우면서 필기를 했던 노트를 찾아서 이걸 다시 정리해서 여기에 올린다.

(언젠가 해야지 하고 있긴 했는데 예전 파일 뒤적거리다가 찾아서 하는 중 ㅎㅎ)

근데 예전이랑 달라진 부분이 있을 수도 있기 때문에 AI 한테 물어봐서 고쳤슴다.

1.  기본 브랜치 이름이 master에서 main으로 변경된 점. -> 이게 무슨 인권? 문제 떄문에 이름이 바뀐걸로 알고 있습니다.
2.  역할이 너무 많아 헷갈렸던 git checkout 명령어가 **git switch**(브랜치 이동)와 **git restore**(파일 복구)로 분리된 점 -> 근데 이거 여전히 checkout 쓸 순 있습니다.

* * *

# Git & GitHub 핵심 개념 및 최신 명령어 총정리

개발자라면 필수로 알아야 하는 Git과 GitHub! 처음 배울 때는 헷갈리기 쉽지만 핵심 개념과 자주 쓰는 명령어를 이해하면 강력한 무기가 됩니다. 

## 1\. Git과 GitHub란 무엇인가

<table style="border-collapse: collapse; width: 100%;" border="1" data-path-to-node="8" data-ke-align="alignLeft"><tbody><tr><td><b>구분</b></td><td><b>설명</b></td></tr></tbody><tbody><tr><td><span data-path-to-node="8,1,0,0"><b data-index-in-node="0" data-path-to-node="8,1,0,0">Git</b></span></td><td><span data-path-to-node="8,1,1,0">분산 버전 관리 시스템(VCS). 내 컴퓨터(Local)에서 파일의 모든 변경 사항을 추적하고 기록합니다.</span></td></tr><tr><td><span data-path-to-node="8,2,0,0"><b data-index-in-node="0" data-path-to-node="8,2,0,0">GitHub</b></span></td><td><span data-path-to-node="8,2,1,0">Git이 기록한 내역(History)을 온라인에 저장하고 다른 사람과 공유할 수 있게 해주는 <b data-index-in-node="52" data-path-to-node="8,2,1,0">원격 저장소(Remote Repository)</b> 호스팅 서비스입니다.</span></td></tr><tr><td><span data-path-to-node="8,3,0,0"><b data-index-in-node="0" data-path-to-node="8,3,0,0">GitHub Desktop</b></span></td><td><span data-path-to-node="8,3,1,0">터미널(CLI) 환경이 익숙하지 않은 사용자를 위해 Git을 시각적으로 다룰 수 있게 만든 GUI 프로그램입니다.</span></td></tr></tbody></table>

## 2\. Git의 핵심 개념 및 작업 영역

Git이 파일을 관리하는 공간은 크게 3가지 영역(Areas)으로 나뉩니다. 이 영역을 이해하는게 git을 사용하는데 진짜 중요합니다

-   **Working Directory**: 현재 파일을 작업하고 수정하는 공간. 그냥 보통 작업하는 그 폴더입니다
-   **Staging Area**: 커밋(Commit) 되기 전, 변경된 파일들이 잠시 대기하는 공간. 폴더 내에서 변경된 것을 git이 추적합니다
-   **Repository (.git)**: 커밋이 완료되어 버전의 역사(History)가 영구적으로 저장되는 공간. 보통 원격저장소(Github)에 저장

### 관련 명령어

-   git init \[folder name\]: 해당 폴더를 Git 저장소로 초기화합니다. (숨김 폴더인 .git이 생성됨)
    -   *git init -b main을 사용하면 기본 브랜치를 바로 main으로 설정할 수 있습니다.*
    -   *이걸 해줘야 git이 해당 폴더의 변경사항을 추적하기 시작합니다*
-   git add \[file\]: 변경된 파일을 Staging Area에 등록합니다.
-   git log: 지금까지 커밋된 모든 변경 사항(History)을 확인합니다.
-   git commit -m "\[commit message\]": Staging Area에 있는 파일들을 코멘트와 함께 .git 저장소에 영구 기록합니다.
    -   이 명령을 쓰기 전에 아마 git이 니가 누구냐며 정보를 입력하라고 합니다
    -   git config --global user.name "이름"  or   git config --global user.email "이메일" 둘 중에 하나만 해도 됩니다.
    -   commit message는 혼자 쓸 때는 상관 없지만 팀 단위에서는 규칙을 정하고 사용하는 것이 좋습니다.

🔗 [\[Git & Github\] Git Commit Message 규칙](/develop/tistory-28/)

> **.gitignore 란?**
> 
> Git의 추적을 원치 않는 파일(예: 보안 키, 빌드 결과물 등)의 목록을 적어두는 파일입니다. 여기에 등록된 파일은 git add를 해도 Staging Area에 올라가지 않습니다. -> 중복되는 모듈이나 중요한 env 파일등을 등록합니다

## 3\. 브랜치(Branch)와 병합(Merge) 

-   **브랜치 이동**: git switch
-   **파일 복구**: git restore

### 브랜치 관련 명령어

-   git branch \[branch name\]: 새로운 브랜치를 생성합니다.
-   git branch -v: 현재 존재하는 브랜치 목록과 최근 커밋을 확인합니다.
-   git switch \[branch name\]: 해당 브랜치로 이동합니다. *(구: git checkout)*
-   git switch -c \[new branch name\]: 브랜치를 생성함과 동시에 해당 브랜치로 이동합니다. *(구: git checkout -b)*
-   git branch -d \[branch name\]: 브랜치를 삭제합니다.

## 4\. GitHub을 활용한 원격 협업

로컬에서 작업한 내용을 GitHub에 올리거나, 남의 프로젝트를 가져와 작업할 때 사용합니다.

### 원격 저장소 연결 및 업로드 (Push)

-   git remote -v: 현재 연결된 원격 저장소 목록을 확인합니다.
-   git remote add \[name\] \[URL\]: 새로운 원격 저장소를 등록합니다. (보통 기본 이름으로 origin을 사용)
-   git remote remove \[name\]: 등록된 원격 저장소 연결을 끊습니다.
-   git push -u origin main: 로컬의 커밋 내역을 GitHub(원격 저장소)에 업로드합니다.

### 오픈소스 및 팀 프로젝트 참여 (Fork & Clone)

-   **Fork**: GitHub에 있는 다른 사람의 저장소를 내 GitHub 계정으로 그대로 복사해 오는 기능입니다.
-   **Clone**: GitHub에 있는 원격 저장소를 내 컴퓨터(Local)로 다운로드하여 작업 폴더를 생성합니다.
    -   git clone \[저장소 주소\] \[folder name(선택)\]
    -   clone은 사용하면 자동으로 remote 정보까지 등록되어서 편리합니다
-   **Upstream Branch**: Fork 해온 원래 베이스 저장소(원본)를 의미합니다. 원본의 최신 코드를 가져와 내 저장소를 동기화할 때 사용합니다. (최근에는 GitHub 웹사이트에서 'Sync fork' 버튼으로 쉽게 동기화할 수 있습니다.)

### 풀 리퀘스트 (Pull Request, PR)

작업자(또는 Fork 한 사람)가 원본 저장소 관리자에게 "내가 수정한 코드를 당신의 메인 코드에 병합(Merge) 해주세요"라고 요청하는 기능입니다. 관리자가 코드 리뷰 후 승인하면 코드가 병합됩니다. 이것도 규칙이 있다면 따르고 없다면 상세하게 써주는 게 좋습니다.

## 5\. 이슈 추적과 마일스톤 (Issues & Milestone)

GitHub은 단순한 코드 저장소를 넘어 프로젝트 관리 도구의 역할도 합니다.

-   **Issues**: 프로젝트의 버그, 문제점, 추가할 기능 등을 등록하여 팀원들과 공유하고 토론하는 게시판 역할을 합니다. PR을 올릴 때 제목이나 본문에 Fixes #이슈번호 라고 적으면 PR이 병합될 때 해당 이슈가 자동으로 닫힙니다. (Tag/Label을 달아 분류 가능)
-   **Milestone**: 특정 버전 배포(릴리즈) 등 하나의 큰 목표를 위해 해결해야 할 Issue들과 PR을 묶어서 진척도를 관리하는 기능입니다.

## 6\. 시간 여행하기: HEAD와 Reset

-   **HEAD**: 현재 작업 중인 로컬 브랜치의 가장 최신 커밋을 가리키는 포인터입니다.
-   git switch --detach \[commit id\]: HEAD를 과거의 특정 커밋 시점으로 이동시켜 과거 코드를 확인합니다. *(구: git checkout \[commit id\])*

### 되돌리기 (Reset)

과거 커밋으로 돌아갈 때 사용하며, 돌아가는 방식에 따라 옵션이 다릅니다.

-   git reset --hard HEAD^: 이전 커밋 하나(^ 개수만큼)로 완전히 되돌아갑니다. 작업 중이던 내용도 모두 삭제되므로 주의해야 합니다.
-   git reset --mixed HEAD^: (기본값) 커밋 내역은 되돌리지만, 작업했던 파일의 변경 내용은 Working Directory에 그대로 남겨둡니다.

### 강제 덮어쓰기

-   git push origin main --force: 로컬의 역사와 원격 저장소의 역사가 달라 충돌할 때, 로컬의 내역으로 원격 저장소를 강제로 덮어씁니다. (협업 시 타인의 코드를 날릴 수 있으므로 매우 주의해서 사용해야 합니다.)
-   이건 사실상 혼자 쓸 때만 쓰는 걸 추천합니다.(팀 단위에서 쓰다가 망해버릴 수 있습니다)
