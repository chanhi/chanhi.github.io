---
title: "[Rpi] 라즈베리파이로 원격 서버 만들기1"
slug: tistory-40
date: 2026-07-28
subcategory: infra
tags: ["RaspberryPi", "Linux", "토이프로젝트"]
series: "라즈베리파이로 원격 서버 만들기"
tistory: https://chanhuy.tistory.com/40
---

뭔가 갑자기 Linux 개발 환경을 구축하고 싶은데 노트북에 쌩으로 깔까 가상머신을 써야 하나 고민하다가

눈에 예에에에ㅔ에전에 학교에서 썼던 라즈베리파이 4B 학습 키트(뭔가 이것저것 센서랑 다있음)를 발견했다.

그래서 이걸 써서 원격 서버로 열면 되겠다 싶어 바로 시작했다.

일단 잘 켜지는지 보려고 바로 켜보니 예전에 라즈베리파이 desktop OS가 깔려있어서 GUI가 나왔다.

잘 작동하는 것을 확인했고 예전에 이미 ssh가 열려있던 것으로 기억해서

바로 vscode remote를 이용해서 접속을 시도했는데...

```bash
[server] Error installing server: platform not currently supported: LinuxARM32
```

이런 오류가 나왔다. 검색해보니까

VS Code는 최근 업데이트(1.86 버전 이후)를 기점으로 32-bit ARM 리눅스 환경(LinuxARM32)에 대한 원격 서버 지원을 완전히 중단했다고 한다.

그렇다. 23년도엔 그냥 putty 쓰고 VNC 뷰어 써서 연결할 땐 상관 없었는데, 이젠 아니었다...(왜 32bit 썼는지 기억도 안남)

다행스럽게도 해당 Rpi 모델이 64bit를 지원한다고 하기 때문에 새로 OS를 구워서 넣으면 된다.

(VScode를 다운그레이드 하는 방법도 있는데 굳이긴 하다.)

일단 Rpi imager를 다운받고 그리고 원하는 OS를 다운 받아서 imager로 SD카드에 구워주면 된다.

[https://www.raspberrypi.com/software/](https://www.raspberrypi.com/software/)

🔗 [Raspberry Pi software – Raspberry Pi](https://www.raspberrypi.com/software/)

\- Imager download

[https://www.raspberrypi.com/software/operating-systems/](https://www.raspberrypi.com/software/operating-systems/)

🔗 [Raspberry Pi OS downloads – Raspberry Pi](https://www.raspberrypi.com/software/operating-systems/)

\- OS download

예전에는 링크가 좀 숨겨져(?)있었던 것 같은데 지금은 찾기 쉽게 잘 되어있다.

OS는 어차피 ssh 환경만 쓸 것같아서 **Raspberry Pi OS (Legacy) Lite) 64bits**로 다운 받았다

Imager는 다운 받아서 실행시키면

![[40-1.jpg]]

대충 이렇게 뜬다. Device는 선택 안해도 넘어가지긴 해서 난 선택 안했다.

그리고 아까 다운로드한 OS에 맞게 OS를 선택하고 wifi 연결도 해주고,

나는 ssh를 쓸 것이기 때문에 ssh도 활성화 해줬다.(비밀번호 인증을 활성화 해둬야 처음 접속할 때 편하다)

그리고 계정 설정은 본인이 원하는 대로 하면 되는데, 원래는 무슨 wifi 연결이랑 글자 문제 때문인가 해서 언어였나 지역을 US나 영국으로 해야 했는데 까먹고 그냥 한국으로 했는데 잘 됐다.

그리고 이제 SD 카드에 구워주고 라즈베리파이에 넣은 뒤 전원키고 한 2분 정도 기다리면 부팅이 끝나있을 것이다.

이제 ssh를 켜뒀기 때문에 굳이 다이렉트로 연결 안하고 바로 putty로 접속을 했다.

잘 접속이 되길래 바로 VScode remote를 했는데

```bash
WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!
Host key verification failed.
```

이 에러가 뜬다.

이건 아까 나처럼 실패한 사람이 있으면 나타날 수 있는데 나는 OS를 바꾸고 설정파일을 그대로 덮어써서 같은 IP를 가져가지고

VSCode가 이전에 접속했던 기록이 있어서 해당 IP의 Host Key를 기억하고 있는데 OS가 바뀌면서 Host key도 바뀌었기 때문에

알아서 차단된 것이다.

해결법은 아래 코드를 실행시켜서 저장된 정보를 지우고 다시 접속하면 된다

```bash
ssh-keygen -R 000.000.000.000 #주소부분에 라즈베리파이 ip
```

혹시 ip를 모른다면 'hostname -I'를 하면 나온다.

그리고 VSCode로 원격접속하는 방법은 왼쪽 아래에 >< 이렇게 생긴 아이콘을 누르고 Connect to host...를 선택하면 어디로 접속할 거냐고 물어본다.

그러면 위에서 나온 ip를 \[계정이름\]@ip 이런식으로 입력하면 접속이 된다.

그런데 알 사람들은 알겠지만 여기까지만 하면 사설망 안에서는(간단하게 말하면 보통 집 안에서) 잘 연결되지만

외부망에서 접속하게 되면 위에서 쓰는 IP는 사설IP이기 때문에 접속이 안된다.

그러면 어떻게 해야 외부망에서 연결할 수 있는지는 다음 글에서 작성하도록 하겠다.
