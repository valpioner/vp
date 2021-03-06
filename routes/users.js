const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

// Register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        isAdmin: req.body.isAdmin
    });

    User.addUser(newUser, (err, user) => {
        if (err) {
            res.json({success: false, msg: 'Failed to register user'});
        } else {
            res.json({success: true, msg: 'User registered'});
        }
    });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    
    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({success: false, msg: 'User not found'});
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({data: user}, config.secret, {
                    expiresIn: 604800 // 1 week
                });

                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        isAdmin: user.isAdmin
                    }
                })
            } else {
                return res.json({success: false, msg: 'Wrong password'});
            }
        });
    });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
});

// GetAll
router.get('/getAllUsers', (req, res, next) => {
    User.find((err, users) => {
        if (err) {
            res.json({success: false, msg: 'Failed to get all users'});
        } else {
            res.json({users});
        }
    });
});

// Get by id
router.get('/:id', (req, res, next) => {
    console.log(req.params);
    User.getUserById(req.params.id, (err, user) => {
        if (err) {
            console.log(err);
            res.json({success: false, msg: 'Failed to get all users'});
        } else {
            console.log('susscess');
            res.json({user});
        }
    });
});

// Update
router.put('/update', (req, res, next) => {
    console.log('updating');
    console.log(req.params);
    console.log(req.body);
    User.updateUser(req.body, (err, user) => {
        if (err) {
            console.log(err);
            res.json({success: false, msg: 'Failed to get all users'});
        } else {
            console.log('susscess');
            res.json({user});
        }
    });
});

// Delete by id
router.post('/delete', (req, res, next) => {
    let id = req.body.id;
    User.delete(id, (err) => {
        if (err) {
            res.json({success: false, msg: 'Failed to delete user'});
        } else {
            res.json({success: true, msg: 'User deleted'});
        }
    });
});

module.exports = router;