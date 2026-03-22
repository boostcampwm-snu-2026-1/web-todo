# Seonuk's TODO

Gruvbox Dark 테마의 심플한 할일 관리 웹 앱.

![Gruvbox Dark 테마](https://img.shields.io/badge/theme-Gruvbox%20Dark-fabd2f?style=flat-square&labelColor=282828)
![Vanilla JS](https://img.shields.io/badge/JS-Vanilla-f7df1e?style=flat-square&labelColor=282828)
![Vite](https://img.shields.io/badge/build-Vite-646cff?style=flat-square&labelColor=282828)
![MockAPI](https://img.shields.io/badge/API-MockAPI-83a598?style=flat-square&labelColor=282828)

---

## 기능

- **할일 추가** — 입력창에 내용을 입력하고 Enter 또는 + 버튼으로 추가
- **완료 토글** — 체크박스 클릭으로 완료/미완료 전환
- **항목 삭제** — 항목에 마우스를 올리면 나타나는 × 버튼으로 삭제
- **필터링** — 전체 / 진행 중 / 완료 세 가지 뷰로 전환
- **완료 항목 일괄 삭제** — 하단 "완료 항목 삭제" 버튼으로 한 번에 정리
- **서버 데이터 로드** — 앱 시작 시 MockAPI에서 할일 목록을 가져와 초기 상태로 사용
- **자동 저장** — localStorage에 저장되어 새로 고침 후에도 데이터 유지 (API 실패 시 폴백)
- **한국어 IME 대응** — 한글 입력 후 Enter 이중 제출 방지 처리

---

## 시작하기

```bash
# 저장소 클론
git clone https://github.com/snkii/web-todo.git
cd web-todo

# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev
```

### 빌드

```bash
npm run build    # dist/ 폴더에 프로덕션 번들 생성
npm run preview  # 빌드 결과물 로컬 미리보기
```

---

## 파일 구조

```
web-todo/
├── index.html          # 앱 마크업 (Vite 진입점)
├── todo.css            # 스타일 (Gruvbox Dark 테마)
├── package.json        # 프로젝트 설정 및 스크립트
└── src/
    ├── main.js         # 앱 부팅 (API 로드 → 렌더링 → 이벤트 등록)
    ├── api.js          # MockAPI 통신 및 데이터 변환
    ├── store.js        # 상태 관리 (todos 배열, localStorage 읽기·쓰기)
    ├── render.js       # DOM 렌더링 (목록·통계 갱신)
    └── events.js       # 이벤트 처리 (폼 제출·체크박스·삭제·필터)
```

### 모듈 역할

| 모듈 | 역할 |
|------|------|
| **api.js** | MockAPI `GET /todos` 요청, 서버 형식 → 앱 형식 변환 |
| **store.js** | `todos` 배열 관리, localStorage 읽기·쓰기 |
| **render.js** | 현재 상태를 DOM에 반영 (목록·통계 갱신) |
| **events.js** | 폼 제출·체크박스·삭제·필터 클릭 이벤트 처리 |

### 데이터 흐름

```
앱 시작
  └─ API GET /todos
       ├─ 성공 → loadTodos(서버 데이터) ──┐
       └─ 실패 → initStore(localStorage) ─┤
                                           ↓
                                       renderAll()
                                       initEvents()
```

### 서버 ↔ 앱 내부 데이터 변환

| 서버 필드 | 앱 내부 필드 | 변환 내용 |
|-----------|-------------|-----------|
| `content` | `text` | 필드명 변경 |
| `completed` | `done` | 필드명 변경 |
| `createdAt` (ISO 8601) | `createdAt` (Unix ms) | `new Date().getTime()` |

---

## 기술 스택

- **HTML / CSS / JavaScript** — 외부 UI 프레임워크 없는 Vanilla 구현
- **Vite** — ESM 기반 개발 서버 및 프로덕션 번들러
- **MockAPI** — 초기 할일 목록 제공 REST API
- **localStorage** — 변경 사항 로컬 저장 및 API 실패 시 폴백
- **CSS Custom Properties** — Gruvbox 색상 팔레트를 토큰으로 관리
- **이벤트 위임** — 동적 목록을 효율적으로 처리
- **DocumentFragment** — DOM 조작 시 리플로우 최소화
