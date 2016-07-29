FROM pablozaiden/typescript:onbuild

# Install docker
RUN curl -sSL https://get.docker.com/ | sh && \
    curl -L https://github.com/docker/compose/releases/download/1.8.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose && \
    chmod +x /usr/local/bin/docker-compose

ENV NODE_ENV=development

EXPOSE 3000
ENTRYPOINT node app.js