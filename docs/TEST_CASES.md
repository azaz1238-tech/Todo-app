# TEST_CASES - 테스트 케이스 (초안)

> 출처: docs/PRD.md, docs/TRD.md, docs/DATA_MODEL.md, docs/API_SPEC.md, docs/COMPONENT_SPEC.md
> 상태: 초안 (검토 전)
> 이 문서가 "완성"의 기준이다. 아래 케이스가 모두 통과하면 해당 버전은 완성으로 본다.
> 테스트 코드는 아직 쓰지 않는다. 여기에는 "무엇을 확인할지"만 적는다.

## 읽는 법
- ID: API-xx는 서버 API 테스트, UI-xx는 화면 컴포넌트 테스트다.
- 문구는 docs/API_SPEC.md와 docs/COMPONENT_SPEC.md에 정해진 문장을 그대로 쓴다.
- 에러 응답은 모두 `{ "error": { "code", "message" } }` 모양이다. (API_SPEC 2장) 에러 케이스는 상태 코드, code, message를 함께 확인한다.
- 제목의 "100자"는 바이트가 아니라 글자 수다. 한글, 영문, 이모지 모두 한 글자로 센다.
- API 테스트는 v0.2부터, 서버 요청이 있는 화면 테스트(TodoPage의 로딩, 서버 에러)도 v0.2부터 해당한다. v0.1은 UI-01 ~ UI-23, UI-48 ~ UI-53, UI-55만 해당한다.
- 화면 요소는 docs/COMPONENT_SPEC.md 1장의 "요소 이름"으로 찾는다. (입력칸 "할 일 제목", 버튼 "추가"와 "삭제", 체크박스는 항목 제목)

---

## 1. API 테스트 (v0.2부터, v0.3에서도 같은 케이스로 통과해야 한다)

### 1-1. GET /api/todos - 목록 조회 (F-02)

| ID | 대상 | 상황 | 기대 결과 |
|----|------|------|-----------|
| API-01 | GET /api/todos | 할 일이 하나도 없음 | 200, 빈 배열 `[]` |
| API-02 | GET /api/todos | 할 일 2개가 서로 다른 시각에 저장됨 | 200, createdAt이 큰(최신) 것이 먼저 |
| API-03 | GET /api/todos | 같은 시각에 저장된 할 일 2개 | 200, id가 큰 것이 먼저 |
| API-04 | GET /api/todos | 할 일 30개 저장 | 200, 개수 제한이나 페이지 나누기 없이 30개 전부 반환 |
| API-05 | GET /api/todos | 저장소(서버 메모리 또는 DB)에서 오류 발생 | 500, INTERNAL_ERROR, "서버 오류가 발생했습니다" |

### 1-2. POST /api/todos - 추가 (F-01)

| ID | 대상 | 상황 | 기대 결과 |
|----|------|------|-----------|
| API-06 | POST /api/todos | 제목 "우유 사기" | 201, 생성된 todo 반환 (id, title="우유 사기", completed=false, createdAt 있음) |
| API-07 | POST /api/todos | 제목 "  장보기  " (앞뒤 공백) | 201, title이 공백이 지워진 "장보기"로 저장되어 반환 |
| API-08 | POST /api/todos | 제목이 정확히 100자 | 201, 생성됨 |
| API-09 | POST /api/todos | 이모지 100개로 된 제목 (글자 수 100, 바이트는 훨씬 큼) | 201, 생성됨 (바이트가 아니라 글자 수로 센다) |
| API-10 | POST /api/todos | 앞뒤 공백 포함 전체 102자, 공백을 지우면 100자 | 201, 생성됨 (공백을 지운 뒤 길이로 검사) |
| API-11 | POST /api/todos | 제목이 빈 문자열 "" | 400, VALIDATION_ERROR, "제목은 필수입니다" |
| API-12 | POST /api/todos | 제목이 공백만 "   " | 400, VALIDATION_ERROR, "제목은 필수입니다" |
| API-13 | POST /api/todos | 제목이 101자 | 400, VALIDATION_ERROR, "제목은 100자 이하여야 합니다" |
| API-14 | POST /api/todos | 공백을 지운 뒤 101자 (앞뒤에 공백 있음) | 400, VALIDATION_ERROR, "제목은 100자 이하여야 합니다" |
| API-15 | POST /api/todos | 본문에 title 필드가 없음 `{}` | 400, VALIDATION_ERROR, "제목은 필수입니다" |
| API-16 | POST /api/todos | title이 문자열이 아님 `{ "title": 123 }` | 400, VALIDATION_ERROR, "제목은 필수입니다" |
| API-17 | POST /api/todos | 본문이 JSON 형식이 아님 | 400, VALIDATION_ERROR, "요청 형식이 올바르지 않습니다" |
| API-18 | POST /api/todos | 두 번 연속 추가한 뒤 GET | 두 번째로 추가한 할 일이 목록 맨 위 |
| API-19 | POST /api/todos | 요청이 거절된 경우 (API-11 ~ API-17) 뒤에 GET | 목록에 아무것도 늘어나지 않음 |
| API-20 | POST /api/todos | 저장소에서 오류 발생 | 500, INTERNAL_ERROR, "서버 오류가 발생했습니다" |

