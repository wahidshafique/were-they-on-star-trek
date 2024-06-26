/** A helper that fetches and squishes various canonical star trek shows into a format that's useful for this app. This is what I used to generate the stData.json */

import fs from 'fs';
import { config } from 'dotenv';
import getHTML from 'html-get';

import _metascraper from 'metascraper';
import image from 'metascraper-image';
import desc from 'metascraper-description';
import url from 'metascraper-url';
import { data as existingStData } from '../src/routes/stData.js';

config({ path: '../.env' });
// these ranks present issues when sending string over to mem alpha so we need to strip them
import ranksToStrip from './rank-abbr-to-strip.json' assert { type: 'json' };

// WARNING: if true, the script will start the crawl process anew, which may be a tad longer
const RECRAWL_EXISTING_CHARACTERS = true;

const metascraper = _metascraper([image(), desc(), url()]);
/**
 * `browserless` will be passed to `html-get`
 * as driver for getting the rendered HTML.
 */
import _browserless from 'browserless';
import { CANON_ANIMATED_TV, CANON_ST_MOVIES, CANON_ST_TV } from '../src/sharedConstants.js';
import _async from 'async';

const browserless = _browserless();

const NUM_OF_PARALLEL_PROCS = 30;

const rfc3986EncodeURIComponent = (str) => {
	return encodeURIComponent(str).replace(/[!'()*]/g, escape);
};

const getContent = async (url, browserContext) => {
	const promise = getHTML(url, { getBrowserless: () => browserContext });
	return promise;
};

const CANON_ST_TV_IDS = Object.values(CANON_ST_TV);

const CANON_ANIMATED_IDS = Object.values(CANON_ANIMATED_TV);

const CANON_ST_MOVIE_IDS = Object.values(CANON_ST_MOVIES);

const apiKey = process.env.API_KEY;

const TV_AGG_CREDIT_EP = (tvId) =>
	`https://api.themoviedb.org/3/tv/${tvId}/aggregate_credits?api_key=${apiKey}`;

const MOVIE_CREDIT_EP = (movieId) =>
	`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`;

const SPECIFIC_CREDIT_EP = (creditId) =>
	`https://api.themoviedb.org/3/credit/${creditId}?api_key=${apiKey}`;

let finalAggregateCredits = {};
let finalMissingWikiEntries = [];
let castCount = 0;
let playedCharacterCount = 0;
console.time('Start of data fetch');
let start = Date.now();
// populate the tv shows first
const allStMedia = [...CANON_ST_TV_IDS, ...CANON_ANIMATED_IDS, ...CANON_ST_MOVIE_IDS];

const generateOverlaps = (browserContext) => async (mediaId, cb) => {
	try {
		console.log('run it');
		const isMovie = CANON_ST_MOVIE_IDS.includes(mediaId);
		// we want the entire cast/crew list
		const aggRes = isMovie
			? await fetch(MOVIE_CREDIT_EP(mediaId))
			: await fetch(TV_AGG_CREDIT_EP(mediaId));
		const aggCreditData = await aggRes.json();
		// in this data, we get roles that need to be expanded via another endpoint.
		// for now I am focusing only on cast, not crew (TODO: crew are important so figure this out later)
		for (const castMembers of aggCreditData.cast) {
			castCount += 1;
			// the casting to array is done to account for movies, which don't have a roles array
			for (const role of [...(castMembers?.roles ?? [castMembers])]) {
				playedCharacterCount += 1;
				console.log('character count', playedCharacterCount);

				const credRes = await fetch(SPECIFIC_CREDIT_EP(role.credit_id));
				const roleData = await credRes.json();

				// to get character specific data I am pulling memory alpha. However, to avoid needless execution time (each crawl is about 2 seconds), first check whether the current role already exists in our data set, _and_ has a key called memAlphaMeta. Checking other keys is useless as they are diminishing; the biggest return is on cutting down crawl time which can sometimes be 10s
				const existingRole =
					existingStData[roleData.person.id]?.totalityOfRoles.find((e) => e.id === roleData.id) ||
					{};

				let mergedRoleData = { ...existingRole, ...roleData };

				if (
					!existingRole ||
					!existingRole?.memAlphaMeta ||
					(existingRole.memAlphaMeta && RECRAWL_EXISTING_CHARACTERS)
				) {
					// // crawl it!
					// on avg takes ~2.5 to ~8 seconds
					console.log('actor ', roleData.person.original_name);
					console.log('searching for ', roleData.media.character);
					const rankMatchPattern = new RegExp(ranksToStrip.join('|'), 'gi');
					// TODO: this works but takes a hell of long time
					const cleanedName = roleData.media.character
						.replace(rankMatchPattern, '')
						.replace(/[{()}]/g, '')
						.trim();
					console.log('cleaned name', cleanedName);
					await getContent(
						`https://memory-alpha.fandom.com/wiki/${rfc3986EncodeURIComponent(cleanedName)}`,
						browserContext,
					)
						.then(metascraper)
						.then((metadata) => {
							// the wiki accepts any garbage url happily, a '404' results in a site logo image as part of the meta data
							if (!metadata.image || metadata.image.includes('Site-logo.png')) {
								// it is exceedingly rare that a credited character does not show up in the fan wiki.
								console.log('Character not found ', roleData);
								finalMissingWikiEntries.push({
									actor: roleData.person.original_name,
									role: roleData.media.character,
								});
							} else {
								mergedRoleData.memAlphaMeta = metadata;
							}
						})
						.then(browserless.close);
					//.then(process.exit);
				}

				// we only care about a persons 'id' which remains fixed;
				// the goal is to just keep building the compendium of characters an actor plays and key it to their real world id.
				// this also avoids misnomers; such as given names and stage names being in conflict
				// (under the assumption that TMDB is accurate)
				const totalityOfRoles = finalAggregateCredits[roleData.person.id]?.totalityOfRoles;
				finalAggregateCredits[roleData.person.id] = {
					original_name: roleData.person.original_name,
					totalityOfRoles: totalityOfRoles
						? [...totalityOfRoles, mergedRoleData]
						: [mergedRoleData],
				};
			}
		}
		// cb(); // Call the callback after processing each mediaId
	} catch (error) {
		// cb(error); // Pass error to the callback if any
		console.log(error);
	}
};

await new Promise((resolve, reject) => {
	// create a browser context inside the main Chromium process
	const browserContext = browserless.createContext();
	_async.eachLimit(allStMedia, NUM_OF_PARALLEL_PROCS, generateOverlaps(browserContext), (err) => {
		browserContext.then((e) => e.destroyContext());
		if (err) reject(err);
		else resolve();
	});
});

console.timeEnd('Start of data fetch');

try {
	// data set
	fs.writeFileSync(
		'../src/routes/stData.js',
		`
	// fetched: ${new Date().toJSON().slice(0, 10).replace(/-/g, '/')}
	// total cast: ${castCount}
	// total characters: ${playedCharacterCount}
	// execution time ~ ${(Date.now() - start) / 1000}s
	export const data = ${JSON.stringify(finalAggregateCredits)}`,
	);

	// errata
	fs.writeFileSync(
		'./errata/errata.js',
		`
	// fetched: ${new Date().toJSON().slice(0, 10).replace(/-/g, '/')}
	// total: ${finalMissingWikiEntries.length}
	export const errata = ${JSON.stringify(finalMissingWikiEntries)}`,
	);
} catch (e) {
	console.error(e);
} finally {
	await browserless.close();
	process.exit();
}
