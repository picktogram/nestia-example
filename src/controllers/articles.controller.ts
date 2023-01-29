import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@root/auth/guards/jwt.guard';
import { UserId } from '@root/common/decorators/user-id.decorator';
import { CreateArticleDto } from '@root/models/dtos/create-article.dto';
import { ArticlesService } from '../providers/articles.service';

@ApiTags('상품 / Articles')
@ApiBearerAuth('Bearer')
@UseGuards(JwtGuard)
@Controller('api/v1/articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @ApiOperation({ summary: '210129 - 게시글 작성' })
  @Post()
  async writeArticle(
    @UserId() userId: number,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    const article = await this.articlesService.write(userId, createArticleDto);
    return article;
  }
}
