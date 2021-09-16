const User = require('../models/user') ;

module.exports.renderRegister = (req , res) => {
    res.render('user/register')
}

module.exports.registerUser = async (req, res , next ) => {
    try{
        const {email , username , password} = req.body ;
        const user = new User({  email , username}) ;
        const registeredUser = await User.register(user , password) ;
        req.login(registeredUser , (err) => {
            if(err) return next() ;
            req.flash('success' , 'welcome to yelpcamp') ;
            res.redirect('/campgrounds')
        })
        
    } catch (e) {
        req.flash('error' , e.message) ;
        res.redirect('/register') ;
    }
    res.send(req.body) ;
}

module.exports.renderLogin = (req , res) => {
    res.render('user/login') ;
}

module.exports.logIn =  (req , res) => {
    // const {username , password} = req.body ;
    req.flash('success' , 'Welcome-back') ;
    const redirectURL = req.session.returnTo || '/campgrounds' ;
    // if(req.session.returnTo){
    //     delete req.session.returnTo ;
    // }
    res.redirect(redirectURL) ;

}
module.exports.logOut = (req , res) => {
    req.logOut() ;
    req.flash('success' , 'Successfully Logged out !')
    res.redirect('/campgrounds') ;
}