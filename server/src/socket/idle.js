import pool from "../sql/index.js";
import { user as USER_QUERY,
    blind as BLIND_ROOM_QUERY } from "../sql/query.js";

import redisClient from "../modules/redis-client.js";
import logger from "../modules/logger.js";

export default function (idle) {
    idle.on("connection", (socket) => {
        // ****************
        // *              *
        // * 발생했던 문제들  *
        // *              *
        // ****************
        socket.on("disconnect", async () => {
            const user_id = socket.user_id;
            if (!user_id) return;

            const socket_id_in_redis = await redisClient.get(`socket-${user_id}`);
            if (socket_id_in_redis) {
                await redisClient.del(`socket-${user_id}`);

                setTimeout(async () => {
                    const socket_id_in_redis = await redisClient.get(`socket-${user_id}`);
                    if (socket_id_in_redis) return;

                    try {
                        const getUserAnonymousResult = await runQuery(pool, USER_QUERY["getUserAnonymous"], [user_id]);
                        const user_uuid = getUserAnonymousResult[0].user_uuid;

                        await pool.query(BLIND_ROOM_QUERY["deleteMatchWaiting"], [user_uuid]);

                        const [getBlindInfoResult] = await pool.query(BLIND_ROOM_QUERY["getBlindInfo"], [user_uuid, user_uuid]);
                        if (getBlindInfoResult.length !== 0) {
                            const room_id = getBlindInfoResult[0].id;
                            await runQuery(pool, BLIND_ROOM_QUERY["leaveBlindRoom"], [{ status: 1 }, user_uuid, user_uuid]);

                            idle.to(`blind-room-${room_id}`).emit("leave blind room", user_uuid);
                        }
                    } catch (error) {
                        logger.error(`socket disconnect (${user_id}) ${error}`);
                    }
                }, 10000);
            }
        });

        socket.on("logout", async (params) => {});

        /*
         *
         *
         *
         *   USER
         *
         *
         *
         */

        /* INIT */
        socket.on("init", async (params) => {});

        /*
         *
         *
         *
         *   CHAT
         *
         *
         *
         */

        /* INIT */
        socket.on("initialize chat room", async (params) => {});

        socket.on("leave chat room", async (params) => {});

        /*
         *
         *
         *
         *   PUBLIC
         *
         *
         *
         */

        /* INIT */
        socket.on("initialize public room", async (params) => {});

        socket.on("leave public room", async (params) => {});

        /*
         *
         *
         *
         *   BLIND
         *
         *
         *
         */

        /* INIT */
        socket.on("initialize blind room", async (params) => {});

        socket.on("leave blind room", async (params) => {});

        /*
         *
         *
         *
         *   REPORT
         *
         *
         *
         */
        socket.on("report", async (params) => {});
    });
}
