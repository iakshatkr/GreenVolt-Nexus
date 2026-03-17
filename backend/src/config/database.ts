import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { env } from './env.js';

type DatabaseMode = 'atlas' | 'memory' | 'disconnected';

const exampleMongoUri = 'mongodb+srv://username:password@cluster.mongodb.net/greenvolt-nexus';

let memoryServer: MongoMemoryServer | null = null;
let databaseMode: DatabaseMode = 'disconnected';

const shouldUseMemoryServer = () => {
  const uri = env.MONGODB_URI.trim();

  if (!uri || uri === exampleMongoUri) {
    return env.NODE_ENV !== 'production';
  }

  return false;
};

const resolveMongoUri = async () => {
  if (shouldUseMemoryServer()) {
    memoryServer ??= await MongoMemoryServer.create({
      instance: {
        dbName: 'greenvolt-nexus'
      }
    });
    databaseMode = 'memory';
    return memoryServer.getUri();
  }

  databaseMode = 'atlas';
  return env.MONGODB_URI;
};

export const connectDatabase = async () => {
  const mongoUri = await resolveMongoUri();
  await mongoose.connect(mongoUri);
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();

  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }

  databaseMode = 'disconnected';
};

export const getDatabaseStatus = () => {
  const readyStateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  } as const;

  return {
    mode: databaseMode,
    readyState: mongoose.connection.readyState,
    state:
      readyStateMap[mongoose.connection.readyState as keyof typeof readyStateMap] ?? 'unknown',
    databaseName: mongoose.connection.name || null
  };
};
