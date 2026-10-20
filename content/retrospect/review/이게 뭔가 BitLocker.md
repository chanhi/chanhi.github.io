---
title: "이게 뭔가 BitLocker"
slug: tistory-34
date: 2026-07-05
subcategory: review
tags: ["Windows", "BitLocker"]
tistory: https://chanhuy.tistory.com/34
---

노트북에 윈도우 업데이트가 떳길래 한참을 미루다가 한번 해둬야지 하고 했더니  
갑자기 "BitLocker 복구"라는 문구가 나오면서 48자리의 복구키를 입력하라고 한다.

이게 뭔가 하고 찾아보니 윈도우에서 제공하는 기능이었다.

* * *

BitLocker는 드**라이브를 암호화하여 데이터를 보호하는 Windows 보안 기능**입니다. 이러한 암호화는 누군가가 오프라인으로 디스크에 액세스하려고 하면 해당 콘텐츠를 읽을 수 없도록 합니다.

BitLocker는 중요한 정보를 안전하게 유지하므로 디바이스를 분실하거나 도난당한 경우에 특히 유용합니다. 사용자에게 친숙하도록 설계되었으며 Windows 운영 체제와 원활하게 통합되어 쉽게 설정하고 관리할 수 있습니다.

BitLocker는 다음 두 가지 기능을 제공합니다.

-   [디바이스 암호화](https://support.microsoft.com/ko-kr/windows/security/encryption/device-encryption-in-windows)는 사용 편의성을 위해 설계되었으며 일반적으로 자동으로 사용하도록 설정됩니다.
-   [BitLocker 드라이브 암호화](https://support.microsoft.com/ko-kr/windows/security/encryption/bitlocker-drive-encryption)는 고급 시나리오용으로 설계되었으며 드라이브를 수동으로 암호화할 수 있습니다.

**\- [https://support.microsoft.com/ko-kr/windows/security/encryption/bitlocker-overview](https://support.microsoft.com/ko-kr/windows/security/encryption/bitlocker-overview)**

* * *

도난 당한것도 아니고 그냥 윈도우 업데이트 하는데 이게 왜 뜬건진 모르겠지만 일단은 이걸 풀기 위해서 검색을 해보았다.

검색해보니 **복구키가 없으면 절대로 해제가 불가능** 하다는 정보를 얻어버렸다.

그래서 정말 방법이 없나 해서 더 찾아보니 로그인된 마이크로소프트 계정에 등록된 장치의 BitLocker 복구키를 찾을 수 있다고 해서 바로 로그인을 했다.

근데 등록된 장치는 있는데 복구키를 찾을 수 없다고 떠서 보니까 이전에 등록이 안된 걸 수도 있다고 한다.(이게 무슨)

결국 BitLocker 복구키를 못찾아서 노트북을 포맷하기로 결정했다...

* * *

당연하게도 BitLocker에 의해 기존에 쓰던 드라이버가 암호화되어서 window에서 제공하는 간단한 복구 기능은 이용할 수가 없다.

그래서 window 설치 usb를 만들어서(이건 찾아보면 쉽게 나온다) 기존에 쓰던(암호화된) 드라이버를 삭제하고(안녕 내 데이터 ㅜㅜㅜㅜㅜㅜ) 새로 윈도우를 설치했다.

그리고 왜 그런진 모르겠는데 저번 포맷할 때도 네트워크 드라이버가 증발해버려서 수동으로 다운 받아서 힘겹게 설치했는데 이번에도 그랬다.

노트북을 한 번 떨군적이 있는데 그게 문제였나...

노트북 제조사의 홈페이지에서 해당 모델에 맞는 네트워크 어댑터 드라이버를 다운받아 usb에 옮긴다.

그리고 윈도우 설치 과정에서 네트워크가 없음을 고르고 설치 과정을 끝낸 뒤 드라이버를 설치하면 된다.

만약 그 버튼이 안 보인다면 shift + F10을 눌러서 프롬프트 창을 띄우고

```bash
OOBE\BYPASSNRO
```

위 명령어를 넣으면 새로 프로세스가 진행되면서 아마 뜰 것이다.

그리고 설치하면 끝

* * *

애초에 이걸 설정한 적도 없고 한 짓이라고는 윈도우 업뎃 뿐인데 이렇게 되어버려서 너무 억울하다.

이 글을 보는 경우라면 이미 잠겨버린 분들이라 도움이 되진 못하겠지만 만약 미리 이 글을 보는 분들이라면 해제하든가 미리 BitLocker 복구키를 백업해두기를 바란다
