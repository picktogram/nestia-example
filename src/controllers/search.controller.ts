import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { SearchService } from '../providers/search.service';
import { TypedQuery, TypedRoute } from '@nestia/core';

@ApiTags('Search')
@ApiBearerAuth('Bearer')
@Controller('api/v1/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  // /**
  //  * @internal
  //  * @param query
  //  * @returns
  //  */
  // @ApiOperation({ summary: '게시글 검색 (미완성)' })
  // @TypedRoute.Get('articles')
  // async getArticles(@TypedQuery() query: { content: string }): Promise<void> {
  //   // return await this.searchService.searchArticles(query.content);
  // }

  // /**
  //  * @internal
  //  * @param query
  //  * @returns
  //  */
  // @ApiOperation({ summary: '댓글 검색 (미완성)' })
  // @TypedRoute.Get('comments')
  // async getComments(@TypedQuery() query: { content: string }): Promise<void> {
  //   // return await this.searchService.searchComments(query.content);
  // }
}
