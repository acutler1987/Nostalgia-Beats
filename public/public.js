'use strict';

let access_token = {};
let getPlaylist = {};
// let showPlaylist = {};
let clearPlaylist = {};

const loginModule = (function () {
	/**
	 * Obtains parameters from the hash of the URL
	 * @return Object
	 */
	function getHashParams() {
		let hashParams = {};
		let e,
			r = /([^&;=]+)=?([^&;]*)/g,
			q = window.location.hash.substring(1);
		while ((e = r.exec(q))) {
			hashParams[e[1]] = decodeURIComponent(e[2]);
		}
		return hashParams;
	}

	var params = getHashParams();

	access_token = params.access_token;

	var refresh_token = params.refresh_token,
		error = params.error;

	if (error) {
		alert('There was an error during the authentication');
	} else {
		if (access_token) {
			$.ajax({
				url: 'https://api.spotify.com/v1/me',
				headers: {
					Authorization: 'Bearer ' + access_token,
				},
				success: function (response) {
					const playerName = response.display_name;
					// console.log(playerName);
					$('.login').hide();
					$('.loggedin').show();
				},
			});
		} else {
			// render initial screen
			$('.login').show();
			$('.loggedin').hide();
		}
		////////////////////// Obtain New Token is broken //////////////////////////////
		document.getElementById('obtain-new-token').addEventListener(
			'click',
			function () {
				$.ajax({
					url: '/refresh_token',
					data: {
						refresh_token: refresh_token,
					},
				}).done(function (data) {
					access_token = data.access_token;
					oauthPlaceholder.innerHTML = oauthTemplate({
						access_token: access_token,
						refresh_token: refresh_token,
					});
				});
			},
			false
		);
		return access_token;
	}
})();

console.log(access_token);
///////////////////////////////////////////////////////////////////////////

///////////////////////////////// AGE MODULE ////////////////////////////////////

// const APPModule = (function (UIMod, APIMod) {})(UIMod, APIMod);

async function calcAge() {
	const curYear = new Date().getFullYear();
	const ageInput = document.getElementById('age').value;
	const highSchoolStart = curYear - (ageInput - 14);
	const collegeEnd = curYear - (ageInput - 22);
	document.getElementById(
		'age-results'
	).innerHTML = `You attended highschool / college from ${highSchoolStart} to ${collegeEnd}`;

	$.ajax({
		url: `https://api.spotify.com/v1/search?query=year%3A${highSchoolStart}-${collegeEnd}&type=track&locale=en-US&limit=10`,
		headers: {
			Authorization: 'Bearer ' + access_token,
		},
		success: function (response) {
			console.log(response);
			const playlist = response.json();
			console.log(playlist);
			return playlist;
		},
	});

	// let response = await fetch(
	// 	`https://api.spotify.com/v1/search?query=year%3A${highSchoolStart}-${collegeEnd}&type=track&locale=en-US&limit=10`
	// );

	// return playlist;
}

///////////////////////////////// API MODULE //////////////////////////////////

// const myPlaylistURL =
// 	'https://api.spotify.com/v1/playlists/6s0eMyEF05xmQLZZT0Y1c9';

// const testSearchURL =
// 	'https://api.spotify.com/v1/search?query=year%3A2002-2010&type=track&locale=en-US&limit=10';

async function displayTracks() {
	const tracksData = await calcAge();
	console.log(tracksData);

	playlist.tracks.items.forEach(function (track, i) {
		const trackImage = playlist.tracks.items[i].album.images[2].url;
		// playlist.tracks.items[i].track.album.images[2].url;
		const title = playlist.tracks.items[i].name;
		// playlist.tracks.items[i].track.name;
		const artist = playlist.tracks.items[i].album.artists[0].name;
		// playlist.tracks.items[i].track.artists[i].name;
		const year = playlist.tracks.items[i].album.release_date;
		// playlist.tracks.items[i].track.album.release_date;
		const trackLink = playlist.tracks.items[i].album.href;
		// playlist.tracks.items[i].track.external_urls.spotify;
		const length = Math.trunc(playlist.tracks.items[i].duration_ms) / 1000;
		// Math.trunc(playlist.tracks.items[i].track.duration_ms) /1000;
	});

	const html = `
			<li class="song-container">
			<div class="track-image" style="background-image: url(${trackImage})">
			</div>
			<div class="track-description">
			<div class="title"><p>${title}</p></div>
			<div class="artist"><p>${artist}</p></div>
			<div class="year"><p>${year}</p></div>
			</div>
			<div class="preview"></div>
			<div class="length-link"><div class="length"><p>${length}</p></div>
			<div class="go-to-spotify"><a href=${trackLink}><p>Play On Spotify</p></a></div>
			</div>
			</li>
		`;

	document
		.getElementById('music-playlist')
		.insertAdjacentHTML('afterbegin', html);

	function showPreview(playlist) {
		playlist.tracks.items.forEach(function (track, i) {
			const trackPreview = playlist.tracks.items[i].track.preview_url;

			const previewHtml = `
					<video class="preview-player" controls name="media">
					<source src=${trackPreview} type="audio/mpeg">
					</video>
				`;

			if (trackPreview)
				document
					.getElementsByClassName('preview')
					.insertAdjacentHTML('afterbegin', previewHtml);
		});
	}

	$('.login').hide();
	$('.loggedin').show();

	clearPlaylist = function () {
		document.getElementById('music-playlist').innerHTML = '';
	};
}

// const APIModule = (function () {
// 	getPlaylist = function () {
// 		$.ajax({
// 			url: searchURL,
// 			headers: {
// 				Authorization: 'Bearer ' + access_token,
// 			},
// 			success: function (response) {
// 				const playlist = response;
// 				// showPlaylist(playlist);
// 				// showPreview(playlist);
// 				console.log(playlist);

// 				// const playlistPromise = new Promise(function showPlaylist(playlist) {
// 				// });
// 			},
// 		});
// 	};

// 	// playlistPromise.then(function showPreview(playlist) {
// 	// 	console.log('second function executed');
// 	// });

// })();
