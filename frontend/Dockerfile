FROM node:25-alpine

COPY frontend/package.json frontend/package-lock.json ./
RUN npm install -g
RUN rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]