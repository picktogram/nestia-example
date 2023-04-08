// eslint-disable-next-line @typescript-eslint/no-namespace

export interface ERROR {
  type: string;
  result: false;
  code: number;
  data: string;
}

export const isErrorGuard = (obj: any): obj is ERROR => {
  if (obj.result === false) {
    return true;
  }
  return false;
};

export interface ALREADY_CREATED_EMAIL extends ERROR {
  type: 'business';
  result: false;
  code: 4001;
  data: '이미 생성된 이메일입니다.';
}

export interface NO_AUTH_TOKEN extends ERROR {
  type: 'business';
  result: false;
  code: 4002;
  data: '인증이 필요합니다.';
}

export interface IS_SAME_POSITION extends ERROR {
  type: 'business';
  result: false;
  code: 4003;
  data: '이미지의 정렬 값이 동일한 경우가 존재합니다.';
}

export interface CANNOT_FINDONE_ARTICLE extends ERROR {
  type: 'business';
  result: false;
  code: 4004;
  data: '게시글을 찾지 못했습니다.';
}

export interface SELECT_MORE_THAN_ONE_BODY_IMAGE extends ERROR {
  type: 'business';
  result: false;
  code: 4005;
  data: '적어도 1장 이상의 이미지를 골라야 합니다.';
}

export interface NOT_FOUND_ARTICLE_TO_COMMENT extends ERROR {
  type: 'business';
  result: false;
  code: 4006;
  data: '댓글을 작성할 게시글을 찾지 못했습니다.';
}

export interface TOO_MANY_REPORTED_ARTICLE extends ERROR {
  type: 'business';
  result: false;
  code: 4007;
  data: '신고가 접수된 게시글이라 댓글 작성이 불가능합니다.';
}

export interface ALREADY_FOLLOW_USER extends ERROR {
  type: 'business';
  result: false;
  code: 4008;
  data: '이미 좋아요를 누른 디자이너님입니다!';
}

export interface CANNOT_FIND_ONE_DESIGNER_TO_FOLLOW extends ERROR {
  type: 'business';
  result: false;
  code: 4009;
  data: '팔로우할 디자이너님을 찾지 못했습니다.';
}

export interface STILL_UNFOLLOW_USER extends ERROR {
  type: 'business';
  result: false;
  code: 4010;
  data: '아직 팔로우한 적 없는 디자이너님에요!';
}

export interface CANNOT_FIND_ONE_DESIGNER_TO_UNFOLLOW extends ERROR {
  type: 'business';
  result: false;
  code: 4011;
  data: '언팔로우할 디자이너님을 찾지 못했습니다.';
}

export interface CANNOT_FIND_ONE_REPLY_COMMENT extends ERROR {
  type: 'business';
  result: false;
  code: 4012;
  data: '답글을 달 댓글을 찾지 못했어요.';
}

export interface ALREADY_CREATED_PHONE_NUMBER extends ERROR {
  type: 'business';
  result: false;
  code: 4013;
  data: '이미 생성된 전화번호입니다.';
}

export interface ARLEADY_REPORTED_ARTICLE extends ERROR {
  type: 'business';
  result: false;
  code: 4014;
  data: '이미 신고한 게시글입니다.';
}

export interface IS_NOT_WRITER_OF_THIS_ARTICLE extends ERROR {
  type: 'business';
  result: false;
  code: 4015;
  data: '이 게시글의 작성자만이 수정할 수 있습니다.';
}

export interface CANNOT_FIND_ONE_COMMENT extends ERROR {
  type: 'business';
  result: false;
  code: 4016;
  data: '해당 댓글을 찾지 못했습니다.';
}

export interface CANNOT_FOLLOW_MYSELF extends ERROR {
  type: 'business';
  result: false;
  code: 4017;
  data: '설마 자기 자신을 팔로우하려고 했어요?!';
}
