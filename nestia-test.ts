import { nestiaTest } from './dist/api/functional/nestia';
import * as AuthApis from './dist/api/functional/api/v1/auth/sign_up';

(async function () {
  const response = await nestiaTest({ host: 'http://127.0.0.1:3000' }, 1);
})();

(async function () {
  const response = await nestiaTest({ host: 'http://127.0.0.1:3000' }, 1);

  await nestiaTest({ host: 'localhost' }, 1);

  // await articleApis
  //   .getAllArticles(
  //     { host: 'localhost' },
  //     {
  //       limit: 10,
  //       page: 1,
  //     },
  //   )
  //   .then((res) => res);

  // await articleApis.getOneDetailArticle({ host: 'local' }, 1).then((res) => {
  //   document.createElement('div').innerHTML = `${res.writer}`;
  // });

  // AuthApis.signUp({}, {});
})();
