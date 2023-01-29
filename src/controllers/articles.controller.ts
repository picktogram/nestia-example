import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@root/auth/guards/jwt.guard';
import { UserId } from '@root/common/decorators/user-id.decorator';
import { createErrorSchema, ERROR } from '@root/config/constant/error';
import { CreateArticleDto } from '@root/models/dtos/create-article.dto';
import { PaginationDto } from '@root/models/dtos/pagination.dto';
import { GetOneArticleResponseDto } from '@root/models/response/get-one-article-response.dto';
import { ArticlesService } from '../providers/articles.service';

@ApiTags('Articles')
@ApiBearerAuth('Bearer')
@UseGuards(JwtGuard)
@Controller('api/v1/articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @ApiParam({ name: 'id', description: '조회하고자 하는 게시글의 id 값' })
  @ApiOkResponse({ type: GetOneArticleResponseDto })
  @ApiBadRequestResponse({
    description: '이미지들 중 position이 null이 아니면서 동일하게 배정된 경우',
    schema: createErrorSchema(ERROR.CANNOT_FINDONE_ARTICLE),
  })
  @Get(':id')
  async getOneDetailArticle(@UserId() userId: number, @Param('id', ParseIntPipe) articleId: number) {
    const article = await this.articlesService.getOneDetailArticle(userId, articleId);
    return article;
  }

  @ApiOperation({ summary: '210129 - 게시글 리스트 조회 (incompleted)' })
  @Get()
  async getAllArticles(@UserId() userId: number, @Query() paginationDto: PaginationDto) {
    const articlesToRead = await this.articlesService.read(userId, paginationDto);
    return articlesToRead;
  }

  @ApiOperation({ summary: '210129 - 게시글 작성 (incompleted)' })
  @ApiBadRequestResponse({
    description: '이미지들 중 position이 null이 아니면서 동일하게 배정된 경우',
    schema: createErrorSchema(ERROR.IS_SAME_POSITION),
  })
  @Post()
  async writeArticle(@UserId() userId: number, @Body() createArticleDto: CreateArticleDto) {
    const response = await this.articlesService.write(userId, createArticleDto);

    // TODO : get one article and return
    if (response) {
      return true;
    }
    return response;
  }
}
