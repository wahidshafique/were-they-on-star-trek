import { mediaEntityEnum } from './../../../lib/types';
import { data as stData } from '../../stData';
import { API_KEY, SUPABASE_SERVICE_KEY, SUPABASE_URL } from '$env/static/private';
import searchResultCookie from '$lib/helpers/searchResultCookie';
import type { PageServerLoad } from './$types';
import { createClient } from '@supabase/supabase-js';

const IMG_THUMB_BG_URL = `https://image.tmdb.org/t/p/w200/`;

const makeFullImageUrl = (e) => (e ? IMG_THUMB_BG_URL + e : null);

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const castReducer = (acc, actor) => {
	const starTrekCastCredit = stData[actor.id];
	if (starTrekCastCredit) {
		const matched = {
			queriedActorData: actor,
			...starTrekCastCredit,
		};
		acc.push(matched);
	}
	return acc;
};

export const load: PageServerLoad = async ({ params, error, fetch, cookies, url }) => {
	if (!params.slug) {
		throw error(404, {
			message: 'Invalid',
		});
	}
	// check if we don't already have results in our store, the cookie is just a bool flag
	const browserHasDataAlready = cookies.get(searchResultCookie.cookieName);

	let mediaEntityDataToReturn;

	if (url.searchParams.has(mediaEntityEnum.person)) {
		let foundPersonData = {};
		// make a fresh call to the relevant api via the url (user landed on this page through a share or direct ingress)
		if (!browserHasDataAlready) {
			const personRes = await fetch(
				`https://api.themoviedb.org/3/person/${params.slug}?api_key=${API_KEY}`,
			);
			const tmpPersonData = await personRes.json();
			if (tmpPersonData?.success && tmpPersonData.success === false) {
				return;
			}
			foundPersonData = {
				name: tmpPersonData.name,
				image: makeFullImageUrl(tmpPersonData.profile_path),
				type: mediaEntityEnum.person,
			};
		} else {
			foundPersonData = JSON.parse(browserHasDataAlready);
			// said cookie is deleted here so on refresh of the current page, we get newer data
			cookies.delete(searchResultCookie.cookieName);
		}
		// when you search for a person, no need to fetch anything from api
		// modify the data to create a custom 'headline'
		mediaEntityDataToReturn = {
			id: params.slug,
			...foundPersonData,
			...stData[params.slug],
		};
	} else if (url.searchParams.has(mediaEntityEnum.tv)) {
		let foundTvData = {};
		const tvRes = await fetch(
			`https://api.themoviedb.org/3/tv/${params.slug}?api_key=${API_KEY}&append_to_response=aggregate_credits`,
		);
		foundTvData = await tvRes.json();
		if (foundTvData?.success && foundTvData.success === false) {
			return;
		}
		const totalityOfMatchingActors = foundTvData.aggregate_credits.cast.reduce(castReducer, []);
		mediaEntityDataToReturn = {
			id: params.slug,
			name: foundTvData.original_name,
			image: makeFullImageUrl(foundTvData.backdrop_path),
			type: mediaEntityEnum.tv,
			totalityOfMatchingActors,
		};
	} else if (url.searchParams.has(mediaEntityEnum.movie)) {
		let foundMovieData = {};
		const movieRes = await fetch(
			`https://api.themoviedb.org/3/movie/${params.slug}?api_key=${API_KEY}&append_to_response=credits`,
		);
		foundMovieData = await movieRes.json();
		if (foundMovieData.success && fundMfoundMovieData.success === false) {
			return;
		}
		const totalityOfMatchingActors = foundMovieData.credits.cast.reduce(castReducer, []);
		mediaEntityDataToReturn = {
			id: params.slug,
			name: foundMovieData.original_title,
			image: makeFullImageUrl(foundMovieData.poster_path),
			type: mediaEntityEnum.movie,
			totalityOfMatchingActors,
		};
	}

	// later on the id's are digested by a prebuild popularity checker
	await supabase.rpc('upsertPopular', {
		media_id_to_upsert: params.slug,
		name_to_upsert: mediaEntityDataToReturn.name,
		type_to_upsert: mediaEntityDataToReturn.type,
		image_to_upsert: mediaEntityDataToReturn.image,
	});

	return mediaEntityDataToReturn;
};
