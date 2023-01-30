# Install dependencies only when needed
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
RUN yarn install
RUN yarn add next

COPY . /app/

EXPOSE 4000

ENV PORT 4000

CMD ["yarn", "dev"]
