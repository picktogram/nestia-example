# picktogram-server

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

```bash
npm run test:watch
```

- 테스트 역시 서버 측에서 Nestia SDK를 사용하여 진행

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

확인할 사항

1. npx nestia sdk 실행 후 packages 폴더 생성 ( 해당 프로젝트는 이미 생성 이후 )
2. packages/api/lib/package.json 생성 ( npm publish 용 설정 파일 )

## 프론트에서의 SDK 사용

```bash
# front side
npm i picktogram-server-apis
```

```typescript
try {
  const connection = {
    host: SERVER_URL,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  };

  const response = await Apis.api.v1.articles.reports.report(connection, articleId, {
    reason: '불쾌한 언행으로 인한 신고',
  });
  return response.data;
} catch (err) {
  throw err;
}
```

[프론트에서 Nestia SDK를 연동한 예시](https://github.com/picktogram/front/blob/feature/user/picktogram/src/components/main/components/card/cardModal.tsx#L20)

# Nestia SDK 연동 (~ing)

[일자리 구하고 있는 개발자](https://sunrise-push-ffa.notion.site/BK-f28d897b19c44e0e992c6f6ff6161fc5)
