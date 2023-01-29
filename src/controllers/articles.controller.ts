import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@root/auth/guards/jwt.guard';
import { UserId } from '@root/common/decorators/user-id.decorator';
import { createErrorSchema, ERROR } from '@root/config/constant/error';
import { CreateArticleDto } from '@root/models/dtos/create-article.dto';
import { PaginationDto } from '@root/models/dtos/pagination.dto';
import { ArticlesService } from '../providers/articles.service';

@ApiTags('Articles')
@ApiBearerAuth('Bearer')
@UseGuards(JwtGuard)
@Controller('api/v1/articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @ApiOperation({ summary: '210129 - 게시글 리스트 조회 (incompleted)' })
  @Get()
  async getAllArticles(@UserId() userId: number, @Query() PaginationDto: PaginationDto) {
    const articlesToRead = await this.articlesService.read(userId, PaginationDto);
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
