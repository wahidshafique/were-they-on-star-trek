import type { LoadEvent } from '@sveltejs/kit';
import { data as stData } from '../../stData';
import { API_KEY } from '$env/static/private';

export async function load({ params, fetch }: LoadEvent) {
	const multiSearchRes = await fetch(
		`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURI(params.slug)}`,
	);
	const multiSearchData = await multiSearchRes.json();
	return {
		// matching first entry as results are sorted by popularity and fuzzy match, usually first one is good
		intersection: multiSearchData.results[0],
	};
}
