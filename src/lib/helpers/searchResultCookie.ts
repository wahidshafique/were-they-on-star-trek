import { browser } from '$app/environment';
import type { FilteredSearchResult } from '$lib/types';

const COOKIE_NAME = 'selectedResult';
const set = (e: FilteredSearchResult) => {
	if (browser) {
		window.document.cookie = `${COOKIE_NAME}=${JSON.stringify(e)};path=/search`;
	}
};

const get = browser && window.document.cookie;

export default {
	set,
	get,
	cookieName: COOKIE_NAME,
};
