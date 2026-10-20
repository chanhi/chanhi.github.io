---
title: "branch에 Rulesets 적용하기"
slug: tistory-30
date: 2026-05-24
subcategory: git
tags: ["Git", "GitHub"]
tistory: https://chanhuy.tistory.com/30
---

계속 github가 "니 main 브랜치가 보호되지 않으니 rulesets을 만들어라"라고 하길래 무시하고 살았는데 얼마전에 팀원이 냅다 main branch에 push하는 모습을 보고(심히 경악함... 보통 pr 날려줘서 이럴거란 생각을 못함...) 이번 기회에 Rulesets을 적용해보려고 한다.

그동안 귀찮아서 안해봤는데 생각보다는 간단했다(이걸 지금껏 안하게 해준 여러 팀원들 땡큐)

먼저 repository에 Settings > Rules > Rulesets으로 간다.

![[30-1.png]]

New ruleset을 눌러서 New branch ruleset을 선택했다(main 브랜치를 보호하는게 목적이라)

![[30-2.png]]

Ruleset Name은 적당히 정해주고 Activate로 status를 변경시켜줘야 한다.

![[30-3.png]]

Target branches에 어떤 브랜치에 이 rule을 적용시킬지 Add target을 통해 추가해준다.

나같은 경우 main인 default를 선택해서 추가해줬다.

![[30-4.png]]

이제 Rule에서 ' Require a pull request before merging', 'Block force pushes' 두 개를 선택해줬다.

이러면 병합을 하기 전에 강제로 push하는 경우를 막고 무조건 PR을 써야 되는 것이 rule로 생성된다. 

생각보다 하려고 했던 rule은 어려운게 없어서 필요한게 있다면 그냥 추가해주면 될 것 같다.
