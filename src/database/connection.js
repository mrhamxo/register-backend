const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Registration-Form')
    .then(() => {
        console.log("Connection Successful");   
    }).catch((error) => {
        console.log("No Connection");
    });