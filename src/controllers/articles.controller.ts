import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UserId } from '../common/decorators/user-id.decorator';
import { createErrorSchema, createErrorSchemas, ERROR } from '../config/constant/error';
import { CreateArticleDto } from '../models/dtos/create-article.dto';
import { CreateCommentDto } from '../models/dtos/create-comment.dto';
import { CommentsService } from '../providers/comments.service';
import { ArticlesService } from '../providers/articles.service';
import { ArticleType, CommentType, PaginationDto } from '../types';
import { createPaginationForm, createResponseForm, ResponseForm } from '../interceptors/transform.interceptor';

@UseGuards(JwtGuard)
@Controller('api/v1/articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService, private readonly commentsService: CommentsService) {}

  /**
   * 230223 - 게시글의 댓글을 최신 순으로 조회한다. (페이지네이션 형태로 변경할 예정)
   * @tag articles
   * @param articleId 댓글을 조회하고자 하는 게시글의 id
   * @param paginationDto 페이지 정보
   * @returns 댓글의 리스트
   */
  @TypedRoute.Get(':id/comments')
  async readComments(
    @TypedParam('id', 'number') articleId: number,
    @TypedQuery() paginationDto: PaginationDto,
  ): Promise<CommentType.ReadCommentsResponse> {
    const comments = await this.commentsService.readByArticleId(articleId, paginationDto);
    return createPaginationForm(comments, paginationDto);
  }

  /**
   * 230130 - 게시글에 댓글 작성
   * @tag articles
   * @param writerId 작성자의 아이디
   * @param articleId 게시글의 아이디
   * @param createCommentDto 작성하고자 하는 댓글의 정보
   * @returns 방금 작성된 댓글
   */
  @ApiBadRequestResponse({
    schema: createErrorSchemas([ERROR.NOT_FOUND_ARTICLE_TO_COMMENT, ERROR.TOO_MANY_REPORTED_ARTICLE]),
  })
  @TypedRoute.Post(':id/comments')
  public async writeComment(
    @UserId() writerId: number,
    @TypedParam('id', 'number') articleId: number,
    @TypedBody() createCommentDto: CreateCommentDto,
  ): Promise<ResponseForm<CommentType.CreateResponse>> {
    const comment = await this.commentsService.write(writerId, articleId, createCommentDto);
    return createResponseForm(comment);
  }

  /**
   * 230129 - 게시글 조회 (incompleted)
   * @tag articles
   * @param userId 작성자의 아이디
   * @param articleId 조회하고자 하는 게시글의 id 값
   * @returns 조회한 게시글
   */
  @ApiBadRequestResponse({
    description: '이미지들 중 position이 null이 아니면서 동일하게 배정된 경우',
    schema: createErrorSchema(ERROR.CANNOT_FINDONE_ARTICLE),
  })
  @TypedRoute.Get(':id')
  public async getOneDetailArticle(
    @UserId() userId: number,
    @TypedParam('id', 'number') articleId: number,
  ): Promise<ResponseForm<ArticleType.DetailArticle>> {
    const article = await this.articlesService.getOneDetailArticle(userId, articleId);
    return createResponseForm(article);
  }

  /**
   * 230129 - 게시글 리스트 조회 (incompleted)
   * @tag articles
   * @param userId 조회를 하는 유저의 아이디
   * @param paginationDto 페이지의 정보
   * @returns 게시글 리스트
   */
  @TypedRoute.Get()
  public async getAllArticles(
    @UserId() userId: number,
    @TypedQuery() paginationDto: PaginationDto,
  ): Promise<ArticleType.GetAllArticlesReponse> {
    const articlesToRead = await this.articlesService.read(userId, paginationDto);
    const response = createPaginationForm(articlesToRead, paginationDto);
    return response;
  }

  /**
   * 230129 - 게시글 작성 / 임시저장 기능이 추가되어야 한다. (incompleted)
   * @tag articles
   
   * @param userId 글을 쓰고자 하는 작성자의 id
   * @param createArticleDto 게시글의 정보
   * @returns
   */
  @ApiBadRequestResponse({
    description: '이미지들 중 position이 null이 아니면서 동일하게 배정된 경우',
    schema: createErrorSchema(ERROR.IS_SAME_POSITION),
  })
  @TypedRoute.Post()
  public async writeArticle(
    @UserId() userId: number,
    @TypedBody() createArticleDto: CreateArticleDto,
  ): Promise<ResponseForm<ArticleType.DetailArticle>> {
    const savedArticle = await this.articlesService.write(userId, createArticleDto);
    const article = await this.articlesService.getOneDetailArticle(userId, savedArticle.id);
    return createResponseForm(article);
  }
}
