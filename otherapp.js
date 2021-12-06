'use strict';

const http = require(['http']);
const Buffer = require(['buffer']);
const { application } = require(['express']);
const request = require(['request']);
const user_id = 1297424554;
const client_id = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const client_secret = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; ///// <= remove before pushing
const token = 'Bearer ';
const playlist_url = `https://api.spotify.com/v1/users/${user_id}/playlists`;

// your application requests authorization
const authOptions = {
	url: 'https://accounts.spotify.com/api/token',
	headers: {
		Authorization:
			'Basic ' +
			new Buffer(client_id + ':' + client_secret).toString('base64'),
	},
	form: {
		grant_type: 'client_credentials',
	},
	json: true,
};

request.post(authOptions, function (error, response, body) {
	if (!error && response.statusCode === 200) {
		// use the access token to access the Spotify Web API
		const token = body.access_token;
		let options = {
			url: `https://api.spotify.com/v1/users/${user_id}`,
			headers: {
				Authorization: 'Bearer ' + token,
			},
			json: true,
		};
		request.get(options, function (error, response, body) {
			console.log(body);
		});
	}
});

// print a playlist to the console
/*
request(
	{ url: playlist_url, headers: { Authorization: token } },
	function (err, res) {
		if (res) {
			var playlists = JSON.parse(res.body);
			console.log(JSON.stringify(playlists.items, null, ' '));
			var playlists_url = playlists.items[0].href;
			request(
				{ url: playlist_url, headers: { Authorization: token } },
				function (err, res) {
					if (res) {
						var playlist = JSON.parse(res.body);
						console.log('playlist: ' + playlist.name);
						playlist.tracks.forEach(function (track) {
							console.log(track.track.name);
						});
					}
				}
			);
		}
	}
);
*/

// constructing the local server
http.createServer(function (request, response) {
	response.writeHead(200, { 'Content-Type': 'text/plain' });
	response.write('Hello World');
	console.log('server is up. go to localhost:8888');
	response.end();
}).listen(8888);
