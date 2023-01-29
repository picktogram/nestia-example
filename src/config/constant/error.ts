import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const ERROR = {
  ALREADY_CREATED_EMAIL: { code: 4001, message: '이미 생성된 이메일입니다.' },
  NO_AUTH_TOKEN: { code: 4002, message: '인증이 필요합니다.' },
  IS_SAME_POSITION: { code: 4003, message: '이미지의 정렬 값이 동일한 경우가 존재합니다.' },
  CANNOT_FINDONE_ARTICLE: { code: 4004, message: '게시글을 찾지 못했습니다.' },
  SELECT_MORE_THAN_ONE_BODY_IMAGE: { code: 4005, message: '적어도 1장 이상의 이미지를 골라야 합니다.' },
} as const;

type KeyOfError = keyof typeof ERROR;
type ValueOfError = (typeof ERROR)[KeyOfError];

export const createErrorSchema = (error: ValueOfError): SchemaObject => {
  return {
    type: 'object',
    properties: {
      code: { type: 'number', example: error.code },
      message: { type: 'string', example: error.message },
    },
  };
};
