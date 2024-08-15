#!/bin/bash

npx prisma migrate deploy && npx prisma db seed && npm run dev:server
