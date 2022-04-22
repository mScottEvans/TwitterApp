'use strict';

console.log('My very first server');


// *********REQUIRES
// In our servers, we have to 'require' instead of import.
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');





// ***********USE
// Once we have required something, we we have to use it.
const app = express();
app.use(cors());



const PORT = process.env.PORT;




// ***********ROUTES
app.get('/weather', async (request, response, next) => {
  try {
    let { searchQuery, lat, lon } = request.query;
    // console.log(request.query);
    let url = `http://api.weatherbit.io/v2.0/forecast/daily/?key=${process.env.WEATHER_API_KEY}&land=en&lat=${lat}&lon=${lon}&days=5`;
    let weatherData = await axios.get(url);
    // console.log(weatherData);
    // console.log(cityObj.data)
    
    let forecastArr = weatherData.data.data.map(day => new Forecast(day));
    // let selectedCity = new Forecast(cityObj);
    response.send(forecastArr);
  } catch(error) {
    next(error);
  }
});


// `https://api.themoviedb.org/3/search/movie/?api_key=${process.env.MOVIE_API_KEY}&language=en-US&page=1&query=${searchQuery}`;


app.get('/movie', async (request, response, next) => {
  console.log('In movie handler');
  try {
    let {searchQuery} = request.query;
    // console.log(request.query);
    let url = `http://localhost:8080/movie?searchQuery=Seattle`


    
    // console.log(url);
    let movieData = await axios.get(url);

    console.log(movieData);
    // console.log(cityObj.data)
    
    let movieArr = movieData.data.results.map(day => new Theaters(day))
    // let selectedCity = new Forecast(cityObj);
    response.send(movieArr);
  } catch(error) {
    next(error);
  }
});




// *********ERRORS
// Handle any errors
app.get('*', (request, response) => {
  response.send('Not sure what you are looking for, but it isn\'t here.');
});

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
 class Theaters {
   constructor(movieObject) {
     this.title = movieObject.title;
     this.overview = movieObject.overview;
     this.vote_average = movieObject.vote_average;
     this.vote_count = movieObject.vote_count;
     this.poster_path = `https://image.tmdb.org/t/p/w500${movieObject.poster_path}`;
     this.popularity = movieObject.popularity;
     this.release_date = movieObject.release_date;
   }
 }



// ************LISTEN
// Start the server
// listen is an Expresss method that takes in a Port value and a callback function
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
