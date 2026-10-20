---
title: "Github Token 사용해서 push 하기"
slug: tistory-31
date: 2026-05-31
subcategory: git
tags: ["Git", "GitHub"]
tistory: https://chanhuy.tistory.com/31
---

google cloud 서버에서 작업을 하다가 git push를 하려고 했는데

username을 입력하라고 떴다. 엥 이런거 떠본적 없는데 리눅스는 다른가? 일단 username이야 뭐 아니까 입력해줬다

그리고 password를 입력하고 해서 내 github 비밀번호를 입력했는데 어... 왜 인증이 안되지?

비번이 틀렸나 하고 웹에서 다시 로그인을 했지만 비번이 틀린 건 아니었다.

바로 찾아보니 github 정책 변경으로 인해 password에 비번이 아닌 'Token'을 입력해야 한다고 한다

token은 이전에 docker hub에 action 권한을 주기 위해서 써본적이 있었는데 여기서도 쓸 줄이야

Token을 생성하는 것은 어렵진 않다

일단 github settings로 이동한다

사이드에 내리다보면 Developer Settings가 있다 눌러서 이동

그리고 Personal access tokens > Tokens(classic)로 이동

generate new token(classic)을 눌러준다

여기에서 Note는 그냥 원하는 이름을 입력해주고 Expiration은 유효기간이다.

그리고 Select scopes에서 할당해줄 권한을 선택하면 되는데 pull, push 정도의 기능을 쓰려면 repo만 선택해주면 된다

![[31-1.png]]

생성을 하고 나면 token이 발급되는데 또 쓸 거면 따로 어디 써둬야 한다. 

나중에 다시 가면 사라져서 까먹으면 재발급해야 됨
