# Setup client
FROM node:14-alpine as client

WORKDIR /app/client/
COPY client/package*.json ./
RUN apk add --no-cache python3 py3-pip
RUN npm install -qy
COPY client/ ./
RUN npm run build