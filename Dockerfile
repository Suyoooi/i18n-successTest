# 기본 이미지 설정
FROM node:21-alpine AS base

RUN npm install -g npm@10.4.0

# builder 이미지 정의
FROM base AS builder

RUN apk add --no-cache libc6-compat

ENV API_URL="http://192.168.10.7:50008"

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사
COPY package.json package-lock.json ./

# 빌더 이미지에서 파일 복사
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 빌드
RUN npm run build

# 환경 변수 설정
# ENV PORT $DEFAULT_PORT

# port 번호 변수로 받아서 설정
# EXPOSE $PORT
