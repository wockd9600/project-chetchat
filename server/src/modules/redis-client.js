// redis-client.js
import { createClient } from 'redis';

// {  url: 'redis://alice:foobared@awesome.redis.server:6380'}
const client = createClient();

client.on('error', err => console.log('Redis Client Error', err));
client.on('connect', () => console.log('Redis Client Connected'));


client.connect();
export default client;