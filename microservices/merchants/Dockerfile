FROM node:18.16.0-alpine

# RUN npm install -g npm@9.6.7
RUN mkdir -p /var/www/gateway
WORKDIR /var/www/gateway
ADD . /var/www/gateway
RUN cp env-example .env
RUN npm install
RUN npm run migration:run
RUN npm run seed:run
CMD npm run build && npm run start:prod
