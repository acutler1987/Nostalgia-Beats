'use strict';

// const { json } = require('express/lib/response');

// const { post } = require('spotify-web-api-node/src/http-manager');

// const config = require('./config.js');

// Declaring some objects we will use later, putting them into the global scope:
let access_token = {};
let userID = {};
let getPlaylist = {};
let clearPlaylist = {};
let tracksData = {};

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
		`https://api.spotify.com/v1/search?query=year%3A${highSchoolStart}-${collegeEnd}&type=track&locale=en-US&limit=12`,
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
	tracksData = await calcAge();
	// console.log(tracksData);

	tracksData.tracks.items.forEach(function (track, i) {
		const trackImage = tracksData.tracks.items[i].album.images[2].url,
			title = tracksData.tracks.items[i].name,
			artist = tracksData.tracks.items[i].album.artists[0].name,
			year = tracksData.tracks.items[i].album.release_date,
			trackLink = tracksData.tracks.items[i].album.href,
			trackPreview = tracksData.tracks.items[i].preview_url;

		const length = function () {
			let ms = tracksData.tracks.items[i].duration_ms,
				min = Math.floor((ms / 1000 / 60) << 0),
				sec = Math.floor((ms / 1000) % 60),
				fullSec = sec < 10 ? '0' + sec : sec;
			return `${min}:${fullSec}`;
		};

		let previewHtml = trackPreview
			? `
			<video class="preview-player" controls name="media">
			<source src=${trackPreview} type="audio/mpeg">
			</video>`
			: '';

		const html = `
			<li class="song-container">
				<div class="track-image" style="background-image: url(${trackImage})"></div>
				<div class="track-description">
					<div class="title"><p>${title}</p></div>
					<div class="artist"><p>${artist}</p></div>
					<div class="year"><p>${year}</p></div>
				</div>
				<div class="preview">${previewHtml}</div>
				<div class="length-link">
					<div class="length">
						<p>${length()}</p>
					</div>
					<div class="go-to-spotify">
						<a href=${trackLink}>
							<p>Play On Spotify</p>
						</a>
					</div>
				</div>
			</li>
			`;

		document
			.getElementById('music-playlist')
			.insertAdjacentHTML('afterbegin', html);

		function showPreview(playlist) {
			playlist.tracks.items.forEach(function (track, i) {});
		}
	});

	$('.login').hide();
	$('.loggedin').show();

	clearPlaylist = function () {
		document.getElementById('music-playlist').innerHTML = '';
	};
	return tracksData;
}

//////////////////////////// Save Playlist Module /////////////////////////

function savePlaylistModule() {
	let userData = {};
	let playlist = {};
	/////////////////////// First, get the users ID...
	async function getUserData() {
		let response = await fetch('https://api.spotify.com/v1/me', {
			headers: {
				Authorization: 'Bearer ' + access_token,
			},
		})
			.then(async (response) => {
				userData = await response.json();
				return userData;
			})
			.catch((error) => {
				console.log(error);
			});
		return userData;
	}

	/////////////////// Then, plug that user ID into a 'create playlist' api POST...
	async function createPlaylist() {
		let userId = userData.id;
		let response = await fetch(
			`https://api.spotify.com/v1/users/${userId}/playlists`,
			{
				method: 'POST',
				headers: {
					Authorization: 'Bearer ' + access_token,
					'Content-Type': 'application/json',
				},
				// PROBLEM SOLVED: fetch POST body MUST match 'Content-Type' header, NOT an object!
				body: JSON.stringify({
					name: 'Nostalgia Beats',
					description: 'it worked!',
					public: true,
				}),
			}
		)
			.then(async (response) => {
				playlist = await response.json();
				return playlist;
			})
			.catch((error) => {
				console.log(error);
			});
		return playlist;
	}

	async function populatePlaylist() {
		/////////////// Use a loop to populate a list of songs:

		let playlistId = playlist.id;
		let trackList = [];
		tracksData.tracks.items.forEach(function (track, i) {
			trackList.push(tracksData.tracks.items[i].uri);
		});
		// console.log(trackList);

		/////////////// Finally, push the current songs into the playlist:
		let response = await fetch(
			`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
			{
				method: 'POST',
				headers: {
					Authorization: 'Bearer ' + access_token,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					uris: trackList,
				}),
			}
		)
			.then((response) => {
				return response.json();
			})
			.catch((error) => {
				console.log(error);
			});
	}

	(async () => {
		await getUserData();
		await createPlaylist();
		await populatePlaylist();
	})();
}
