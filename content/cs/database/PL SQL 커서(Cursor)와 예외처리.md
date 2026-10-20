---
title: "PL/SQL 커서(Cursor)와 예외처리"
slug: tistory-15
date: 2025-06-11
subcategory: database
tags: ["Database", "SQL"]
tistory: https://chanhuy.tistory.com/15
---

PL/SQL에서 SELECT를 할 때 주의해야 할 점이 있다.

바로 반드시 하나의 행만을 검색해야 한다는 것이다!

이게 뭔 소리냐면, select를 통해 값을 조회하고 그 값을 변수에 넣는 작업을 할 때 여러개의 행을 조회해 버리면 오류가 발생하기 때문에 하나의 행만을 조회하도록 해야 한다!

만약 두 개 이상의 데이터 행을 추출하면 **TOO\_MANY\_ROWS** 오류가 발생하고, 어떤 데이터도 추출하지 못하면**NO\_DATA\_FOUND** 오류가 발생한다.

아니 그러면 여러 행을 한번에 조회해서 사용할 수는 없는 것인가??

이럴 때 바로 커서(Cursor)를 사용하면 된다!

커서: SQL 처리 결과가 저장된 작업 영역에 이름을 지정하고 저장된 정보를 접근할 수 있게 함. SQL 명령을 실행시키면 서버는 명령을 파싱하고 실행하기 위한 메모리 영역을 오픈하는데 이 영역을 cursor라고 부른다

종류: 암시적 커서, 명시적 커서

암시적 커서

-   오라클 데이터베이스에서 실행되는 모든 SQL문장은 암시적인 커서
-   SQL 문이 실행되는 순간 자동으로 열림과 닫힘 실행

<table style="border-collapse: collapse; width: 100%; height: 68px;" border="1" data-ke-align="alignLeft"><tbody><tr style="height: 17px;"><td style="width: 33.2558%; height: 17px; text-align: center;">SQL%ROWCOUNT</td><td style="width: 66.7442%; height: 17px; text-align: center;">해당 SQL 문에 영향을 받는 행의 수</td></tr><tr style="height: 17px;"><td style="width: 33.2558%; height: 17px; text-align: center;">SQL%FOUND</td><td style="width: 66.7442%; height: 17px; text-align: center;">해당 SQL문의 영향을 받는 행의 수가 1개 이상일 경우TRUE</td></tr><tr style="height: 17px;"><td style="width: 33.2558%; height: 17px; text-align: center;">SQL%NOTFOUND</td><td style="width: 66.7442%; height: 17px; text-align: center;">해당 SQL 문에 영향을 받는행의 수가 없을 경우TRUE</td></tr><tr style="height: 17px;"><td style="width: 33.2558%; height: 17px; text-align: center;">SQL%ISOPEN</td><td style="width: 66.7442%; height: 17px; text-align: center;">암시적 커서가 열려 있는지의 여부검색 항상FALSE(실행한 후 바로커서를 닫기 때문)</td></tr></tbody></table>

명시적 커서

![[15-1.png]]

-   DECLARE : 이름이 있는 SQL 영역 생성
-   OPEN : 커서 활성화
-   FETCH : 커서의 현재 데이터행을 해당 변수에 넘김
-   EMPTY : 현재 데이터행의 존재 여부 검사, 레코드가 없으면 FETCH 하지 않음
-   CLOSE : 커서가 사용한 자원 해제

```sql
DECLARE
 v_empno emp.empno%TYPE;
 v_ename emp.ename%TYPE;
 CURSOR emp_list IS --커서 선언
 	SELECT empno, ename
 	FROM emp;
BEGIN
 OPEN emp_list; --커서 연결
 LOOP
 	FETCH emp_list INTO v_empno, v_ename; --커서로부터 데이터 패치
 	EXIT WHEN emp_list%NOTFOUND; 
    --%NOTFOUND fetch한 데이터가 행을 리턴하지 않으면 True
	DBMS_OUTPUT.PUT_LINE(v_ename);
 END LOOP;
 DBMS_OUTPUT.PUT_LINE('전체데이터수' || TO_CHAR(emp_list%ROWCOUNT));
 --%ROWCOUNT 현재까지 반환된 모든 데이터 행 수
 CLOSE emp_list; --커서 닫기
END;
```

FOR 문을 사용하면 커서의 OPEN, FETCH, CLOSE가 자동으로 발생 됨!

