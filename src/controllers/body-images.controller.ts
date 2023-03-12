import { TypedRoute } from '@nestia/core';
import { BadRequestException, Controller, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { createErrorSchema, ERROR } from '../config/constant/error';
import { CreateBodyImageMulterOptions } from '../config/multer-s3/multer-option';
import { createResponseForm, ResponseForm } from '../interceptors/transform.interceptor';
import { BodyImagesService } from '../providers/body-images.service';

@UseGuards(JwtGuard)
@Controller('api/v1/body-image')
export class BodyImagesController {
  constructor(private readonly bodyImagesService: BodyImagesService, private readonly configService: ConfigService) {}

  /**
   * @summary 230129 - 이미지를 저장하고, 저장된 경로를 받아오는 API로, key는 file 이라는 명칭, 최대 이미지 수는 10개이다.
   * @tag body-images
   * @param files 저장할 이미지
   * @returns 이미지가 저장되고 난 후의 경로의 배열
   */
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
  @TypedRoute.Post()
  async upload(@UploadedFiles() files: Express.MulterS3.File[]): Promise<ResponseForm<string[]>> {
    if (!files?.length) {
      throw new BadRequestException(ERROR.SELECT_MORE_THAN_ONE_BODY_IMAGE);
    }
    const locations = files.map(({ location }) => location);
    return createResponseForm(locations);
  }
}
