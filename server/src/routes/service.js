'use strict';


import express from 'express';
import sanitizeHtml from 'sanitize-html';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

import { isLoggedIn } from '../middlewares/authMiddleware.js';

import pool from '../sql/index.js';
import { runTransaction, runQuery } from '../utils/database.js';

import {
    login as LOGIN_QUERY,
    user as USER_QUERY,
    chat as CHAT_ROOM_QUERY,
    public_room as PUBLIC_ROOM_QUERY,
    log as LOG_QUERY,
} from '../sql/query.js';

import jwt from '../modules/jwt.js';
import logger from '../modules/logger.js';



const router = express.Router();

// router.post('/insert', async (req, res) => {
//     const { d } = req.body;

//     let conn
//     try {
//         const totalRecords = 10000;
//         const batchSize = 1000;

//         const totalBatches = Math.ceil(totalRecords / batchSize);


//         conn = await pool.getConnection();

//         for (let j = 0; j < totalBatches; j++) {
//             for (let i = 1; i <= batchSize; i++) {
//                 const recordNumber = j * batchSize + i;
//                 const name = `Trash Item ${recordNumber}`;
//                 const description = `Description for trash item ${recordNumber}`;

//                 // SQL 쿼리 실행
//                 conn.query(
//                     'INSERT INTO trash_data (name, description) VALUES (?, ?)',
//                     [name, description],
//                     (error, results, fields) => {
//                         if (error) {
//                             console.error('Error inserting data:', error);
//                         }
//                     }
//                 );
//             }

//             // 일괄 처리 커밋
//             conn.commit();
//             conn.beginTransaction();
//         }

//         // 마지막 일괄 처리
//         conn.commit();

//     } catch (error) {
//         conn.rollback();
//         console.log(error)
//     } finally {
//         conn.release();
//     }
// });


