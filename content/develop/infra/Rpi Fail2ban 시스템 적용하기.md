---
title: "[Rpi] Fail2ban 시스템 적용하기"
slug: tistory-39
date: 2026-07-26
subcategory: infra
tags: ["RaspberryPi", "Linux", "토이프로젝트"]
tistory: https://chanhuy.tistory.com/39
---

라즈베리파이로 원격 SSH 서버를 열었는데 보안을 어떻게 해야 하나 고민하다가 Fail2ban을 알게 되었다

찾아보니 리눅스 서버 보안 쪽에서는 유명한 서비스였다. 그리고 SSH 보안 외에도 여러 범용성을 가지며 가벼운 시스템이기 때문에

Fail2ban을 선택했다.

![[39-1.png]]

#### Fail2ban

외부에서 무작위로 SSH 접속(22번 포트)을 시도하는 해킹 봇들을 방어하기 위해 Fail2ban이 백그라운드에서 동작하고 있습니다. systemd 통합 로그를 기반으로 비정상적인 접근을 실시간으로 차단합니다.

**패키지 업데이트 및 설치** 라즈베리파이 터미널(VS Code 또는 PuTTY)에서 아래 명령어를 차례로 입력합니다.

```
sudo apt update
sudo apt install fail2ban -y
```

**설정 파일 복사 (안전한 수정)** Fail2ban은 원본 설정 파일(jail.conf)이 업데이트 시 덮어씌워지는 것을 방지하기 위해 .local 파일을 만들어 사용하는 것을 원칙으로 합니다.

```
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
```

**systemd 백엔드 설정 파일 생성** 최신 리눅스 시스템(Raspberry Pi OS 포함)은 접속 기록을 남기던 전통적인 텍스트 형태의 로그 파일(/var/log/auth.log)을 사용하지 않고 systemd의 통합 저널(Journal) 시스템으로 로그 관리 방식을 변경했습니다.

하지만 Fail2ban은 기본적으로 옛날 방식의 텍스트 파일을 찾도록 설정되어 있어 아래 명령어를 복사하여 붙여넣기 한 후 엔터를 누릅니다. Fail2ban의 추가 설정 폴더(jail.d)에 백엔드를 systemd로 강제 지정하는 파일을 생성합니다.

```
echo -e "[DEFAULT]\nbackend = systemd" | sudo tee /etc/fail2ban/jail.d/custom-backend.local
```

**Fail2ban 서비스 재시작** 설정이 반영되도록 서비스를 다시 시작합니다.

```
sudo systemctl restart fail2ban
```

**Fail2ban 서비스 정상 가동 여부 확인:***(출력 결과에 초록색으로 active (running)이 표시되면 정상입니다.)*

```
sudo systemctl status fail2ban
```

**현재 차단된 IP 목록 및 보안 기록 확인 (가장 자주 쓰이는 명령어):***(해당 명령어를 입력하면 Currently banned 항목에서 현재 라즈베리파이 접근이 차단된 해커들의 IP 개수와 목록을 실시간으로 확인할 수 있습니다.*

```
sudo fail2ban-client status sshd
```

**(참고) 잘못 차단된 IP 수동 해제:**

```
sudo fail2ban-client set sshd unbanip [차단해제할_IP주소]
```

-   실수로 비밀번호를 여러 번 틀려 본인의 다른 기기가 차단되었다면 아래 명령어로 차단을 풀 수 있습니다.

### 유용한 시스템 관리 명령어

라즈베리파이 내부 터미널(VS Code 터미널 또는 PuTTY)에서 시스템 상태를 점검할 때 사용하는 기본 명령어입니다

**현재 라즈베리파이의 네트워크(IP) 주소 확인:**

```
hostname -I
```

**시스템 저장 공간(SD 카드) 잔여 용량 확인:**

```
df -h
```

**서버 재부팅 및 종료:**

```
# 시스템 재부팅 (재부팅 후 VS Code에서 다시 연결 가능)
sudo reboot

# 시스템 완전 종료 (전원 코드를 뽑기 전 반드시 실행)
sudo poweroff
```
