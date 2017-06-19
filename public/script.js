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
    } );

    $(".form-inline").submit(function (event) {
            if ($("#city").val().length <= 2) {
            event.preventDefault();
                $("#messageErreur").html("<p><b>Merci de saisir un nom de ville supérieur à deux caractères !!!</p></b>");
            }
          //  else {
            //  event.preventDefault();
                      //  $("#messageErreur").html("Merci de saisir un nom de ville supérieur à deux caractères !!!");
                  //  }
                });


})
