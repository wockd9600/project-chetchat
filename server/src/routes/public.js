'use strict';

import express from 'express';

import { isLoggedIn } from '../middlewares/authMiddleware.js';

import PublicController from '../controllers/PublicController.js';
const controller = new PublicController();

const router = express.Router();


/* GET */
// router.get('/init', isLoggedIn, (req, res, next) => controller.init(req, res));
router.get('/room/stats', isLoggedIn, (req, res, next) => controller.getVisitAndQuestionCount(req, res));
router.get('/room/:room_uuid', (req, res, next) => controller.initPublicRoom(req, res));
router.get('/room/:room_uuid/page', (req, res, next) => controller.getMessageInPublicRoom(req, res));
router.get('/room/setting/block-words', isLoggedIn, (req, res, next) => controller.getBlockWorlds(req, res));


/* POST */
router.post('/room/message', (req, res, next) => controller.sendMessage(req, res));
router.post('/room/imageMessage', isLoggedIn, (req, res, next) => controller.sendMessageOfImageType(req, res));
router.post('/room/setting/block-words', isLoggedIn, (req, res, next) => controller.addBlockWorlds(req, res));



/* PUT */
router.put('/room/setting', isLoggedIn, (req, res, next) => controller.updatePublicRommSettings(req, res));



/* DELETE */
router.delete('/room/message', isLoggedIn, (req, res, next) => controller.deleteMessage(req, res));
router.delete('/room/message/all', isLoggedIn, (req, res, next) => controller.deleteMessageAll(req, res));
router.delete('/room/setting/block-words', isLoggedIn, (req, res, next) => controller.deleteBlockWorlds(req, res));




export default router;