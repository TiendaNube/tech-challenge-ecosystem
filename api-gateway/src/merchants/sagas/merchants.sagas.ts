import { Injectable } from '@nestjs/common';
import { ICommand, Saga, ofType } from '@nestjs/cqrs';
import { Observable, delay, map } from 'rxjs';
import { MerchantCreatedTransactionEvent } from '../events/impl/merchant-created-transaction.event';
import * as clc from 'cli-color';
@Injectable()
export class MerchantSagas {
  @Saga()
  transactionCreated = (events$: Observable<unknown>): Observable<ICommand> => {
    return events$.pipe(
      ofType(MerchantCreatedTransactionEvent),
      delay(1000),
      map((event) => {
        console.log(clc.redBright('Inside [HeroesGameSagas] Saga'));
        return event;
      }),
    );
  };
}
