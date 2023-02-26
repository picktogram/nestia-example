import { CustomRepository } from '../../config/typeorm/custom-typeorm.decorator';
import { Repository } from 'typeorm';
import { CommentEntity } from '../tables/comment.entity';

@CustomRepository(CommentEntity)
export class CommentsRepository extends Repository<CommentEntity> {
  async getRepresentCommentsByArticeIds(articleIds: number[]) {
    if (articleIds.length === 0) {
      return [];
    }

    const comments = await this.createQueryBuilder()
      .from((qb) => {
        return qb
          .from(CommentEntity, 'c')
          .select(['c.id AS "id"', 'c.contents AS "contents"', 'c.articleId AS "articleId"'])
          .addSelect('ROW_NUMBER() OVER (PARTITION BY c."articleId" ORDER BY c."createdAt" DESC)::int4 AS "position"')
          .where('c.articleId IN (:...articleIds)', { articleIds });
      }, 'cte')
      .getRawMany();

    return comments;
  }
}
