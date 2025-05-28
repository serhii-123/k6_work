import { Hono } from 'hono';
import initDb from './db/db';
import OrderModel from './models/OrderModel';
import { OrderRouter } from './routes/OrderRouter';

export async function createApp() {
    const db = await initDb();
    const orderModel = new OrderModel(db);
    const orderRouter = new OrderRouter(orderModel);

    const app = new Hono();

    app.route('/api', orderRouter.routes());

    return app;
}