import { Injectable } from '@nestjs/common';
import { ICommand, Saga } from '@nestjs/cqrs';
import { Observable, map } from 'rxjs';
import * as clc from 'cli-color';
@Injectable()
export class TransactionsSagas {
  @Saga()
  transactionCreated = (events$: Observable<unknown>): Observable<ICommand> => {
    return events$.pipe(
      map((event) => {
        console.log(clc.redBright('Inside [HeroesGameSagas] Saga'));
        return event;
      }),
    );
  };
}
