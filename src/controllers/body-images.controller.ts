import { BadRequestException, Controller, Get, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBadRequestResponse, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { JwtGuard } from '@root/auth/guards/jwt.guard';
import { createErrorSchema, ERROR } from '@root/config/constant/error';
import { CreateBodyImageMulterOptions } from '@root/config/multer-s3/multer-option';
import { BodyImagesService } from '@root/providers/body-images.service';

@ApiTags('Articles')
@ApiBearerAuth('Bearer')
@UseGuards(JwtGuard)
@Controller('api/v1/body-image')
export class BodyImagesController {
  constructor(private readonly bodyImagesService: BodyImagesService, private readonly configService: ConfigService) {}

  @ApiOperation({ summary: '230129 - 이미지를 저장하고, 저장된 경로를 받아오는 API' })
  @ApiBadRequestResponse({ schema: createErrorSchema(ERROR.SELECT_MORE_THAN_ONE_BODY_IMAGE) })
  @UseInterceptors(FilesInterceptor('file', 10, CreateBodyImageMulterOptions()))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'files라는 키 값으로 form-data 형식으로 이미지 배열을 담아야 한다.',
    type: 'multipart/form-data',
    required: true,
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @Post()
  async upload(@UploadedFiles() files: Express.MulterS3.File[]) {
    if (!files?.length) {
      throw new BadRequestException(ERROR.SELECT_MORE_THAN_ONE_BODY_IMAGE);
    }
    return files.map(({ location }) => location);
  }
}
