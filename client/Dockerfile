FROM node:14-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci -qy
COPY . .
EXPOSE 8080
CMD ["npm", "build"]

# Image used for development