const campground = require('../models/campGround');
const Review = require('../models/review') ;

module.exports.postReview = async (req, res) => {
    const camp = await campground.findById(req.params.id) ;
    const review = new Review(req.body.review) ;
    review.author = req.user._id ;
    camp.reviews.push(review) ;
    await review.save() ;
    await camp.save() ;
    req.flash('success' , 'New review posted') ;
    res.redirect(`/campgrounds/${req.params.id}`) ;
} 

module.exports.deleteReview = async (req , res ) => {
    const {id , reviewId} = req.params ;
    await campground.findByIdAndUpdate(id , {$pull : {reviews : reviewId}}) ;
    Review.findByIdAndDelete(reviewId) ;
    req.flash('success' , 'Successfully deleted') ;
    res.redirect(`/campgrounds/${id}`) ;
}