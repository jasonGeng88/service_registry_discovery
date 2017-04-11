FROM node:6.10.2
MAINTAINER jasongeng88@gmail.com
ENV TZ="Asia/Shanghai" HOME="/usr/src/app"
WORKDIR ${HOME}
COPY src/ ${HOME}/
RUN npm install
EXPOSE 8080
ENTRYPOINT ["npm", "run", "start"]