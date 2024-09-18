import jwt from '../modules/jwt.js';
import logger from '../modules/logger.js';


const isLoggedIn = async (req, res, next) => {
    let token = null;
    if (req.headers) {
        token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        // 토큰이 없는 경우
        return res.status(401).json({
            name: 'JsonWebTokenError',
            code: 401,
            message: '로그인 정보가 없습니다. 로그인 해주세요.'
        });
    }

    try {
        const decoded = await jwt.verify(token);

        // 토큰이 유효한 경우
        req.user = decoded;
        next();
    } catch (error) {
        // 토큰이 유효하지 않은 경우
        // logger.error(`${req.method} ${req.url} ${req.ip} ${error.name}`);
        res.status(error.code).json(error);
    }
};


// 일단 보류
const isNotLoggedIn = (req, res, next) => {
    const token = req.headers.authorization;

    if (token) {
        // 토큰이 있는 경우
        return res.status(400).json({
            name: 'JsonWebTokenError',
            code: 400,
            message: '이미 로그인한 상태입니다.'
        });
    }

    next();
};

export {
    isLoggedIn
}