'use strict';

import express from 'express';

import { isLoggedIn } from '../middlewares/authMiddleware.js';

import BlindController from '../controllers/BlindController.js';
const controller = new BlindController();

const router = express.Router();


/* GET */
// router.get('/init', isLoggedIn, (req, res, next) => controller.init(req, res));
router.get('/', isLoggedIn, (req, res, next) => controller.initBlindRoom(req, res));


/* POST */
router.post('/message', isLoggedIn, (req, res, next) => controller.sendMessage(req, res));
router.post('/match', isLoggedIn, (req, res, next) => controller.startMatching(req, res));
router.post('/reqeust-be-friend', isLoggedIn, (req, res, next) => controller.requestToBeFriends(req, res));
router.post('/respond-be-friend', isLoggedIn, (req, res, next) => controller.respondToBeFriends(req, res));


/* PUT */


/* DELETE */
router.delete('/match', isLoggedIn, (req, res, next) => controller.stopMatching(req, res));




export default router;