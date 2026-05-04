FROM node:20-slim

WORKDIR /app

RUN npm install -g expo-cli

COPY package.json .
RUN npm install

COPY . .

EXPOSE 8081

CMD ["npx", "expo", "start", "--web", "--non-interactive"]
