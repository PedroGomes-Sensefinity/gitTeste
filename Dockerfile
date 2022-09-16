# Setup CLIENT
FROM node:14-alpine as client

WORKDIR /app/client/

RUN apk add --no-cache python3 py3-pip
COPY client/ ./
RUN npm install -qy
RUN npm run build

# Setup SERVER
FROM node:14-alpine as server
WORKDIR /app
COPY --from=client /app/client/build/ ./client/build/
WORKDIR /app/server/
COPY server/package*.json ./
RUN npm install -qy
COPY server/ ./
ENV PORT 8000
EXPOSE 8000
CMD ["npm", "start"]
