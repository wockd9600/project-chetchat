import redisClient from '../modules/redis-client.js';

export const initSocketInfo = async (user, socket_id) => {
    const data = await redisClient.get(`socket-${user.id}`);

    if (!data || JSON.parse(data).id !== socket_id) {
        const newData = { id: socket_id, location: 'lobby' };
        await redisClient.set(`socket-${user.id}`, JSON.stringify(newData), 'EX', 60 * 60 * 24);
    } else {
        await redisClient.expire(`socket-${user.id}`, 60 * 60 * 24);
    }
}

export const setSocketInfo = async (user, socket_id, location) => {
    const newData = { id: socket_id, location };
    await redisClient.set(`socket-${user.id}`, JSON.stringify(newData), 'EX', 60 * 60 * 24);
}