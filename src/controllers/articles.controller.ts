import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@root/auth/guards/jwt.guard';
import { UserId } from '@root/common/decorators/user-id.decorator';
import { CreateArticleDto } from '@root/models/dtos/create-article.dto';
import { PaginationDto } from '@root/models/dtos/pagination.dto';
import { ArticlesService } from '../providers/articles.service';

@ApiTags('상품 / Articles')
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
