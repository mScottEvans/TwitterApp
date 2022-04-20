'use strict';

console.log('My very first server');

const { request } = require('express');
const { response } = require('express');
// *********REQUIRES
// In our servers, we have to 'require' instead of import.
// Here we will list the requirement for a server
const express = require('express');
require('dotenv').config();

let data = require("./data/weather.json");
const cors = require('cors');

// we musts include cors if we want to share resources over the web



// ***********USE
// Once we have required something, we we have to use it.
// This is where we assign the required file a variable
// React does this in one step with 'import', it says we must use it and it assign to a variable. Express takes 2 steps, require and use.
// this is just how Express works
const app = express();



// define PORT and validate that my env is working
const PORT = process.env.PORT;


// I know something is wrong with my env or how I'm importing it if my server is running on 3002

// ***********ROUTES
// We will use these as our endpoint
// create a basic default route.
// app.get correlates to axios.get
// the firsts parametere is the URL in quotes
// app.get('/', (request, response) => {
//   response.send('Hello, from our server');
// })

app.get('/weather', (request, response, next) => {
  try {
    let cityName = request.query.searchQuery;
    let cityObj = data.find(weather => weather.city_name.toLowerCase() === cityName.toLowerCase());
    // console.log(cityObj.data)
    let forecastArr = cityObj.data.map(day => new Forecast(day))
    // let selectedCity = new Forecast(cityObj);
    response.send(forecastArr);
  } catch(error) {
    next(error);
  }
});



// at the bottom of all our routes:
app.get('*', (request, response) => {
  response.send('Not sure what you are looking for, but it isn\'t here.');
})


// *********ERRORS
// Handle any errors
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});


// **********CLASSES
class Forecast {
  constructor(cityObject) {
    this.date = cityObject.datetime;
    this.description = cityObject.weather.description;
  }
}



// ************LISTEN
// Start the server
// listen is an Expresss method that takes in a Port value and a callback function
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
