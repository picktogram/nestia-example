export const ERROR = {
  ALREADY_CREATED_EMAIL: { code: 4001, message: '이미 생성된 이메일입니다.' },
  NO_AUTH_TOKEN: { code: 4002, message: '인증이 필요합니다.' },
  IS_SAME_POSITION: { code: 4003, message: '이미지의 정렬 값이 동일한 경우가 존재합니다.' },
} as const;