### 1-3. PATCH /api/todos/:id - 완료 전환 (F-03)

| ID | 대상 | 상황 | 기대 결과 |
|----|------|------|-----------|
| API-21 | PATCH /api/todos/:id | 미완료 할 일에 `{ "completed": true }` | 200, completed=true인 todo 반환 (id, title, createdAt은 그대로) |
| API-22 | PATCH /api/todos/:id | 완료된 할 일에 `{ "completed": false }` | 200, completed=false로 돌아옴 |
| API-23 | PATCH /api/todos/:id | 전환한 뒤 GET | 목록의 해당 항목 completed가 바뀌어 있고, 목록 순서는 그대로 |
| API-24 | PATCH /api/todos/999 | 없는 id | 404, NOT_FOUND, "할 일을 찾을 수 없습니다" |
| API-25 | PATCH /api/todos/abc | id가 숫자가 아님 | 400, INVALID_ID, "잘못된 id입니다" |
| API-26 | PATCH /api/todos/0 | id가 0 (양의 정수가 아님) | 400, INVALID_ID, "잘못된 id입니다" |
| API-27 | PATCH /api/todos/-1 | id가 음수 | 400, INVALID_ID, "잘못된 id입니다" |
| API-28 | PATCH /api/todos/:id | 본문에 completed가 없음 `{}` | 400, VALIDATION_ERROR, "completed는 true 또는 false여야 합니다" |
| API-29 | PATCH /api/todos/:id | completed가 문자열 `{ "completed": "true" }` | 400, VALIDATION_ERROR, "completed는 true 또는 false여야 합니다" |
| API-30 | PATCH /api/todos/:id | 본문이 JSON 형식이 아님 | 400, VALIDATION_ERROR, "요청 형식이 올바르지 않습니다" |
| API-31 | PATCH /api/todos/:id | 저장소에서 오류 발생 | 500, INTERNAL_ERROR, "서버 오류가 발생했습니다" |

### 1-4. DELETE /api/todos/:id - 삭제 (F-04)

| ID | 대상 | 상황 | 기대 결과 |
|----|------|------|-----------|
| API-32 | DELETE /api/todos/:id | 있는 id | 204, 응답 본문 없음 |
| API-33 | DELETE /api/todos/:id | 삭제한 뒤 GET | 목록에서 해당 할 일이 사라짐, 나머지는 그대로 |
| API-34 | DELETE /api/todos/999 | 없는 id | 404, NOT_FOUND, "할 일을 찾을 수 없습니다" |
| API-35 | DELETE /api/todos/:id | 이미 지운 id를 한 번 더 삭제 | 404, NOT_FOUND, "할 일을 찾을 수 없습니다" |
| API-36 | DELETE /api/todos/abc | id가 숫자가 아님 | 400, INVALID_ID, "잘못된 id입니다" |
| API-37 | DELETE /api/todos/:id | 저장소에서 오류 발생 | 500, INTERNAL_ERROR, "서버 오류가 발생했습니다" |

