import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Body, Controller, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UserId } from '../common/decorators/user-id.decorator';
import { createErrorSchema, createErrorSchemas, ERROR } from '../config/constant/error';
import { CreateArticleDto } from '../models/dtos/create-article.dto';
import { CreateCommentDto } from '../models/dtos/create-comment.dto';
import { GetAllArticlesResponseDto } from '../models/response/get-all-articles-response.dto';
import { CommentsService } from '../providers/comments.service';
import { ArticlesService } from '../providers/articles.service';
import { CommentType, Pagination } from '../types';

@ApiTags('Articles')
@ApiBearerAuth('Bearer')
@UseGuards(JwtGuard)
@Controller('api/v1/articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService, private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: '230223 - 게시글의 댓글을 최신 순으로 조회한다.' })
  @TypedRoute.Get(':id/comments')
  async readComments(
    @TypedParam('id', 'number') articleId: number,
    @TypedQuery() paginationDto: { page: number; limit: number },
  ): Promise<CommentType.RootComment[]> {
    const comments = await this.commentsService.readByArticleId(articleId, paginationDto);
    return comments;
  }

  @ApiOperation({ summary: '230130 - 게시글에 댓글 작성' })
  @ApiBadRequestResponse({
    schema: createErrorSchemas([ERROR.NOT_FOUND_ARTICLE_TO_COMMENT, ERROR.TOO_MANY_REPORTED_ARTICLE]),
  })
  @TypedRoute.Post(':id/comments')
  public async writeComment(
    @UserId() writerId: number,
    @Param('id', ParseIntPipe) articleId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const comment = await this.commentsService.write(writerId, articleId, createCommentDto);
    return comment;
  }

  @ApiOperation({ summary: '230129 - 게시글 조회 (incompleted)' })
  @ApiBadRequestResponse({
    description: '이미지들 중 position이 null이 아니면서 동일하게 배정된 경우',
    schema: createErrorSchema(ERROR.CANNOT_FINDONE_ARTICLE),
  })
  @ApiParam({ name: 'id', description: '조회하고자 하는 게시글의 id 값' })
  @TypedRoute.Get(':id')
  public async getOneDetailArticle(@UserId() userId: number, @Param('id', ParseIntPipe) articleId: number) {
    const article = await this.articlesService.getOneDetailArticle(userId, articleId);
    return article;
  }

  @ApiOperation({ summary: '230129 - 게시글 리스트 조회 (incompleted)' })
  @ApiOkResponse({ type: GetAllArticlesResponseDto })
  @TypedRoute.Get()
  public async getAllArticles(@UserId() userId: number, @Query() paginationDto: Pagination) {
    const articlesToRead = await this.articlesService.read(userId, paginationDto);
    return articlesToRead;
  }

  @ApiOperation({ summary: '230129 - 게시글 작성 / 임시저장 기능이 추가되어야 한다. (incompleted)' })
  @ApiBadRequestResponse({
    description: '이미지들 중 position이 null이 아니면서 동일하게 배정된 경우',
    schema: createErrorSchema(ERROR.IS_SAME_POSITION),
  })
  @TypedRoute.Post()
  public async writeArticle(@UserId() userId: number, @TypedBody() createArticleDto: CreateArticleDto) {
    const savedArticle = await this.articlesService.write(userId, createArticleDto);
    const article = await this.articlesService.getOneDetailArticle(userId, savedArticle.id);
    return article;
  }
}
