FROM node:8-alpine
MAINTAINER sumanta23

LABEL description="Docker file for cerberos server"

RUN mkdir -p /var/www/logs/
RUN mkdir -p /logs/
RUN mkdir -p /usr/src/
WORKDIR /usr/src/

ADD package.json /usr/src/package.json
RUN npm install --production --no-optional

ADD app.tar.gz /usr/src/

CMD ["node", "index.js"]


