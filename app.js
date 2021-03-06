'use strict';

const express = require('express');
const request = require('request');
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

const config = require('./config.js');

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = function (length) {
	let text = '';
	const possible =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};

const stateKey = 'spotify_auth_state';

const app = express();

app.use(express.static(__dirname + '/public'))
	.use(cors())
	.use(cookieParser());

///////////////////////////////////////// LOGIN MODULE //////////////////////////////////////////////////

const loginModule = (function () {
	// FIRST CALL
	app.get('/login', function (req, res) {
		var state = generateRandomString(16);
		res.cookie(stateKey, state);

		// requesting authorization
		var scope =
			'user-read-private user-read-email playlist-modify-public playlist-modify-private';
		res.redirect(
			'https://accounts.spotify.com/authorize?' +
				querystring.stringify({
					response_type: 'code',
					client_id: config.client_id,
					scope: scope,
					redirect_uri: config.redirect_uri,
					state: state,
					show_dialog: false,
				})
		);
	});

	// SECOND CALL
	app.get('/callback', function (req, res) {
		// requesting refresh and access tokens
		// after checking the state parameter

		var code = req.query.code || null;
		var state = req.query.state || null;
		var storedState = req.cookies ? req.cookies[stateKey] : null;

		if (state === null || state !== storedState) {
			res.redirect(
				'/#' +
					querystring.stringify({
						error: 'state_mismatch',
					})
			);
		} else {
			res.clearCookie(stateKey);
			var authOptions = {
				url: 'https://accounts.spotify.com/api/token',
				form: {
					code: code,
					redirect_uri: config.redirect_uri,
					grant_type: 'authorization_code',
				},
				headers: {
					Authorization:
						'Basic ' +
						new Buffer(
							config.client_id + ':' + config.client_secret
						).toString('base64'),
				},
				json: true,
			};

			request.post(authOptions, function (error, response, body) {
				if (!error && response.statusCode === 200) {
					var access_token = body.access_token,
						refresh_token = body.refresh_token;

					var options = {
						url: 'https://api.spotify.com/v1/me',
						headers: { Authorization: 'Bearer ' + access_token },
						json: true,
					};

					// use the access token to access the Spotify Web API
					// request.get(options, function (error, response, body) {
					// 	console.log(body);
					// });

					// we can also pass the token to the browser to make requests from there
					res.redirect(
						'/#' +
							querystring.stringify({
								access_token: access_token,
								refresh_token: refresh_token,
							})
					);
				} else {
					res.redirect(
						'/#' +
							querystring.stringify({
								error: 'invalid_token',
							})
					);
				}
			});
		}
	});

	// THIRD CALL
	const getAccessToken = app.get('/refresh_token', function (req, res) {
		// requesting access token from refresh token
		var refresh_token = req.query.refresh_token;
		var authOptions = {
			url: 'https://accounts.spotify.com/api/token',
			headers: {
				Authorization:
					'Basic ' +
					new Buffer(
						config.client_id + ':' + config.client_secret
					).toString('base64'),
			},
			form: {
				grant_type: 'refresh_token',
				refresh_token: refresh_token,
			},
			json: true,
		};

		request.post(authOptions, function (error, response, body) {
			if (!error && response.statusCode === 200) {
				var access_token = body.access_token;
				res.send({
					access_token: access_token,
				});
			}
		});
	});
})();

app.listen(8888, function () {
	console.log('Listening on 8888');
});
