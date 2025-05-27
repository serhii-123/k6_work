import { Hono } from 'hono';
import { serve } from '@hono/node-server'

const app = new Hono();

app.get('/hello-world', async c => c.text('Hello world'));

serve({ port: 3000, fetch: app.fetch });