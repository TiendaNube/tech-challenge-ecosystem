import Transaction from '@domain/Transaction';
import ITransactionService from '@services/ITransactionService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import * as yup from 'yup';

const DATE_FORMAT = /[0-9]{2}\/[0-9]{2}/;
const WRONG_DATE_MESSAGE = 'Wrong date format YYYY-MM-DD';

const requestValidator = yup.object().shape({
  merchant_id: yup.number().min(1).required(),
  description: yup.string().required(),
  payment_method: yup.string().required(),
  card_number: yup.string().required(),
  card_holder: yup.string().required(),
  expiration_date: yup.string().matches(DATE_FORMAT, WRONG_DATE_MESSAGE),
  cvv: yup.string().max(3).required(),
});

export default class TransactionController {
  async create(request: Request, response: Response): Promise<Response> {
    const transactionService: ITransactionService =
      container.resolve('TransactionService');

    const requestData = {
      merchant_id: request.body.merchant_id,
      payment_method: request.body.payment_method,
      card_number: request.body.card_number,
      card_holder: request.body.card_holder,
      expiration_date: request.body.expiration_date,
      description: request.body.description,
      cvv: request.body.cvv,
      total: request.body.total,
    };

    await requestValidator.validate(requestData, { abortEarly: true });

    requestData.expiration_date = new Date(
      requestData.expiration_date.replace('/', '/01/').replace('/', '-'),
    );

    const transaction = await transactionService.create(
      requestData as Transaction,
    );

    return response.json(transaction);
  }
}
