import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SlackService {
  constructor(private readonly configService: ConfigService) {}

  async sendToServerErrorChannel(text: string) {
    try {
      text = `server env : ${this.configService.get('NODE_ENV')}\n` + `${text}`;
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
