const express = require('express') ;
const router = express.Router( { mergeParams : true })  ;
const catchAsync = require('../utils/catchAsync') ;
const campground = require('../models/campGround');
const Review = require('../models/review') ;
const ExpressError = require('../utils/ExpressError') ;
const { reviewSchema } = require('../schemas.js') ;
const {validateReview , isLoggedIn , isReviewAuthor } = require('../middleware') ;
const {postReview , deleteReview} = require('../controllers/reviews') ;

router.post('/' , isLoggedIn ,validateReview , catchAsync( postReview )) 
router.delete('/:reviewId' , isLoggedIn , isReviewAuthor, catchAsync( deleteReview )) ;

module.exports = router ;