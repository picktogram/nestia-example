import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR } from '../config/constant/error';
import { CreateCommentDto } from '../models/dtos/create-comment.dto';
import { ArticlesRepository } from '../models/repositories/articles.repository';
import { CommentsRepository } from '../models/repositories/comments.repository';
import { ArticleEntity } from '../models/tables/article.entity';
import { CommentEntity } from '../models/tables/comment.entity';
import { CommentType } from '../types';
import { getOffset } from '../utils/getOffset';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsRepository) private readonly commentsRepository: CommentsRepository,
    @InjectRepository(ArticlesRepository) private readonly articlesRepository: ArticlesRepository,
  ) {}

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

  async write(writerId: number, articleId: number, createCommentDto: CreateCommentDto): Promise<CommentEntity> {
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
        throw new BadRequestException(ERROR.CANNOT_FIND_ONE_REPLY_COMMENT);
      }
    }

    if (!article) {
      throw new BadRequestException(ERROR.NOT_FOUND_ARTICLE_TO_COMMENT);
    }

    if (article.isReported >= ArticleEntity.TOO_MANY_REPORTED) {
      throw new BadRequestException(ERROR.TOO_MANY_REPORTED_ARTICLE);
    }

    const entityToSave = CommentEntity.create({ writerId, articleId, ...createCommentDto });
    const comment = await this.commentsRepository.save(entityToSave);
    return comment;
  }
}
