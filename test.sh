#!/bin/bash

cp .env.testing ./src/express/.env
docker-compose run testing
