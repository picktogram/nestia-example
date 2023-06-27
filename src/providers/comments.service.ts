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
  CANNOT_FIND_IMAGE_TO_LEFT_COMMENT,
  CANNOT_FIND_ONE_COMMENT,
  CANNOT_FIND_ONE_REPLY_COMMENT,
  NOT_FOUND_ARTICLE_TO_COMMENT,
  TOO_MANY_REPORTED_ARTICLE,
} from '../config/errors/business-error';
import typia from 'typia';
import { BodyImagesRepository } from '../models/repositories/body-images.repository';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsRepository)
    private readonly commentsRepository: CommentsRepository,
    @InjectRepository(ArticlesRepository)
    private readonly articlesRepository: ArticlesRepository,
    @InjectRepository(UserLikeCommentsRepository)
    private readonly userLikeCommentsRepository: UserLikeCommentsRepository,
    @InjectRepository(BodyImagesRepository)
    private readonly bodyImagesRepository: BodyImagesRepository,
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
    { page, limit, imageId }: CommentType.GetCommentDto,
  ): Promise<CommentType.CommentsByArcile> {
    const { skip, take } = getOffset({ page, limit });
    const [list, count] = await this.commentsRepository.findAndCount({
      select: {
        id: true,
        writerId: true,
        parentId: true,
        imageId: true,
        contents: true,
        xPosition: true,
        yPosition: true,
        writer: {
          id: true,
          nickname: true,
          name: true,
          profileImage: true,
          status: true,
        },
        createdAt: true,
      },
      relations: {
        writer: true,
      },
      where: { articleId, ...(imageId && { imageId }) },
      order: { createdAt: 'DESC' },
      skip,
      take,
    });

    return {
      // list: list.map((comment) => {
      //   return {
      //     id: comment.id,
      //     writerId: comment.writerId,
      //     parentId: comment.parentId,
      //     contents: comment.contents,
      //     xPosition: comment.xPosition,
      //     yPosition: comment.yPosition,
      //     createdAt: comment.createdAt.toString(),
      //     writer: {
      //       id: comment.writer.id,
      //       nickname: comment.writer.nickname,
      //       profileImage: comment.writer.profileImage,
      //     },
      //   };
      // }),
      list,
      count,
    };
  }

  async write(
    writerId: number,
    articleId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<
    | CommentEntity
    | CANNOT_FIND_ONE_REPLY_COMMENT
    | NOT_FOUND_ARTICLE_TO_COMMENT
    | TOO_MANY_REPORTED_ARTICLE
    | CANNOT_FIND_IMAGE_TO_LEFT_COMMENT
  > {
    const article = await this.articlesRepository.findOne({
      select: {
        id: true,
        isReported: true,
      },
      where: { id: articleId },
    });

    if (createCommentDto.parentId) {
      const parentComment = await this.commentsRepository.findOne({
        where: { articleId, id: createCommentDto.parentId },
      });

      if (!parentComment) {
        return typia.random<CANNOT_FIND_ONE_REPLY_COMMENT>();
      }
    }

    if (createCommentDto.imageId) {
      const image = await this.bodyImagesRepository.findOne({
        where: { articleId, id: createCommentDto.imageId },
      });

      if (!image) {
        return typia.random<CANNOT_FIND_IMAGE_TO_LEFT_COMMENT>();
      }
    } else {
      /**
       * 이미지를 지정하지 않은 경우에는 좌표 값을 삭제한다.
       */
      createCommentDto.xPosition = null;
      createCommentDto.yPosition = null;
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
