FROM node:22-slim

WORKDIR /app

# ติดตั้ง openssl (แก้ปัญหา Prisma)
RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

# copy เฉพาะ package ก่อนเพื่อ cache
COPY package*.json ./

RUN npm install

# COPY . .

# EXPOSE 3300