/* global bootbox */
$(document).ready(function() {

  // Scrape Button
  $("#scrape").on("click", function() {
    $.ajax({
      method: "GET",
      url: "/scrape"
    }).then(function(data) {
      console.log(data);
      window.location = "/"
    });
  });

  // Clear Button
  $("#clear").on("click", function() {
    $.ajax({
      method: "GET",
      url: "/clear"
    }).then(function(data) {
      console.log(data);
      window.location = "/"
    });
  });

  // Saved Article Button
  $(".save").on("click", function(){
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "POST",
      url: "/articles/save/" + thisId
    }).then(function(data){
      window.location = "/"
    })
  })

  // Delete Button
  $(".delete").on("click", function(){
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "POST",
      url: "/articles/delete/" + thisId
    }).then(function(data){
      window.location = "/saved"
    })
  })

























});