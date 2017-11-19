var express  = require('express');
var request  = require('request');
var mongoose= require('mongoose');

var app = express();

var options = { server: { socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000 } }};
mongoose.connect('mongodb://hg75:zipang@ds113586.mlab.com:13586/meteo', options, function(err) {

});

  var citySchema = mongoose.Schema({
      cityName: String,
      icon: String,
      description:String,
      main_temp_max: String,
      main_temp_min: String,
      main_temp: String,
      coord_lon: String,
      coord_lat: String
  });

var CityModel = mongoose.model('City', citySchema);

app.use(express.static('public'));
app.set('view engine', 'ejs');


var cityList=[];

app.get('/', function(req, res){
  res.render('index', {cityList : cityList});
});

app.get('/add', function(req, res){
  request("http://api.openweathermap.org/data/2.5/weather?q="+req.query.city+"&APPID=9b754f1f40051783e4f72c176953866e&units=metric&lang=fr", function(error, response, body){
  body=JSON.parse(body);
    // console.log(body);
    // console.log(body.coord);
    // console.log(body.coord.lon);

    var cityDb = new CityModel({
      cityName: body.name,
      icon: body.weather[0].icon,
      description:body.weather[0].description,
      main_temp_max: body.main.temp_max,
      main_temp_min: body.main.temp_min,
      main_temp: body.main.temp,
      coord_lon: body.coord.lon,
      coord_lat: body.coord.lat
    });

    cityDb.save(function(error, contact){

    });

    cityList.push(body);
    // console.log(cityList);
    res.render('index', {cityList : cityList});
  });
});

app.get('/delete', function(req, res){
  cityList.splice(req.query.position, 1);
  res.render('index', {cityList : cityList});
});

app.get('/update', function(req, res){
  let position = req.query.place.split(',');
  let positionNumber = [];
  for(var i =0;i<position.length;i++){
    positionNumber.push(parseInt(position[i]));
  }

  console.log(positionNumber);
  let copyCityList = [...cityList];
  for(var j =0; j<cityList.length;j++){
    cityList.splice(j,1,copyCityList[positionNumber[j]]);
  }
  res.render('index', {cityList : cityList});
});


app.listen(8080, function () {
  console.log("Server listening on port 8080");
});
