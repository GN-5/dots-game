import { auth } from "../server/firebase";
function loadUser(dispatch) {
	let user = auth.currentUser;
	if (!user) {
		const id = '' + Math.round(Math.random() * 1000000);
		user = {
			id,
			name: 'Guest' + id,
			loggedIn: false
		};
	}
	dispatch({
		type: 'UPDATE_USER',
		data: user
	});
	return user;
}

export {
	loadUser,
};
