FROM node:20-slim as dependencies

WORKDIR /app
COPY . /app

RUN npm install pm2 -g
RUN npm install --silent
RUN npx prisma generate
RUN npm run build

RUN chmod +x ./entrypoint.sh

COPY tsconfig.json .env* /app/dist/

ENTRYPOINT [ "/bin/sh", "./entrypoint.sh" ]
