import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentDto } from '../models/dtos/create-comment.dto';
import { ArticlesRepository } from '../models/repositories/articles.repository';
import { CommentsRepository } from '../models/repositories/comments.repository';
import { UserLikeCommentsRepository } from '../models/repositories/user-like-comments.repository';
import { ArticleEntity } from '../models/tables/article.entity';
import { CommentEntity } from '../models/tables/comment.entity';
import { CommentType } from '../types';
import { getOffset } from '../utils/getOffset';
import {
  CANNOT_FIND_ONE_COMMENT,
  CANNOT_FIND_ONE_REPLY_COMMENT,
  NOT_FOUND_ARTICLE_TO_COMMENT,
  TOO_MANY_REPORTED_ARTICLE,
} from '../config/errors/business-error';
import typia from 'typia';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsRepository)
    private readonly commentsRepository: CommentsRepository,
    @InjectRepository(ArticlesRepository)
    private readonly articlesRepository: ArticlesRepository,
    @InjectRepository(UserLikeCommentsRepository)
    private readonly userLikeCommentsRepository: UserLikeCommentsRepository,
  ) {}

  async likeOrUnlike(userId: number, commentId: number) {
    const like = await this.userLikeCommentsRepository.findOneBy({ userId, commentId });

    if (like) {
      await this.userLikeCommentsRepository.remove(like);
    } else {
      await this.userLikeCommentsRepository.save({ userId, commentId });
    }

    return !like;
  }

  async getOne(userId: number, articleId: number, commentId: number): Promise<CommentEntity | CANNOT_FIND_ONE_COMMENT> {
    const comment = await this.commentsRepository.findOne({ where: { id: commentId, articleId } });
    if (!comment) {
      return typia.random<CANNOT_FIND_ONE_COMMENT>();
    }
    return comment;
  }

  async readByArticleId(
    articleId: number,
    { page, limit }: { page: number; limit: number },
  ): Promise<{ list: CommentType.RootComment[]; count: number }> {
    const { skip, take } = getOffset({ page, limit });
    const [list, count] = await this.commentsRepository.findAndCount({
      select: {
        id: true,
        writerId: true,
        parentId: true,
        contents: true,
        xPosition: true,
        yPosition: true,
      },
      where: { articleId },
      order: { createdAt: 'DESC' },
      skip,
      take,
    });

    return { list, count };
  }

  async write(
    writerId: number,
    articleId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentEntity | CANNOT_FIND_ONE_REPLY_COMMENT | NOT_FOUND_ARTICLE_TO_COMMENT | TOO_MANY_REPORTED_ARTICLE> {
    const article = await this.articlesRepository.findOne({
      select: {
        id: true,
        isReported: true,
      },
      where: { id: articleId },
    });

    if (createCommentDto.parentId) {
      const parentComment = await this.commentsRepository.findOne({
        where: { articleId, parentId: createCommentDto.parentId },
      });

      if (!parentComment) {
        return typia.random<CANNOT_FIND_ONE_REPLY_COMMENT>();
      }
    }

    if (!article) {
      return typia.random<NOT_FOUND_ARTICLE_TO_COMMENT>();
    }

    if (article.isReported >= ArticleEntity.TOO_MANY_REPORTED) {
      return typia.random<TOO_MANY_REPORTED_ARTICLE>();
    }

    const entityToSave = CommentEntity.create({ writerId, articleId, ...createCommentDto });
    const comment = await this.commentsRepository.save(entityToSave);
    return comment;
  }
}
