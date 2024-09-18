'use strict';

class UsersController {
    /* GET */
    async getProfile(req, res) {
        
    }

    async searchForAddingFriends(req, res) {
        
    }



    /* POST */
    async addFriends(req, res) {
        
    }

    async addBlockUser(req, res) {
        
    }

    async reportUser(req, res) {
        
    }



    /* UPDATE */
    async updateUserSettings(req, res) {
        const user = req.user;
        const { property } = req.body;

        try {
            if (!isValidObject(property) || !isValidParam(property.key) || !isValidParam(property.value)) throw new Error('Invalid parameter');

            const sanitizedKey = sanitizeHtml(property.key);
            const sanitizedValue = typeof property.value === 'boolean' ? property.value : sanitizeHtml(property.value);


            if (sanitizedKey === 'friend_request') {
                if (typeof sanitizedValue !== 'boolean')
                    throw new Error('Invalid type of friend_request key');

            } else if (sanitizedKey === 'direct_message') {
                if (isNaN(sanitizedValue) || sanitizedValue < 0 || sanitizedValue > 2)
                    throw new Error('Invalid type of direct_message key');

            } else {
                throw new Error('Invalid key');
            }

            const setUserSettingResult = await runQuery(pool, USER_QUERY['setUserSetting'], [{ [sanitizedKey]: sanitizedValue }, user.id]);


            return res.json({ success: true });
        } catch (error) {
            logger.error(`${req.method} ${req.url} (${user.id}) ${req.ip} ${property} ${error}`);
            return res.json({ error: true });
        }
    }

    async updateUserProfile(req, res) {
        const user = req.user;
        const { property } = req.body;

        await runTransaction(async (conn) => {
            if (!isValidObject(property) || !isValidParam(property.key) || !isValidParam(property.value)) return;
            // return handlerError(socket, user, data, SOCKET_ERROR.TOGGLE_MY_PROFILE.NOT_EXIST_PARAMS);

            const sanitizedKey = sanitizeHtml(property.key);
            const sanitizedValue = sanitizeHtml(property.value);


            if (sanitizedKey === 'nickname') {
                if (typeof sanitizedValue !== 'string' || sanitizedValue.length < 1 || sanitizedValue.length > 15)
                    throw new Error('Invalid type of nickname key');

            } else if (sanitizedKey === 'status_message') {
                if (typeof sanitizedValue !== 'string' || sanitizedValue.length < 1 || sanitizedValue.length > 30)
                    throw new Error('Invalid type of status_message key');

            } else if (sanitizedKey === 'image_url') {
                if (typeof sanitizedValue !== 'string' || sanitizedValue.length < 1)
                    throw new Error('Invalid type of image_url key');
            } else {
                throw new Error('Invalid key');
            }

            const setUserProfileResult = await runQuery(conn, USER_QUERY['setUserProfile'], [{ [sanitizedKey]: sanitizedValue }, user.id]);

            if (sanitizedKey === 'image_url') {
                const [temp] = await conn.query('UPDATE temporary_image SET ? WHERE image_url = ?', [{ is_complete: 1 }, sanitizedValue]);
            }


            return res.json({ success: true });
        }).catch(error => {
            logger.error(`${req.method} ${req.url} (${user.id}) ${req.ip} ${property} ${error}`);
            return res.json({ error: true, message: '프로필을 변경할 수 없습니다.' });
        });
    }

