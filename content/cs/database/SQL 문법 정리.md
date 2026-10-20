---
title: "SQL 문법 정리"
slug: tistory-21
date: 2025-06-13
subcategory: database
tags: ["Database", "SQL"]
tistory: https://chanhuy.tistory.com/21
---

DDL

-   create table
-   alter table
-   drop table  
    DML
-   select
-   insert
-   update
-   delete  
    정리 함 해야겠다  
    '', "" -> 다름

집계함수: 여러 집단에 적용해 단일 값을 반환  
: SUM, AVG, COUNT, MAX, MIN  
ex)

```
SELECT MAX(comm), MIN(comm), SUM(comm) FROM emp
```

*null 데이터는 집계 함수 대상에서 제외*

GROUP BY: 속성 값이 같은 값끼리 그룹을 만든다

```
SELECT deptno,SUM(sal)AS “급여 합계” FROM emp GROUP BY deptno
```

-   각 부서번호를 기준으로 그룹화 -> 부서별 급여 합계 출력(SUM)
-   표현식에 집계함수 x
-   select절에 집단 함수가 포함되어 있고 group by절이 없는 경우 select절에 집단 함수가 아닌 속성은 나타낼 수 없다  
    GROUP BY ... HAVING : 그룹화한 결과에 대한 조건문
    
    ```
    SELECT deptno,SUM(sal) AS "급여 합계" 
    FROM emp 
    GROUP BY deptno 
    HAVING SUM(sal) >= 9000
    ```
    

집합연산자  
: 둘 이상의 select 문들의 결과 집합을 합성해서 하나의 결과 집합으로 만들어 주는 연산자

-   select문장의 열의 개수가 일치해야 하고 대응되는 열의 데이터 형은 서로 호환되어야 함
-   열 이름은 select문1을 따른다
-   기본적으로 중복된 행은 제거된다
-   기본적으로 첫 번째 열 값으로 정렬된다
    
    ```
    SELECT문1 집합연산자 SELECT문2
    ```
    
-   UNION: 합집합
-   INTERSECT: 교집합
-   MINUS: 차집합

조인(join)  
한 개 이상의 릴레이션으로부터 연관된 튜플을 결합하는 것

-   내부 조인: 값들이 정확하게 일치하는 경우 사용
    
    ```
    SELECT table.column1 [, table.column2, ….] 
    FROM table1, table2 
    WHERE table1.column1 = table2.column1 [and <검색조건>]
    ```
    
    ```
    SELECT table.column1 [, table.column2, ….] 
    FROM table1 [INNER] JOIN table2 
    ON table1.column1 = table2.column1 
    [WHERE <검색조건>]
    ```
    
-   외부 조인: 내부 조인은 공통된 값이 없으면 반환 x, 조건을 만족하지 못하는 행들을 보기 위해 사용
    -   왼쪽 외부 조인(LEFT): 왼쪽 테이블에 없으면 빈 값으로 채우면서 출력
    -   오른쪽 외부 조인(RIGHT): 내부 조인하고 오른쪽 테이블에 남은 값도 붙여서 출력
    -   완전 외부 조인(FULL): LEFT -> RIGHT 순으로 수행하고 출력하는 느낌?
-   오라클 특수 표기법\*
    
    ```
    SELECT table.column1 [, table.column2, ….] 
    FROM table1, table2 
    WHERE table1.column1 = table2.column1(+) /*왼쪽 조인*/
    /*WHERE table1.column1 (+)= table2.column1 오른쪽 조인*/
    ```
    
    ```
    SELECT table.column1 [, table.column2, ….] 
    FROM table1 LEFT OUTER JOINtable2 
    ON table1.column1 = table2.column1
    ```
    
-   셀프 조인
    -   동일 테이블 사이의 조인
    -   자기 참조
        
        ```
        SELECT worker.empno, worker.ename, manager.empno, manager.ename
        FROM emp worker, emp manager
        where worker.mgr = manager.empno
        ```
        
-   > 사원 번호와 사원이름, 사원의 상관을 출력하기 위한 자기 참조
    

서브 질의  
:하나의 sql문에 중첩된 select문

-   스칼라 부속 질의: select 절에서 사용
    
    ```
    SELECT empno, sal, sal/(select max(sal) from emp) as 급여율 FROM emp;
    ```
    
-   인라인 뷰: from절에서 사용
    
    ```
    SELECT emp2000.deptno, COUNT(*) 
    FROM (SELECT empno, ename, deptno 
      FROM emp 
      WHERE sal> 2000) emp2000 
    GROUP BY emp2000.deptno
    ```
    
-   중첩 질의: where절에서 사용
-   단일 행 부속 질의
    
    ```
    SELECT ename, empno, job 
    FROM emp 
    WHERE job =(SELECT job FROM emp WHERE empno = 7369)
    ```
    
