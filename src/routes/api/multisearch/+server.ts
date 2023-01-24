import type { FilteredSearchResults } from '$lib/types';
import type { RequestHandler } from './$types';
import { API_KEY } from '$env/static/private';

const IMG_THUMB_BG_URL = `https://image.tmdb.org/t/p/w200/`;

export const GET: RequestHandler = async ({ url }) => {
	console.log(url.searchParams.get('query'));
	const res = await fetch(
		`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${url.searchParams.get(
			'query',
		)}`,
	);

	const { results } = await res.json();

	const filteredResults: FilteredSearchResults | [] = [];

	if (results) {
		for (const {
			backdrop_path,
			profile_path,
			poster_path,
			original_name,
			original_title,
			name,
		} of results) {
			const imgPath = backdrop_path || profile_path || poster_path;
			const image = imgPath ? IMG_THUMB_BG_URL + imgPath : null;
			filteredResults.push({
				name: name || original_name || original_title,
				// use config api, the url is not pregiven due to keeping it 'light' according to docs
				image,
			});
		}
	}

	return new Response(
		JSON.stringify({
			body: filteredResults,
		}),
	);
};
