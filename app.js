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
const UIController = function () {
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
	};
};
