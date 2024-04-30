FROM node:18.16.0-alpine

# RUN npm install -g npm@9.6.7
RUN mkdir -p /var/www/gateway
WORKDIR /var/www/gateway
ADD . /var/www/gateway
RUN npm install
CMD npm run build && npm run start:prod
