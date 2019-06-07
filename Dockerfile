FROM node:8-alpine

ENV ADDICT_VERSION 1.0.4
ENV SRC_URL https://github.com/steelburn/addict.git
EXPOSE 3000
ENTRYPOINT [ "/usr/local/bin/addict" ]

RUN apk update && apk add git && npm install $SRC_URL -g \
        && npm cache clear --force
