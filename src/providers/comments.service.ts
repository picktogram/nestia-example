import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR } from '@root/config/constant/error';
import { CreateCommentDto } from '@root/models/dtos/create-comment.dto';
import { ArticlesRepository } from '@root/models/repositories/articles.repository';
import { CommentsRepository } from '@root/models/repositories/comments.repository';
import { ArticleEntity } from '@root/models/tables/article.entity';
import { CommentEntity } from '@root/models/tables/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsRepository) private readonly commentsRepository: CommentsRepository,
    @InjectRepository(ArticlesRepository) private readonly articlesRepository: ArticlesRepository,
  ) {}

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

    const comment = await this.commentsRepository.save(createCommentDto);
    return comment;
  }
}
