'use strict';

import express from 'express';

import { isLoggedIn } from '../middlewares/authMiddleware.js';

import ChatController from '../controllers/ChatController.js';
const controller = new ChatController();

const router = express.Router();


/* GET */
// router.get('/init', isLoggedIn, (req, res, next) => controller.init(req, res));
router.get('/', isLoggedIn, (req, res, next) => controller.getChatRoomList(req, res));
router.get('/room/:room_uuid', isLoggedIn, (req, res, next) => controller.initChatRoom(req, res));
router.get('/room/:room_uuid/page', isLoggedIn, (req, res, next) => controller.getMessageInChatRoom(req, res));
// req.app.get("io").sockets.adapter.rooms.get(roomId).size)


/* POST */
router.post('/room/message', isLoggedIn, (req, res, next) => controller.sendMessage(req, res));
router.post('/room/imageMessage', isLoggedIn, (req, res, next) => controller.sendMessageOfImageType(req, res));
router.post('/room/new', isLoggedIn, (req, res, next) => controller.createChatRoom(req, res));


/* PUT */


/* DELETE */
router.delete('/room/message', isLoggedIn, (req, res, next) => controller.deleteMessage(req, res));
router.delete('/room/:room_uuid', isLoggedIn, (req, res, next) => controller.deleteChatRoom(req, res));




export default router;