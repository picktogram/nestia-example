import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const ERROR = {
  ALREADY_CREATED_EMAIL: { code: 4001, message: '이미 생성된 이메일입니다.' },
  NO_AUTH_TOKEN: { code: 4002, message: '인증이 필요합니다.' },
  IS_SAME_POSITION: { code: 4003, message: '이미지의 정렬 값이 동일한 경우가 존재합니다.' },
  CANNOT_FINDONE_ARTICLE: { code: 4004, message: '게시글을 찾지 못했습니다.' },
  SELECT_MORE_THAN_ONE_BODY_IMAGE: { code: 4005, message: '적어도 1장 이상의 이미지를 골라야 합니다.' },
  NOT_FOUND_ARTICLE_TO_COMMENT: { code: 4006, message: '댓글을 작성할 게시글을 찾지 못했습니다.' },
  TOO_MANY_REPORTED_ARTICLE: { code: 4007, message: '신고가 접수된 게시글이라 댓글 작성이 불가능합니다.' },
  ALREADY_FOLLOW_USER: { code: 4008, message: '이미 좋아요를 누른 디자이너입니다!' },
  CANNOT_FIND_ONE_DESIGNER: { code: 4009, message: '팔로우할 디자이너를 찾지 못했습니다.' },
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

/**
 * TODO :
 */

type Push<T extends any[], U> = [...T, U];
type NTuple<N extends number, T extends any[] = []> = T['length'] extends N ? T : NTuple<N, Push<T, any>>;

export const createErrorSchemas = <T extends string[]>(errors: NTuple<T['length'], ValueOfError[]>): SchemaObject => {
  return {
    type: 'array',
    items: {
      anyOf: [...errors].map((error) => {
        return {
          properties: {
            code: { type: 'number', example: error['code'] },
            message: { type: 'string', example: error['message'] },
          },
        };
      }),
    },
  };
};
