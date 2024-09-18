import { socketEmit } from '@/utils/socket.js';

export default {
    methods: {
        async $socketEmit(name, data) {
            return socketEmit(name, data);
        },
    }
}