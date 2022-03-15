'use strict';

// const config = require('./config.js');

let access_token = {};
let userID = {};
let getPlaylist = {};
// let showPlaylist = {};
let clearPlaylist = {};

(function loginModule() {
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
			// let data = false;
			$.ajax({
				url: 'https://api.spotify.com/v1/me',
				// dataType: 'json',
				// async: false,
				headers: {
					Authorization: 'Bearer ' + access_token,
				},
				success: function (response) {
					// data = response;
					// console.log(data);
					$('.login').hide();
					$('.loggedin').show();
				},
				error: function (error) {
					console.log(error);
				},
			});
			// 	const getUserData = (function () {
			// 	const userData = data;
			// 	console.log(userData);
			// 	return userData;
			// })();
		} else {
			// render initial screen
			$('.login').show();
			$('.loggedin').hide();
		}
		////////////////////// Obtain New Token is broken //////////////////////////////
		// document.getElementById('obtain-new-token').addEventListener(
		// 	'click',
		// 	function () {
		// 		$.ajax({
		// 			url: '/refresh_token',
		// 			data: {
		// 				refresh_token: refresh_token,
		// 			},
		// 		}).done(function (data) {
		// 			access_token = data.access_token;
		// 			oauthPlaceholder.innerHTML = oauthTemplate({
		// 				access_token: access_token,
		// 				refresh_token: refresh_token,
		// 			});
		// 		});
		// 	},
		// 	false
		// );
		// const userJson = getUserData();
		return access_token;
	}
})();

// (async function getUserInfo() {
// 	[access_token, userJson] = await loginModule();
// 	console.log(access_token);
// 	console.log(userJson);
// })();

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

	let response = await fetch(
		`https://api.spotify.com/v1/search?query=year%3A${highSchoolStart}-${collegeEnd}&type=track&locale=en-US&limit=50`,
		{
			headers: {
				Authorization: 'Bearer ' + access_token,
			},
		}
	);

	let data = await response.json();
	// console.log(data);
	return data;
}

///////////////////////////////// API MODULE //////////////////////////////////

async function displayTracks() {
	const tracksData = await calcAge();
	console.log(tracksData);

	tracksData.tracks.items.forEach(function (track, i) {
		const trackImage = tracksData.tracks.items[i].album.images[2].url;
		const title = tracksData.tracks.items[i].name;
		const artist = tracksData.tracks.items[i].album.artists[0].name;
		const year = tracksData.tracks.items[i].album.release_date;
		const trackLink = tracksData.tracks.items[i].album.href;
		const length =
			Math.trunc(tracksData.tracks.items[i].duration_ms) / 1000;

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
	});

	$('.login').hide();
	$('.loggedin').show();

	clearPlaylist = function () {
		document.getElementById('music-playlist').innerHTML = '';
	};
}

//////////////////////////// Save Playlist Module /////////////////////////

function savePlaylistModule() {
	(async function getUserData() {
		let response = await fetch('https://api.spotify.com/v1/me', {
			headers: {
				Authorization: 'Bearer ' + access_token,
			},
		});

		let userData = await response.json();
		let userId = userData.id;
		// console.log(userData);
		// console.log(userID);

		let createPlaylist = $.ajax({
			url: `https://api.spotify.com/v1/users/${userId}/playlists`,
			type: 'POST',
			headers: {
				Authorization: 'Bearer ' + access_token,
			},
			body: {
				name: 'Nostalgia Beats',
				description: 'it worked!',
				public: true,
			},
			success: function (result) {
				console.log(result);
			},
			error: function (error) {
				console.log(error);
			},
		});

		// return createPlaylist.json();
	})();
}
