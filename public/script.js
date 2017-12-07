$("document").ready(function() {

/*  $("li").each(function(i) {
    console.log(i);
  });
*/

/*
  $("li").click(function(){

    $("#content").html( "<p>new content !!!</p>" );

    $("#btn-valide").remove();
    $(this).fadeOut().delay(5000).fadeIn();

  });
*/

  $( function() {
      $( "#sortable" ).sortable();
      $( "#sortable" ).disableSelection();
    });

    $(".form-inline").submit(function (event) {
            if ($("#city").val().length <= 2) {
            event.preventDefault();
                $("#messageErreur").html("<p><b>Merci de saisir un nom de ville supérieur à deux caractères !!!</p></b>");
            }
                });

var mymap = L.map('mapid').setView([51.505, -0.09], 8);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
maxZoom: 18,
}).addTo(mymap);

$('li').each(function(index){
  // console.log($(this).attr("data-lat")+" // "+$(this).attr("data-long"));

var lat = $(this).attr("data-lat");
var long =$(this).attr("data-long");

mymap= mymap.setView([lat, long], 8);


});

$(".btn-danger").click(function(){

  mymap= mymap.setView([$(this).attr('data-lat'), $(this).attr('data-long')], 12);
// console.log($(this).attr('data-lat'));
// console.log($(this).attr('data-long'));
L.marker([$(this).attr('data-lat'), $(this).attr('data-long')]).addTo(mymap)
        .bindPopup("Temperature:<br>"+$(this).attr('data-temp'))
        .openPopup();

  //mymap=mymap.setView([$(".btn btn-danger").attr("data-lat"), $(".btn btn-danger").attr("data-long")], 10);

/*  L.marker([lat, long]).addTo(mymap)
      .bindPopup("Temperature:<br>$(this).attr('data-temp')")
      .openPopup();
*/

});

$( "#sortable" ).on( "sortupdate", function( event, ui ) {
  let li = document.querySelectorAll('li');
  console.log(li);

  let city = document.querySelectorAll('.city');
  console.log(city);


  $('.delete').each(function(index){
    // console.log(index);
    $(this).attr('href', '/delete?position='+index);
  });


  // console.log(deleteCity);
  // let position = Array.from(li);
  // console.log(position);
  // console.log(li);

  let position = [];
  let cities = [];
  for(var i =0; i<li.length; i++){
    position.push(parseInt(li[i].id));
    cities.push(city[i].innerText);
  }

  // for(var i=0; i<li.length; i++){
  //   const cities[i] = new Ville(parseInt(li[i].id), city[i].innerText);
  // }

  // var word = 'hello';
  console.log(position);
  console.log(cities);
  $.getJSON("http://localhost:8080/update?place="+position+"&ville="+cities);

});



})
