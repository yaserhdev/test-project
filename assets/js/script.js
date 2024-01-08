// Store search history list to a variable
var searchHistory = document.getElementById("history-list");
// Store existing or empty search history array to a variable
var movies = JSON.parse(localStorage.getItem("movie")) || [];
// Store review list to a variable
var reviewList = document.getElementById("reviews");

// Function to get movie info
function getMovieInfo(movieTitle) {
	// Options for fetch request
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNTliNDBmMGMwOTdmNjM4ZDQ4YjhlNjlhMDkxNTA3NSIsInN1YiI6IjY1OTllNjI5MjE2MjFkMDI1YjEyNzIwMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._hWhbcMnrwULC8RBE87ZQU64SQJGs4jQBKtTFJBSE64'
		}
	};
	// Fetch request based off movie title to retrieve title, movie ID, and synopsis from response
	fetch('https://api.themoviedb.org/3/search/movie?query=' + movieTitle + '&include_adult=false&language=en-US&page=1', options)
		.then(response => response.json())
		.then(response => {
			var date = new Date(response.results[0].release_date);
			var year = date.getFullYear();
			var title = (response.results[0].original_title + " " + year);
			displayTitle(title);
			var movieID = response.results[0].id;
			getMovieReviews(movieID);
			var synopsis = response.results[0].overview;
			displaySynopsis(synopsis);
			// Removes "hide" class from hidden elements
			$(".hide").removeClass("hide");
		})
};

// Function to display title
function displayTitle(title) {
	// Clears current title
	$("#current-movie").text("");
	// Displays new title
	$("#current-movie").text(title);
};

// Function ti display synopsis
function displaySynopsis(synopsis) {
	// Clears current synopsis
	$("#synopsis").text("");
	// Displays new synopsis
	$("#synopsis").text(synopsis);
};

// Function to get YouTube API data
function getTrailerID(movieTitle) {
	// AJAX request based off movie title to retrieve YouTube video ID of official trailer from response
	$.ajax({
		url: "https://youtube.googleapis.com/youtube/v3/search?maxResults=5&order=relevance&q=" + movieTitle + "%20Official%20Trailer&key=AIzaSyBjL77pPgy03XkhkRF0ux7R3lAx3F1fPY4",
		method: "GET"
	})
	.then(function(response) {
		// Function to assign source URL of official trailer from YouTube to iFrame element in HTML
		$(document).ready(function() {
			// Removes current iFrame URL
			$("iframe").removeAttr("src");
			var videoID = response.items[0].id.videoId;
			// Assigns new iFrame URL
			$("iframe").attr("src", "http://www.youtube.com/embed/" + videoID);
		});
	});
};

// Function to get movie reviews
function getMovieReviews(movieID) {
	// Options for fetch request
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
		  	Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNTliNDBmMGMwOTdmNjM4ZDQ4YjhlNjlhMDkxNTA3NSIsInN1YiI6IjY1OTllNjI5MjE2MjFkMDI1YjEyNzIwMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._hWhbcMnrwULC8RBE87ZQU64SQJGs4jQBKtTFJBSE64'
		}
	};
	// Fetch request based off movie ID to retrieve movie reviews from response
	fetch('https://api.themoviedb.org/3/movie/' + movieID + '/reviews?language=en-US&page=1', options)
		.then(response => response.json())
		.then(response => {
			var reviews = [];
			// For loop to push each review from response to reviews array
			for (let i = 0; i < response.results.length; i++) {
				reviews.push(response.results[i].content);
			};
			displayReviews(reviews);		
		});
};

// Function to display reviews
function displayReviews(reviews) {
	// Removes current reviews
	$("li").remove();
	// For loop to display each review from reviews array
	for (let i = 0; i < reviews.length; i++) {
		var li = document.createElement("li");
		li.textContent = reviews[i];
		reviewList.appendChild(li);
	};
};

// Function to save search history
function saveHistory(movieTitle) {
	// Converts movie title to lowercase for comparison purposes
	movieTitle = movieTitle.toLowerCase();
	// If statement to check for existing movie in search history; if entered movie title was not previously entered it is pushed to movies array and saved to local storage
	if (movies.includes(movieTitle) === false) {
		movies.push(movieTitle);
		var movieJSON = JSON.stringify(movies);
		localStorage.setItem("movie", movieJSON);
		displayHistory();
	};
};

// Function to display search history
function displayHistory() {
	// Clears text content of search history list
	searchHistory.textContent = "";
	// For loop to display search history as buttons
	for (let i = 0; i < movies.length; i++) {
		var button = document.createElement('button');
		button.textContent = movies[i];
		searchHistory.appendChild(button);
		button.classList.add("button", "is-primary", "is-light", "history");
	};
	// Adds event listener to execute "loadHistory" function on click
	searchHistory.addEventListener("click", loadHistory);
};

// Function to display trailer, reviews, and synopsis of movie from search history when corresponding button is clicked
function loadHistory(event) {
	// Assigns text content of button that was clicked to a variable
	var movieTitle = event.target.textContent;
	getMovieInfo(movieTitle);
	getTrailerID(movieTitle);
};

// Event listener for submit button
$(".search-btn").on("click", function() {
	// Assigns search input value to a variable
	var movieTitle = $(".input").val(); 
	getMovieInfo(movieTitle);
	getTrailerID(movieTitle);
	saveHistory(movieTitle);
	// Clears search input value
	$(".input").val("");
});

// Event listener for clear history button
$(".clear-btn").on("click", function() {
	// Removes search history
    $(".history").remove();
	// Clears local storage
    localStorage.clear();
    resetPage();
});

// Function to reset page to initial state
function resetPage() {
    location.reload();
};

// Displays search history on page load
displayHistory();