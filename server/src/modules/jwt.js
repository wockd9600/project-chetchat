import randToken from 'rand-token';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { initSocketInfo } from '../utils/redis.js';

dotenv.config();


const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const reLogin = (socket) => socket.emit('relogin');

const options = {
    algorithm: "HS256", // 해싱 알고리즘
    expiresIn: '15m', // 토큰 유효 기간
    issuer: "issuer" // 발행자
}

async function verify(token) {
    try {
        // req.decoded = jwt.verify(req.headers.authorization, JWT_SECRET_KEY);
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        return decoded;
    }
    catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw {
                name: 'TokenExpiredError',
                code: 419,
                message: '토큰이 만료되었습니다.'
            };
        }
        // 토큰의 비밀키가 일치하지 않는 경우
        else {
            throw {
                name: 'JsonWebTokenError',
                code: 402,
                message: '유효하지 않은 토큰입니다.'
            };
        }
    }
}

export default {
    sign: async (data) => {
        /* 현재는 idx와 email을 payload로 넣었지만 필요한 값을 넣으면 됨! */
        const payload = {
            id: data.id,
        };
        //sign메소드를 통해 access token 발급!
        return jwt.sign(payload, JWT_SECRET_KEY, options);
    },
    getRefreshToken: async () => {
        return randToken.uid(256);
    },
    verify,
    decode: (token) => {
        return jwt.decode(token);
    },
    verifyToken: async (socket, token, params) => {
        // const { TOKEN_ERROR } = require('../modules/error_codes');
        if (!token) {
            // await logErrorAndReLogin(TOKEN_ERROR.NOT_EXIST.CODE, TOKEN_ERROR.NOT_EXIST.MESSAGE);
            return false
        }
        try {
            const result = await verify(token);
            await initSocketInfo(result, socket.id);

            if (socket.user_id !== result.id) socket.user_id = result.id
            if (!socket.user_id) throw new Error('don\'t have user id');

            // console.log(result, params.event)
            // logger.info(`socket on ${params.event} (${result.id})`);

            return result;
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                reLogin(socket);
                // await logErrorAndReLogin(TOKEN_ERROR.INVALID.CODE, TOKEN_ERROR.INVALID.MESSAGE);
                return false

            } else if (error.name === 'TokenExpiredError') {
                if (!params.cnt) params.cnt = 0
                params.cnt += 1
                if (params.cnt > 3) return reLogin(socket);
                socket.emit('tokenExpired', params);
                return false;
            }
        }
    },
}