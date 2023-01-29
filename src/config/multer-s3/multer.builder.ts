import multerS3 from 'multer-s3';
import { Request } from 'express';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

export const imageMimeTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/bmp', 'image/webp'];
export const mediaMimeTypes = ['video/mp4'];

export class MulterBuilder {
  private readonly s3: S3Client;
  private readonly bucketName: string;
  private readonly allowedMimeTypes: Array<string> = [];

  private resource = '';
  private path = '';

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get('AWS_BUCKET_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
    this.bucketName = configService.get('AWS_BUCKET_NAME');
  }

  allowImageMimeTypes() {
    this.allowedMimeTypes.push(...imageMimeTypes);
    return this;
  }

  allowMediaMimeTypes() {
    this.allowedMimeTypes.push(...mediaMimeTypes);
    return this;
  }

  setResource(keyword: string) {
    this.resource = keyword;
    return this;
  }

  setPath(path: string) {
    this.path = path;
    return this;
  }

  build() {
    return multerS3({
      s3: this.s3,
      bucket: this.bucketName,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (req: Request, file, callback) => {
        let filename;
        const splitedFileNames = file.originalname.split('.');
        const extension = splitedFileNames.at(splitedFileNames.length - 1);
        if (this.path) {
          filename = `${this.path}/${new Date().getTime()}.${extension}`;
        } else {
          filename = `${new Date().getTime()}.${extension}`;
        }

        return callback(null, encodeURI(`${this.resource}/${filename}`));
      },
    });
  }
}
