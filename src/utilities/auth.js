import { apiUrl } from '../config';

function initFb(dispatch) {
	window.fbAsyncInit = function () {
		window.FB.init({
			appId: '162637991074423',
			cookie: true,
			xfbml: true,
			version: 'v3.0'
		});

		window.FB.AppEvents.logPageView();

		window.FB.Event.subscribe('auth.statusChange', authChanged);
		window.FB.Event.subscribe('authResponseChange', authChanged);
	};

	(function (d, s, id) {
		var js,
			fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {
			return;
		}
		js = d.createElement(s);
		js.id = id;
		js.src = 'https://connect.facebook.net/en_US/sdk.js';
		fjs.parentNode.insertBefore(js, fjs);
	})(document, 'script', 'facebook-jssdk');

	function authChanged(data) {
		let user;
		if (data.authResponse && data.status === 'connected') {
			const userId = data.authResponse.userID;
			const oldUser = JSON.parse(window.localStorage.getItem('user'));
			window.FB.api('/' + userId, res => {
				user = {
					id: userId,
					name: res.name,
					loggedIn: true
				};
				dispatch({
					type: 'UPDATE_USER',
					data: user
				});
				window.localStorage.setItem('user', JSON.stringify(user));
				updateUser(user, (oldUser && !oldUser.loggedIn) && oldUser.id);
			});
			return;
		}
		const id = '' + Math.round(Math.random() * 1000000);
		user = {
			id,
			name: 'Guest' + id,
			loggedIn: false
		};
		dispatch({
			type: 'UPDATE_USER',
			data: user
		});
		window.localStorage.setItem('user', JSON.stringify(user));
		updateUser(user);
		// getFriendList(dispatch);
	}
}

function loadUser(dispatch) {
	let user = JSON.parse(window.localStorage.getItem('user'));
	if (!user) {
		const id = '' + Math.round(Math.random() * 1000000);
		user = {
			id,
			name: 'Guest' + id,
			loggedIn: false
		};
		window.localStorage.setItem('user', JSON.stringify(user));
		updateUser(user);
	}
	dispatch({
		type: 'UPDATE_USER',
		data: user
	});
	return user;
}

function updateUser(user, oldId) {
	let url = apiUrl + '/update-user';
	url += '/' + user.id;
	url += '/' + user.name;
	url += '/' + (oldId || 'none');
	fetch(url, {
		method: 'POST'
	});
}

export {
	initFb,
	loadUser,
};