router.post('/signUp', async function (req, res, next) {
    const {
        email,
        pwd,
    } = req.body;

    let conn = null;

    try {
        const sanitizedEmail = sanitizeHtml(email).toLowerCase();
        const sanitizedPwd = sanitizeHtml(pwd);

        const regTypeForLoginId = /^[a-z0-9_]{5,20}$/;
        const regTypeForPwd = /^[A-Za-z0-9!@#$%^_]{7,20}$/;

        if (!(regTypeForLoginId.test(sanitizedEmail)) || !(regTypeForPwd.test(sanitizedPwd))) {
            logger.error(`${req.method} ${req.url} (${email}) ${req.ip} 회원가입 글자 수`);

            return res.status(200).json({
                code: 201,
                message: '아이디는 영문+숫자만 가능합니다.',
            });
        }

        conn = await pool.getConnection();

        await conn.beginTransaction();


        // check id duplication
        const [getUserEmail] = await conn.query(LOGIN_QUERY['getUser'] + ' ' + 'WHERE email = ?', [email]);

        if (getUserEmail.length !== 0) {
            return res.status(200).json({
                code: 201,
                message: '사용 중인 아이디입니다.',
            });
        }


        // pwd 암호화 처리
        const salt = crypto.randomBytes(16).toString('hex');
        const hashPassword = await bcrypt.hash(sanitizedPwd + salt, 14);


        // add user, user_profile, public_room table
        const [addUser] = await conn.query(LOGIN_QUERY['addUser'], [{ email: sanitizedEmail, pwd: hashPassword, salt }]);
        const user_id = addUser.insertId;
        if (!user_id) throw new Error('not user id')

        let public_room_uuid = uuidv4().split('-')[0];
        const [getPublicIDFoRUUIDResult] = await conn.query(PUBLIC_ROOM_QUERY['getPublicIDFoRUUID'], [public_room_uuid]);

        if (getPublicIDFoRUUIDResult.length != 0) {
            public_room_uuid = uuidv4().split('-')[0];
            const [getPublicIDFoRUUIDResult] = await conn.query(PUBLIC_ROOM_QUERY['getPublicIDFoRUUID'], [public_room_uuid]);
            if (getPublicIDFoRUUIDResult.length != 0) {
                public_room_uuid = uuidv4().split('-')[0];
            }
        }

        const [addPublicRoom] = await conn.query(LOGIN_QUERY['addPublicRoom'], [{ user_id, uuid: public_room_uuid }]);
        const public_room_id = addPublicRoom.insertId;
        if (!public_room_id) throw new Error('not public room id')


        const user_uuid = uuidv4();

        const userResult = await Promise.all([
            await conn.query(LOGIN_QUERY['addUserProfile'], [{ user_id, nickname: sanitizedEmail }]),
            await conn.query(LOGIN_QUERY['addUserSetting'], [{ user_id }]),
            await conn.query(LOGIN_QUERY['addUserAnonymous'], [{ user_id, user_uuid }]),
            await conn.query(LOGIN_QUERY['addPublicSetting'], [{ room_id: public_room_id }]),
        ]);

        const [addPublicMessageResult] = await conn.query(PUBLIC_ROOM_QUERY['addPublicMessage'], [{ room_id: public_room_id, content: '챗챗에 오신 걸 환영합니다!' }]);
        const public_message_id = addPublicMessageResult.insertId;

        const setPublicRoomResult = await conn.query(PUBLIC_ROOM_QUERY['setPublicRoom'], [{ last_message_id: public_message_id }, public_room_id]);


        await conn.commit();

        return res.status(200).json({
            code: 200,
            message: '회원가입 완료',
        });
    } catch (error) {
        logger.error(`${req.method} ${req.url} (${email}) ${req.ip} ${error}`);

        if (conn) await conn.rollback();
        return res.status(200).json({
            code: 202,
            message: error.message,
        });
    } finally {
        if (conn) conn.release();
    }
});


router.post('/login', async function (req, res, next) {
    const {
        email,
        pwd,
        device,
    } = req.body



    // must have id, pwd
    if (!email || !pwd) return;

    await runTransaction(async (conn) => {
        const sanitizedEmail = sanitizeHtml(email);
        const sanitizedPwd = sanitizeHtml(pwd);
        const sanitizedDevice = device ? sanitizeHtml(device) : 'mobile';


        // compare id
        const [getUserForEmail] = await conn.query(LOGIN_QUERY['getUser'] + ' ' + 'WHERE email = ?', [sanitizedEmail]);

        if (getUserForEmail.length === 0) {
            return res.status(200).json({
                code: 201,
                message: '아이디 또는 비밀번호를 확인해주세요.',
            });
        }

        if (getUserForEmail[0].status) {
            return res.status(200).json({
                code: 201,
                message: '탈퇴된 아이디입니다.',
            });
        }

        const user_id = getUserForEmail[0].id;




        // 비밀번호가 틀린 횟수 5회 이상이면 1분동안 로그인 불가
        const [latestLoginCount] = await conn.query(LOGIN_QUERY['getLoginAttemptCount'], [user_id]);

        if (latestLoginCount.length !== 0 && latestLoginCount[0].attempt >= 5) {
            const [lastLoginAttemptTime] = await conn.query(LOGIN_QUERY['getLastLoginAttemptTime'], [user_id]);
            const time_difference_in_minutes = lastLoginAttemptTime[0].time_difference_in_minutes;

            if (time_difference_in_minutes < 1) {
                return res.status(200).json({
                    code: 202,
                    message: '5회 이상 틀렸습니다. 잠시 후 다시 시도해 주세요.',
                });
            };
        }



        // compare pwd
        const dbPW = getUserForEmail[0].pwd;
        const salt = getUserForEmail[0].salt;
        // const hashPW = crypto.createHash("sha512").update(originalPassword + salt).digest("hex");

        const isPasswordMatch = await bcrypt.compare(sanitizedPwd + salt, dbPW);

        if (!isPasswordMatch) {
            const attempt = latestLoginCount.length !== 0 ? latestLoginCount[0].attempt : 0

            const [addLoginLog] = await conn.query(LOG_QUERY['login'], {
                user_id,
                ip: req.ip,
                device_type: sanitizedDevice,
                attempt: attempt + 1,
            });


            return res.status(200).json({
                code: 201,
                message: `아이디 또는 비밀번호를 확인해주세요. ${attempt + 1}회 틀렸습니다.`,
            });
        }



        // 토큰 발급, 리프레쉬 토큰을 저장한 db index 암호화
        const access_token = await jwt.sign({ id: user_id });
        const refresh_token = uuidv4();

        // 리프레쉬 토큰 설정
        const [tempResult] = await conn.query(LOGIN_QUERY['setRefreshToken'], [{ refresh_token }, user_id]);

        const [
            getMyInfoResult,
            getMySettingResult,
            getFriendsListResult,

            getPublicInfoResult,
            getMyPublicRoomForSettingResult,

            getChatRoomListResult
        ] = await Promise.all([
            await runQuery(conn, LOGIN_QUERY['getMyInfo'], [user_id]),
            await runQuery(conn, LOGIN_QUERY['getMySetting'], [user_id]),

            await conn.query(USER_QUERY['getFriendsList'], [user_id]),
            await runQuery(conn, LOGIN_QUERY['getPublicInfo'], [user_id]),
            await runQuery(pool, PUBLIC_ROOM_QUERY['getMyPublicRoomForSetting'], [user_id]),
            await conn.query(CHAT_ROOM_QUERY['getChatRoomList'], [user_id, 10, 0]),
        ]);


        // 로그인 완료하면 db에 저장
        const [addLoginLog] = await conn.query(LOG_QUERY['login'], {
            user_id,
            ip: req.ip,
            device_type: sanitizedDevice,
            result: 1,
            attempt: 0,
        });

        return res.status(200).json({
            code: 200,
            message: '로그인',
            token: access_token,
            index: refresh_token,

            myInfo: getMyInfoResult[0],
            mySetting: getMySettingResult[0],
            friendsList: getFriendsListResult[0],

            publicInfo: getPublicInfoResult[0],
            publicSetting: getMyPublicRoomForSettingResult[0],

            chatRoomList: getChatRoomListResult[0],
        });
    }).catch(error => {
        console.log(error);
        logger.error(`${req.method} ${req.url} (${email}) ${req.ip} ${error}`);

        return res.status(200).json({
            code: 202,
            message: error.message,
        });
    });
});

router.post('/logout', isLoggedIn, async function (req, res, next) {
    const user = req.user;

    await runTransaction(async (conn) => {
        // 로그아웃 하면 기록(?), 소켓 제거, 알림 제거
        const [
            setUserSettingResult,
            setRefreshTokenResult
        ] = await Promise.all([
            await runQuery(conn, USER_QUERY['setUserSetting'], [{ device_token: null }, user.id]),
            await conn.query(LOGIN_QUERY['setRefreshToken'], [{ refresh_token: null }, user.id]),
        ]);

        return res.status(200).json({ success: true });
    }).catch(error => {
        logger.error(`${req.method} ${req.url} (${email}) ${req.ip} ${error}`);

        return res.status(200).json({
            code: 202,
            message: error.message,
        });
    });
});

router.post('/refresh', async function (req, res, next) {
    const access_token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    const { refresh_token } = req.body;

    let user;
    await runTransaction(async (conn) => {
        if (!access_token || !refresh_token) throw new Error('not token');

        // access token에 담겨 있는 정보 가져오기
        user = jwt.decode(access_token);
        if (!user) throw new Error('not user');

        if (typeof user.id !== "number") throw new Error('invalid user id')


        const [getUserRefreshToken] = await conn.query(LOGIN_QUERY['getUser'] + ' ' + `where id = ?`, [user.id]);
        const db_refresh_token = getUserRefreshToken[0].refresh_token;


        // // access token에 담겨 있던 유저 id로 db에서 refresh token을 가져와서 유저가 가고 있는 refresh token하고 비교 해봄.
        if (refresh_token !== db_refresh_token) {
            logger.error(`${req.method} ${req.url} (${user ? user.id : 'not user'}) ${req.ip} invalid token`);
            return res.json({ code: 401 });
        }


        // 토큰으로 로그인을 유지할 때 아이피, 기기도 확인해야 함 다른 아이피, 기기에서 접속하면 로그아웃 시켜야함.
        // Refresh token 때만 비교하면 될 거 같은데
        // 근데 그럼 vpn 쓰면 바뀌네 => 보안이 더 중요함 내 실력에 둘 다 선택할 수는 없고 보안을 선택하자.
        // => vpn 뿐만 아니라 와이파이만 써도 바뀜. 그럼 일단 바꾸는 건 자제하자.
        // => 근데 로그인을 하면 토큰을 새로 발급하기 때문에 어차피 후자 방식으로 구현됨.

        // refresh token이 같다면 access token을 새로 발급 받는다.
        const new_access_token = await jwt.sign(user);
        const new_refresh_token = uuidv4();

        const [tempResult] = await conn.query(LOGIN_QUERY['setRefreshToken'], [{ refresh_token: new_refresh_token }, user.id]);

        // access token을 client로 보냄.
        return res.status(200).json({
            code: 200,
            message: '토큰이 재발급되었습니다.',
            token: new_access_token,
            index: new_refresh_token,
        });
    }).catch(error => {
        logger.error(`${req.method} ${req.url} (${user ? user.id : 'not user'}) ${req.ip} ${error}`);
        return res.json({ code: 401 });
    });
});

export default router;
