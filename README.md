# 💬 ChetChat

### 목차
1. [프로젝트 소개](#1-프로젝트-소개)
2. [계획 및 MVP](#2-계획-및-mvp)
3. [기술 스택](#3-기술-스택)
4. [주요 기능](#4-주요-기능)
5. [발생했던 문제들](#5-발생했던-문제들)
6. [아쉬운 점](#6-아쉬운-점)
<br>

## 1. 프로젝트 소개
* ChetChat은 불특정 다수와 대화할 수 있는 1:1 웹 채팅 서비스입니다.
* 다른 유저와 1:1 채팅을 할 수 있습니다.
* 편지함에 익명으로 방명록이나 속마음을 작성할 수 있습니다.
* 누군가와 무작위로 매칭되어 1:1 채팅을 할수 있습니다.
<br><br>

## 2. 계획 및 MVP
* Router : [Google Sheets](https://docs.google.com/spreadsheets/d/1CtwyJhN6VOHIiZjzQjs4PnL2MsnpVVFYBjOe00MmZ7s/edit?usp=sharing)
* Database : [Google Sheets](https://docs.google.com/spreadsheets/d/1kjzvjCuG9k5Bg-Bt1R3e_1jZ8HP5TC-X3b0jlIT_thQ/edit?usp=sharing)
* MVP : [Google Slide](https://docs.google.com/presentation/d/1M_GactTNRUEK_akBnxVG0sIWhV-cCoauUhY-KW3DSI0/edit?usp=sharing)
* 디자인 : [Figma](https://www.figma.com/design/yGhIaIBRJsmgHDXU5rgWo4/ChetChet?node-id=5-8&t=WTkIsL2nEUUPCe67-1)
<br><br>

## 3. 기술 스택
* `Vue.js`
* `Express.js`
* `AWS RDS(MariaDB)`, `AWS S3`, `AWS Lightsail`
* `Redis`
* `Github`
<br><br>

## 4. 주요 기능
### [계정]
- <b>회원가입</b> : 아이디  6자 이상, 비밀번호 8자 이상 입력
- <b>로그인</b> : 아이디, 비밀번호로 로그인합니다. 5번 이상 틀릴 경우 5분 동안 로그인이 제한됩니다.

| 계정 |
|----------|
|<img width="376" src="https://github.com/user-attachments/assets/cc644615-4ced-4cfb-b6e7-ebda340218e8" />|
      
<br><br>

### [메인 화면]
- <b>헤더</b> : 유저 검색, 차단 목록, 로그아웃
- <b>메인</b> : 내 프로필, 즐겨찾기한 친구, 친구 목록을 볼 수 있다.

| 메인 화면 |
|----------|
|<img width="376" src="https://github.com/user-attachments/assets/61e9e12f-9e9b-4e6a-9896-ead0ca9e339e" />|
   
<br><br>

### [유저 검색]
- <b>검색 조건</b> : 없는 유저, 탈퇴한 유저, 차단된 유저, 이미 친구인 유저, 검색을 허용하지 않은 유저는 검색되지 않음.
- <b>친구 추가</b> : 새로운 친구 등록

| 유저 검색 |
|----------|
|<img width="376" src="https://github.com/user-attachments/assets/070ea3b2-c11f-4b42-98ef-1575062e4891" />|
   
<br><br>

### [차단 목록]
- <b>해제</b> : 차단한 유저를 해제할 수 있다.

| 차단 목록 |
|----------|
|<img width="376" src="https://github.com/user-attachments/assets/f9350463-46c9-4b25-af7d-e1e3edb75afa" />|
   
<br><br>

### [내 프로필]
- <b>설정</b> : 클릭 시 내 계정으로 이동
- <b>프로필 이미지</b> : 클릭 시 프로필 이미지 확대
- <b>프로필 편집</b> : 클릭 시 프로필 편집으로 이동
- <b>편지함</b> : 클릭 시 내 편지함으로 이동

| 내 프로필 |
|----------|
|<img width="376" src="https://github.com/user-attachments/assets/20361641-3e29-4358-b4fb-46564686287a" />|
   
<br><br>

### [내 계정]
- <b>친구추가 허용</b> : 친구추가 허용을 off시 검색되지 않고 다른 유저가 친구추가 할 수 없게 된다.
- <b>개인정보 처리방침</b> : 클릭 시 개인정보 처리방침 페이지로 이동
- <b>서비스 이용약관</b> : 클릭 시 서비스 이용약관 페이지로 이동
- <b>회원탈퇴</b> : 클릭 시 여부를 한 번 더 물어보고 동의하면 회원 탈퇴된다.

| 내 계정 |
|----------|
|<img width="376" src="https://github.com/user-attachments/assets/86420eb6-90ad-4e48-91da-4b48210ede3a" />|
   
<br><br>

### [프로필 편집]
- <b>프로필 이미지</b> : 프로필 이미지를 변경할 수 있다.
- <b>별명</b> 별명을 변경할 수 있다. 다른 친구들에게도 변경된 별명으로 보인다.
- <b>상태메시지</b> : 상태메시지를 변경할 수 있다.

| 프로필 편집 |
|----------|
|<img width="376" src="https://github.com/user-attachments/assets/2841e422-1eaa-4238-83ee-f42fe7b645cb" />|
   
<br><br>

### [유저 프로필]
- <b>즐겨찾기</b> : 즐겨찾기 추가. 메인 화면 위에 고정됨.
- <b>차단하기</b> : 친구가 삭제되고 해당 유저에게 메시지를 받을 수 없게 된다.
- <b>프로필 이미지</b> : 클릭 시 프로필 이미지 확대
- <b>친구 이름 변경</b> : 내가 보는 친구 이름이 변경할 수 있다.
- <b>1:1 대화하기</b> : 해당 유저와 1:1 대화
- <b>편지함</b> : 해당 유저의 편지함으로 이동

| 유저 프로필 |
|----------|
|<img width="376" src="https://github.com/user-attachments/assets/cf2bda03-04c3-4da6-86bd-10d5ccc754c8" />|

<br><br>

### [대화]
- <b>알림</b> : pwa 설치해야만 받을 수 있다.
- <b>대화 추가</b> : 1:1 대화할 유저 선택
- <b>채팅방 리스트</b> : 상대 유저의 프로필 이미지, 이름, 최신 대화 내용, 시간, 읽었음 여부를 확인할 수 있다.
- <b>편지함</b> : 내 편지함으로 이동

| 대화 |
|----------|
|<img width="376" src="https://github.com/user-attachments/assets/da245342-b0fa-418c-a5d6-b3d0204ed0ce" />|
   
<br><br>

### [1:1 채팅방]
- <b>뒤로가기</b> : 뒤로가기
- <b>상대 프로필</b> : 대화 상대의 프로필을 볼 수 있다.
- <b>추가 기능</b> : PC에서 마우스 오른쪽 클릭 또는 모바일에서 메시지를 꾹 누르면 추가 기능 사용 가능. 답글 달기, 복사 기능<br>
- <b>이미지 타입 메시지</b> : 클릭시 이미지 확대
- <b>이미지 전송</b> : 이미지 전송
- <b>텍스트 전송</b> : 텍스트 전송

| 1:1 채팅방 |
|----------|
|<img width="376" src="https://github.com/user-attachments/assets/b4d32982-0fac-46c1-8dc8-470154d69b67" />|
   
<br><br>

### [편지함]
- 기능은 1:1 채팅방과 흡사하고 익명라는 점과 추가 기능에 '차단' 기능이 생긴 것이 차이, 우측 상단에 편지함 설정

| 편지함 |
|----------|
|<img width="376" src="https://github.com/user-attachments/assets/33bc7b0e-9930-4d8e-a8cb-c740cd40834c" />|
   
<br><br>

### [내 편지함 설정]
- <b>방문자 수</b> : 나 이외의 유저가 방문할 때 1씩 오름
- <b>질문 수</b> : 질문할 때마다 1씩 오름
- <b>질문 허용</b> : 질문 가능한 유저의 범위 설정 (모두, 친구, 불가능)
- <b>프로필 공개</b> : 편지함 좌측 상단에 자신의 프로필을 공개할 건지 선택할 수 있다.
- <b>금지 단어</b> : 익명으로 메시지를 보낼 때 금지할 단어를 설정할 수 있다.
- <b>편지함 이름</b> : 편지함 이름 설정
- <b>편지함 공유하기</b> : 편지함 주소 복사
- <b>대화 내용 비우기</b> : 편지함의 모든 메시지를 삭제한다.

| 내 편지함 설정 |
|----------|
|<img width="376" src="https://github.com/user-attachments/assets/49020f6c-2dcf-4552-8b1c-9335123c7e1f" />|
   
<br><br>

### [블라인드 채팅]
- <b>매치 버튼</b> : 시작하기, 멈추기 버튼을 클릭하면 무작위로 유저와 대화를 시작한다

| 블라인드 채팅 |
|----------|
|<img width="376" src="https://github.com/user-attachments/assets/2e65cd27-c5f0-4261-9644-df12d9e40f26" />|
   
<br><br>

### [블라인드 채팅방]
- <b>뒤로가기</b> : 채팅방 리스트로 이동
- <b>나가기</b> : 블라인드 채팅으로 이동
- <b>친구 신청</b> : 친구 신청 버튼을 누르면 상대에게 요청하고 상대가 동의하면 서로 친구가 된다.
- <b>채팅</b> : 1:1 채팅, 편지함과 같음

| 블라인드 채팅방 |
|----------|
|<img width="376" src="https://github.com/user-attachments/assets/c0b4d16e-da58-4917-aa74-6a99fa183c32" />|
   
<br><br>

## 5. 발생했던 문제들
🔌 소켓
| 문제 상황 | 블라인드 채팅 중 상대가 나간 걸 감지 못함. |
| --- | --- |
| 원인 | 나가기 버튼 클릭이 아닌 뒤로가기, 브라우저 끄기, 소켓 연결 끊김의 경우에 대한 처리가 누락됨. |
| 해결 | socket.io의 disconnect 이벤트로 소켓 연결이 끊겼을 때 블라인드 채팅방에서 나감을 감지하고 처리함.  |
|코드|asdfsfasdfkasjdfklsjf |

| 문제 상황 | 서버를 pm2 클러스터 모드로 실행하면 이벤트를 못 받을 때가 있음. |
| --- | --- |
| 원인 | pm2 클러스터 모드는 여러 프로세스(워커)를 사용하기 때문에 각 프로세스 간의 메모리와 소켓 연결이 독립적으로 동작함. 이로 인해 다른 프로세스에서 발생한 소켓 이벤트를 수신하지 못하는 문제가 발생함. |
| 해결 | Redis를 기반으로 하는 socket.io-redis 어댑터를 사용하여 각 워커 간의 소켓 이벤트를 Redis Pub/Sub를 통해 공유하고, 모든 프로세스에서 동일하게 이벤트를 처리할 수 있도록 구현함. 이를 통해 클러스터 모드에서도 이벤트 전파가 가능해짐. |
|코드|asdfsfasdfkasjdfklsjf |
<br>

🪣S3
| 문제 상황 | 이미지를 보낼 때 에러가 발생하면 S3에는 저장되지만 DB엔 저장되지 않음 |
| --- | --- |
| 원인 | S3에 이미지는 성공적으로 업로드되지만, 이후 다른 작업에서 에러가 발생해 롤백되면서 DB에 저장되지 않는 문제. |
| 해결 | 이미지의 주소를 저장하는 임시 테이블을 생성해, 에러 발생 시에도 이미지를 추적하고 처리할 수 있도록 개선. |
|코드|asdfsfasdfkasjdfklsjf |

<br><br>

## 6. 아쉬운 점
1. <b>하드 코딩</b> : 처음에 구조를 구상한 후, 코드로 구현했으면 좋았을 거 같다. 주석을 먼저 작성하여 기능을 명확히 하고, 이를 바탕으로 클래스나 함수 등 코드를 구성했으면 효율적으로 코드를 관리했을텐데 그러지 못해서 비슷한 코드가 반복되는 경우가 있었다.

2. <b>라이브러리 사용 미습 :</b> 적절한 라이브러리를 사용했으면 코드를 훨씬 깔끔하고 쉽게 관리할 수 있었을텐데 아쉽다. (ex. validator, sequelize) 다음엔 라이브러리 검색도 적극적으로 활용해 봐야겠다.
