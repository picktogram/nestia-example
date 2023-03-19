import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from '../providers/search.service';
import { UserEntity } from '../models/tables/user.entity';
import {TypedQuery, TypedRoute} from '@nestia/core';

@ApiTags('Search')
@ApiBearerAuth('Bearer')
@Controller('api/v1/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @ApiOperation({ summary: 'MVP : 디자이너 프로필 조회 & 토큰에 담긴 값 Parsing' })
  @TypedRoute.Get('articles')
  async getArticles(@TypedQuery() query: { content: string }) {
    return await this.searchService.searchArticles(query.content);
  }

  @ApiOperation({ summary: 'MVP : 디자이너 프로필 조회 & 토큰에 담긴 값 Parsing' })
  @TypedRoute.Get('comments')
  async getComments(@TypedQuery() query: { content: string }) {
    return await this.searchService.searchComments(query.content);
  }
}
