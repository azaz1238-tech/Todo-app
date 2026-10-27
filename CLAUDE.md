# CLAUDE.md - Todo App

## 프로젝트 개요
혼자 쓰는 간단한 할 일 목록 웹 앱 (초보자 학습용)

## MVP 범위 (docs/IDEA.md 기준)
- 할 일 추가 (제목 필수, 1~100자)
- 할 일 목록 보기 (최신순)
- 완료/미완료 전환 (체크박스)
- 할 일 삭제
- 새로고침해도 데이터 유지

## 지금은 만들지 않는 것
- 로그인, 공유, 알림, 마감일, 카테고리

## 버전 로드맵
- v0.1 화면만 (브라우저 메모리)
- v0.2 API 연결 (서버 메모리)
- v0.3 DB 저장
- v0.4 필터와 수정
- v1.0 배포

## 기술 스택
- 프론트엔드: Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind CSS
- 백엔드: FastAPI (Python)
- DB: PostgreSQL + SQLAlchemy
- 검증: Pydantic (서버), 화면 1차 검사는 직접 작성
- 테스트: Jest + React Testing Library (화면), pytest (API)

## 폴더 구조
- app/ : 페이지 (Next.js)
- src/components/ : 화면 컴포넌트
- src/lib/ : 화면 쪽 공용 코드 (API 호출 등)
- src/types/ : 화면에서 쓰는 타입
- backend/ : FastAPI 서버 (API 라우트, DB 연결, 서버 로직)
- docs/ : 명세 문서

## 반드시 참고할 문서
- docs/IDEA.md
- docs/PRD.md, docs/TRD.md, docs/DATA_MODEL.md
- docs/API_SPEC.md, docs/COMPONENT_SPEC.md, docs/TEST_CASES.md

## 규칙
- 명세에 없는 기능을 임의로 추가하지 말 것
- 현재 진행 중인 버전의 범위를 넘어 미리 구현하지 말 것
- any 타입 금지 (Python은 타입 힌트를 붙인다)
- 한 번에 한 기능만 작업하고, 끝나면 무엇을 바꿨는지 요약할 것
- 사용자가 명령하기 전에는 문서나 코드를 추가하지 말고, 초안을 만들어 보여줄 것
- 테스트를 삭제하거나 skip하지 말 것
- 테스트가 실패하면 테스트가 아닌 구현을 고칠 것
- console.log는 디버깅 후 제거할 것
- 초보자가 이해할 수 있게 주석은 한국어로 짧게

## 자주 쓰는 명령
- 프론트 개발 서버: npm run dev
- 백엔드 개발 서버: uvicorn main:app --reload (backend/ 폴더에서)
- 화면 테스트: npm test
- API 테스트: pytest (backend/ 폴더에서)
