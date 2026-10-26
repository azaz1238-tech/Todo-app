# DATA_MODEL - 데이터 모델 (초안)

> 출처: docs/PRD.md (F-01 ~ F-05), docs/TRD.md
> 상태: 초안 (검토 전)
> 이 문서에는 테이블, 필드 이름, 타입, 제약조건(필수 여부, 길이, 기본값)을 담는다.
> DB는 v0.3부터 쓴다. v0.1~v0.2는 같은 모양의 데이터를 브라우저/서버 메모리에 둔다.

## 1. 테이블 목록
테이블은 **todos 하나만** 둔다. PRD의 기능(추가, 목록, 완료 전환, 삭제, 유지)이 모두 "할 일" 한 종류의 데이터만 다루기 때문이다. (사용자 테이블은 로그인이 범위 밖이라 만들지 않는다.)

## 2. todos 테이블

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | int | PK, 자동 증가 (AUTO_INCREMENT) | 자동 증가 번호 (삭제, 완료 전환 때 어떤 할 일인지 가리키는 값) |
| title | varchar(100) | 필수, 1~100자 | 할 일 제목 (F-01) |
| completed | boolean | 필수, 기본값 false | 완료 여부 (F-03) |
| createdAt | timestamp | 필수, 기본값 now() | 만든 시각 (최신순 정렬 기준, F-02) |

### 규칙
- **DB는 MySQL**이다. MySQL의 boolean은 내부적으로 0/1 숫자(tinyint)로 저장되지만, Drizzle이 코드에서는 true/false로 바꿔 준다.
- **정렬(F-02)**: createdAt이 큰 것부터(최신순). 같은 시각이면 id가 큰 것부터.
- **삭제(F-04)**: 해당 행을 완전히 지운다. (삭제 표시만 해두는 방식은 쓰지 않는다.)
- **제목 검사**: 서버가 앞뒤 공백을 지운 뒤 길이(1~100자)를 검사하고, 지운 값을 저장한다. 길이 규칙은 DB 제약과 Zod 검사 양쪽에서 지킨다. (docs/TRD.md 4장 참고)
- **createdAt은 유지한다.** 최신순 정렬의 기준이다.
- **updatedAt(마지막 수정 시각)은 지금 두지 않는다.** 수정 기능이 PRD에 아직 없다. 수정을 정의하는 v0.4에서 추가한다.

## 3. TypeScript 타입 예시

저장된 할 일 한 개 (src/types/ 에 둔다).

```ts
// 서버가 돌려주는 할 일 한 개
export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string; // JSON으로 오가면 날짜는 문자열이 된다
};

// 할 일을 새로 만들 때 화면이 보내는 값 (F-01)
export type CreateTodoInput = {
  title: string; // 1~100자
};

// 완료 여부를 바꿀 때 화면이 보내는 값 (F-03)
export type UpdateTodoInput = {
  completed: boolean;
};
```

- id, completed, createdAt은 서버/DB가 정하므로 만들 때는 보내지 않는다. (title만 보낸다.)
- DB에서 읽은 createdAt은 Date지만, 화면으로 보낼 때 문자열(ISO 형식)로 바뀐다.

## 4. 예시 데이터

| id | title | completed | createdAt |
|----|-------|-----------|-----------|
| 2 | 장보기 | false | 2026-10-23 10:30 |
| 1 | 운동하기 | true | 2026-10-23 09:00 |

(최신순이므로 id 2가 위에 보인다.)

## 5. 결정한 것
- 제목 앞뒤 공백은 저장 전에 지운다.
- 할 일 개수 제한은 없다. 목록은 페이지 나누기 없이 전부 돌려준다.
