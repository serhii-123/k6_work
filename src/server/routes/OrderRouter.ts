import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator';
import OrderModel from "../models/OrderModel";
import { createOrderBodySchema, payOrderParamSchema } from "../schemas/order.schema";

export class OrderRouter {
    constructor(private service: OrderModel) {}

    routes(): Hono {
        const app = new Hono();

        app.post(
            '/order',
            zValidator('json', createOrderBodySchema),
            async c => {
                try {
                    const { email, item, qty, price } = c.req.valid('json');
                    const orderId = await this.service.createOrder(email, item, qty, price);

                    return c.json({ orderId });
                } catch(e) {
                    console.log(e);
                }
            }
        );

        app.post(
            '/order/:id/pay',
            zValidator('param', payOrderParamSchema),
            async c => {
                try {
                    const { id } = c.req.valid('param');
                    const payed = await this.service.payOrder(id);
                    
                    return c.json({ payed });
                } catch(e) {
                    console.log(e);
                }
            }
        );

        app.get(
            '/revenue',
            async c => {
                try {
                    const revenue = await this.service.calculateRevenue();
                    
                    return c.json({ revenue });
                } catch(e) {
                    console.log(e);
                }
            }
        );

        return app;
    }
}