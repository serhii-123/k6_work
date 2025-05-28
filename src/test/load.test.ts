import http, { RefinedResponse, ResponseType } from 'k6/http';
import { check, sleep } from 'k6';

type resType = RefinedResponse<ResponseType>;

export const options = {
    stages: [
        { duration: '10s', target: 10 },
    ],
    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<100']
    },
};

export default function () {
    const checkOptions = {
        'status is 200': (r: resType) => r.status === 200,
        'response is fast': (r: resType) => r.timings.duration < 100
    };
    const headers = { 'Content-Type': 'application/json' };
    const orderReqBody = {
        email: 's@i.ua',
        item: 'Pillow',
        qty: 5,
        price: 50.05
    };
    const orderRes = http.post(
        'http://localhost:3000/api/order',
        JSON.stringify(orderReqBody),
        { headers }
    );

    check(orderRes, checkOptions);

    if(!orderRes.body || orderRes?.body instanceof ArrayBuffer) return; 

    sleep(1);

    const orderId: string = JSON.parse(orderRes?.body).orderId;
    const payRes = http.post(`http://localhost:3000/api/order/${orderId}/pay`);

    check(payRes, checkOptions);
    sleep(1);
    
    const revenueRes = http.get('http://localhost:3000/api/revenue');

    check(revenueRes, checkOptions);
    sleep(1);
}