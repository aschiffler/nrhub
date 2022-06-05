ARG NODE_VERSION=14
ARG OS=alpine3.12

#### Stage BASE ########################################################################################################
FROM node:${NODE_VERSION}-${OS} AS base

# Install tools, create Node-RED app and data dir, add user and set rights
RUN set -ex && \
    apk add --no-cache \
        bash \
        tzdata \
        iputils \
        curl \
        nano \
        git \
        openssl \
        openssh-client \
        ca-certificates && \
    deluser --remove-home node && \
    adduser -h /home/vlab-user -D -H vlab-user -u 1000 && \

USER node-red
RUN mkdir -p /home/vlab-user/node-red
WORKDIR /home/vlab-user/node-red

# Env variables
ENV NODE_PATH=/usr/src/node-red/node_modules \
    PATH=/usr/src/node-red/node_modules/.bin:${PATH} \
    FLOWS=flows.json

ENTRYPOINT ["npm", "--no-update-notifier", "--no-fund", "start", "--prefix","/usr/src/node-red"]
