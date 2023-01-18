# Install dependencies only when needed
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN yarn install --frozen-lockfile
RUN npm install
RUN npm install next

COPY . /app/

EXPOSE 3000

ENV PORT 3000

RUN npm install next
CMD ["npm", "run", "dev"]
