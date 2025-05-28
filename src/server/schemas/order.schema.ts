import { z } from 'zod';

export const createOrderBodySchema = z.object({
    email: z.string().includes('@').min(5),
    item: z.string().min(1),
    qty: z.number().int().min(1),
    price: z.number().min(0.01)
});

export const payOrderParamSchema = z.object({
    id: z.preprocess(val => {
        if(typeof val === 'string') return Number(val);
        
        return val;
    }, z.number().min(1))
});