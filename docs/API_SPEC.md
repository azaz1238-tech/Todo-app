# API_SPEC - API 명세 (초안)

> 출처: docs/DATA_MODEL.md, docs/PRD.md, docs/TRD.md
> 상태: 초안 (검토 전)
> 이 문서에는 주소(엔드포인트), 메서드, 요청 본문, 성공 응답, 에러 응답, 상태 코드를 담는다.
> API는 v0.2부터 생긴다. v0.2(서버 메모리)와 v0.3(MySQL)은 **같은 명세**를 쓰고, 저장 위치만 다르다.
> 모든 요청과 응답의 본문은 JSON이다.

## 1. 한눈에 보기

| 메서드 | 주소 | 하는 일 | 성공 코드 | 기능 |
|--------|------|---------|-----------|------|
| GET | /api/todos | 목록 조회 (최신순) | 200 | F-02 |
| POST | /api/todos | 추가 | 201 | F-01 |
| PATCH | /api/todos/:id | 완료 전환 | 200 | F-03 |
| DELETE | /api/todos/:id | 삭제 | 204 | F-04 |

- F-05(데이터 유지)는 별도 API가 아니라 저장소(서버 메모리 → MySQL)가 해결한다.
- 성공 응답의 Todo 모양은 docs/DATA_MODEL.md의 `Todo` 타입과 같다: id, title, completed, createdAt.
- PATCH는 지금 `completed`만 바꾼다. 제목 수정은 v0.4에서 같은 주소에 추가한다.

## 2. 공통 규칙

### 에러 형식
모든 에러 응답은 아래 한 가지 모양으로 통일한다.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "제목은 필수입니다"
  }
}
```

- `code`: 프로그램이 구분하는 영문 대문자 이름 (바뀌지 않는다)
- `message`: 사람이 읽는 한국어 문장 (화면에 그대로 보여줄 수 있다)

### 에러 코드 목록

| 상태 코드 | code | 언제 | message |
|-----------|------|------|---------|
| 400 | VALIDATION_ERROR | 요청 본문이 규칙에 맞지 않음 | 엔드포인트별로 아래에 적음 |
| 400 | INVALID_ID | 주소의 id가 양의 정수가 아님 | "잘못된 id입니다" |
| 404 | NOT_FOUND | 해당 id의 할 일이 없음 | "할 일을 찾을 수 없습니다" |
| 500 | INTERNAL_ERROR | 서버 내부 오류 | "서버 오류가 발생했습니다" |

### 글자 수 기준
- 제목의 "100자"는 바이트가 아니라 **글자 수**다. 한글, 영문, 이모지 모두 한 글자로 센다.

### 깨진 요청 본문
- POST, PATCH의 본문이 JSON 형식이 아니면 400 VALIDATION_ERROR와 "요청 형식이 올바르지 않습니다"를 돌려준다.

### 목록 규칙
- 페이지 나누기와 개수 제한 없이 전부 돌려준다.
- 정렬은 서버가 한다: createdAt 큰 순, 같으면 id 큰 순.

## 3. GET /api/todos - 목록 조회 (F-02)

- 요청 본문: 없음
- 성공 (200): Todo 배열. 할 일이 없으면 빈 배열 `[]`.
- 에러: 500 INTERNAL_ERROR

성공 응답
```json
[
  { "id": 2, "title": "장보기", "completed": false, "createdAt": "2026-10-23T10:30:00.000Z" },
  { "id": 1, "title": "운동하기", "completed": true, "createdAt": "2026-10-23T09:00:00.000Z" }
]
```

## 4. POST /api/todos - 추가 (F-01)

- 요청 본문: `{ "title": string }`
- 검사: 서버가 title의 앞뒤 공백을 지운 뒤 1~100자인지 확인하고, 지운 값을 저장한다.
- 성공 (201): 만들어진 Todo. completed는 false로 시작한다.

요청
```json
{ "title": "  장보기  " }
```

성공 응답 (201, 공백이 지워진 채 저장됨)
```json
{ "id": 3, "title": "장보기", "completed": false, "createdAt": "2026-10-23T11:00:00.000Z" }
```

| 에러 상황 | 상태 코드 | code | message |
|-----------|-----------|------|---------|
| 본문이 JSON 형식이 아님 | 400 | VALIDATION_ERROR | "요청 형식이 올바르지 않습니다" |
| title이 없음, 문자열이 아님 | 400 | VALIDATION_ERROR | "제목은 필수입니다" |
| 공백을 지운 뒤 비어 있음 | 400 | VALIDATION_ERROR | "제목은 필수입니다" |
| 공백을 지운 뒤 100자 초과 | 400 | VALIDATION_ERROR | "제목은 100자 이하여야 합니다" |
| 서버 내부 오류 | 500 | INTERNAL_ERROR | "서버 오류가 발생했습니다" |

에러 응답 예시 (400)
```json
{ "error": { "code": "VALIDATION_ERROR", "message": "제목은 필수입니다" } }
```

## 5. PATCH /api/todos/:id - 완료 전환 (F-03)

- 요청 본문: `{ "completed": boolean }`
- 성공 (200): 바뀐 Todo.

요청 (PATCH /api/todos/3)
```json
{ "completed": true }
```

성공 응답 (200)
```json
{ "id": 3, "title": "장보기", "completed": true, "createdAt": "2026-10-23T11:00:00.000Z" }
```

| 에러 상황 | 상태 코드 | code | message |
|-----------|-----------|------|---------|
| id가 양의 정수가 아님 (예: /api/todos/abc) | 400 | INVALID_ID | "잘못된 id입니다" |
| 본문이 JSON 형식이 아님 | 400 | VALIDATION_ERROR | "요청 형식이 올바르지 않습니다" |
| completed가 없거나 true/false가 아님 | 400 | VALIDATION_ERROR | "completed는 true 또는 false여야 합니다" |
| 해당 id의 할 일이 없음 | 404 | NOT_FOUND | "할 일을 찾을 수 없습니다" |
| 서버 내부 오류 | 500 | INTERNAL_ERROR | "서버 오류가 발생했습니다" |

에러 응답 예시 (404)
```json
{ "error": { "code": "NOT_FOUND", "message": "할 일을 찾을 수 없습니다" } }
```

## 6. DELETE /api/todos/:id - 삭제 (F-04)

- 요청 본문: 없음
- 성공 (204): 본문 없이 끝난다. 해당 행을 완전히 지운다.

| 에러 상황 | 상태 코드 | code | message |
|-----------|-----------|------|---------|
| id가 양의 정수가 아님 | 400 | INVALID_ID | "잘못된 id입니다" |
| 해당 id의 할 일이 없음 (이미 지워진 경우 포함) | 404 | NOT_FOUND | "할 일을 찾을 수 없습니다" |
| 서버 내부 오류 | 500 | INTERNAL_ERROR | "서버 오류가 발생했습니다" |

## 7. 화면 동작과의 연결
- 요청이 실패하면 화면은 응답의 `error.message`를 안내 문구로 쓸 수 있다.
- 400은 화면의 1차 검사를 통과한 뒤에도 나올 수 있다. 서버가 항상 다시 검사하기 때문이다. (docs/TRD.md 4장)

## 8. 아직 정하지 않은 것
- 실패했을 때 화면에 문구를 어떻게 보여줄지 (docs/COMPONENT_SPEC.md에서 정한다)
