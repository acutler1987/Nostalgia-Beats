'use strict';

const APIController = (function () {
	const clientId = '';
	const clientSecret = '';

	// private methods
	const _getToken = async () => {
		const result = await fetch('https://accounts.spotify.com/api/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: 'Basic' + btoa(clientId + ':' + clientSecret),
			},
			body: 'grant_type=client_credentials',
		});

		const data = await result.json();
		return data.access_token;
	};

	const _getGenres = async (token) => {
		const result = await fetch(
			'https://api.spotify.com/v1/browse/categories?locale=sv_US',
			{
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + token,
				},
			}
		);

		const data = await result.json();
		return data.categories.items;
	};

	const _getPlaylistByGenre = async (token, genreID) => {
		const result = await fetch(
			`https://api.spotify.com/v1/browse/categories/${genreID}/playlists?limit=${limit}`,
			{
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + token,
				},
			}
		);

		const data = await result.json();
		return data.playlists.items;
	};

	const _getTracks = async (token, tracksEndPoint) => {
		const list = 10;

		const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + token,
			},
		});

		const data = await result.json();
		return data.items;
	};

	const _getTrack = async (token, trackEndPoint) => {
		const result = await fetch(`${trackEndPoint}`, {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + token,
			},
		});

		const data = await result.json();
		return data;
	};

	return {
		getToken() {
			return _getToken();
		},

		getGenres(token) {
			return _getGenres(token);
		},

		getPlaylistByGenre(token, genreID) {
			return _getPlaylistByGenre(token, genreID);
		},

		getTracks(token, tracksEndPoint) {
			return _getTracks(token, tracksEndPoint);
		},

		getTrack(token, trackEndPoint) {
			return _getToken(token, trackEndPoint);
		},
	};
})();

// UI Module
const UIController = (function () {
	// HTML selectors
	const DOMElements = {
		selectGenre: '',
		selectPlaylists: '',
		buttonSubmit: '',
		divSongDetail: '',
		hfToken: '',
		divSongList: '',
	};

	// Public Methods
	return {
		// method to get input fields
		inputField() {
			return {
				genre: document.querySelector(DOMElements.selectGenre),
				playlist: document.querySelector(DOMElements.selectPlaylists),
				submit: document.querySelector(DOMElements.buttonSubmit),
				tracks: document.querySelector(DOMElements.divSongList),
				songDetail: document.querySelector(DOMElements.divSongDetail),
			};
		},

		// method to create select list option
		createGenre(text, value) {
			const html = `html markup will go here, inserting ${text} and ${value}`;
			document
				.querySelector(DOMElements.selectGenre)
				.insertAdjacentHTML('beforeend', html);
		},

		createPlaylist(text, value) {
			const html = `html markup will go here, inserting ${text} and ${value}`;
			document
				.querySelector(DOMElements.selectPlaylist)
				.insertAdjacentHTML('beforeend', html);
		},

		// method to create the track list
		createTrack(id, name) {
			const html = `html markup will go here, inserting ${id} and ${name}`;
			document
				.querySelector(DOMElements.divSongList)
				.insertAdjacentHTML('beforeend', html);
		},

		// method to create song detail
		createSongDetail(img, song, artist) {
			const detailDiv = document.querySelector(DOMElements.divsongDetail);
			// when user clicks on a song, clear out old details div
			detailDiv.innerHTML = '';

			const html = `markup goes here- ${img}, ${song} and ${artist} should each have their own divs`;

			detailDiv.insertAdjacentHTML('beforeend', html);
		},

		resetTrackDetail() {
			this.inputField().songDetail.innerHTML = '';
		},

		resetTracks() {
			this.inputField().songs.innerHTML = '';
			this.resetTrackDetail();
		},

		resetPlaylist() {
			this.inputField().playlist.innerHTML = '';
			this.resetTracks();
		},
	};
})();

// the app proper
const APPController = (function (UICtrl, APICtrl) {
	// get input field object ref
	const DOMInputs = UICtrl.inputField();

	// get genres on page load
	const loadGenres = async () => {
		// get the token
		const token = await APICtrl.getToken();
		// get the genres
		const genres = await APICtrl.getGenres(token);
		// populate genre select element
		genres.forEach((element) =>
			UICtrl.createGenre(element.name, element.id)
		);
	};

	// genre change event listener
	DOMInputs.genre.addEventListener('change', async () => {
		// when user changes genres, reset subsequent fields
		UICtrl.resetPlaylist();

		// get the token, add method to store the token on the page
		const token = UICtrl.getStoredToken().token;

		// get the genre select field
		const genreSelect = UICtrl.inputField();

		// get the selected genreID
		const genreID = genreSelect.options[genreselect.selectedIndex].value;

		// get playlist data from Spotify based on genre
		const playlist = await APICtrl.getPlaylistByGenre(token, genreID);

		// load the playlist select field
		console.log(playlist);
	});

	// submit button click event listener
	DOMInputs.submit.addEventListener('click', async (e) => {
		// prevent page reset
		e.preventDefault();
	});
})();
