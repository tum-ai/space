FROM node:20-alpine

WORKDIR /space

COPY . .

RUN cd app && apk add --no-cache make gcc g++ python3 py3-pip && \
    npm install && \
    npm rebuild bcrypt --build-from-source && \
    apk del make gcc g++ python3 py3-pip

WORKDIR /space/app

ENTRYPOINT ["sh", "entrypoint.sh"]