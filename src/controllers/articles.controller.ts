import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@root/auth/guards/jwt.guard';
import { UserId } from '@root/common/decorators/user-id.decorator';
import { createErrorSchema, ERROR } from '@root/config/constant/error';
import { CreateArticleDto } from '@root/models/dtos/create-article.dto';
import { CreateCommentDto } from '@root/models/dtos/create-comment.dto';
import { PaginationDto } from '@root/models/dtos/pagination.dto';
import { GetOneArticleResponseDto } from '@root/models/response/get-one-article-response.dto';
import { CommentsService } from '@root/providers/comments.service';
import { ArticlesService } from '../providers/articles.service';

@ApiTags('Articles')
@ApiBearerAuth('Bearer')
@UseGuards(JwtGuard)
@Controller('api/v1/articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService, private readonly commentsService: CommentsService) {}

  @Post(':id/comments')
  async writeComment(
    @UserId() writerId: number,
    @Param('id', ParseIntPipe) articleId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const comment = await this.commentsService.write(writerId, articleId, createCommentDto);
    return comment;
  }

  @ApiOperation({ summary: '230129 - 게시글 조회 (incompleted)' })
  @ApiOkResponse({ type: GetOneArticleResponseDto })
  @ApiBadRequestResponse({
    description: '이미지들 중 position이 null이 아니면서 동일하게 배정된 경우',
    schema: createErrorSchema(ERROR.CANNOT_FINDONE_ARTICLE),
  })
  @ApiParam({ name: 'id', description: '조회하고자 하는 게시글의 id 값' })
  @Get(':id')
  async getOneDetailArticle(@UserId() userId: number, @Param('id', ParseIntPipe) articleId: number) {
    const article = await this.articlesService.getOneDetailArticle(userId, articleId);
    return article;
  }

  @ApiOperation({ summary: '230129 - 게시글 리스트 조회 (incompleted)' })
  @Get()
  async getAllArticles(@UserId() userId: number, @Query() paginationDto: PaginationDto) {
    const articlesToRead = await this.articlesService.read(userId, paginationDto);
    return articlesToRead;
  }

  @ApiOperation({ summary: '230129 - 게시글 작성 / 임시저장 기능이 추가되어야 한다. (incompleted)' })
  @ApiBadRequestResponse({
    description: '이미지들 중 position이 null이 아니면서 동일하게 배정된 경우',
    schema: createErrorSchema(ERROR.IS_SAME_POSITION),
  })
  @Post()
  async writeArticle(@UserId() userId: number, @Body() createArticleDto: CreateArticleDto) {
    const savedArticle = await this.articlesService.write(userId, createArticleDto);
    const article = await this.articlesService.getOneDetailArticle(userId, savedArticle.id);
    return article;
  }
}
