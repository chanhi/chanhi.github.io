---
title: "[Python] Poetry를 사용해서 Django 프로젝트 시작하기"
slug: tistory-4
date: 2022-10-02
subcategory: python
tags: ["Python"]
tistory: https://chanhuy.tistory.com/4
---

Poetry는 pip과 pipenv 같은 python dependency manager이다. 다만 .toml 파일과 .lock 파일을 생성해 dependency를 관리한다.

설치를 위해서는 poetry 홈페이지에서 이용하는 os에 맞게 install 명령을 사용한다. (아래는 윈도우)

```bash
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | py -
```

설치를 하면 공식문서에도 있지만 PATH를 추가하라고 한다. 친절하게 아래처럼 경로를 알려주니 환경변수에 추가해 주자

![[4-1.png]]

이제 vscode를 열어서 poetry로 가상환경에  django를 설치를 한다.

1\. poetry init 으로 .lock , .toml 파일을 생성

2\. poetry add django 로 django 설치

3\. poetry shell 로 가상환경 terminal로 이동

4\. django-admin startproject config . 로 django 프로젝트 생성 !

원래는 poetry shell에서 django-admin 명령어가 제대로 동작을 해야하는데 나는 왜인지 "django-admin : 'django-admin' 용어가 cmdlet, 함수, 스크립트 파일 또는 실행할 수 있는 프로그램 이름으로 인식되지 않습니다...어쩌구저쩌구" 이렇게 나와서 알아보니 환경변수 문제인듯 해서 환경변수에 해당 가상환경이 있는 폴더를 추가하니까 작동을 했다. (이거 때문에 python 다 지우고 했는데 결국 PATH 문제였다는...?)
