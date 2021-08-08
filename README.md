## 구름 과제 템플릿

---
- 아래 내용 및 템플릿을 외부에 공유하지 말아 주시고 github, 블로그 등에 소스코드를 올리실 경우 회사 이름 혹은 서비스 이름으로 검색되지 않게 해주세요.
- 프로젝트의 주요 기능에 대해서는 주요 스펙은 꼭 지켜주시기 바랍니다.
- [구름IDE](https://ide.goorm.io)로 개발을 합니다.
---

### 프로젝트 목적
- Node.js, Socket.io, MongoDB, React, Bootstrap 이용해보기

### 프로젝트 주요 기능
아래 기능을 구현하기 위한 템플릿 수정은 자유롭게 하시면 됩니다.
- 파일 매니저 기능
  - 파일/폴더 구조를 가진 프로젝트를 업로드 합니다.
    - zip, tar를 지원합니다.
  - 업로드 된 프로젝트를 풀어 ul과 li를 이용해 리스트를 만듭니다.
    - 디렉토리 구조는 [폴더1]/[폴더2]/파일 과 같이 하여 리스트업합니다.
      - 폴더1 안에 폴더2가 있고, 그 안에 파일이 있는 구조입니다.
    - 예를 들어, abc폴더 안에 def 폴더가 있고, 그 안에 main.c, main.py 파일들이 있다면,
      - abc/def/main.c
      - abc/def/main.py
      - 이렇게 두 파일이 보여야 합니다.
  - 해당 디렉토리 밑에 있는 파일에 대해 [읽기/쓰기] 가능하도록 합니다.
    - 읽기 - 파일명을 클릭하면 textarea에 파일 내용이 보입니다.
    - 쓰기 -  textarea에서 내용을 편집하고 저장 버튼을 눌러 저장합니다.
	
- 채팅 기능
  - 채팅을 할 수 있습니다.
  - 소켓을 이용하여 실시간으로 메시지를 주고 받습니다.
  - 새로고침이나 재접속을 하여도 채팅 내역은 남습니다.
  - 귓속말을 통해 1:1 메시지 교환도 가능합니다.
    - (서버) 귓속말 구현 시, 내용을 모든 상대에게 보내면 안됩니다. 
    - 반드시 <받는 사람>만 내용을 받아야 합니다.
	
### 프로젝트 UI
- 메인 화면
  - 파일매니저, 채팅 기능과 관련하여 알맞는 UI와 기능들이 구현되어 있으면 됩니다.
  - 구성은 자유로우며 각 화면을 single 페이지 또는 multiple 페이지로 구현하는 것도 자유입니다.

### 프로젝트 기술 스택
- Back-end
  - Node.js, Socket.io, MongoDB, Redis, ExpressJs 사용
  
- Front-end
  - React, Bootsrap, Reactstrap, React-router 사용
  - Redux, MobX 등을 사용하지 않고 state를 관리합니다.
  
- 개발 환경
  - OS: Ubuntu 18.04.2 LTS
  - 브라우저: 크롬
  - Nodejs: 14.17.2

위에 언급되지 않은 라이브러리는 자유롭게 설치해서 사용하셔도 됩니다.
  
### 템플릿 실행
- 실행 전 작업
  - DB 설치
    - `cd scripts && ./installDb.sh` 명령어로 Mongodb, Redis를 설치합니다.
  - npm package 설치
    - `npm install` 명령어로 npm package를 설치합니다.
	
- 실행
  - DB 실행
    - `./scripts/startDb.sh` 명령어로 Mongodb, Redis를 시작합니다.
  - App Build
    - `npm run build:prd`로 Production 모드로 빌드합니다.
    - 또는 `npm run build:dev`로 Development 모드로 빌드합니다.
  - App Start
    - `npm run start:prd`로 Production 모드로 실행합니다.
    - 또는 `npm run start:dev`로 Development 모드로 실행합니다.

- 실행 결과 확인
  - 상단 메뉴 [프로젝트] -> [실행 URL과 포트]에서 실행되고 있는 Port(기본 포트는 3000)와 관련된 URL를 브라우저 검색창에 입력하면 실행 결과를 확인할 수 있습니다.
  

