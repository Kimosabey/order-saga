const API_URL = 'http://localhost:3001';

export const createOrder = async (orderData: { userId: string; item: string; price: number }) => {
    const res = await fetch(`${API_URL}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
    });
    return res.json();
};

export const getOrderStatus = async (orderId: string) => {
    const res = await fetch(`${API_URL}/order/${orderId}`);
    return res.json();
};