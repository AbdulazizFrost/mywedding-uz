import { createApp } from './app.js';
import { env } from './config/env.js';
import { testDatabaseConnection } from './config/database.js';

const app = createApp();

app.listen(env.port, async () => {
  console.log(`[server] mywedding-api запущен на порту ${env.port} (${env.nodeEnv})`);
  await testDatabaseConnection();
});
