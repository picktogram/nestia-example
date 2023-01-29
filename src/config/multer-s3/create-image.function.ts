import axios from 'axios';
import aws from 'aws-sdk';
import path from 'path';

aws.config.loadFromPath(path.join(__dirname, '../../../../s3.json'));
const s3 = new aws.S3();

export const createImageBy = async (imageLinks: string[]) => {
  const images = await Promise.allSettled(
    imageLinks.map(async (originalLink: string, index: number) => {
      const response = await axios.get(originalLink, {
        responseType: 'arraybuffer',
      });

      const filename = `products/${new Date().getTime()}.jpg`;

      const s3Response = s3.upload({ Bucket: '', Key: filename, Body: response.data }, {});
      await s3Response.promise(); // NOTE : this part is saving image part.

      if (response.status === 200) {
        //   return BodyImage.create({});
      }
    }),
  );

  return images.filter((el) => el.status === 'fulfilled').map((el: any) => el.value);
};
