FROM node:latest AS modules
WORKDIR /app
COPY package.json yarn.lock ./
RUN ["yarn", "install"]

FROM modules
WORKDIR /app
COPY . .
EXPOSE 3001/tcp
ENTRYPOINT ["node", "."]
