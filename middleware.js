
const {campgroundSchema , reviewSchema } = require('./schemas.js') ;
const campground  =require('./models/campGround') ;
const Review = require('./models/review') ;
const User = require('./models/user') ;
const ExpressError = require('./utils/ExpressError') ;



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const item = await campground.findById(id);
    if (!item.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id ,reviewId } = req.params;
    console.log(reviewId) ;
    const item = await Review.findById(reviewId);
    console.log(item) ;
    if (!item.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


module.exports.validateReview = (req,res,next) => {
    const {error}= reviewSchema.validate(req.body) ;
    console.log(error)
    if(error){
        const msg = error.details.map(el => el.message).join(',') ;
        throw  new ExpressError(msg , 400) ; 
    }else{
        next() ;
    }
}