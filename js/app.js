//Require data
const express = require("express");
const bodyParser = require("body-parser");
const mainRoutes = require('./index.js');
const config = require('../config.js');

//Sets as an Express app
const app = express();
const port = process.env.PORT || 3000; //The app will be deliver at port 3000


//App configuration
app.use(bodyParser.urlencoded({ extended : false }));
app.set("view engine", "pug"); // This app uses pug
app.use(express.static('public')); //The static files
app.use(mainRoutes); // main routes are now being used

//Throw an error
app.use((req, res , next) => {

    //Sets the error message
    const err = new Error('Not Found');
    
    //Sets the error status
    err.status = 404;
    
    // Pass the error to next function
    next(err);
});

app.use((err, req, res, next) => {

    //Sets the response status
    res.status(err.status);

    // Set the error object
    err = `${err.status} : ${err.message}`;

    //Render the error pug template passing the error object
    res.render('error', { err })

});

// The app can be find in http://localhost:3000
app.listen(port, () => {
	console.log('Page loaded at localhost:3000');
});


