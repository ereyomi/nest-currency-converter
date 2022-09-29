import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { catchError, map, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ExchangerateApiResponse } from './core/exchangerate.interface';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}
  getExchangerate(
    baseCurrency: string,
  ): Observable<AxiosResponse<ExchangerateApiResponse>> {
    return this.httpService
      .get(
        `https://v6.exchangerate-api.com/v6/0380feae9551900e5b470040/latest/${baseCurrency}`,
      )
      .pipe(
        catchError((e) => {
          throw new HttpException(
            e.response.data?.['error-type'] || 'unsuported base currency code',
            e.response.status,
          );
        }),
        map((response) => response.data),
      );
  }
}
