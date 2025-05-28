import { createApp } from "./app";
import { serve } from '@hono/node-server'

createApp().then((app) => {
    serve({ port: 3000, fetch: app.fetch });
    console.log('Server started');
});