레코드 이름도 자동 선언되므로 따로 선언할 필요도 없음!

```sql
DECLARE
 	CURSOR dept_cnt IS
 		SELECT b.dname, COUNT(a.empno) cnt
 		FROM    emp a, dept b
 		WHERE  a.deptno = b.deptno
 		GROUP  BY b.dname;
BEGIN
 	FOR emp_list IN dept_cnt LOOP
 		DBMS_OUTPUT.PUT_LINE('부서명 : ' || emp_list.dname);
 		DBMS_OUTPUT.PUT_LINE('사원수 : ' || TO_CHAR(emp_list.cnt));
 	END LOOP;
END;
```

커서에 파라미터를 전달해서 사용할 수 있다.

```sql
DECLARE
 CURSOR emp_list(v_deptno  emp.deptno%TYPE) IS
 	SELECT  ename 
	FROM      emp
 	WHERE   deptno = v_deptno;
BEGIN
 DBMS_OUTPUT.PUT_LINE('** 입력한 부서 직원** '); -- 패러미터변수의값을전달(OPEN될때값전달)
 FOR emplst IN emp_list(10) LOOP 
	DBMS_OUTPUT.PUT_LINE(‘부서번호10 : ' || emplst.ename);
 END LOOP;
 FOR emplst IN emp_list(20) LOOP 
	DBMS_OUTPUT.PUT_LINE(‘부서번호20 : ' || emplst.ename);
 END LOOP;
END;
```

예외처리

<table style="border-collapse: collapse; width: 100%; height: 147px;" border="1" data-ke-align="alignLeft" data-ke-style="style13"><tbody><tr style="height: 21px;"><td style="width: 33.3333%; text-align: center; height: 21px;">예외</td><td style="width: 33.3333%; text-align: center; height: 21px;">설명</td><td style="width: 33.3333%; text-align: center; height: 21px;">처리</td></tr><tr style="height: 42px;"><td style="width: 33.3333%; height: 42px;">미리 정의된 오라클 서버 예외</td><td style="width: 33.3333%; height: 42px;">PL/SQL에서 자주 발생하는 약 20개의 오류</td><td style="width: 33.3333%; height: 42px;">선언할 필요 없음. 발생시 자동 트랩</td></tr><tr style="height: 42px;"><td style="width: 33.3333%; height: 42px;">미리 정의되지 않은 오라클 서버 예외</td><td style="width: 33.3333%; height: 42px;">미리 정의된 오라클 서버 예외를 제외한 모든 오류</td><td style="width: 33.3333%; height: 42px;">선언부에서 선언해야하고 발생시 자동 트랩</td></tr><tr style="height: 42px;"><td style="width: 33.3333%; height: 42px;">사용자 정의 예외</td><td style="width: 33.3333%; height: 42px;">개발자가 정한 조건에 만족하지 않을 경우 발생하는 오류</td><td style="width: 33.3333%; height: 42px;">선언부에서 선언하고 실행부에서 RAISE문을 사용하여 발생</td></tr></tbody></table>

```sql
DECLARE
 	not_null_test  EXCEPTION; -- 단계1(미리 정의되지 않은 예외
 	/* not_null_test는 선언된 예외 이름-1400 Error 처리번호는표준Oracle Server Error 번호 */
 	PRAGMA EXCEPTION_INIT(not_null_test, -1400);-- 단계2
    --사용자 정의 예외
    user_define_error EXCEPTION; -- 단계 1
 	cnt NUMBER;
BEGIN
	-- empno를 입력하지않아서NOT NULL 에러발생
	INSERT INTO emp(ename, deptno) VALUES('tiger', 30);
    IF cnt < 5 THEN-- RAISE문을 사용하여 직접적으로예외발생
    	RAISE user_define_error;
    END IF;
    
 	EXCEPTION
   		WHEN TOO_MANY_ROWS THEN --미리 정의된 예외
 			DBMS_OUTPUT.PUT_LINE('TOO_MANY_ROWS에러 발생');
		WHEN not_null_test  THEN -- 단계 3
 			DBMS_OUTPUT.PUT_LINE('not null 에러 발생 ');
        WHEN user_define_error THEN
 			RAISE_APPLICATION_ERROR(-20001, '사원 부족’);
        WHEN OTHERS THEN --항상 마지막에 위치
			DBMS_OUTPUT.PUT_LINE('기타 에러 발생');
 END;
```
