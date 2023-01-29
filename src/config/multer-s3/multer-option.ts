import { BadRequestException } from '@nestjs/common';
import { imageMimeTypes, mediaMimeTypes, MulterBuilder } from './multer.builder';
import multer from 'multer';

export const fileFilter = (kind: 'image' | 'media') => (req: any, file: any, cb: any) => {
  const types = kind === 'image' ? imageMimeTypes : mediaMimeTypes;
  const mimeType = types.find((im) => im === file.mimetype);
  if (!mimeType) {
    cb(new BadRequestException(`${types.join(', ')}만 저장할 수 있습니다.`), false);
  }

  if (kind === 'media') {
    file.originalname = `${new Date().getTime()}`;
  }

  return cb(null, true);
};

export const CreateProfileImageMulterOptions = (): multer.Options => {
  return {
    fileFilter: fileFilter('image'),
    storage: new MulterBuilder().allowImageMimeTypes().setResource('user').setPath('profile').build(),
    limits: { fileSize: 1024 * 1024 * 20 },
  };
};

export const CreateBodyImageMulterOptions = (): multer.Options => {
  return {
    fileFilter: fileFilter('image'),
    storage: new MulterBuilder().allowImageMimeTypes().setResource('article').setPath('body-image').build(),
    limits: { fileSize: 1024 * 1024 * 20 },
  };
};
