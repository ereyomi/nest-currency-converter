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

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('currency')
  doCurrencyConvertion(
    @Query() query: { baseCurrency: string; targetCurrency: string },
    @Res() res: Response,
  ) {
    if (!query.baseCurrency && !query.targetCurrency) {
      throw new HttpException(
        'Query params (baseCurrency and targetCurrency) are missing ?baseCurrency={{}}&targetCurrency={{}}',
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
    return this.appService.findAll(query.baseCurrency).pipe(
      map((data) => {
        const conversionRate = data['conversion_rates']?.[query.targetCurrency];
        return res.status(HttpStatus.OK).json({
          result: data,
          documentation: 'https://www.exchangerate-api.com/docs',
          terms_of_use: 'https://www.exchangerate-api.com/terms',
          targetCurrency: query.targetCurrency,
          baseCurrency: query.baseCurrency,
          conversionRate,
          data,
        });
      }),
    );
  }
}
