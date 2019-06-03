FROM node:10.16.0-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
ENV AWSCLI_VERSION "1.14.10"
RUN apk add --update \
    python \
    python-dev \
    py-pip \
    build-base \
    && pip install awscli==$AWSCLI_VERSION --upgrade --user \
    && apk --purge -v del py-pip \
    && rm -rf /var/cache/apk/*
WORKDIR /usr/src/app/api/nodejs-server
RUN npm install
EXPOSE 8080
CMD [ "npm", "start" ]