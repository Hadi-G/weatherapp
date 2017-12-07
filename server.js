var express  = require('express');
var request  = require('request');
var mongoose= require('mongoose');

var app = express();

var options = { server: { socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000 } }};
mongoose.connect('mongodb://hg75:zipang@ds113586.mlab.com:13586/meteo', options, function(err) {
});

  var citySchema = mongoose.Schema({
    name: String,
    icon: String,
    description:String,
    main_temp_max: Number,
    main_temp_min: Number,
    main_temp: Number,
    coord_lon: Number,
    coord_lat: Number,
    position:Number,
  });

var CityModel = mongoose.model('City', citySchema);

app.use(express.static('public'));
app.set('view engine', 'ejs');

var cityList=[];

app.get('/', function(req, res){
  CityModel.find().sort({position:1}).exec(function(error, cities3){
      cityList = cities3;
      res.render('index', {cityList : cityList});
  });
  });


var indice = -1;

app.get('/add', function(req, res){
  request("http://api.openweathermap.org/data/2.5/weather?q="+req.query.city+"&APPID=9b754f1f40051783e4f72c176953866e&units=metric&lang=fr", function(error, response, body){
  body=JSON.parse(body);

    indice += 1;

    var cityDb = new CityModel({
      name: body.name,
      icon: body.weather[0].icon,
      description:body.weather[0].description,
      main_temp_max: body.main.temp_max,
      main_temp_min: body.main.temp_min,
      main_temp: body.main.temp,
      coord_lon: body.coord.lon,
      coord_lat: body.coord.lat,
      position:indice
    });

    cityDb.save(function(error, contact){
      CityModel.find().sort({position:1}).exec(function(error, cities3){
          cityList = cities3;
          console.log(cityList);
          res.render('index', {cityList : cityList});
      });
      // res.render('index', {cityList : cityList});
    });
  });
});

app.get('/delete', function(req, res){

  indice -= 1;

  CityModel.remove({position:req.query.position}, function(error){
    CityModel.find().sort({position:1}).exec(function(error, cities){

      for(var i=0; i<cities.length; i++){
        CityModel.update({name:cities[i].name},{position:i}, function(error, raw, list){
          });
        }

    setTimeout(function(){
      CityModel.find().sort({position:1}).exec(function(error, cities3){
          cityList = cities3;
          // console.log(cityList);
          res.render('index', {cityList : cityList});
    }, 200);

        });
      });
    });
  });

app.get('/update', function(req, res){
  let position = req.query.place.split(',');
  let positionNumber = [];
  let ville = req.query.ville.split(',');
  let villeParse = [];

  for(var i =0;i<position.length;i++){
    positionNumber.push(parseInt(position[i]));
    villeParse.push(ville[i]);
  }

  CityModel.find(function(error, cities){
    for(var j = 0; j<cities.length; j++){
      CityModel.update({name:villeParse[j]}, {position:villeParse.indexOf(villeParse[j])}, function(error, raw){
      });
    }

});

setTimeout(function(){
  CityModel.find().sort({position:1}).exec(function(error, cities3){
      cityList = cities3;
      console.log(cityList);
      // res.render('index', {cityList : cityList});
});
}, 500);

});


app.listen(8080, function () {
  console.log("Server listening on port 8080");
});
