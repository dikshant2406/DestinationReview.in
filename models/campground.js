const mongoose = require('mongoose');
const Review = require('./review') ;
const schema = mongoose.Schema;

// const ImageSchema = new schema({
//     url : String ,
//     filename  : String
// }) ;

// ImageSchema.virtual('thumbnail').get( function () {
//     return this.url.replace('/upload' , '/upload/w_200') ;
// }) ;

const opts = {toJSON : {virtuals : true} } ; 

const campgroundSchema = new schema({
    title: String,
    images : [
        {
            url : String ,
            filename : String 
        }
    ] , 
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    price: Number,
    description: String,
    location: String ,
    author : {
        type : schema.Types.ObjectId , 
        ref : 'User' 
    } ,
    reviews : [{
        type : schema.Types.ObjectId ,
        ref : 'Review'
    }]
} , opts ) ;

campgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href = "/campgrounds/${this._id}">${this.title}</a></strong>`

    // return "i AM POPUP" ;
}) ;

campgroundSchema.post( 'findOneAndDelete' , async function (doc) {
    if(doc){
        await Review.remove({
            _id : {
                $in : doc.reviews 
            }
        })
    }
})

module.exports = mongoose.model('campGround', campgroundSchema) ;