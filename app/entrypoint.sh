#!/bin/bash


npx prisma migrate deploy && npx prisma db seed && pm2-runtime ecosystem.config.js
