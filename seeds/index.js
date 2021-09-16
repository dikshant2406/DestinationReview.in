const express = require('express');
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedhelpers')
const campground = require('../models/campGround');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("dataBase connected");
});

const sample = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
}
const seedDB = async () => {
    await campground.deleteMany({});
    for (let i = 0; i < 250; i++) {
        let random1000 = Math.floor((Math.random() * 1000));
        let price = Math.floor((Math.random() * 80)) + 20 ;
        const c = new campground({
            author : '60f852f23473bf3b701516a7' ,
            title: `${sample(descriptors)} ${sample(places)}` ,
            price :`${price}`,
            decription : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil quaerat asperiores quo amet velit, minima dolorem? Expedita repellat ratione perferendis. Nam ipsam dolorum corporis vero hic, eos aliquid non iure" ,
            location: `${cities[random1000].city} , ${cities[random1000].state}` ,
            images :  [
                {

                  url: 'https://res.cloudinary.com/dnue5ievg/image/upload/v1631311728/YelpCamp/k8ol7i6izrypfjrjwqgg.jpg',
                  filename: 'YelpCamp/w5auran1wewferpsra6x'
                },
                {
                  url: 'https://res.cloudinary.com/dnue5ievg/image/upload/v1631355396/YelpCamp/t1ejnx7cm6ynenqgqqyw.jpg',
                  filename: 'YelpCamp/t1ejnx7cm6ynenqgqqyw'
                }
            ] ,
            geometry : { type: 'Point', coordinates: [ cities[random1000].longitude , cities[random1000].latitude ] },
            
            
        }) ;
        await c.save() ;
    }
}

seedDB().then(() => {
    db.close() ;
})