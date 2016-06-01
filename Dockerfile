FROM daocloud.io/library/ubuntu:14.04
MAINTAINER yanze123 462865314@qq.com

RUN sed -i 's/archive/cn.archive/g' /etc/apt/sources.list

RUN apt-get update 
RUN mkdir -p /app
WORKDIR /app

RUN apt-get install -y xz-utils
ADD node-v6.1.0-linux-x64.tar.xz /app

#RUN tar Jxf node-v6.1.0-linux-x64.tar.xz
RUN ln -s /app/node-v6.1.0-linux-x64/bin/node /usr/bin
RUN ln -s /app/node-v6.1.0-linux-x64/bin/npm /usr/bin/npm
RUN npm config set registry=https://registry.npm.taobao.org

RUN mkdir -p /app/movietest/
ADD . /app/movietest/
WORKDIR /app/movietest/
RUN npm install
EXPOSE 4000
ENTRYPOINT ["node", "app.js"]