### 1-5. 데이터 유지 (F-05, v0.3부터)

| ID | 대상 | 상황 | 기대 결과 |
|----|------|------|-----------|
| API-38 | 저장소 (MySQL) | 할 일을 추가한 뒤 저장소 연결을 새로 만들어 다시 조회 | 추가한 할 일이 그대로 남아 있음 (서버 재시작 후에도 유지) |
| API-39 | 저장소 (MySQL) | 완료 전환한 뒤 다시 조회 | completed 값이 유지됨 |
| API-40 | 저장소 (MySQL) | 삭제한 뒤 다시 조회 | 삭제된 행이 완전히 사라져 있음 (삭제 표시만 해두지 않음) |

---

## 2. 컴포넌트 테스트 (React Testing Library)

### 2-1. TodoForm - 입력과 1차 검사 (F-01)

| ID | 대상 | 상황 | 기대 결과 |
|----|------|------|-----------|
| UI-01 | TodoForm | 제목 "우유 사기" 입력 후 추가 클릭 | onAdd("우유 사기") 호출, 입력칸 비워짐 |
| UI-02 | TodoForm | 제목 "  장보기  " (앞뒤 공백) 입력 후 추가 클릭 | onAdd("장보기") 호출 (공백이 지워진 값) |
| UI-03 | TodoForm | 입력칸이 빈 채로 추가 클릭 | onAdd 호출 안 함, 입력칸 아래에 "제목은 필수입니다" |
| UI-04 | TodoForm | 공백만 입력하고 추가 클릭 | onAdd 호출 안 함, 입력칸 아래에 "제목은 필수입니다" |
| UI-05 | TodoForm | 101자 입력 후 추가 클릭 | onAdd 호출 안 함, 입력칸 아래에 "제목은 100자 이하여야 합니다" |
| UI-06 | TodoForm | 정확히 100자 입력 후 추가 클릭 | onAdd 호출, 안내 문구 없음 |
| UI-07 | TodoForm | 이모지 100개 입력 후 추가 클릭 | onAdd 호출 (이모지도 한 글자로 센다), 안내 문구 없음 |
| UI-08 | TodoForm | 앞뒤 공백을 지우면 100자인 제목 (전체는 100자 초과) | onAdd 호출 (공백을 지운 뒤 길이로 검사) |
| UI-09 | TodoForm | 1차 검사 안내 문구가 떠 있는 상태에서 다시 입력 | 안내 문구가 사라짐 |
| UI-10 | TodoForm | disabled=true | 추가 버튼이 비활성화되어 클릭해도 onAdd 호출 안 함 |
| UI-11 | TodoForm | disabled=false | 추가 버튼이 활성화됨 |
| UI-12 | TodoForm | errorMessage="서버 오류가 발생했습니다" 전달 | 입력칸 아래에 그 문구가 보임 |
| UI-13 | TodoForm | errorMessage=null 전달 | 입력칸 아래에 에러 문구가 없음 |
| UI-55 | TodoForm | onAdd가 실패(reject)함 | 입력칸의 값이 그대로 남음 (성공(resolve)했을 때만 비워짐) |

### 2-2. TodoList / TodoItem - 목록 보기, 전환, 삭제 (F-02, F-03, F-04)

