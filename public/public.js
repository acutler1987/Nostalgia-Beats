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
let methuselahPlaylist = {};
let getTracks = {};

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

	const validAgeHtml = `
		<h3>You attended highschool / college from ${highSchoolStart} to ${collegeEnd}</h3>
		<br />
		<br />
		<button
			type="button"
			class="buttons"
			onclick="displayTracks()"
		>Build Playlist</button>
		<button
			type="button"
			class="buttons"
			onclick="clearPlaylist()"
		>Start Over</button>
		`;

	// const tooYoungHtml = `
	// 	<h3>Sorry, you're not old enough to have wistful memories yet...</h3>
	// `;

	// const tooOldHtml = `
	// 	<h3>Yeah, right!</h3>
	// 	<br />
	// 	<button
	// 		type="button"
	// 		class="buttons"
	// 		onclick="methuselahPlaylist()"
	// 	>No, I'm actually ${ageInput}!</button>
	// `;

	// const reallyOldHtml = `
	// <h3>Okay, Methuselah...</h3>
	// 	<br />
	// 	<br />
	// 	<button
	// 		type="button"
	// 		class="buttons"
	// 		onclick="displayTracks()"
	// 	>Build Playlist</button>
	// 	<button
	// 		type="button"
	// 		class="buttons"
	// 		onclick="clearPlaylist()"
	// 	>Start Over</button>
	// 	`;

	// if (ageInput >= 120) {
	// 	document.getElementById('playlist-customizer').innerHTML = tooOldHtml;
	// } else if (ageInput < 22) {
	// 	document.getElementById('playlist-customizer').innerHTML = tooYoungHtml;
	// } else {
	// 	document.getElementById('playlist-customizer').innerHTML = validAgeHtml;
	// }

	// methuselahPlaylist = function () {
	// 	document.getElementById('playlist-customizer').innerHTML =
	// 		reallyOldHtml;
	// };

	document.getElementById('playlist-customizer').innerHTML = validAgeHtml;

	const data = `${highSchoolStart}-${collegeEnd}`;
	console.log(data);

	return data;
}

///////////////////////////////// API MODULE //////////////////////////////////

const songSearchEndpoint = `https://api.spotify.com/v1/search?query=year%3A${ageRange}&type=track&locale=en-US&limit=12`;
const userProfileEndpoint = 'https://api.spotify.com/v1/me';
const createPlaylistEndpoint = `https://api.spotify.com/v1/users/${userId}/playlists`;
const savePlaylistEndpoint = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

const fetchAPICall = async function (endpoint, method) {
	let response = await fetch(endpoint, {
		method: method,
		headers: {
			Authorization: 'Bearer ' + access_token,
		},
	});

	let data = await response.json();
	return data;
};

async function displayTracks() {
	const ageRange = await calcAge();
	console.log(ageRange);

	(async function getTracks() {
		let response = await fetch(
			`https://api.spotify.com/v1/search?query=year%3A${ageRange}&type=track&locale=en-US&limit=12`,
			{
				headers: {
					Authorization: 'Bearer ' + access_token,
				},
			}
		);

		let tracksData = await response.json();
		// console.log(data);
		return tracksData;
	})();

	tracksData = await getTracks();
	console.log(tracksData);

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

		const songContainerHtml = `
		<li class="song-container">
				<div class="track-image" style="background-image: url(${trackImage})"></div>
				<div class="track-description">
					<p class="title">${title}</p>
					<p class="description-text">${artist}</p>
					<p class="description-text">${year}</p>
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
			.insertAdjacentHTML('afterbegin', songContainerHtml);
	});

	clearPlaylist = function () {
		document.getElementById('age').value = '';
		document.getElementById('playlist-customizer').innerHTML = '';
		document.getElementById('music-playlist').innerHTML = '';
		document.getElementById('save-playlist-wrapper').innerHTML = '';
	};

	const savePlaylistHtml = `
		<button
			type="button"
			class="buttons"
			onclick="savePlaylistModule()"
		>Save This Playlist</button>
		`;

	document
		.getElementById('save-playlist-wrapper')
		.insertAdjacentHTML('afterbegin', savePlaylistHtml);

	$('.login').hide();
	$('.loggedin').show();

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
