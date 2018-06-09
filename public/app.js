//populate commentCol to show and create comments
$(".commentBtn").on("click", function() {
  $("#commentCol").empty()
  var thisId = $(this).attr("data-id");
  console.log(thisId)
  
  $.ajax({
    method: "GET",
    url: "/postings/" + thisId
  })
    .then(function(data) {
       // The title of the article
       $("#commentCol").append("<h2>" + data.title + "</h2>");
       // An input to enter a new title
       $("#commentCol").append("<input id='titleinput' name='title' >");
       // A textarea to add a new note body
       $("#commentCol").append("<textarea id='bodyinput' name='body'></textarea>");
       // A button to submit a new note, with the id of the article saved to it
       $("#commentCol").append("<button data-id='" + data._id + "' id='savenote'>Save Comment</button>");

       $("#commentCol").append("<div id='titleDisplay'></div>");
       $("#commentCol").append("<div id='commentDisplay'></div>");

       if (data.comment) {
          $("#titleDisplay").val(data.note.title);
          $("#commentDisplay").val(data.note.title);
       }
    });
});

// When you click the savenote button
$("#savenote").on("click", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log(thisId);

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/postings/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

$("#scrapeBtn").on("click", function() {
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
  location.reload();
})