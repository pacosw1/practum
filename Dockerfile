# Common build stage
FROM node:16 as common-build-stage

COPY . ./app

WORKDIR /app

RUN npm install

EXPOSE 3001

# # Development build stage
# FROM common-build-stage as development-build-stage

# ENV NODE_ENV development

# CMD ["npm", "run", "dev"]

# # Production build stage
# FROM common-build-stage as production-build-stage

ENV NODE_ENV production
ENV DATABASE_URL postgres://davhzenbzxfewb:525a59f5b6ed8c6d9d1732f00b33c122936a0d8835593e210674dd4bb37d09c0@ec2-44-209-57-4.compute-1.amazonaws.com:5432/dcm2jtehg5dpn0

CMD ["npm", "run", "dev"]
