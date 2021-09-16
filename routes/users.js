const express = require('express') ;
const router = express.Router() ;
const User = require('../models/user') ;
const passport = require('passport') ;
const catchAsync = require('../utils/catchAsync') ;
const { request } = require('express');
const {
    renderRegister , 
    registerUser ,
    renderLogin ,
    logIn ,
    logOut
} = require('../controllers/users') ;


router.route('/register')
    .get( renderRegister)
    .post( catchAsync(registerUser)) 


router.route('/login')
    .get( renderLogin ) 
    .post( passport.authenticate('local' , {failureFlash : true  ,failureRedirect : '/login' }) , logIn)

router.get('/logout' , logOut) ;

module.exports  = router ;
