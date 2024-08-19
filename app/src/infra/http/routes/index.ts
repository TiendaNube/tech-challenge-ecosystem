import { Router } from 'express';

import payableRouter from '@infra/http/routes/payable.routes';
import transactionRouter from '@infra/http/routes/transaction.routes';

const routes = Router();

routes.use('/payable', payableRouter);
routes.use('/transaction', transactionRouter);

export default routes;
