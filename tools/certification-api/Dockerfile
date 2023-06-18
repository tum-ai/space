# Install dependencies only when needed
FROM node:19-alpine3.17 AS base

ENV CHROME_BIN="/usr/bin/chromium-browser" \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"
RUN set -x \
    && apk update \
    && apk upgrade \
    && apk add --no-cache \
    udev \
    ttf-freefont \
    chromium

WORKDIR /app
    
COPY package.json package-lock.json ./

RUN yarn install --frozen-lockfile
RUN npm install -g puppeteer
RUN npm install

COPY . /app/

EXPOSE 80
ENV PORT 80

CMD ["npm", "run", "dev"]
