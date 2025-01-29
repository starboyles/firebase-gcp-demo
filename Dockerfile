
FROM node:17-alpine


WORKDIR /app


COPY package*.json ./


RUN npm install --only=production

COPY . .


ENV NODE_ENV=production


EXPOSE 3000


CMD ["npm", "start"]
