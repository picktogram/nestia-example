import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SlackService {
  constructor(private readonly configService: ConfigService) {}

  async sendToServerErrorChannel(text: string) {
    try {
      const environment = this.configService.get<string>('NODE_ENV');
      if (!environment || environment.toLocaleLowerCase() === 'local') {
        return;
      }

      text = `server env : ${environment}\n` + `${text}`;
      await axios.post(
        'https://hooks.slack.com/services/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',
        { text },
        { headers: { 'Content-Type': 'application/json' } },
      );
    } catch (err) {
      console.error(err);
    }
  }
}
