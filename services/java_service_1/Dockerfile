FROM java:8
MAINTAINER jasongeng88@gmail.com
ENV TZ="Asia/Shanghai" HOME="/root"
WORKDIR ${HOME}
COPY ROOT.jar ${HOME}/ROOT.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "ROOT.jar"]