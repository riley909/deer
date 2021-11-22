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
| 김남형 | [42seouler](https://github.com/)                | 요금계산 로직 설계, 기본요금 인터페이스 다형성        |          |
| 김서경 | [riley909](https://github.com/riley909)         | 요금계산 로직, 부트스트랩시 디비초기화, typeorm 설정   |          |
| 김요셉 | [kim-jos](https://github.com/kim-jos)           | MySQL spatial data query를 typeorm querybuilder 변환, EC2배포      |          |
| 정천우 | [codehousepig](https://github.com/codehousepig) | MySQL spatial data 사용법, 파킹존, 금지구역, 지역의 유효성       |          |
| 최유진 | [n12seconds](https://github.com/n12seconds)     | 할인, 패널티 로직 구현, 할인 패널티 DB 설계, Postman        |          |

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

<img src="https://user-images.githubusercontent.com/67426853/142763340-7e2084ee-fea2-47fe-a2ce-7064822503f4.png" width=700>

</br>
</br>

## 📌 구현 기능

## NestJS Lifecycle events 활용하기

DB 초기화 작업을 자동으로 수행하기 위해 NestJS의 생명주기를 이용했습니다. <br>
모든 모듈이 초기화된 후 연결을 수신하기 전, 어플리케이션이 부트스트랩될 때 호출되는 onApplicationBootstrap() 후크를 사용했습니다.

```
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    // initialize database
  }
}
```

서버 구동시 테이블 생성과 동시에 테스트 가능한 데이터가 삽입됩니다.

<br>

## 기본 요금 Interface 다형성 이용

![image](https://user-images.githubusercontent.com/77034008/142785971-374cec5f-de95-499e-8e02-e987e71febb6.png)

인터페이스를 구현한 클레스를 사용해 기본 요금 계산방식이 바뀌더라도 비지니스로직에 영향을 최소화하기 위한 방법으로 이용했습니다.

## MySQL의 Spatial Data Types 활용하기

(MySQL 8.0 Reference Manual 을 참고하여 작성했으며 버전별로 사용하는 함수가 다르므로 확인이 필요합니다.) <br>
이번 과제에서는 single geometry 값을 보유하는 POINT, LINESTRING, POLYGON 을 사용했습니다. <br>

- POINT: 유저의 좌표, parking-zone의 위치 <br>
- LINESTRING: 지역의 경계(선분) <br>
- POLYGON: 지역(면) <br>

### 사용자에게 좌표를 (위도, 경도) 를 받았을 때 계산하는 방법 <br>

#### 1. 사용자가 해당 지역 안에서 반납을 요청하였을 때 <br>

1. 해당 지역 내부인지 확인 (ST_CONTAINS, ST_GeomFromText 함수 사용) <br>

```
SELECT *(any) FROM '해당테이블' WHERE ST_CONTAINS( 해당테이블의 POLYGON 타입을 탐고 있는 attribute , ST_GeomFromText( ${사용자의 좌표(POINT)} ))`;
```

2. 해당 지역의 parking-zone 인지 확인 <br>

```
    SELECT * , 하버사인 공식 AS distance
    FROM parking_zone
    HAVING distance <= parking_zone의 반지름 attribute
```

반지름 내에 있는지 확인하여 있다면 값이 조회됨.

```
하버사인 공식을 이용한 부분
	(6371*ACOS(COS(RADIANS('user 위도값'))
    	*COS(RADIANS('위도 attribute'))
        *COS(radians('경도 attribute')-RADIANS('user 경도값'))
        +SIN(RADIANS('user 위도값'))*SIN(RADIANS('위도 attribute'))))

```

3. 해당 지역의 금지구역인지 확인 <br>
   위의 내부확인과 같이 해당하는 Table 만 바꿔 조회화면 된다. <br>

#### 2. 사용자가 해당 지역 바깥에서 반납을 요청하였을 때 <br>

사용자의 좌표와 해당 지역의 경계의 거리를 구한다.(ST_DISTANCE, ST_GeomFromText 함수 사용) <br>
`SELECT ST_DISTANCE( ST_GeomFromText( ${사용자의 좌표(POINT)} ), ST_GeomFromText( ${지역의 경계값(LINESTRING)} )) AS DISTANCE` <br>
의 Query 를 보내면 소수점의 거리가 나오는데 필요에 맞게 가공하여 사용하면 된다. <br>
e.g. 이번 프로젝트에 사용한 지역 <br>
<img src="https://user-images.githubusercontent.com/61304585/142751694-12effc02-d22f-40b1-83ec-fc765950154e.png" width=500> <br>
<img src="https://user-images.githubusercontent.com/61304585/142751709-e50da958-23b7-40db-b9f3-6a346c27cb59.png" width=200> <br>
결괏값으로 나온 DISTANCE 에 100,000 을 곱하면 이번 프로젝트에서 사용할 m(미터) 가 나오는데 실제 지도에서 거리를 확인해 보면 거의 같은 것을 볼 수 있다. <br>
<br>
<br>
<br>

## 이용요금 계산하기

이용정보로 이용요금을 계산하는 방법은 다음과 같습니다. <br>

#### 1. 유저 정보, 킥보드 정보 조회 <br>

#### 2. 킥보드의 지역 정보로 기본 요금, 시간당 요금 계산 <br>

#### 3. 할인 및 벌금 적용 <br>

할인 및 벌금 정보는 discount_penalty_info 테이블에서 관리합니다. <br>
특정 킥보드, 특정 회원에게만 적용되는 정책이 추가될 가능성을 고려해서 category, content 칼럼을 추가하고 정책 적용 대상을 구분하여 저장할 수 있도록 했습니다.<br>

<img src="https://user-images.githubusercontent.com/42341135/142761145-4ed03ff7-fc68-46fa-a2fe-c464a8178437.png" width=400> <br>

- type : 할인/벌금 구분 <br>
- category : 지역/키보드/유저/전체 등 정책 적용 대상 <br>
- content : 지역명, 킥보드명, 유저id 등 category별 키 값 <br>
- policy : 정책명 <br>
- price : 금액, % <br>
  <br>

##### 1) 벌금 적용 <br>

1.  discount_penalty_info 테이블에서 해당 이용 건에 적용 가능한 벌금정책 리스트 조회 <br>
    ex) category="지역", content="지역명", type="discount" 이거나 <br>
    category="킥보드", content="킥보드명", type="discount" 이거나 <br>
    category="유저", content="유저id", type="discount" 이거나 <br>
    category="전체", type="discount" 인 데이터 조회 <br>

2.  반납좌표가 금지구역 안인 경우 조회된 리스트 중 해당하는 정책을 찾아 벌금 부과 후 return <br>
    반납좌표가 관할구역 외인 경우 조회된 리스트 중 해당하는 정책을 찾아 벌금 부과 후 return <br>
    기타 벌금정책이 존재할 경우 적용된 정책명, 금액을 상세내역 리스트(details)에 추가합니다. <br>

##### 2) 할인 적용 <br>

1.  같은 방식으로 discount_penalty_info 테이블에서 해당 이용 건에 적용 가능한 할인정책 리스트 조회 <br>
2.  switch문으로 정책에 맞는 로직을 수행하며 적용된 정책명, 금액을 상세내역 리스트(details)에 추가합니다. <br>

#### 4. 최종 금액(totalPrice)과 상세내역 리스트(details) retrun <br>

```
 "details": [
        {
            "type": "basic", //basic, discount, penalty
            "policy": "기본요금",
            "price": 4500
        }, ...
],
"totalPrice": 0
```

<br>
details의 type은 기본요금, 할인, 패널티 구분을 나타냅니다. details가 discount인 경우 price만큼 기본요금에서 빼고, details가 penalty인 경우 price만큼 기본요금에 더합니다. <br>
이 결과값이 최종금액(totalPrice)이며 0보다 작을 경우는 0을 retrun합니다. <br>

## 📖 API Document

[🔗 Postman Document](https://documenter.getpostman.com/view/8136495/UVJWqfQt)

### API Test 방법 <br>

1. 다음 링크로 이동합니다. [postman 링크](https://www.postman.com/restless-escape-500858/workspace/12-punch-assignment-deer/request/8136495-ded5c67b-dda5-486c-b248-420eb0c4d1d8) <br>
 저장된 테스트 결과 확인이 가능합니다. 현재 '특정 킥보드 파킹존에 반납시 무료' 조건은 '건대1' 킥보드에 적용되어있습니다. <br>
 디비에 저장된 할인/벌금 조건은 다음과 같습니다. <br>
 - 파킹존에 반납 시 30퍼센트 할인
 - 30분 이내 재이용시 기본요금 무료
 - 특정 킥보드(킥보드명 '건대1') 파킹존에 반납시 무료 
 - 금지구역 반납시 6000원 벌금 부과
 - 지역 외 반납시 여수는 거리당 100원씩, 건대는 200원씩 부과  <br>
 
2. 회원가입 요청을 통해 회원 정보를 추가합니다. <br>
3. 요금계산 api를 호출한다. <br>


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

</details>

4.서버를 구동합니다.

```
$ npm start
```

## 🛠 Dependencies

<img src="https://user-images.githubusercontent.com/67426853/142763561-48d5c58d-e1d7-46e9-9199-7a54923c3c23.png" width=600>

</br>

<div align=center>

</div>

</br>
</br>

## Reference

이 프로젝트는 [원티드 프리온보딩 백엔드 코스](https://www.wanted.co.kr/events/pre_onboarding_course_4) 6차 과제 일환으로 디어코퍼레이션에서 출제한 과제를 기반으로 만들었습니다.

```

```
