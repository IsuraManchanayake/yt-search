
$(document).ready(function() {
	$('#search-btn').on('click', function() {
		search();
	})
});

var prevPage = "";
var nextPage = "";
var q = "";

function search() {
	$('#results').html('');
	$('#buttons').html('');

	q = $('#query').val();

	$.get(
		"https://www.googleapis.com/youtube/v3/search",
		{
			part: 'snippet, id',
			q: q,
			type: 'video',
			key: 'AIzaSyCJde-8KAYxi8MBWIFRPvEJHdBKwke46C0',
			maxResults: 5
		},
		function(data) {
			// var nextPageToken = data.nextPageToken;
			// var previousPageToken = data.previousPageToken;
			prevPage = data.prevPageToken;
			nextPage = data.nextPageToken;
			console.log(data);
			console.log(prevPage);
			console.log(nextPage);
			$.each(data.items, function(i, item) {
				var output = getOutput(item);
				$('#results').append(output);
			});
			if(prevPage) {
				$('#buttons').append('<button id="prevPage">previous</button>');
				$('#prevPage').on('click', function() {
					searchPage(prevPage);
				});
			}
			if(nextPage) {
				$('#buttons').append('<button id="nextPage">next</button>');
				$('#nextPage').on('click', function() {
					searchPage(nextPage);
				});
			}
			$('#buttons').append('<div class="clearfix"></div>');
		}
		);
}

function searchPage(pageToken) {
	console.log("searchPage");
	$('#results').html('');
	$('#buttons').html('');

	$.get(
		"https://www.googleapis.com/youtube/v3/search",
		{
			part: 'snippet, id',
			q: q,
			type: 'video',
			key: 'AIzaSyCJde-8KAYxi8MBWIFRPvEJHdBKwke46C0',
			maxResults: 5,
			pageToken: pageToken
		},
		function(data) {
			prevPage = data.prevPageToken;
			nextPage = data.nextPageToken;
			console.log(data);
			console.log(prevPage);
			console.log(nextPage);
			$.each(data.items, function(i, item) {
				var output = getOutput(item);
				$('#results').append(output);
			});
			if(prevPage) {
				$('#buttons').append('<button id="prevPage">previous</button>');
				$('#prevPage').on('click', function() {
					searchPage(prevPage);
				});
			}
			if(nextPage) {
				$('#buttons').append('<button id="nextPage">next</button>');
				$('#nextPage').on('click', function() {
					searchPage(nextPage);
				});
			}
			$('#buttons').append('<div class="clearfix"></div>');
		}
		);
}

function getOutput(item) {
	var videoId = item.id.videoId;
	var title = item.snippet.title;
	var description = item.snippet.description;
	var channelId = item.snippet.channelId;
	var channelTitle = item.snippet.channelTitle;
	var thumbnail = item.snippet.thumbnails.high.url;
	var viewCount;
	var likeCount;
	var dislikeCount;

	$.ajax({
		url: "https://www.googleapis.com/youtube/v3/videos?id="+videoId+"&key=AIzaSyCJde-8KAYxi8MBWIFRPvEJHdBKwke46C0&part=statistics",
		async: false,
		success: function(data) {
			viewCount = data.items[0].statistics.viewCount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			likeCount = data.items[0].statistics.likeCount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			dislikeCount = data.items[0].statistics.dislikeCount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
	});

	var output = '<li><div class="result">'
	+ '<div class="list-left">'
	+ '<a href="https://www.youtube.com/watch?v=' + videoId + '" target="_blank"><img src="' + thumbnail + '"></a></div>'
	+ '<div class="list-right">'
	+ '<a href="https://www.youtube.com/watch?v=' + videoId + '" target="_blank"><h2>' + title + '</h2></a>'
	+ '<a href="https://www.youtube.com/channel/' + channelId + '" target="_blank"><h4>' + channelTitle + '</h4></a>'
	+ '<p class="stat">' + viewCount + ' views</p>'
	+ '<p ><small><span class="stat" style="color:#1EA345">' + likeCount + '</span>&nbsp&nbsp<span class="stat" style="color:#ED6976">' + dislikeCount + '</span></small></p>'
	+ '<p>' + description + '</p>'
	+ '</div><div class="clearfix"></div></li>';
	;
	return output;
}
