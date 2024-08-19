import IPayableService from '@services/IPayableService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import * as yup from 'yup';

const DATE_FORMAT = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
const WRONG_DATE_MESSAGE = 'Wrong date format YYYY-MM-DD';

const requestValidator = yup.object().shape({
  merchant_id: yup.number().min(1).required(),
  from_date: yup.string().matches(DATE_FORMAT, WRONG_DATE_MESSAGE).required(),
  to_date: yup.string().matches(DATE_FORMAT, WRONG_DATE_MESSAGE).required(),
});

export default class PayableController {
  async totalInPeriodByMerchantId(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const payableService: IPayableService = container.resolve('PayableService');

    const requestData = {
      merchant_id: Number(request.query.merchant_id),
      from_date: request.query.from_date as string,
      to_date: request.query.to_date as string,
    };

    await requestValidator.validate(requestData, { abortEarly: true });

    const payableList = await payableService.totalInPeriodByMerchantId(
      requestData.merchant_id,
      requestData.from_date,
      requestData.to_date,
    );

    return response.json(payableList);
  }
}
