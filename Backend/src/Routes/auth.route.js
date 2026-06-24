const express = require("express");
const { Router } = express;
const { GetMe, UserResgistration, Userlogin, Userlogout } = require("../Controllers/auth.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");

const router = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */

router.post('/register', UserResgistration);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */

router.post('/login',Userlogin);


/**
 * @route Get/api/auth/logout
 * @desc Clear token from cookies and add token in blacklist
 * @access Public
 */

router.get('/logout', Userlogout);

/**
 * @route Get/api/auth/Get-me
 * @desc Get current logged in user details
 * @access Private
 */

router.get('/get-me', authMiddleware, GetMe);

module.exports = router;