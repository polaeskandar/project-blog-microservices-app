FROM node:alpine

WORKDIR /app/event-bus
COPY package.json ./
RUN npm install
COPY ./ ./

CMD [ "npm", "start" ]