| ID | 대상 | 상황 | 기대 결과 |
|----|------|------|-----------|
| UI-14 | TodoList | 할 일 0개 (todos=[]) | "할 일이 없습니다. 위에서 추가해 보세요." 표시 |
| UI-15 | TodoList | 할 일이 있음 | 빈 목록 안내 문구가 보이지 않음 |
| UI-16 | TodoList | 받은 순서대로 3개 전달 | 받은 순서 그대로 위에서 아래로 그림 (화면에서 다시 정렬하지 않음) |
| UI-17 | TodoItem | 미완료 할 일 (completed=false) | 제목이 보이고, 체크박스는 체크 해제, 제목에 취소선 없음 |
| UI-18 | TodoItem | 완료된 할 일 (completed=true) | 체크박스가 체크됨, 제목에 취소선 |
| UI-19 | TodoItem | 미완료 항목의 체크박스 클릭 | onToggle(id, true) 호출 |
| UI-20 | TodoItem | 완료 항목의 체크박스 클릭 | onToggle(id, false) 호출 (다시 누르면 미완료로) |
| UI-21 | TodoItem | 삭제 버튼 클릭 | onDelete(id) 호출, 확인 창 없이 바로 호출됨 |
| UI-22 | TodoList | 완료 항목이 목록 중간에 있음 | 완료 항목도 순서가 그대로이고 위치를 옮기지 않음 |
| UI-23 | TodoList | 항목의 체크박스, 삭제 버튼 클릭 | TodoItem이 받은 onToggle, onDelete가 해당 항목의 id로 호출됨 |

### 2-3. TodoPage - 상태와 API 연결 (v0.2부터, fetch를 가짜로 대체해서 테스트)

| ID | 대상 | 상황 | 기대 결과 |
|----|------|------|-----------|
| UI-24 | TodoPage | 페이지를 열고 GET 응답을 기다리는 중 | "불러오는 중..." 표시 |
| UI-25 | TodoPage | GET 성공, 할 일 2개 | 서버가 준 순서대로 2개가 보이고 "불러오는 중..."은 사라짐 |
| UI-26 | TodoPage | GET 성공, 빈 배열 | "할 일이 없습니다. 위에서 추가해 보세요." 표시 |
| UI-27 | TodoPage | GET 실패 (500) | "목록을 불러오지 못했습니다"와 [다시 시도] 버튼 표시 |
| UI-28 | TodoPage | GET 실패 후 [다시 시도] 클릭, 이번엔 성공 | GET을 다시 요청하고, 목록이 보이며 에러 문구는 사라짐 |
| UI-29 | TodoPage | GET 요청에 서버 응답이 아예 없음 (네트워크 끊김) | "서버에 연결할 수 없습니다"가 목록 자리에 보임 |
| UI-30 | TodoPage | 제목 입력 후 추가 클릭, POST 성공 (201) | POST /api/todos 요청, 새 항목이 목록 맨 위에 생기고 입력칸이 비워짐 |
| UI-31 | TodoPage | 추가 요청이 오가는 동안 (응답 대기 중) | 추가 버튼이 비활성화됨, 응답이 오면 다시 활성화됨 |
| UI-32 | TodoPage | 추가 요청이 오가는 동안 목록 | 응답이 오기 전에는 새 항목이 목록에 보이지 않음 (서버 성공 뒤에 화면을 바꿈) |
| UI-33 | TodoPage | 빈 제목으로 추가 클릭 | POST 요청을 보내지 않음, "제목은 필수입니다" |
| UI-34 | TodoPage | POST 실패 (400), 응답 message="제목은 필수입니다" | 입력칸 아래에 응답의 error.message 표시, 입력한 값은 그대로 남음 |
| UI-35 | TodoPage | POST 실패 (500) | 입력칸 아래에 "서버 오류가 발생했습니다" 표시, 입력한 값은 그대로 남음 |
| UI-36 | TodoPage | POST 요청에 서버 응답이 아예 없음 | 입력칸 아래에 "서버에 연결할 수 없습니다" 표시, 입력한 값은 그대로 남음 |
| UI-37 | TodoPage | 추가 실패 문구가 떠 있는 상태에서 다시 입력하거나 추가를 다시 시도 | 에러 문구가 사라짐 |
| UI-38 | TodoPage | 체크박스 클릭, PATCH 성공 (200) | PATCH /api/todos/:id 요청 (body: completed), 응답을 받은 뒤 해당 항목에 취소선, 목록 순서 그대로 |
| UI-39 | TodoPage | 완료 항목의 체크박스를 다시 클릭, PATCH 성공 | 취소선이 사라지고 미완료로 돌아감 |
| UI-40 | TodoPage | PATCH 응답을 기다리는 중 | 응답이 오기 전에는 항목의 체크 상태가 바뀌지 않음 |
| UI-41 | TodoPage | PATCH 실패 (404) | 목록 위쪽에 "할 일을 찾을 수 없습니다" 한 줄 표시, 해당 항목은 목록에서 사라짐 |
| UI-42 | TodoPage | PATCH 실패 (500) | 목록 위쪽에 "서버 오류가 발생했습니다" 한 줄 표시, 항목 상태는 그대로 |
| UI-43 | TodoPage | 삭제 버튼 클릭, DELETE 성공 (204) | DELETE /api/todos/:id 요청, 응답을 받은 뒤 해당 항목이 목록에서 사라지고 나머지는 그대로 |
| UI-44 | TodoPage | 마지막 남은 항목을 삭제 | 목록이 비고 "할 일이 없습니다. 위에서 추가해 보세요." 표시 |
| UI-45 | TodoPage | DELETE 실패 (500) | 목록 위쪽에 "서버 오류가 발생했습니다" 한 줄 표시, 항목은 목록에 그대로 있음 |
| UI-46 | TodoPage | 전환 또는 삭제 실패 문구가 떠 있는 상태에서 다음 동작(체크 또는 삭제)을 함 | 이전 에러 문구가 사라짐 |
| UI-47 | TodoPage | 전환 또는 삭제 요청에 서버 응답이 아예 없음 | 목록 위쪽에 "서버에 연결할 수 없습니다" 한 줄 표시, 항목 상태는 그대로 |
| UI-54 | TodoPage | DELETE 실패 (404, 이미 지워진 항목) | 목록 위쪽에 "할 일을 찾을 수 없습니다" 한 줄 표시, 해당 항목은 목록에서 사라짐 |

