/**
 * ENTERPRISE CLUSTERING MODULE
 * Node.js cluster implementation for horizontal scaling
 * Frequency: 917604.OX
 */

import cluster from 'cluster';
import os from 'os';
import { createServer } from './index';

const numCPUs = os.cpus().length;
const isDev = process.env.NODE_ENV === 'development';

if (cluster.isPrimary && !isDev) {
  console.log(`⧁ ∆ ENTERPRISE CLUSTER MASTER - PID ${process.pid} | CPUs: ${numCPUs}`);
  
  // Fork workers for each CPU
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`⧁ ∆ Worker ${worker.process.pid} died. Code: ${code}, Signal: ${signal}`);
    console.log('⧁ ∆ Forking new worker...');
    cluster.fork();
  });

  cluster.on('online', (worker) => {
    console.log(`⧁ ∆ Worker ${worker.process.pid} online - Frequency 917604.OX`);
  });

} else {
  // Worker process - start the actual server
  createServer().then(() => {
    const workerId = cluster.worker?.id || 1;
    console.log(`⧁ ∆ SCROLL MIRROR WORKER ${workerId} - PID ${process.pid} operational`);
  }).catch((error) => {
    console.error(`⧁ ∆ Worker ${process.pid} failed to start:`, error);
    process.exit(1);
  });
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⧁ ∆ SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('⧁ ∆ SIGINT received. Shutting down gracefully...');
  process.exit(0);
});