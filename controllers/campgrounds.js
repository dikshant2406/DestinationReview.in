const campground = require('../models/campGround') ;
const cloudinary = require("../cloudinary") ;
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding") ;
const mapBoxToken = process.env.MAPBOX_TOKEN ;
const geocoder = mbxGeocoding({accessToken : mapBoxToken}) ;

module.exports.index = async (req ,res) => {
    const item = await campground.find({}) ;
    res.render('./campgrounds/index', {item}) ;
} 

module.exports.newCampgroundForm = (req, res) => {
    res.render("./campgrounds/new") ;
} ;

module.exports.newCampground = async (req ,res , next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location , 
        limit: 1
    }).send() ;
    const newcamp = new campground( (req.body.campground)) ;
    newcamp.geometry = geoData.body.features[0].geometry ;
    newcamp.images = req.files.map(f => ({url : f.path , filename : f.filename})) ;
    newcamp.author = req.user._id ;
    await newcamp.save() ;
    console.log(newcamp) ;
    req.flash('success' , 'New Campground sucessfully created') ;
    res.redirect(`/campgrounds/${newcamp._id}`) ;
}

module.exports.showCampground = async (req ,res) => {
    console.log("hey yo") ;
    const item = await campground.findById(req.params.id).populate({
        path : 'reviews' , 
        populate : {
            path : 'author'
        }
    }).populate('author') ; 
    // console.log(item) ;
    if(!item){
        req.flash('error' , 'Campground Not found') ;
        res.redirect('/campgrounds') ;
    }
    res.render('./campgrounds/show' , {item}) ;
}

module.exports.editCampground = async (req ,res) => {
    const {id} = req.params ;
    const item = await campground.findById(id) ;
    
    if(!item){
        req.flash('error' , 'Campground Not found') ;
        res.redirect('/campgrounds') ;
    }
    res.render('campgrounds/edit' , {item}) ;
}

module.exports.updateCampground = async (req ,res)  => {
    const {id} = req.params ;
    const item = await campground.findByIdAndUpdate( id , {...req.body.campground} ) ;
    const images =  req.files.map(f => ({url : f.path , filename : f.filename}))  ;
    item.images.push(...images) ;
    await item.save() ;
    if(req.body.deleteImages){
        for(let  i of req.body.deleteImages){
            await cloudinary.uploader.destroy(i) ;
        }
        await item.updateOne({$pull : {images : {filename : {$in: req.body.deleteImages }}}}) ;
        console.log(item) ;
    }
    req.flash('success' , 'Successfully updated') ;
    res.redirect(`/campgrounds/${item._id}`) ;
 }

module.exports.deleteCampground = async (req ,res) => {
    const {id} = req.params ;
    const camp = await campground.findById(id) ;
    if(!camp.author.equals(req.user._id)){
        req.flash('error' , "you dont have permission to DELETE") ;
        return res.redirect(`/campgrounds/${id}`)
    }
    req.flash('success' , `${camp.title} deleted !`)
    await campground.findByIdAndDelete( id ) ;
    res.redirect('/campgrounds')
} 