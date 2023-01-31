import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentDto } from '@root/models/dtos/create-comment.dto';
import { CommentsRepository } from '@root/models/repositories/comments.repository';

@Injectable()
export class CommentsService {
  constructor(@InjectRepository(CommentsRepository) private readonly commentsRepository: CommentsRepository) {}

  async write(writerId: number, articleId: number, { contents }: CreateCommentDto) {
    const comment = await this.commentsRepository.save({
      writerId,
      articleId,
      contents,
    });

    return comment;
  }
}
