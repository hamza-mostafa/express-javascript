#!/bin/bash

cp .env.example .env
cp .env.example ./src/express/.env
docker-compose up -d
