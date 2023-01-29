export const NUM_OF_ENTITIES = 10;

export const getOffset = (page: number, limit: number) => {
  const take = limit ?? NUM_OF_ENTITIES;
  const skip = page > 1 ? take * (page - 1) : 0;
  return { skip, take };
};
