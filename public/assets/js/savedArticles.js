
var loadSavedArticles = function (data){
	var articleId;
  	var articleTitle;
  	var articleLink;
  	var noteBtn;
  	var unsaveBtn;


    for (var i = 0; i < data.length; i++) {
    	articleId = data[i]._id;
    	articleTitle = data[i].title;
    	articleLink = data[i].link;
    	console.log(articleLink);

    	var articleTitleTd = $("<tr>");
    	var unsaveBtn = $("<button>Unsave</button>");
    	var noteBtn = $("<button>Note</button>");
    	articleTitleTd.addClass("articleTitleStyle");
    	unsaveBtn.addClass("btn btn-default btn-info unsaveBtnStyle");
    	unsaveBtn.attr('id', articleId);
    	noteBtn.addClass("btn btn-default btn-info noteBtnStyle");
    	noteBtn.attr('id', articleId);
    	noteBtn.attr("data-toggle", "modal");
    	noteBtn.attr("data-target", "#addNoteModal");

    	articleTitleTd.html("<a href=" + articleLink + ">" + articleTitle + "</a>");
    	articleTitleTd.append(unsaveBtn);
    	articleTitleTd.append(noteBtn);

    	$("#displayArticles").append(articleTitleTd);
    };
};



$.getJSON("/savedarticles", function(data) {
	loadSavedArticles(data);
});

$(document).on("click", ".unsaveBtnStyle", function() {
	var thisId = $(this).attr("id");

	$.ajax({
		method: "GET",
	    url: "/articles/unsave/"+thisId
	}).done(function(data) {
		$("#displayArticles").empty();
		$.getJSON("/savedarticles", function(data) {
			loadSavedArticles(data);
		});
	});
});

$(document).on("click", ".noteBtnStyle", function() {
  $("#displayNotes").empty();
  $(".savenote").remove();
  var thisId = $(this).attr("id");

  $.ajax({
    method: "GET",
    url: "/articles/note/" + thisId
  }).done(function(data) {
      console.log(data);
      $("#displayNotes").append("<input id='notecontent' name='body'></input>");
      $("#noteSaveBtn").append("<button type='button' class='btn btn-primary savenote' data-id=" + thisId + ">Save</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the body of the note in the body textarea
        $("#notecontent").val(data.note.body);
     
    };
  });
});

// When you click the savenote button
$(document).on("click", ".savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/note/" + thisId,
    data: {
      body: $("#notecontent").val()
    }
  }).done(function(data) {})
});
