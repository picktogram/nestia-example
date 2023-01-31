import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsRepository } from '@root/models/repositories/comments.repository';

@Injectable()
export class CommentsService {
  constructor(@InjectRepository(CommentsRepository) private readonly commentsRepository: CommentsRepository) {}
}
