# picktogram-server

> **_"디자이너를 위한 SNS 서비스"_** 라는 주제로 개발 진행 중

## 서버 실행

```bash
npm run start:local
```

```text
# .env
DB_TYPE=
LOCAL_DB_HOST=
LOCAL_DB_PORT=
LOCAL_DB_USERNAME=
LOCAL_DB_DATABASE=
LOCAL_DB_PASSWORD=

TEST_DB_HOST=
TEST_DB_PORT=
TEST_DB_USERNAME=
TEST_DB_DATABASE=
TEST_DB_PASSWORD=
```

- 다른 환경 설정 값들은 생략

## 테스트

- [Nestia를 활용한 e2e 테스트](https://kscodebase.tistory.com/642)
- [테스트 코드로 커뮤니케이션하기](https://kscodebase.tistory.com/646)

```bash
npm run test:watch
```

- 테스트 역시 서버 측에서 Nestia SDK를 사용하여 진행
- [해당 레포지토리 내 e2e 테스트 파일 위치](https://github.com/picktogram/server/blob/main/src/test/e2e/users.spec.ts)

## Swagger 생성

```bash
npm run build
   # npm run prebuild  : rimraf dist
   # npm run build     : nest build
   # npm run postbuild : npx nestia swagger && npx nestia sdk
```

- 빌드 시 swagger 문서 및 SDK 생성이 되도록 하기

## SDK 배포 방법

```bash
npm run build
   # npm run prebuild  : rimraf dist
   # npm run build     : nest build
   # npm run postbuild : npx nestia swagger && npx nestia sdk

npm run publish # cd packages/api/lib && npm publish
```

- [npm을 통해 배포된 SDK](https://www.npmjs.com/package/picktogram-server-apis)

확인할 사항

1. npx nestia sdk 실행 후 packages 폴더 생성 ( 해당 프로젝트는 이미 생성 이후 )
2. packages/api/lib/package.json 생성해둬야... ( npm publish 용 설정 파일 )

## 프론트에서의 SDK 사용

> _TypeScript로 작성된 서버는 프론트 개발자가 코드를 보고 해석하는 데에 전혀 문제가 없다._

```bash
# front side
npm i picktogram-server-apis
```

```typescript
import * as Apis from 'picktogram-server-apis/api/functional';

try {
  const connection = {
    host: SERVER_URL,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  };

  // /api/v1/articles/reports 경로의 report()
  // 메서드의 이름은 백엔드 개발자가 컨트롤러에서 지정한 이름과 동일
  const response = await Apis.api.v1.articles.reports.report(connection, articleId, {
    reason: '불쾌한 언행으로 인한 신고',
  });
  return response.data;
} catch (err) {
  throw err;
}
```

- [프론트에서 Nestia SDK를 연동한 코드 예시](https://github.com/picktogram/front/blob/feature/user/picktogram/src/components/main/components/card/cardModal.tsx#L20)
- [프론트 개발자 입장에서 바라본 Nestia SDK](https://sunrise-push-ffa.notion.site/Picktogram-3437f9ef750b43e78ca09c3aae0df46d)
- [모든 타입이 추론되는 API 만들기 ( feat. Nestia )](https://kscodebase.tistory.com/663)
- [Nestia에서 typeof, namespace를 쓰면 안 됩니다](https://kscodebase.tistory.com/676)

# Nestia SDK 연동 (~ing)

- [일자리 구하고 있는 "신입" 뿌론토 개발자](https://sunrise-push-ffa.notion.site/BK-f28d897b19c44e0e992c6f6ff6161fc5)
