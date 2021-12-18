FROM node:16.13-bullseye-slim
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app/
COPY ./package*.json /usr/src/app/
RUN npm ci
COPY . /usr/src/app/

EXPOSE 3000

# start the app
CMD [ "npm", "start" ]
