export const NUM_OF_ENTITIES = 10;

export const getOffset = (page: number) => {
  const skip = page > 1 ? NUM_OF_ENTITIES * (page - 1) : 0;
  const take = NUM_OF_ENTITIES;
  return { skip, take };
};
