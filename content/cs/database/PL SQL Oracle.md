---
title: "PL/SQL [Oracle]"
slug: tistory-14
date: 2025-06-10
subcategory: database
tags: ["Database", "SQL"]
tistory: https://chanhuy.tistory.com/14
---

관계형 데이터베이스의 기초인 SQL은 프로그래밍 언어가 가지고 있는 조건문, 반복문, 입출력 등과 같은 동작, 사용자와의 상호 작용, 질의결과를 UI로 표현하는 등의 기능이 없다.

그렇기 때문에 SQL과 프로그래밍 언어의 통합이 필요한데...

이 통합을 할 때 데이터베이스 모델과 프로그래밍 언어 모델 간의 차이 때문에 여러 문제가 발생하는데 이를 Impedance Mismatch라고 한다.

-   데이터 타입간 차이: SQL 데이터 타입을 각 프로그래밍 언어의 타입에 맞도록 binding 해야 함
-   SQL 질의 결과가 튜플 집합이기 때문에 이를 데이터로 사용하기 위해 값을 추출한 후 사용해야 함

이걸 수행하려면 Embedded SQL(ESQL/C 등), SQL/PSM(SQL/Persistent Stored Modules)(PL/SQL), API 방식(JDBC) 등의 방법들을 이용하여 데이터베이스 프로그래밍을 할 수 있다!

 이중에서 Oracle의 PL/SQL의 기본적인 문법들을 알아보자

PL/SQL(Procedural Language extension to SQL): 오라클에서 제공하는 SQL을 확장한 절차적 프로그래밍 언어

언어 구조

선언부(DECLARE), 실행부(BEGIN… END), 예외처리부(EXCEPTION)로 구성

```sql
DECLARE  -- 선택
	-- 변수, 상수, 커서, 사용자지정예외선언
BEGIN-- 필수
	-- SQL 문장
    -- PL/SQL 제어 문장
EXCEPTION  -- 선택
	-- 에러 발생시수행될액션
END;-- 필수
```

이런 구조로 다음과 같은 블록 유형들을 가진다.

-   익명(Anonymous): 이름이 없는 PL/SQL 블록
-   저장 프로시저(Stored Procedure) 및 함수(Function): 매개변수를 받을 수 있고, 반복해서 사용할 수 있는 이름이 있는PL/SQL 블록
-   패키지(Package): 관련된 저장 프로시저, 함수를 모은 이름이 있는 PL/SQL 블록
-   트리거(Trigger): 데이터베이스의 테이블과 연결되어 자동적으로 실행되는 이름이 있는 PL/SQL 블록

이 블록 유형들에 대해서 자세히 알아보기 전에 기초적인 문법 몇 개만 알아보자

식별자

-   첫 자리는 알파벳으로 시작
-   총 자릿수는 30자 이내
-   특수문자 사용가능(단 &,-,/,space 제외)
-   대소문자 구별 x

문자는 작은 따음표 => 'String'

PL/SQL 추가 데이터 타입

-   BOOLEAN
-   %TYPE: 스칼라 데이터 타입 => 이미 선언된 다른 변수나 데이터베이스 컬럼의 데이터 타입을 사용
-   %ROWTYPE: 복합 데이터 타입 => 테이블이나 뷰 내부의 컬럼 이름, 데이터 타입, 크기, 속성을 그대로 사용

```sql
DECLARE
	v_total_sal CHAR(1) NUMBER(9) := 0;
	v_ename emp.ename%TYPE;
	v_emp emp%ROWTYPE;
BEGIN
	SELECT  empno, ename
 	INTO v_emp.empno, v_name
 	FROM  emp
	WHERE empno= 7369;
END;
```

사용자 정의 데이터 형

```sql
DECLARE
 TYPE emp_record IS RECORD
 	( v_ename VARCHAR2(30), 
	v_job VARCHAR2(9) );
 emp_rec emp_record ;
BEGIN
 SELECT ename, job
 INTO emp_rec.v_ename, emp_rec.v_job
 FROM emp
 WHERE empno= 7369;
 DBMS_OUTPUT.PUT_LINE( ‘Name : ' || emp_rec.v_ename);
 DBMS_OUTPUT.PUT_LINE( ‘Job : ' || emp_rec.v_job);
END;
```

조건문

```sql
IF condition THEN
 statements;
ELSIF condition THEN
 statements;
ELSE
 statements;
END IF;
```

반복문

```sql
LOOP           
	statements;
	...   
EXIT [WHEN condition];
END LOOP;

FOR index in [REVERSE] 시작값..끝값 LOOP           
	statements;
	... 
END LOOP; 

WHILE condition LOOP           
	statements;
...  
END LOOP;
```

```sql
DECLARE  
	i		NUMBER := 0;
	nSum	NUMBER := 0;
BEGIN
 	FOR i IN 1..100 LOOP
 		nSum := nSum + i;
 	END LOOP;
 	DBMS_OUTPUT.PUT_LINE(‘1~100까지의 합 : ‘ || 
	TO_CHAR(nSum));
END;
```

EXIT = break와 같은 기능

NULL = continue와 같은 기능

sql developer로 PL/SQL의 결과를 출력할 때 다음과 같이 하면 된다.

```sql
Set ServerOutput On
BEGIN
 DBMS_OUTPUT.PUT_LINE(‘Hello World’);
END;
```

![[14-1.png]]
