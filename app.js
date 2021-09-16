if(process.env.NODE_ENV !== "production"){
    require('dotenv').config() ;
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const campground = require('./models/campGround');
const methodOverride = require('method-override') ;
const morgan = require('morgan') ;
const ejsMate = require('ejs-mate') ;
const catchAsync = require('./utils/catchAsync') ;
const ExpressError = require('./utils/ExpressError') ;
const Joi = require('joi') ;
const {campgroundSchema , reviewSchema } = require('./schemas.js') ;
const Review = require('./models/review') ;
const session = require('express-session') ;
const flash = require('connect-flash') ;
const passport = require('passport') ;
const localStrategy = require('passport-local') ;
const User = require('./models/user') ;
const mongoSanitize = require('express-mongo-sanitize') ;

const userRoute = require('./routes/users') ;
const campgroundsRoute = require('./routes/campgrounds') ;
const reviewsRoute = require('./routes/reviews') ;


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true ,
    useUnifiedTopology: true , 
    useFindAndModify : false 
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("dataBase connected");
});
const app = express(); 
app.engine('ejs' , ejsMate) ;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended : true})) ;
app.use(methodOverride('_method')) ;
app.use(morgan('tiny'))
app.use(express.static(path.join(__dirname , 'public'))) ;
app.use(mongoSanitize()) ;


const sessionConfig = {
    name : 'session' ,
    secret : 'Somereallystrongsecretthisis' ,
    resave : false ,
    saveUninitialized : true , 
    cookie : {
        httpOnly : true ,
        expires : Date.now() + 1000*60*60*24*7 , 
        maxAge : 1000*60*60*24*7
    }
}

app.use(session(sessionConfig)) ;
app.use(flash()) ;

app.use(passport.initialize());
app.use(passport.session()) ;

app.use((req , res , next) => {
    res.locals.currentUser = req.user ;
    res.locals.success = req.flash('success') ;
    res.locals.error = req.flash('error') ;
    next() ;
})

passport.use(new localStrategy( User.authenticate())) ;
passport.serializeUser( User.serializeUser()) ;
passport.deserializeUser( User.deserializeUser()) ;


app.use('/campgrounds' , campgroundsRoute) ;
app.use('/campgrounds/:id/reviews' , reviewsRoute ) ;
app.use('/' , userRoute )

app.get('/fakeUser' , async (req ,res ) => {
    const user = new User({email : '89989@gmail.com' , username : 'uuuuuu989'}) ;
    const newUser = await User.register(user , 'chicken') ;
    console.log(user) ;
    res.send(newUser) ;
})


const validateCampground = (req ,res,next ) => {

    const {error}= campgroundSchema.validate(req.body) ;

    if(error){
        const msg = error.details.map(el => el.message).join(',') ;
        throw  new ExpressError(msg , 400) ; 
    }else{
        next() ;
    }
}

const validateReview = (req,res,next) => {
    const {error}= reviewSchema.validate(req.body) ;
    console.log(error)

    if(error){
        const msg = error.details.map(el => el.message).join(',') ;
        throw  new ExpressError(msg , 400) ; 
    }else{
        next() ;
    }
}

app.get('/', (req, res) => {
    res.render('home');
})



app.all('*' , ( req , res , next) => {
    next( new ExpressError('oh boy error' , 404)) ;
})

app.use((err , req , res , next) => {
    const {statusCode = 500} = err ;
    if(!err.message) err.message = "Page not found" ;
    res.status(statusCode).render('error' , {err}) ;
})


app.listen(3000, () => {
    console.log("listening from port 3000");
})