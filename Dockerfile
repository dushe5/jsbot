FROM node:16-alpine AS build
WORKDIR /app
COPY package*.json .env ./
RUN npm install
COPY . /app

FROM node:16-alpine
WORKDIR /app
COPY --from=build /app ./
CMD ["src/main.js"]
