# Node.js 이미지 불러오기
FROM --platform=linux/amd64 node:18

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# Chrome 설치
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install -y google-chrome-stable

# package.json, package-lock.json 복사
COPY package*.json ./

# 의존성 모듈 설치
RUN npm ci


# 소스 복사
COPY . .

# 서버 실행
CMD [ "npm", "run", "start" ]