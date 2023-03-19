import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { NTuple, ValueOfError } from '../../types';

export const ERROR = {
  ALREADY_CREATED_EMAIL: { result: false, code: 4001, data: '이미 생성된 이메일입니다.' },
  NO_AUTH_TOKEN: { result: false, code: 4002, data: '인증이 필요합니다.' },
  IS_SAME_POSITION: { result: false, code: 4003, data: '이미지의 정렬 값이 동일한 경우가 존재합니다.' },
  CANNOT_FINDONE_ARTICLE: { result: false, code: 4004, data: '게시글을 찾지 못했습니다.' },
  SELECT_MORE_THAN_ONE_BODY_IMAGE: { result: false, code: 4005, data: '적어도 1장 이상의 이미지를 골라야 합니다.' },
  NOT_FOUND_ARTICLE_TO_COMMENT: { result: false, code: 4006, data: '댓글을 작성할 게시글을 찾지 못했습니다.' },
  TOO_MANY_REPORTED_ARTICLE: {
    result: false,
    code: 4007,
    data: '신고가 접수된 게시글이라 댓글 작성이 불가능합니다.',
  },
  ALREADY_FOLLOW_USER: { result: false, code: 4008, data: '이미 좋아요를 누른 디자이너님입니다!' },
  CANNOT_FIND_ONE_DESIGNER_TO_FOLLOW: { result: false, code: 4009, data: '팔로우할 디자이너님을 찾지 못했습니다.' },
  STILL_UNFOLLOW_USER: { result: false, code: 4010, data: '아직 팔로우한 적 없는 디자이너님에요!' },
  CANNOT_FIND_ONE_DESIGNER_TO_UNFOLLOW: {
    result: false,
    code: 4011,
    data: '언팔로우할 디자이너님을 찾지 못했습니다.',
  },
  CANNOT_FIND_ONE_REPLY_COMMENT: { result: false, code: 4012, data: '답글을 달 댓글을 찾지 못했어요.' },
  ALREADY_CREATED_PHONE_NUMBER: { result: false, code: 4013, data: '이미 생성된 전화번호입니다.' },
  ARLEADY_REPORTED_ARTICLE: { result: false, code: 4014, data: '이미 신고한 게시글입니다.' },
  IS_NOT_WRITER_OF_THIS_ARTICLE: { result: false, code: 4015, data: '이 게시글의 작성자만이 수정할 수 있습니다.' },
  CANNOT_FIND_ONE_COMMENT: { result: false, code: 4016, data: '해당 댓글을 찾지 못했습니다.' },
  CANNOT_FOLLOW_MYSELF: { result: false, code: 4017, data: '설마 자기 자신을 팔로우하려고 했어요?!' },
} as const;

export const createErrorSchema = (error: ValueOfError): SchemaObject => {
  return {
    type: 'object',
    properties: {
      code: { type: 'number', example: error.code },
      message: { type: 'string', example: error.data },
    },
  };
};

export const createErrorSchemas = <T extends string[]>(errors: NTuple<T['length'], ValueOfError[]>): SchemaObject => {
  return {
    type: 'array',
    items: {
      anyOf: [...errors].map((error: ValueOfError) => {
        return {
          properties: {
            code: { type: 'number', example: error.code },
            message: { type: 'string', example: error.data },
          },
        };
      }),
    },
  };
};
