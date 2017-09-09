
var loadAllArticles = function (data){
	var articleId;
  	var articleTitle;
  	var articleLink;
  	var saveBtn;

    for (var i = 0; i < data.length; i++) {
    	articleId = data[i]._id;
    	articleTitle = data[i].title;
    	articleLink = data[i].link;

    	var articleTitleTd = $("<tr>");
    	var saveBtn = $("<button>Save</button>");
    	articleTitleTd.addClass("articleTitleStyle");
    	saveBtn.addClass("btn btn-default btn-info saveBtnStyle");
    	saveBtn.attr('id', articleId);
    	console.log(articleLink);

    	articleTitleTd.html("<a href=" + articleLink + ">" + articleTitle + "</a>");
    	articleTitleTd.append(saveBtn);

    	$("#displayArticles").append(articleTitleTd);
	};
};


$.getJSON("/articles", function(data) {
	loadAllArticles(data);
});


$(document).on("click", "#loadArticle", function() {
  $("p.mainPresetTextStyle").remove();

  $.ajax({
    method: "GET",
    url: "/scrape"
  }).done(function(data) {
 
	  	$.getJSON("/articles", function(data) {
			loadAllArticles(data);
		});
	});
});


$(document).on("click", "#clearArticle", function() {
	$.ajax({
		method: "GET",
	    url: "/cleararticles"
	}).done(function(data) {
		$("#displayArticles").empty();
		var mainPresetText = $("<p> Please Load Articles!</p>");
		mainPresetText.addClass("mainPresetTextStyle");
		$("#displayArticles").append(mainPresetText);
	});
});



$(document).on("click", ".saveBtnStyle", function() {
	var thisId = $(this).attr("id");
	console.log(thisId);
	$.ajax({
		method: "GET",
	    url: "/articles/save/"+thisId
	}).done(function(data) {
		console.log(data);
	});
});



