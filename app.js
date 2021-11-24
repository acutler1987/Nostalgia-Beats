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
		_getToken() {
			return _getToken();
		},

		_getGenres(token) {
			return _getGenres(token);
		},

		_getPlaylistByGenre(token, genreID) {
			return _getPlaylistByGenre(token, genreID);
		},

		_getTracks(token, tracksEndPoint) {
			return _getTracks(token, tracksEndPoint);
		},

		_getTrack(token, trackEndPoint) {
			return _getToken(token, trackEndPoint);
		},
	};
})();

// UI Module
const UIController = function () {
	// HTML selectors
	const DOMElements = {};
};
