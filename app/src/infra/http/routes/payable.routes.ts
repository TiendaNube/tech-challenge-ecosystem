import { Router } from 'express';

import PayableController from '../controllers/PayableController';

const payableRoutes = Router();
const payableController = new PayableController();

payableRoutes.get('/total', payableController.totalInPeriodByMerchantId);

export default payableRoutes;
