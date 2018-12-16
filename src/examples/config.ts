import { config as configDotEnv } from 'dotenv';

configDotEnv({ debug: process.env.DEBUG as any });

export const projectsDir = process.env.PROJECTS_DIR || `${process.env.HOME}/dev/projects`;
export const api = {
  host: process.env.HOST || 'localhost',
  port: +(process.env.PORT || 8008),
  routes: { cors: { origin: ['*'] } },
};

export const storage = {
  mongodbUri: process.env.MONGODB_URL || 'mongodb://localhost:27017/incubator',
};

export const hostname = process.env.HOSTNAME || 'hakier.it';
