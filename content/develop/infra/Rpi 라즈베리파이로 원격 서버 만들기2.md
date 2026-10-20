---
title: "[Rpi] 라즈베리파이로 원격 서버 만들기2"
slug: tistory-41
date: 2026-07-28
subcategory: infra
tags: ["RaspberryPi", "Linux", "토이프로젝트"]
series: "라즈베리파이로 원격 서버 만들기"
tistory: https://chanhuy.tistory.com/41
---


🔗 [\[Rpi\] 라즈베리파이로 원격 서버 만들기1](/develop/tistory-40/)

이전글 참고

이제 외부망에서 접속하기 위한 설정을 할 차례다.

처음에는 당연히 포트포워딩을 생각하고 있었는데 찾아보니 Tailscale을 사용해서 접속시킨 기기끼리 사설망을 구축해주는

서비스가 있어서 이것도 한번 사용해봤다.

[https://tailscale.com/](https://tailscale.com/)

🔗 [Tailscale | Secure Connectivity for AI, IoT & Multi-Cloud](https://tailscale.com/)

개념은 VPN이랑 비슷하긴 한데 설정이 훨씬 간편하다.

Tailscale은 WireGuard 프로토콜 위에 구축된 메쉬(mesh) VPN이다. 아까 얘기했던 대로 내가 등록한 기기들을 하나의 사설 네트워크로 묶어주는 기능을 한다.

방법은 매우 간단하다.

**1\. 라즈베리파이에 설치**

Bash

```
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
# 출력되는 링크로 접속하여 계정 연동
tailscale ip -4  # 부여된 100.x.y.z IP 메모
```

**2\. 클라이언트(노트북) 설치:** Tailscale 앱 다운로드 후 **동일한 계정**으로 로그인.

**[https://tailscale.com/download](https://tailscale.com/download)**

**3\. VS Code SSH Config 설정:**

```
Host rpi-tailscale
    HostName 100.x.y.z
    User pi
    IdentityFile ~/.ssh/id_ed25519
```

그리고 저번 글에서 자세히 설명을 안한게 있는데 위에 VSCode ssh config 설정에 IdentityFlile은 ssh\_key를 등록해서 password 없이 키 인증을 통해 접속하게 해주는 설정이다.

위 설정을 하면 매번 비밀번호를 입력할 필요가 없다.

방법은 간단하다

1\. 키를 생성하고 2.라즈베리파이에 공개키를 등록한다.

```bash
# 1. 키 생성
ssh-keygen -t ed25519

# 2. 라즈베리파이에 공개키 등록
cat $env:USERPROFILE\.ssh\id_ed25519.pub | ssh [계정이름]@[라즈베리파이IP] "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys"
```

보안을 생각하면 이 키 등록을 해서 등록된 기기만 접속 가능하게하고 /etc/ssh/sshd\_config에서 PasswordAuthentication no로 설정해서 저장하면 비밀번호로 ssh에 접근하는 것을 아예 차단한다. sudo systemctl restart ssh 명령을 통해 재시작해야 적용

그리고 기기를 추가하려면 ~/.ssh/authorized\_keys에 새기기의 공개키를 새로운 줄에 넣어주면 된다.

그리고 이전에 Fail2ban 관련 글을 썼는데, 이건 실제로는 방화벽에 규칙을 추가한거라 제대로 방화벽 설정을 한건 아니다.

```bash
sudo apt update && sudo apt install ufw -y
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp  # 🚨 매우 중요: 방화벽 활성화 전 반드시 SSH 포트를 열어야 함
sudo ufw enable
sudo ufw status
```

위 코드를 쓰면 내부로 오는 건 22포트만 열고 나머진 막고 나가는건 다 허용한다. 

그리고 포트포워딩 방식은 공유기 관리자 페이지에 접속을 일단 해야 한다.

관리자 페이지에서 수동으로 외부 포트는 20000번대에 아무거나 해서 공격을 좀 회피하고 내부는 22포트로 설정한다.

자세한건 본인 공유기 회사랑 포트포워딩 검색하면 대부분 잘 나온다.
