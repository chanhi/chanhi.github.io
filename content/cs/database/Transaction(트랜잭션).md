---
title: "Transaction(트랜잭션)"
slug: tistory-17
date: 2025-06-11
subcategory: database
tags: ["Database"]
tistory: https://chanhuy.tistory.com/17
---

transaction?

-   데이터베이스 내에서 하나의 그룹으로 처리해야 하는 명령문들을 모아 놓은 작업 단위
-   여러 개의 SQL 명령문들을 하나의 논리적인 작업 단위로 처리하는데 이를 트랜잭션이라고 함
-   그러니까 어떤 하나의 개념급의 일을 처리하는 일련의 과정이 하나로 묶여 수행되야 하는 것

트랜잭션은 ACID 특성을 따라야 한다.

-   Atomicity(원자성): 여러 개의 명령어 집합(트랜잭션)이 정상적으로 처리되면 종료하고 하나라도 문제가 발생하면 전체를 취소
-   Consistency(일관성): 어떤 트랜잭션이 수행되기 전에 데이터베이스가 일관된 상태를 가졌다면 트랜잭션이 수행된 후에 데이터베이스는 또 다른 일관된 상태를 가짐
-   Isolation (격리성, 고립성): 수행 중인 트랜잭션에 다른 트랜잭션이 끼어들어 변경 중인 데이터 값을 훼손하지 못해야 함
-   Durability (지속성): 수행을 성공적으로 완료한 트랜잭션은 변경한 데이터를 영구히 저장해야 함

트랜잭션을 제어하기 위한 명령어

트랜잭션은 데이터를 변경하는 DML문이 실행됨과 동시에 진행이 된다.

이 작업이 성공적으로 처리되도록 하는 명령어는 COMMIT이고 작업을 취소하는 명령어는 ROLLBACK이다

즉 트랜잭션은 COMMIT혹은 ROLLBACK 명령 이후 부터 새로운 COMMIT혹은 ROLLBACK 명령을 실행하는 시점까지의 모든 DML 명령들이다.

-   COMMIT
    -   트랜잭션(INSERT, UPDATE, DELETE) 작업 내용을 실제 DB에 저장
    -   데이터가 완전히 변경됨
-   ROLLBACK
    -   트랜잭션(INSERT, UPDATE, DELETE) 작업내용을 취소
    -   이전 COMMIT한 곳 까지만 복구

데이터베이스 사용자가 COMMIT이나 ROLLBACK 명령어를 명시적으로 수행시키지 않더라도, 자동적으로 COMMIT 혹은ROLLBACK이 되는 경우(auto commit)

-   DDL과 DCL 명령문 실행 후 자동 COMMIT
-   정전이 발생했거나 컴퓨터 Down시 자동 ROLLBACK

SAVEPOINT

-   트랜잭션의 중간 지점에 수정 내용을 반영하는 포인트를 만들 수 있으며, 이를 SAVEPOINT라고 함
-   트랜잭션이 잘못되어 처음부터 다시 실행해야 할 경우 트랜잭션의 처음이 아니라 SAVEPOINT까지 되돌아가면 트랜잭션 전체가 ROLLBACK되는 것을 막을 수 있다.
-   SAVEPOINT는 트랜잭션안에 여러 개 만들 수 있다.

![[17-1.png]]

동시성 제어

여러 개의 트랜잭션이 동시에 수행되면서 같은 데이터에 접근하여 연산을 실행하더라도, 문제가 발생하지 않고 정확한 수행 결과를 얻을 수 있도록 수행을 제어하는 방법(OS의 Critical Section을 다루는 세마포어와 같은 느낌)

<table style="border-collapse: collapse; width: 100%;" border="1" data-ke-align="alignLeft"><tbody><tr><td style="width: 7.09302%;">&nbsp;</td><td style="width: 10.5814%;">트랜잭션1</td><td style="width: 11.5116%;">트랜잭션2</td><td style="width: 41.628%;">발생문제</td><td style="width: 29.186%;">동시접근</td></tr><tr><td style="width: 7.09302%;">1</td><td style="width: 10.5814%;">읽기</td><td style="width: 11.5116%;">읽기</td><td style="width: 41.628%;">문제없음</td><td style="width: 29.186%;">허용</td></tr><tr><td style="width: 7.09302%;">2</td><td style="width: 10.5814%;">읽기</td><td style="width: 11.5116%;">쓰기</td><td style="width: 41.628%;">오손 읽기, 반복불가능 읽기, 유령데이터 읽기</td><td style="width: 29.186%;">허용 혹은 불가 선택</td></tr><tr><td style="width: 7.09302%;">3</td><td style="width: 10.5814%;">쓰기</td><td style="width: 11.5116%;">쓰기</td><td style="width: 41.628%;">갱신손실</td><td style="width: 29.186%;">허용불가(LOCK 이용)</td></tr></tbody></table>

갱신 손실: 2개의 트랜잭션이 1개의 데이터를 동시에 갱신할 때 발생

\=> 공유 데이터를 동시에 접근하지 못하게 해야 함

\=> LOCK을 이용해서 자원 접근을 제한하고 해제해서 갱신 손실을 방지