    async updateFriends(req, res) {
        const user = req.user;
        const { email, property } = req.body;

        try {
            if (!isValidParam(email) || !isValidObject(property) || !isValidParam(property.key) || !isValidParam(property.value)) throw new Error('Invalid parameter');

            const sanitizedEmail = sanitizeHtml(email);

            const sanitizedKey = sanitizeHtml(property.key);
            let sanitizedValue = typeof property.value === 'boolean' ? property.value : sanitizeHtml(property.value);


            const [getUserIDForEmailResult] = await runQuery(pool, USER_QUERY['getUserIDForEmail'], [sanitizedEmail]);
            const frinend_id = getUserIDForEmailResult.id;


            // 1. 친구인지 확인
            const getRelationshipResult = await runQuery(pool, USER_QUERY['getRelationship'], [user.id, frinend_id, user.id, frinend_id]);
            if (getRelationshipResult[0].result !== 2) throw new Error('not friends');


            if (sanitizedKey === 'bookmarked') {
                if (typeof sanitizedValue !== 'boolean')
                    throw new Error('Invalid type of bookmarked key');

            } else if (sanitizedKey === 'friend_name') {
                if (typeof sanitizedValue !== 'string' || sanitizedValue.length < 1 || sanitizedValue.length > 15)
                    throw new Error('Invalid type of friend_name key');

                if (sanitizedValue === '!cbfus$q@') sanitizedValue = null;

            } else {
                throw new Error('Invalid key');
            }



            // 2. 친구 값 변경
            const setFriendshipsResult = await runQuery(pool, USER_QUERY['setFriendships'], [{ [sanitizedKey]: sanitizedValue }, user.id, frinend_id]);

            return res.json({ success: true });
        } catch (error) {
            logger.error(`${req.method} ${req.url} (${user.id}) ${req.ip} ${property} ${error}`);
            return res.json({ error: true });
        }
    }

    async toggleNotificationSubscription(req, res) {
        const user = req.user;
        const { device_token } = req.body;

        try {
            // device_token이 없으면 구독 불가
            if (!device_token) {
                // 이미 구독 중이면 구독 해제
                const setUserSettingResult = await runQuery(pool, USER_QUERY['setUserSetting'], [{ notification: false, device_token: null }, user.id]);
                return res.json({ success: true, notification: false });
            } else {
                // 구독 중이 아니면 구독
                const setUserSettingResult = await runQuery(pool, USER_QUERY['setUserSetting'], [{ notification: true, device_token: JSON.stringify(device_token) }, user.id]);
                return res.json({ success: true, notification: true });
            }

            // const notificationData = {
            //     messageType: "info",
            //     title: "Pill my rhythm",
            //     body: "영양제 스케줄 알림 기능을 활성화합니다.",
            //     tag: 'message-group-2',
            //     // 모바일에서는 tag값에 renotify를 한번 줘보세요. 그럼 갱신될 때 알아차리기 수월합니다.
            //     vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40, 500],
            //     // sound: '/demos/notification-examples/audio/notification-sound.mp3',
            // };

            // // 구독이 완료되면 알림 기능을 활성화한다는 Push 알림을 전송한다.
            // webpush.sendNotification(device_token, JSON.stringify(notificationData)).catch((error) => {
            //     console.error(error);
            //     throw new HttpException(500, error);
            // });
        } catch (error) {
            logger.error(`${req.method} ${req.url} (${user.id}) ${req.ip} ${error}`);
            return res.status(500).json({ error: 'Failed to register notification' });
        }

    }


    /* DELETE */
    async deleteBlockUser(req, res) {
        const user = req.user;
        const { id } = req.body;

        try {
            if (!isValidParam(id)) throw new Error('Invalid parameter');

            const sanitizedID = !isNaN(id) ? parseInt(id) : sanitizeHtml(id);


            if (typeof sanitizedID === 'number') {
                const deleteBlockedUserForIDResult = await runQuery(pool, USER_QUERY['deleteBlockedUserForID'], [user.id, sanitizedID]);
            } else {
                const deleteBlockedUserForUUIDResult = await runQuery(pool, USER_QUERY['deleteBlockedUserForUUID'], [user.id, sanitizedID]);
            }

            return res.json({ success: true });
        } catch (error) {
            logger.error(`${req.method} ${req.url} (${user.id}) ${req.ip} ${id} ${error}`);
            return res.json({ error: true });
        }
    }

    async deleteUserAcoount(req, res) {
        const user = req.user;
        if (!user || !user.id) return res.json({ error: true });

        try {
            const [deleteUser] = await pool.query(LOGIN_QUERY['setRefreshToken'], [{ status: 1 }, user.id]);

            return res.json({ success: true });
        } catch (error) {
            logger.error(`${req.method} ${req.url} (${user.id}) ${req.ip} ${error}`);
            return res.json({ error: true });
        }
    }
}

export default UsersController;