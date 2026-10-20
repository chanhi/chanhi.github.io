---
title: "PL/SQL (프로시저, 함수, 트리거)"
slug: tistory-16
date: 2025-06-11
subcategory: database
tags: ["Database", "SQL"]
tistory: https://chanhuy.tistory.com/16
---

프로시저

-   매개 변수를 사용할 수 있고 반복해서 사용할 수 있는 이름이 있는 PL/SQL 블록
-   리턴값 없음!
-   연속 실행 또는 구현이 복잡한 트랜잭션을 수행하는 PL/SQL 블록을 데이터베이스에 저장하기 위해 생성
-   데이터베이스 내에서 미리 컴파일되어 저장되므로, 실행시간때 컴파일 해야 하는 SQL문보다 빠르게 실행
-   매개변수: 블록 안에서의 변수와 똑같이 일시적으로 값을 저장하는 역할
    -   IN
        -   호출 환경으로부터 프로시저로 값을 전달
        -   상수, 수식 또는 초기화된 변수 사용
    -   OUT
        -   프로시저로부터 호출 환경으로 값을 전달
        -   초기화되지 않은 변수를 매개변수로 사용
        -   명시적으로 지정해야 함

```sql
CREATE or replace PROCEDURE select_ename(v_empno IN number) IS
 v_ename emp.ename%type;
BEGIN
 SELECT ename
 INTO   v_ename
 FROM emp
 WHERE empno= v_empno;
 DBMS_OUTPUT.PUT_LINE('이름 : ' || v_ename);
END;
```

함수

-   매개 변수를 사용할 수 있고 반복해서 사용할 수 있는 이름이 있는 PL/SQL 블록
-   리턴값 있음, IN 매개변수만 사용
-   프로시저와의 차이점은 결과값을 return한다는 것과 IN 매개변수만 사용 가능하다는 것

```sql
CREATEor replace FUNCTION get_incsal (v_empno NUMBER, rate IN  NUMBER) RETURN NUMBER
IS
 	v_sal emp.sal%type;
BEGIN 
 	SELECT sal
 	INTO v_sal
 	FROM emp
 	WHERE empno = v_empno;
    
 	v_sal := v_sal * rate;
 	RETURN v_sal; 
END;
```

트리거

-   데이터베이스에 특정한 변경이 가해졌을 때 이에 대응해서 자동으로 호출하는 일종의 프로시저
-   데이터베이스 테이블에 갱신 DML문이 발생할 때 수행
-   INSERT, UPDATE, DELETE문의 사용에 사건을 정의할 수 있으며 이들을 실행할 때 정의된 트리거도 자동실행
-   데이터베이스에 저장
-   뷰에 대해서가 아니라 테이블에 관해서만 정의
-   테이블 생성시 참조 무결성과 데이터 무결성 그 밖의 다른 제약조건으로 정의할 수 없는 복잡한 요구사항에 대한 제약조건을 생성할 수 있다.
-   문장 트리거
    -   트리거 사건에 의해 단 한번 실행
    -   컬럼의 각 데이터행 제어 불가능
    -   컬럼의 데이터 값에 상관없이 변화가 일어남을 감지하여 실행되는 트리거
-   행 트리거
    -   컬럼의 각각의 데이터행에 변화가 생길때마다 실행
    -   변화가 생긴 데이터행의 실제값 제어 가능
    -   데이터행의 실제값을 수정, 변경 또는 저장할 때 사용

```sql
CREATE or replace TRIGGER enable_emp
BEFORE
INSERT OR DELETE OR UPDATE
ON EMP

DECLARE  -- 변수를 선언할때DECLARE문사용
	disable_time EXCEPTION;
BEGIN
 	IF  (TO_CHAR(SYSDATE,'HH24:MI') >= ‘14:00' and TO_CHAR(SYSDATE,'HH24:MI') <= ‘24:00') THEN
 		RAISE disable_time;
 	END IF;
 	EXCEPTION
 		WHEN disable_time THEN 
			RAISE_APPLICATION_ERROR(-20500, '업무시간에만 사용 가능합니다.');
END;
```

```sql
CREATE or replace TRIGGER trigger_test
BEFORE  UPDATE ON dept
FOR EACH ROW      --행트리거

BEGIN
 DBMS_OUTPUT.PUT_LINE('변경 전 컬럼 값: ' || :old.dname);
 DBMS_OUTPUT.PUT_LINE('변경 후 컬럼 값: ' || :new.dname);
END;
```
