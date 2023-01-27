import fs from 'fs';
import 'dotenv/config.js';
import getHTML from 'html-get';

import _metascraper from 'metascraper';
//import title from 'metascraper-title';
import image from 'metascraper-image';
import desc from 'metascraper-description';
import url from 'metascraper-url';
import { data as existingStData } from './src/routes/stData.js';

const RECRAWL_EXISTING_CHARACTERS = false;

const metascraper = _metascraper([image(), desc(), url()]);
/**
 * `browserless` will be passed to `html-get`
 * as driver for getting the rendered HTML.
 */
import _browserless from 'browserless';

const browserless = _browserless();

const rfc3986EncodeURIComponent = (str) => {
	return encodeURIComponent(str).replace(/[!'()*]/g, escape);
};

const getContent = async (url) => {
	// create a browser context inside the main Chromium process
	const browserContext = browserless.createContext();
	const promise = getHTML(url, { getBrowserless: () => browserContext });
	// close browser resources before return the result
	promise.then(() => browserContext).then((browser) => browser.destroyContext());
	return promise;
};

/** A helper that fetches and squishes various canonical star trek shows into a format that's useful for this app. This is what I used to generate the stData.json */

const CANON_ST_TV_IDS = [
	// 253, // tos
	// 655, // tng
	580, // ds9
	// 1855, // voy
	// 314, // ent
	// 67198, // disco
	// 85949, // picard
	// 9030, // snw
];

const CANON_ANIMATED_IDS = [
	// 1992, // tas
	// 85948, // low
	// 106393, // prod
];

const CANON_ST_MOVIE_IDS = [
	152, // motion picture
	154, // wrath of khan
	157, // search for spock
	168, // voyage home
	172, // final frontier
	174, // undiscovered country

	193, // generations
	199, // first contact
	200, // insurrection
	201, // nemesis

	13475, // star trek
	106393, // into darkness
	106393, // beyond
];

const apiKey = process.env.API_KEY;

const TV_AGG_CREDIT_EP = (tvId) =>
	`https://api.themoviedb.org/3/tv/${tvId}/aggregate_credits?api_key=${apiKey}`;

const TV_SPECIFIC_CREDIT_EP = (creditId) =>
	`https://api.themoviedb.org/3/credit/${creditId}?api_key=${apiKey}`;

let finalAggregateCredits = {};
let finalMissingWikiEntries = [];
let castCount = 0;
let playedCharacterCount = 0;

console.time('Start of data fetch');
let start = Date.now();
// populate the tv shows first
for (const tvId of [...CANON_ST_TV_IDS, ...CANON_ANIMATED_IDS]) {
	// we want the entire cast/crew list
	const aggRes = await fetch(TV_AGG_CREDIT_EP(tvId));
	const aggCreditData = await aggRes.json();
	// in this data, we get roles that need to be expanded via another endpoint.
	// for now I am focusing only on cast, not crew
	for (const castMembers of aggCreditData.cast) {
		// there are ~3465 character entries to loop over here, each api call is ~8ms. So this entire thing should take about 30 seconds to run per show
		castCount += 1;
		for (const role of castMembers.roles) {
			playedCharacterCount += 1;
			const credRes = await fetch(TV_SPECIFIC_CREDIT_EP(role.credit_id));
			const roleData = await credRes.json();

			// to get character specific data I am pulling memory alpha. However, to avoid needless execution time (each crawl is about 2 seconds), first check whether the current role already exists in our data set, _and_ has a key called memAlphaMeta. Checking other keys is useless as it runs much faster; the biggest return is on cutting down crawl time
			const existingRole =
				existingStData[roleData.person.id]?.totalityOfRoles.find((e) => e.id === roleData.id) || {};

			let mergedRoleData = { ...existingRole, ...roleData };

			if (
				!existingRole ||
				!existingRole?.memAlphaMeta ||
				(existingRole.memAlphaMeta && RECRAWL_EXISTING_CHARACTERS)
			) {
				// crawl it!
				// on avg takes ~2.5 seconds
				console.log('actor ', roleData.person.original_name);
				console.log('searching for ', roleData.media.character);
				// await getContent(
				// 	`https://memory-alpha.fandom.com/wiki/${rfc3986EncodeURIComponent(
				// 		roleData.media.character,
				// 	)}`,
				// )
				// 	.then(metascraper)
				// 	.then((metadata) => {
				// 		console.log(metadata);
				// 		// the wiki accepts any garbage url happily, a '404' results in a site logo image as part of the meta data
				// 		if (!metadata.image || metadata.image.includes('Site-logo.png')) {
				// 			// it is exceedingly rare that a credited character does not show up in the fan wiki.
				// 			console.log('Character not found ', roleData);
				// 			finalMissingWikiEntries.push({
				// 				actor: roleData.person.original_name,
				// 				role: roleData.media.character,
				// 			});
				// 		} else {
				// 			mergedRoleData.memAlphaMeta = metadata;
				// 		}
				// 	})
				// 	.then(browserless.close);
				//.then(process.exit);

				//process.exit();
			}

			// if (existingRole.memAlpha && RECRAWL_EXISTING_CHARACTERS) {
			// console.log('hey this already exists!', existingRole);
			// }

			//			process.exit();

			// we only care about a persons 'id' which remains fixed;
			// the goal is to just keep building the compendium of characters an actor plays and key it to their real world id.
			// this also avoids misnomers; such as given names and stage names being in conflict
			// (under the assumption that TMDB is accurate)
			const totalityOfRoles = finalAggregateCredits[roleData.person.id]?.totalityOfRoles;
			finalAggregateCredits[roleData.person.id] = {
				original_name: roleData.person.original_name,
				totalityOfRoles: totalityOfRoles ? [...totalityOfRoles, mergedRoleData] : [mergedRoleData],
			};
		}
	}
}

// movies

// data set
fs.writeFileSync(
	'./src/routes/stData.js',
	`
	// fetched: ${new Date().toJSON().slice(0, 10).replace(/-/g, '/')}
	// total cast: ${castCount}
	// total characters: ${playedCharacterCount}
	// execution time ~ ${(Date.now() - start) / 1000}
	export const data = ${JSON.stringify(finalAggregateCredits)}`,
	(err) => {
		if (err) {
			console.error(err);
		}
		console.timeEnd('Start of data fetch');
		console.log('write success');
		// file written successfully
	},
);

// errata
fs.writeFileSync(
	'./errata/errata.js',
	`
	// fetched: ${new Date().toJSON().slice(0, 10).replace(/-/g, '/')}
	export const errata = ${JSON.stringify(finalMissingWikiEntries)}`,
	(err) => {
		if (err) {
			console.error(err);
		}
		console.timeEnd('Start of data fetch');
		console.log('write success');
		// file written successfully
	},
);
