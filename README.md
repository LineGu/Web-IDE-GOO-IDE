# Goo IDe

`웹` IDE로 어디서든 개발하자!

## 개발 기간
2021.08.10 - 2021.08.31 (추후 추가 개발 예정)

## 기능별 안내

### 로그인 
로그인을 통해 프로젝트 단위로 코드와 멤버를 관리할 수 있습니다.
![](https://i.imgur.com/rm1AheW.png)

### 회원가입
간편한 회원가입을 통해 이용 가능합니다!
![](https://i.imgur.com/XQ4M0uZ.png)

### 워크스페이스
자신이 만든 프로젝트와 멤버로 활동하고 있는 프로젝트를 한곳에서 볼 수 있습니다.
플러스 버튼을 통해 쉽게 프로젝트를 추가할 수 있습니다.
![](https://i.imgur.com/5VpkIl6.png)

### IDE
새로운 프로젝트를 생성한 후 가장 첫 IDE 화면입니다.
![](https://i.imgur.com/3LVHn0W.png)

### 파일 및 폴더 추가
사이드바 상단 버튼을 통해 폴더와 파일을 불러올 수 있습니다.
`zip`, `tar` 형식의 압축 파일도 불러올 수 있습니다.

용량이 큰 파일이나 폴더를 불러올 땐, `Worker`를 이용한 멀티쓰레드로 버벅임 없이 빠르게 불러올 수 있습니다!
![](https://i.imgur.com/r6LikcX.png)

사이드바 상단 버튼으로 `프로젝트 멤버 추가`, `저장`, `폴더 불러오기`, `파일 불러오기` 가 가능합니다! 저장은 Ctrl + S 로도 가능합니다.
![](https://i.imgur.com/JmnbUfa.png)

### Drag And Drop
Drag And Drop으로 폴더와 파일을 쉽게 이동시킬 수 있습니다.
![](https://i.imgur.com/XCEz6RB.gif)

### 파일 내용 
파일 내용을 변경하고 저장하면 변경 사항이 빠르게 반영됩니다.
![](https://i.imgur.com/mV9Og1n.gif)

### 상단 NAV BAR
상단 Nav Bar 를 통해 열기, 닫기, 순서 재정렬이 가능합니다.
![](https://i.imgur.com/cjA95hc.gif)


### 컨텍스트 메뉴
GOO IDE만의 Context Menu로 파일 새로 만들기, 이름 변경, 삭제가 가능합니다.
![](https://i.imgur.com/6O3duXt.gif)

### 멤버 초대
프로젝트에 멤버를 초대하여, 함께 개발이 가능하고 프로젝트 멤버들과 채팅이 가능합니다.

초대 시에 자동 검색을 통해 쉽게 여러명의 멤버를 한번에 초대할 수 있습니다.
![](https://i.imgur.com/nscuxFs.png)

![](https://i.imgur.com/ZhP4zEH.png)


### 채팅
프로젝트 멤버들과 실시간 채팅이 가능합니다. 
개인적인 내용이 있다면 귓속말 기능을 이용할 수 있습니다!

채팅 내역은 사라지지 않으며 언제든 참고하실 수 있습니다.
![](https://i.imgur.com/VgXhOWF.png)

![](https://i.imgur.com/sthEuZ7.png)

### 추후 개발 예정 기능 
* 동시 편집
* 터미널
* 코드미러 도입

### 개발적 특징
* Worker를 이용한 Multi Thread 경험
* Next.js 없이 SSR 적용.
* Socket.io를 이용한 실시간 양방향 통신 경험
* FileReader와 Multer를 이용한 File Data 관리 경험.
* Tree 구조를 이용한 모델 관리 경험
* Redis로 Session 관리
* Mongoose로 데이터 관리
* NodeMailer를 이용하여 에러 발생 시 메일로 발송. 빠른 대처 가능

### 사용한 기술

* Java Script
* Node.js
* Worker
* Multer
* React
* Socket.io
* Express.js
* Mongoose
* Redis
* NodeMailer

