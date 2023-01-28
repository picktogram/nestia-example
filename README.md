# nestjs-e-commerce

e-commerce 프로젝트를 진행하기 위한 B.E. 설정 및 기본 코드를 구현합니다.  
B.E.나 F.E. 구분할 것 없이 양자에게 도움이 되기를 바랍니다.  
더 나은 방법, 기능 추가 등은 아래로 문의주시면 감사하겠습니다.

email : kscodebase@gmail.com

# How to use?

1. MySQL 설치
2. .env에 각종 값들을 모두 기입 ( 기입 후에는 .env.example 파일 이름을 .env로 고쳐주세요. )
3. 아래 명령어로 tables를 MySQL 상에 synchronize.

   ```bash
   $ npm install # 필요한 node package module을 install 합니다.
   $ npm run schema:sync # 정의된 entity들을 즉시 생성합니다.
   ```

   - 만약 잘못된 데이터가 있다면 일단 workbench로 삭제해주세요.
   - 또는 schema:drop 후 schema:sync로 DB를 삭제, 재생성해주세요.

4. 서버 실행 후 F.E. 에 자유롭게 연동

   ```bash
   $ npm run start:dev # 또는 npm run start
   ```

5. localhost:3000/api 경로에서 swagger 문서 확인 가능
   - 해당 문서를 통해 경로, 기능, Request와 Response를 확인합니다.

추후 pm2를 이용한 클러스터링을 설명하겠습니다.
