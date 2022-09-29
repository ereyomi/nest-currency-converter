import {
  Controller,
  Get,
  Query,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { map } from 'rxjs';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller('currency')
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  doCurrencyConvertion(
    @Query() query: { baseCurrency: string; targetCurrency: string },
    @Res() res: Response,
  ) {
    if (!query.baseCurrency && !query.targetCurrency) {
      throw new HttpException(
        'Query params (baseCurrency and targetCurrency) are missing /currency?baseCurrency={{}}&targetCurrency={{}}',
        HttpStatus.FORBIDDEN,
      );
    }
    if (!query.baseCurrency) {
      throw new HttpException(
        'baseCurrency code is required',
        HttpStatus.FORBIDDEN,
      );
    }
    if (!query.targetCurrency) {
      throw new HttpException(
        'targetCurrency code is required',
        HttpStatus.FORBIDDEN,
      );
    }
    // do save request in database
    // send a response that we would reply via mail
    // pick up request via cron job
    return this.appService.getExchangerate(query.baseCurrency).pipe(
      map((data) => {
        const conversionRate = data['conversion_rates']?.[query.targetCurrency];
        return res.status(HttpStatus.OK).json({
          targetCurrency: query.targetCurrency,
          baseCurrency: query.baseCurrency,
          conversionRate,
        });
      }),
    );
  }
  sendMail() {
    return {
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: 'abc@example.com', // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Hello world?', // plain text body
      html: '<b>Hello world?</b>', // html body
    };
  }
}
