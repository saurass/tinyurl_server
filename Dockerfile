FROM node:12

MAINTAINER Saurabh Srivastava (saurass.in)
WORKDIR /tinyurl-server
COPY package*.json ./

RUN npm install
COPY . .

CMD ["node", "app.js"]