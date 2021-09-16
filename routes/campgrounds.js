const express = require('express') ;
const router = express.Router() ;
const catchAsync = require('../utils/catchAsync') ;
const ExpressError = require('../utils/ExpressError') ;
const campground = require('../models/campGround');
const {campgroundSchema , reviewSchema } = require('../schemas.js') ;
const Review = require('../models/review') ;
const {isLoggedIn , isAuthor , validateCampground} = require('../middleware.js') ;
const multer = require('multer') ;
const {storage} = require('../cloudinary') ;
const upload = multer({storage}) ;


const { 
    index ,
    newCampgroundForm ,
    newCampground ,
    showCampground , 
    editCampground ,
    updateCampground , 
    deleteCampground 
    } = require('../controllers/campgrounds') ;

router.route('/')
    .get( catchAsync(index) ) 
    .post( isLoggedIn , upload.array('image') , validateCampground , catchAsync(newCampground)) 


router.get("/new" , isLoggedIn , newCampgroundForm )

router.route('/:id')
    .get( catchAsync(showCampground))
    .put( isLoggedIn , isAuthor ,upload.array('image') , validateCampground , catchAsync(updateCampground)) 
    .delete( isLoggedIn , isAuthor , catchAsync(deleteCampground)) 

router.get('/:id/edit' , isLoggedIn , isAuthor , catchAsync(editCampground)) ;




module.exports = router ;