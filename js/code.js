var game2048 = (function()
{
	var title, rating, info, poster, plot;
	var busy;

	function GetTextFromSpeech()
	{
		if(busy)
			return;

		busy = true;
		if (annyang) {
			var commands = {
				'search*title' : FetchMovieData,
				'hello' : function(){ console.log('works'); },
			};

			annyang.addCommands(commands);
			annyang.start();
		}
	}

	function FetchMovieData(title)
	{
		title = title.substring(1);

		$.ajax({
			url: 'https://www.omdbapi.com/',
			type: 'GET', 
			data: {t : title}, 
			dataType: 'json',
			success: successfunction,
			error: errorfunction,
		});
	}

	function errorfunction(err)
	{
		console.log(err);
		busy = false;
	}

	function successfunction(data)
	{
		title.innerHTML = data.Title;
		rating.innerHTML = data.imdbRating + '/10';
		info.innerHTML = data.Rated + ' | ' + data.Runtime + ' | ' + data.Genre + ' | ' + data.Type + ' ( ' + data.Year + ')';
		poster.setAttribute('src', data.Poster);

		var str = data.Plot + '<br><br>';
		str += (data.Director == 'N/A' ? '' : '<b>Directors</b> : ' + data.Director + '<br>');
		str += (data.Writer == 'N/A' ? '' : '<b>Writers</b> : ' + data.Writer + '<br>');
		str += '<b>Stars</b> : ' + data.Actors + '<br>';
		plot.innerHTML = str;

		busy = false;
	}

	function init(obj)
	{
		busy = false;
		title = document.getElementById(obj.title);
		rating = document.getElementById(obj.rating);
		info = document.getElementById(obj.info);
		poster = document.getElementById(obj.poster);
		plot = document.getElementById(obj.plot);

		GetTextFromSpeech();
		FetchMovieData(' breaking bad');
	}

	return {
		'init' : init,
	};
})();