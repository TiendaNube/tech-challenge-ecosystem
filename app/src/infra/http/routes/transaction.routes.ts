import { Router } from 'express';

import TransactionController from '../controllers/TransactionController';

const transactionRoutes = Router();
const transactionController = new TransactionController();

transactionRoutes.post('/', transactionController.create);

export default transactionRoutes;
