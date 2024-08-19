import 'reflect-metadata';
import { PrismaClient } from '@prisma/client';

// Carrega as variáveis de ambiente de teste

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:postgres@localhost:5433/tests',
    },
  },
});

export default prisma;