LOCK

-   공유 LOCK(LS): 트랜잭션이 읽기를 할 때 사용(select)
-   배타 LOCK(LX): 트랜잭션이 읽고 쓰기를 할 때 사용(insert, update, delete)
-   데이터에 Lock이 걸려 있지 않으면 트랜잭션은 데이터에 Lock을 걸 수 있다.
-   트랜잭션이 데이터X를 읽기만 할 경우 LS(X)를 요청하고, 읽고 쓰기를 할 경우 LX(X)를 요청한다.
-   다른 트랜잭션이 데이터에 LS(X)을 걸어둔 경우, LS(X)의 요청은 허용하고 LX(X)는 허용하지 않는다.
-   다른 트랜잭션이 데이터에 LX(X)을 걸어둔 경우, LS(X)와 LX(X) 모두 허용하지 않는다.
-   트랜잭션이 Lock을 허용받지 못하면 대기상태가 된다.

2단계 Locking(2 phase locking)

Lock을 걸고 해제하는시점에 제한을 두지 않으면 두 개의 트랜잭션이 동시에 실행될 때 데이터의 일관성이 깨질 수 있어 이를 방지하는 방법

-   확장단계: 트랜잭션이 필요한 Lock을 획득하는 단계로, 이 단계에서는 이미 획득한 Lock을 해제하지 않음
-   수축단계: 트랜잭션이 lock을 해제하는 단계로, 이 단계에서는 새로운 Lock을 획득하지 않음

![[17-2.png]]

2단계Locking 기법을 사용하면 데이터의 일관성을 유지할 수 있지만 데드락이 발생할 가능성이 있다.

Lock 단위

Lock 단위가 클 때 동시성 수준이 낮아지지만, 동시성 제어 기법은 간단해짐.

Lock 단위가 작을 때 동시성 수준은 높아지지만, Lock 수가 많아져서 동시성 제어 기법이 복잡해짐

-   Row-level Lock
    -   어떤 사용자가 실행하고 있는 DML문에 의해 변경이 진행중인 행에는 Row-level Lock이 발생
    -   Row-level Lock은 변경이 진행중인 행이 완료될 때까지 보호됨
-   Table-level Lock
    -   변경중인 데이터가 테이블 전체인 경우에 Table-level Lock 발생
    -   한 트랜잭션이 Row-level Lock을 얻는 순간, 해당 테이블에 대한Table-level Lock도 동시에 얻음(예:DDL 오퍼레이션 불가능, 테이블 전체에 대한 변경문 불가능)

트랜잭션 고립수준(isolation level)

트랜잭션의 고립 수준은, Lock을 강하게 오래 유지할수록 강화되고, Lock을 최소화할수록 약화된다. 즉 트랜잭션의 고립 수준이 높을수록 동시성 정도는 낮아진다.

-   Read Uncommitted (Level=0)
    -   트랜잭션이 처리중인 아직 커밋되지 않은 데이터를 다른 트랜잭션이 읽는것을 허용
    -   SELECT 질의의 대상이 되는 테이블에 대해서 Lock을 설정하지 않은것과 같다.
    -   문제점: 오손읽기, 반복 불가능 읽기, 유령 데이터 읽기
    -   SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED
-   Read Committed (Level=1)
    -   트랜잭션이 커밋되어 확정된 데이터만 다른 트랜잭션이 읽도록 허용
    -   문제점: 반복불가능읽기, 유령데이터읽기
    -   SET TRANSACTION ISOLATION LEVEL READ COMMITTED
-   Repeatable Read (Level=2)
    -   자신의 데이터에 설정된 공유락(LS)과 배타락(LX)을 트랜잭션이 종료할 때까지 유지하여, 다른 트랜잭션이 자신의 데이터를 갱신할 수 없도록 함
    -   문제점: 유령데이터읽기
    -   SET TRANSACTION ISOLATION LEVEL REPEATABLE READ
-   Serializable (Level=3)
    -   고립수준이 가장 높은 명령어로, 실행중인 트랜잭션은 다른 트랜잭션으로부터 완벽하게 분리된다.
    -   SET TRANSACTION ISOLATION LEVEL SERIALIZABLE

-   오손 읽기 (dirty read)
    -   다른 트랜잭션에 의해 수정되었지만 아직 commit되지 않은 데이터를 읽는 것
    -   변경 후 아직 commit되지 않은 값을 읽었는데, 변경을 가한 트랜잭션이 최종적으로 rollback된다면 그 값을 읽은 트랜잭션은 비일관상태에 놓이게 된다.
-   반복 불가능 읽기(non-repeatable read)
    -   한 트랜잭션 내에서 같은 읽기 작업을 2번 수행했는데, 그 사이에 다른 트랜잭션이 값을 수정(update, delete)하는 바람에2개의 읽기 결과가 다르게 나타나는 현상
-   유령 데이터 읽기(phantom read)
    -   한 트랜잭션 내에서 같은 읽기작업을 2번 수행했는데, 그 사이에 다른 트랜잭션이 값을 삽입(insert)하는 바람에 이전에 없던 데이터(유령데 이터)가 나타나는 현상
