'use strict';

import express from 'express';

import { isLoggedIn } from '../middlewares/authMiddleware.js';

import UsersController from '../controllers/UsersController.js';
const controller = new UsersController();

const router = express.Router();


/* GET */
// router.get('/init', isLoggedIn, (req, res, next) => controller.init(req, res));
router.get('/profile/:email', isLoggedIn, (req, res, next) => controller.getProfile(req, res));
router.get('/blockList', isLoggedIn, (req, res, next) => controller.getBlockList(req, res));
router.get('/search', isLoggedIn, (req, res, next) => controller.searchForAddingFriends(req, res));


/* POST */
router.post('/friends', isLoggedIn, (req, res, next) => controller.addFriends(req, res));
router.post('/block', isLoggedIn, (req, res, next) => controller.addBlockUser(req, res));
router.post('/report', isLoggedIn, (req, res, next) => controller.reportUser(req, res));



/* PUT */
router.put('/profile', isLoggedIn, async (req, res, next) => controller.updateUserProfile(req, res));
router.put('/settings', isLoggedIn, async (req, res, next) => controller.updateUserSettings(req, res));
router.put('/friends', isLoggedIn, (req, res, next) => controller.updateFriends(req, res));
router.put("/notification", isLoggedIn, (req, res, next) => controller.toggleNotificationSubscription(req, res));



/* DELETE */
router.delete('/block', isLoggedIn, (req, res, next) => controller.deleteBlockUser(req, res));
router.delete('/account', isLoggedIn, (req, res, next) => controller.deleteUserAcoount(req, res));




export default router;