-   다중 행 부속 질의
    
    ```
    SELECT ename 
    FROM emp 
    WHERE deptno IN (SELECT deptno FROM dept WHERE dname='ACCOUNTING' or dname='RESEARCH');
    ```
    
-   다중 열 부속 질의
    
    ```
    SELECT empno, ename, sal, deptno 
    FROM emp 
    WHERE (job, sal) IN ( SELECT job, MIN(sal) FROM emp GROUP BY job);
    ```
    
-   *서브 질의의 결과 값은 1개의 행,열만 가진다*

select문이 아닌 구문에서 서브 질의 사용 가능

```
/*emp테이블과 동일한 테이블 생성(단 무결성 제약조건은 x)*/
CREATE TABLE emp1 AS select * from emp;
/*최고값에 1을 더한 값을 insert*/
INSERT INTO emp1(empno,ename) 
values ((select max(empno)+1 from emp),'TEST');
/*update문*/
UPDATE emp1 
SET job = (select job from emp where empno=7369) WHERE ename='TEST';
/*delete문*/
DELETE from emp1 
where deptno in (select deptno from dept where dname='SALES' or loc = 'DALLAS');
```

| 내장 함수 | 설명 |
| --- | --- |
| LOWER | 소문자로 변환 |
| UPPER | 대문자로 변환 |
| INITCAP | 첫 글자만 대문자, 나머지 소문자 변환 |
| LTRIM/RTRIM | 왼쪽/오른쪽 공백제거 |
| SUBSTR | 문자열의 일부분을 반환 |
| LENGTH | 문자열의 글자 수 |
| CEIL | 올림 |
| MOD | 나머지 |
| POWER | 승수 값 |
| ROUND | 반올림 |
| TRUNC | 버림 |
| SYSDATE | 현재 날짜, 시간 |
| LAST\_DAY | 해당 월의 마지막 날짜 |
| MONTHS\_BETWEEN | 두 기간 사이의 개월 수 |
| TO\_CHAR | 문자로 치환 |
| TO\_NUMBER | 숫자로 치환, 숫자 형태가 아니면 오류 |
| TO\_DATE | 날짜 형태의 문자를 날짜로 치환 |
| COALESCE(식1, ...) | NVL항이 여러 개인 느낌 |
| NVL(식1, 식2) | 식1이 NULL이 아니면 식1, NULL이면 식2를 리턴 |
| GREATEST / LEAST | 최대/최소 값 |
| concat(문자, 문자) | 문자와 문자를 연결 |

CASE: sql에서의 간단한 조건문

```
CASE
    WHEN 조건식1 THEN 식1
    WHEN 조건식2 THEN 식2
    ELSE 식3
END
```

문자를 연결하는 연산자

```
SELECT ename || job col_name FROM EMP;
```

뷰(view)

-   하나 이상의 릴레이션으로 부터 유도된, 이름을 가진 가상 릴레이션(virtual relation)
    -   가상 릴레이션: 실제로 튜플을 갖지 않은 릴레이션
-   뷰는 기본 릴레이션(base relation, 실제 릴레이션)에 대한 SELECT문의 형태로 정의됨

```
CREATE [OR REPLACE] VIEW 뷰이름 
[(열이름1 [, … 열이름n])] 
AS 
SELECT문
```

-   열 이름: 뷰에서 사용할 열 이름(안 쓰면 가져온 테이블의 이름을 그대로 사용)
-   열 이름과 SELECT문에서 추출하는 속성은 ==일대일 대응

뷰를 통한 데이터 변경

-   뷰가 하나의 테이블을 사용하고, 적절한 권한이 있다면 INSERT, UPDATE, DELETE 문을 사용하여 뷰가 참조하는 테이블의 데이터 변경가능
-   데이터 변경이 불가능한 뷰
    -   집단함수가 포함된 뷰
    -   DISTINCT 키워드를 포함하여 정의한 뷰
    -   조인으로 정의된 뷰 ◈WITH READ ONLY 옵션을 사용하여 정의된 뷰
-   WITH CHECK OPTION 사용
    -   뷰를 통해 수행되는 INSERT 와UPDATE는WITH CHECK OPTION 절이 있으면 삽입되거나 갱신되는 데이터에 대해 무결성 제약조건과 데이터 검증체크를 한다.
-   WITH READ ONLY사용
    -   뷰에서 삽입, 갱신, 삭제가 불가능해진다

뷰 삭제

```
DROP VIEW 뷰이름
```

장점

-   질의문을좀더쉽게작성할수있음
-   데이터보안유지에도움  
    단점
-   질의시기본테이블에대한질의보다비효율적
-   뷰로구성된내용에대한삽입, 삭제, 갱신연산에대 한제약이많음
