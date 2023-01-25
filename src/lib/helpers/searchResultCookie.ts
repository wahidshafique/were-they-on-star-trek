import { browser } from '$app/environment';

const COOKIE_NAME = 'selectedResult';
const set = (e: boolean) => {
	if (browser) {
		window.document.cookie = `${COOKIE_NAME}=${e.toString()};path=/search`;
	}
};

const get = browser && window.document.cookie;

export default {
	set,
	get,
	cookieName: COOKIE_NAME,
};
