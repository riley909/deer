# [Assignment 6] 디어코퍼레이션

### 원티드x위코드 백엔드 프리온보딩 과제 6

<br>

### **[과제 출제 기업 정보]**

[기업명] **디어코퍼레이션**

[🔗 디어 사이트](https://web.deering.co/)

[🔗 wanted 채용공고 링크](https://www.wanted.co.kr/wd/59051)

</br>

## 😎 Members of 12-Punch

| 이름   | github                                          | 담당 기능 | TIL/회고 |
| ------ | ----------------------------------------------- | --------- | -------- |
| 김남형 | [42seouler](https://github.com/)                |           |          |
| 김서경 | [riley909](https://github.com/riley909)         |           |          |
| 김요셉 | [kim-jos](https://github.com/kim-jos)           |           |          |
| 정천우 | [codehousepig](https://github.com/codehousepig) |           |          |
| 최유진 | [n12seconds](https://github.com/n12seconds)     |           |          |

</div>

<br>
<br>
<br>
<br>

## 📖 과제 내용

### [필수 포함 사항]

- READ.ME 작성
  - 프로젝트 빌드, 자세한 실행 방법 명시
  - 구현 방법과 이유에 대한 간략한 설명
  - 완료된 시스템이 배포된 서버의 주소
  - Swagger나 Postman을 통한 API 테스트할때 필요한 상세 방법
  - 해당 과제를 진행하면서 회고 내용 블로그 포스팅
- Swagger나 Postman을 이용하여 API 테스트 가능하도록 구현

</br>

### [과제 안내]

디어는 사용자의 요금을 계산하기 위해 다양한 상황을 고려합니다.

- 우선 지역별로 다양한 요금제를 적용하고 있습니다. 예를 들어 건대에서 이용하는 유저는 기본요금 790원에 분당요금 150원, 여수에서 이용하는 유저는 기본요금 300원에 분당요금 70원으로 적용됩니다.
- 할인 조건도 있습니다. 사용자가 파킹존에서 반납하는 경우 요금의 30%를 할인해주며, 사용자가 마지막 이용으로부터 30분 이내에 다시 이용하면 기본요금을 면제해줍니다.
- 벌금 조건도 있습니다. 사용자가 지역 바깥에 반납한 경우 얼마나 멀리 떨어져있는지 거리에 비례하는 벌금을 부과하며, 반납 금지로 지정된 구역에 반납하면 6,000원의 벌금을 요금에 추과로 부과합니다.
- 예외도 있는데, 킥보드가 고장나서 정상적인 이용을 못하는 경우의 유저들을 배려하여 1분 이내의 이용에는 요금을 청구하지 않고 있습니다.

최근에 다양한 할인과 벌금을 사용하여 지자체와 협력하는 경우가 점점 많아지고 있어 요금제에 새로운 할인/벌금 조건을 추가하는 일을 쉽게 만드려고 합니다. 어떻게 하면 앞으로 발생할 수 있는 다양한 할인과 벌금 조건을 기존의 요금제에 쉽게 추가할 수 있는 소프트웨어를 만들 수 있을까요?

우선은 사용자의 이용에 관한 정보를 알려주면 현재의 요금 정책에 따라 요금을 계산해주는 API를 만들어주세요. 그 다음은, 기능을 유지한 채로 새로운 할인이나 벌금 조건이 쉽게 추가될 수 있게 코드를 개선하여 최종 코드를 만들어주세요.

#### 다음과 같은 정보들이 도움이 될 것 같아요.

- 요금제가 사용자 입장에서 합리적이고 이해가 쉬운 요금제라면 좋을 것 같아요.
- 앞으로도 할인과 벌금 조건은 새로운 조건이 굉장히 많이 추가되거나 변경될 것 같아요.
- 가장 최근의 할인/벌금 조건의 변경은 '특정 킥보드는 파킹존에 반납하면 무조건 무료' 였습니다.

<details>
  <summary><b>참고할 수 있는 정보들</b></summary>
  <br>

**이용에는 다음과 같은 정보들이 있습니다.**

---

```
use_deer_name (사용자가 이용한 킥보드의 이름)
use_end_lat, use_end_lng (사용자가 이용을 종료할 때 위도 경도)
use_start_at, use_end_at (사용자가 이용을 시작하고 종료한 시간)
```

**데이터베이스에는 킥보드에 대해 다음과 같은 정보들이 있습니다.**

---

```
deer_name (킥보드의 이름으로 고유한 값)
deer_area_id (킥보드가 현재 위치한 지역의 아이디)
```

**데이터베이스에는 지역에 대해 다음과 같은 정보들이 있습니다.**

---

```
area_id (지역 아이디로 고유한 값)
area_bounday (지역을 표시하는 MySQL spatial data로 POLYGON)
area_center (지역의 중심점)
area_coords (지역의 경계를 표시하는 위도, 경도로 이루어진 점의 리스트)
```

**데이터베이스에는 파킹존에 대해 다음과 같은 정보들이 있습니다.**

---

```
parkingzone_id (파킹존 아이디로 고유한 값)
parkingzone_center_lat, parkingzone_center_lng (파킹존 중심 위도, 경도)
parkingzone_radius (파킹존의 반지름)
```

**데이터베이스에는 반납금지구역에 대해 다음과 같은 정보들이 있습니다.**

---

```
forbidden_area_id (반납금지구역 아이디로 고유한 값)
forbidden_area_boundary (반납금지구역을 표시하는 MySQL spatial data로 POLYGON)
forbidden_area_coords (반납금지구역의 경계를 표시하는 위도, 경도로 이루어진 점의 리스트)
```

</details>

</br>
</br>

## 🛠 사용 기술 및 Tools

### [Back-End] ![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)

### [Deploy] <img src="https://img.shields.io/badge/AWS_EC2-232F3E?style=for-the-badge&logo=Amazon&logoColor=white"/>

### [Etc.] <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white"/>&nbsp;<img src="https://img.shields.io/badge/Github-181717?style=for-the-badge&logo=Github&logoColor=white"/>&nbsp;<img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white"/> <img src="https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white">

<img src="https://user-images.githubusercontent.com/67426853/142720033-26301764-7bbe-4e6b-bc82-e9b19a3dbd3a.png" width=700>

<br>
<br>

## DB Schema

</br>
</br>

## 📌 구현 기능

<br>
<br>

## 📖 API Document

[🔗 Postman Document]()

### API Test 방법

1. 다음 링크로 이동합니다. [postman 링크]()
2. user폴더 안의 회원가입, 로그인 요청을 통하여 accessToken을 획득합니다.
3. 권한이 필요한 api 요청 시 header의 Authorization 항목에 accessToken을 입력하여 요청할 수 있습니다.

- 로그인, 회원가입을 제외한 api 호출시 accessToken이 필요합니다.

## 🪄 설치 및 실행 방법

### 설치

1. 레포지토리를 clone 받습니다

```
$ git clone
```

2. clone한 경로에 들어간 후 의존성을 설치하고 환경 셋팅을 진행합니다.

```
$ cd 12-punch-assignment4-8percent
$ npm install
```

3. src 폴더에 docker-compose.yml 파일을 만들어 데이터베이스 연결을 설정합니다.

- Docker가 설치되어 있지 않다면 [여기](https://www.docker.com/get-started)에서 설치해 주세요
- [docker-compose.yml 노션 링크]()
- <details><summary><b>링크 접속불가 시 docker-compose 파일 설정 방법</b></summary>

  ```
  version: '3.1'
  services:

  db:
  image: mysql
  command: --default-authentication-plugin=mysql_native_password
  restart: always
  ports: - "3306:3306"
  environment:
  MYSQL_ROOT_PASSWORD: wanted
  MYSQL_DATABASE: wanted
  ```

```

</details>

4.서버를 구동합니다.

```

$ npm start

```

<span style="color:red"><b>[수정]</b>5. Unit test 및 End-to-End test를 진행합니다.</span>

```

$ npm test

```

</br>
</br>

## 🛠 Dependencies

</br>

<div align=center>

</div>

</br>
</br>

## Reference

이 프로젝트는 [원티드 프리온보딩 백엔드 코스](https://www.wanted.co.kr/events/pre_onboarding_course_4) 6차 과제 일환으로 디어코퍼레이션에서 출제한 과제를 기반으로 만들었습니다.
```
