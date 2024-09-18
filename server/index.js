import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import multer from 'multer';
import session from "express-session"
import RedisStore from "connect-redis"
import dotenv from 'dotenv';

import { fileTypeFromBuffer } from 'file-type';

import { isLoggedIn } from './src/middlewares/authMiddleware.js';

import pool from './src/sql/index.js';
import jwt from './src/modules/jwt.js';
import redisClient from './src/modules/redis-client.js';
import logger from './src/modules/logger.js';


const app = express();

dotenv.config();

const storage = multer.memoryStorage(); // 또는 다른 storage 옵션 사용
const upload = multer({ storage: storage });

import indexRouter from './src/routes/index.js';
import usersRouter from './src/routes/users.js';
import chatRouter from './src/routes/chat.js';
import publicRouter from './src/routes/public.js';
import blindRouter from './src/routes/blind.js';
import authRouter from './src/routes/service.js';

import { uploadFile } from './src/modules/aws-s3.js';


const corsOption = {
    origin: '*', // 클라이언트 주소
    credentials: true // true로 하면 설정한 내용을 response 헤더에 추가 해줍니다.
}

app.use(helmet());
app.use(cors(corsOption)); // CORS 미들웨어 추가

app.use(express.json({
    limit: '10mb',
}));


app.use(express.urlencoded({ extended: false }));

let redisStore = new RedisStore({
    client: redisClient,
    prefix: "myapp:",
})

app.use(
    session({
        store: redisStore,
        resave: false, // required: force lightweight session keep alive (touch)
        saveUninitialized: false, // recommended: only save session when data exists
        secret: process.env.SESSION_SECRET,
        cookie: { secure: false, sameSite: 'none', httpOnly: false },
    })
);


// 미들웨어 함수 정의
function addDeviceInfoToRequest(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    const userAgent = req.headers['x-custom-user-agent'];;

    const user = jwt.decode(token);
    const user_id = user ? user.id : -1;

    const ip = req.ip;

    let device = null;
    if (userAgent) {
        const deviceInfo = userAgent.match(/\(([^)]+)\)/);
        device = deviceInfo[1];
    }

    logger.info(`${req.method} ${req.url} (${user_id}) ${device} ${ip}`);
    next();
}

// 미들웨어를 모든 라우터에 적용
app.use(addDeviceInfoToRequest);



app.post('/upload', isLoggedIn, upload.single('file'), async (req, res) => {
    // const user = req.user;

    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).json({ error: '인증 실패: 토큰이 전송되지 않았습니다.' });


        const user = await jwt.verify(token);

        // 토큰도 보내야해
        const file = req.file;

        // 파일의 MIME 타입 확인
        const mimeType = await fileTypeFromBuffer(file.buffer);

        if (!mimeType || (!mimeType.mime.startsWith('image/') && !mimeType.mime.startsWith('video/'))) {
            // 이미지 또는 동영상이 아닌 경우
            res.status(400).json({ error: 'Invalid file type. Please upload an image or a video.' });
            return;
        }


        const result = await uploadFile(file);
        const message_type = mimeType.mime.startsWith('image/') ? 1 : 2;

        // * ------------------------------------------------ *
        // *
        // * 발생했던 문제들
        // * 이미지를 보낼 때 에러가 발생하면 S3에는 저장되지만 DB엔 저장되지 않음
        // *
        // * ------------------------------------------------ *
        const [temp] = await pool.query('INSERT INTO temporary_image SET ?', [{ image_url: result }]);


        if (result) res.json({ url: result, message_type });
        else res.status(400).json({ error: 'Fail File uploading' });
    } catch (error) {
        logger.error(`${req.method} ${req.url} (${user.id}) ${req.ip} ${error}`);
        return res.status(500).json({ error: 'Failed to upload file' });
    }
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/chat', chatRouter);
app.use('/public', publicRouter);
app.use('/blind', blindRouter);
app.use('/service', authRouter);


import initSocket from './src/socket/index.js';

const ioServer = initSocket(app); // 서버에 소켓 io 장착

ioServer.listen(8000, () => {
    console.log('서버 시작');
});