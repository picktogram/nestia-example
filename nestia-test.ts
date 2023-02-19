import { nestiaTest, nestiaTest2 } from './dist/api/functional/nestia';

(async function () {
  // const response = await nestiaTest({ host: 'http://127.0.0.1:3000' }, 1);
  const response = await nestiaTest2(
    { host: 'http://127.0.0.1:3000' },
    {
      email: 'kakasoo@naver.com',
    },
  );
})();