### 2-4. v0.1 (브라우저 메모리) 화면 테스트

v0.1은 서버 요청이 없어서 로딩과 서버 에러 상태가 없다. UI-01 ~ UI-23과 UI-55(TodoForm, TodoList, TodoItem)는 v0.1에서도 같다. TodoPage는 아래 케이스를 따른다.

| ID | 대상 | 상황 | 기대 결과 |
|----|------|------|-----------|
| UI-48 | TodoPage (v0.1) | 처음 열었을 때 | "불러오는 중..." 없이 바로 "할 일이 없습니다. 위에서 추가해 보세요." 표시 |
| UI-49 | TodoPage (v0.1) | 제목 "우유 사기" 추가 | 목록에 "우유 사기"가 보이고 입력칸이 비워짐 |
| UI-50 | TodoPage (v0.1) | "운동하기", "장보기" 순서로 추가 | 나중에 추가한 "장보기"가 맨 위 (최신순) |
| UI-51 | TodoPage (v0.1) | 체크박스 클릭 후 다시 클릭 | 취소선이 생겼다가 사라짐, 목록 순서는 그대로 |
| UI-52 | TodoPage (v0.1) | 삭제 버튼 클릭 | 해당 항목이 바로 사라짐 (확인 창 없음) |
| UI-53 | TodoPage (v0.1) | 빈 제목, 공백만, 101자로 추가 | 항목이 늘어나지 않고 입력칸 아래에 안내 문구 |

---

## 3. 테스트하지 않는 것 (지금은 범위 밖)
- 로그인, 공유, 알림, 마감일, 카테고리 (PRD 5장)
- 필터(TodoFilter)와 제목 수정 (v0.4 시작 시 추가)
- 배포 환경 확인 (v1.0 시작 시 추가)

## 4. 아직 정하지 않은 것
- **삭제 확인 창** (PRD 열린 질문): UI-21, UI-43, UI-52는 COMPONENT_SPEC의 "확인 창 없이 바로 삭제"를 가정했다. 확인 창을 넣기로 하면 이 케이스들을 고친다.
