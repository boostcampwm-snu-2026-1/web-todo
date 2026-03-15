# Seonuk's TODO

Gruvbox Dark 테마의 심플한 할일 관리 웹 앱.

별도 설치나 서버 없이 `todo.html` 파일 하나를 브라우저로 열면 바로 사용할 수 있다.

![Gruvbox Dark 테마](https://img.shields.io/badge/theme-Gruvbox%20Dark-fabd2f?style=flat-square&labelColor=282828)
![Vanilla JS](https://img.shields.io/badge/JS-Vanilla-f7df1e?style=flat-square&labelColor=282828)
![No Build](https://img.shields.io/badge/build-none-b8bb26?style=flat-square&labelColor=282828)

---

## 기능

- **할일 추가** — 입력창에 내용을 입력하고 Enter 또는 + 버튼으로 추가
- **완료 토글** — 체크박스 클릭으로 완료/미완료 전환
- **항목 삭제** — 항목에 마우스를 올리면 나타나는 × 버튼으로 삭제
- **필터링** — 전체 / 진행 중 / 완료 세 가지 뷰로 전환
- **완료 항목 일괄 삭제** — 하단 "완료 항목 삭제" 버튼으로 한 번에 정리
- **자동 저장** — localStorage에 저장되어 새로 고침 후에도 데이터 유지
- **한국어 IME 대응** — 한글 입력 후 Enter 이중 제출 방지 처리

---

## 시작하기

```bash
# 저장소 클론
git clone https://github.com/snkii/web-todo.git
cd web-todo
```

이후 `todo.html`을 브라우저로 열면 끝. 빌드 과정이나 패키지 설치가 없다.

---

## 파일 구조

```
web-todo/
├── todo.html   # 앱 마크업 (구조)
├── todo.css    # 스타일 (Gruvbox Dark 테마)
└── todo.js     # 앱 전체 로직 (상태 관리 · 렌더링 · 이벤트 처리)
```

> `store.js` / `render.js` / `events.js` 는 원래 ES 모듈로 분리된 파일이었으나,
> 로컬 파일(`file://`)에서 바로 열 수 있도록 `todo.js` 하나로 통합되었다.

### todo.js 내부 구성

| 영역 | 역할 |
|------|------|
| **Store** | `todos` 배열 관리, localStorage 읽기·쓰기 |
| **Render** | 현재 상태를 DOM에 반영 (목록·통계 갱신) |
| **Events** | 폼 제출·체크박스·삭제·필터 클릭 이벤트 처리 |

---

## 기술 스택

- **HTML / CSS / JavaScript** — 외부 프레임워크 없는 Vanilla 구현
- **localStorage** — 브라우저 내장 저장소로 별도 백엔드 불필요
- **CSS Custom Properties** — Gruvbox 색상 팔레트를 토큰으로 관리
- **이벤트 위임** — 동적 목록을 효율적으로 처리
- **DocumentFragment** — DOM 조작 시 리플로우 최소화
