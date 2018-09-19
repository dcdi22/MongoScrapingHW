/* global bootbox */
$(document).ready(function() {

  // Scrape Button
  $("#scrape").on("click", function() {
    $.ajax({
      method: "GET",
      url: "/scrape"
    }).then(function(data) {
      console.log(data);
    });
  });

  // Saved Article Button
  // $(".save").on("click", function(){
  //   var thisId = $(this).attr("data-id");
  //   $.ajax({
  //     method: "POST",

  //   })
  // })

























});