/**
 * local server entry file, for local development
 */

import { createServer } from 'node:http';
import app, { setupApolloServer } from './app.js';

/**
 * start server with port
 */
const PORT = process.env.PORT || 3001;

const httpServer = createServer(app);

// Setup Apollo Server
setupApolloServer(app, httpServer).then(() => {
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready on port ${PORT}`);
    console.log(`🚀 GraphQL endpoint: http://localhost:${PORT}/graphql`);
  });
});

/**
 * close server
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
