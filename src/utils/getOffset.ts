import { Pagination } from '../types';

/**
 * default limit ( = take ) 값으로 10을 지정해뒀다.
 */
export const NUM_OF_ENTITIES = 10 as const;

/**
 * 페이지네이션을 계산하기 편하게 하기 위해 유틸 함수를 만든다.
 * @param param0 page, lmit을 가진 객체로, 자동 완성 기능을 위해 객체 형태를 받도록 수정
 * @returns
 */
export const getOffset = ({ page, limit }: Pagination) => {
  const take = limit ?? NUM_OF_ENTITIES;
  const skip = page > 1 ? take * (page - 1) : 0;
  return { skip, take };
};
