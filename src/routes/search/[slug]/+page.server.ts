import { error } from '@sveltejs/kit';
import { data as stData } from '../../stData';

export function load({ params }) {
	console.log(params);
	const intersection = stData.find((post) => post.slug === params.slug);
	return {
		intersection,
	};

	if (!post) throw error(404);

	return {
		post,
	};
}
