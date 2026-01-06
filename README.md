# 📝 Sticky Note 프로젝트

[![React](https://img.shields.io/badge/React-19.2.3-blue?logo=react&logoColor=white)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-teal?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.2.0-blue?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## 🌟 프로젝트 개요

**Sticky Note**는 Next.js + TypeScript 기반의 메모 웹 앱입니다.  
사용자는 로그인 후 **메모(Memo)**와 **메모보드(MemoBoard)**를 생성, 수정, 삭제하고,  
위치, 크기, 폰트, 색상 등 스타일 정보를 포함한 상태를 DB에 저장하고 불러올 수 있습니다.

- **DB:** MariaDB (Prisma 사용)
- **UI:** React + TailwindCSS + Framer Motion
- **아이콘:** Lucide React

[🔗 GitHub Repository](https://github.com/jieul2/sticky-note)

---

## ⚙️ 설치 및 실행

```bash
# 라이브러리 설치
npm install
# 또는
yarn install

# 개발 서버 실행
npm run dev
# 또는
yarn dev
```

---

## 📦 설치된 주요 라이브러리

| 라이브러리                                        | 용도                                            |
| ------------------------------------------------- | ----------------------------------------------- |
| react-contenteditable                             | 메모 내용 편집 시 커서 깨짐/한글 입력 문제 해결 |
| lucide-react                                      | 아이콘 사용 (Save, Sun, Moon 등)                |
| framer-motion                                     | 메모 애니메이션 (이동, 크기 조절 등)            |
| next-themes                                       | 다크모드 테마 관리                              |
| prisma / @prisma/client / @prisma/adapter-mariadb | DB 연결 및 ORM                                  |
| mysql2                                            | MariaDB 연결 드라이버                           |
| bcrypt / bcryptjs                                 | 비밀번호 암호화                                 |
| tailwind-merge                                    | Tailwind 클래스 병합                            |
| class-variance-authority                          | UI 컴포넌트 변형 관리                           |
| dotenv                                            | 환경변수 관리                                   |

> ⚠️ 프로젝트 실행 전 위 라이브러리들이 설치되어 있어야 합니다.

---

## 🗂️ DB 구조 및 초기화

- 테이블: **User, MemoBoard, Memo**
- 기존 테이블이 있으면 DROP 후 재생성 ✅
- 테스트용 데이터 삽입:
  - User id=1 기준
  - MemoBoard 2개
  - 각 MemoBoard에 여러 개 Memo 삽입 ✅

---

## ✅ 완료된 기능

- **로그인 / 사용자 인증 기능** ✅

  - 계정 기반 인증 및 세션 관리
  - 로그인 후 사용자 데이터(User) 확인 가능

- **불러오기 기능** ✅

  - 로그인 후 현재 계정(User) 관련 MemoBoard + Memo 데이터 불러오기
  - Memo 위치, 크기, 폰트, 색상 등 스타일 정보 포함
  - 프론트엔드에서 렌더링

- **저장 기능** ✅

  - 사용자가 메모 내용, 위치, 크기, 색상, 폰트 등을 변경하면 DB 업데이트
  - MemoBoard 단위 저장 가능
  - 저장은 **저장 버튼 클릭 시만** 실행

- **프론트엔드 기본 페이지 구현** ✅

  - 헤더, 메모보드, 메모 렌더링
  - 저장 버튼, 다크모드 토글, 사용자 로그인 상태 표시
  - 실제 UI 구조와 스타일 적용, 기능 테스트 가능

- **메모/메모보드 생성 기능** ✅

  - 새 MemoBoard 생성 ❌
  - 새 Memo 생성 및 해당 MemoBoard에 연결
  - 생성 즉시 렌더링

- **메모 이동 및 크기 조절** ✅

  - 기본적으로 마우스 이동은 막기
  - 설정에서 “움직이기” 활성화 시 방향키 + 기능키로 이동 가능
  - 크기 조절도 설정에서 활성화/비활성화 가능

- **전체 선택** ✅

  - Ctrl + A로 선택 시 여러 Memo 중 선택된 것만 전체 선택
  - 이후 복사, 삭제 등의 액션 적용 가능

- **스타일 설정** ✅

  - 글자 크기, 글자 색상, 폰트, 글자 두께, 배경색, 테두리 크기/색상, overflow 옵션
  - 각 Memo마다 독립적으로 적용 가능

---

## 📝 앞으로 해야 할 일

### 삭제 기능

- Memo 삭제 시 DB에서 제거
- MemoBoard 삭제 시 연결된 Memo도 삭제(FK 관계)

### 다크모드 적용 범위

- 헤더와 사이트 주변 영역만 다크모드 적용
- MemoBoard, Memo 색상은 사용자 지정 값 유지

### 프론트엔드와 DB 연결 테스트

- Prisma Client 기준 데이터 불러오기, 생성, 수정, 삭제
- React/Tailwind UI에서 실제 렌더링 확인

### 추가 기능 / 고도화

- 여러 사용자 계정 동시 사용 테스트
- 메모 검색, 정렬, 필터 기능 추가
- 메모 이동/크기 조절 UX 개선

---

## 💡 참고

- 저장 버튼 클릭 시에만 DB 저장
- Ctrl+S / Cmd+S 단축키도 저장 버튼과 동일하게 동작
- Alt + N 새로운 메모 생성
- 메모 클릭후 Alt + E 메모 서식 및 메모 설정
