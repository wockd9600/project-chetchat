'use strict';

import express from 'express';

import { isLoggedIn } from '../middlewares/authMiddleware.js';

import IndexController from '../controllers/IndexController.js';
const controller = new IndexController();

const router = express.Router();


/* GET */
router.get('/init', isLoggedIn, (req, res, next) => controller.init(req, res));
router.get('/init-part', isLoggedIn, (req, res, next) => controller.initPart(req, res));
router.get('/ad', (req, res, next) => controller.ad(req, res));



export default router;