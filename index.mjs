import { serve } from '@hono/node-server';
import { app } from './server.mjs';

serve({ fetch: app.fetch, port: 3030 }, (addr) => {
    console.log(`Server started at ${addr.port}`);
});