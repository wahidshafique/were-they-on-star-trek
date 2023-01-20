import fs from 'fs';
import 'dotenv/config.js';
import getHTML from 'html-get';
/**
 * `browserless` will be passed to `html-get`
 * as driver for getting the rendered HTML.
 */
import _browserless from 'browserless';

const browserless = _browserless();

/** A helper that fetches and squishes various canonical star trek shows into a format that's useful for this app. This is what I used to generate the stData.json */

const CANON_ST_TV_IDS = [
	253, // tos
	655, // tng
	580, // ds9
	1855, // voy
	314, // ent
	67198, // disco
	85949, // picard
	9030, // snw
];

const CANON_ANIMATED_IDS = [
	1992, // tas
	85948, // low
	106393, // prod
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

const sleep = (m) => new Promise((r) => setTimeout(r, m));

const TV_AGG_CREDIT_EP = (tvId) =>
	`https://api.themoviedb.org/3/tv/${tvId}?api_key=${apiKey}&append_to_response=aggregate_credits`;

const TV_SPECIFIC_CREDIT_EP = (creditId) =>
	`https://api.themoviedb.org/3/credit/${creditId}?api_key=${apiKey}`;

let finalAggregateCredits = [];

// populate the tv shows first
for (const tvId of [...CANON_ST_TV_IDS, ...CANON_ANIMATED_IDS]) {
	// we want the entire cast/crew list
	const aggRes = await fetch(TV_AGG_CREDIT_EP(tvId));
	const creditData = await aggRes.json();
	// in this data, we get roles that need to be expanded via another endpoint
	for (const [castMemberIndex, castMembers] of creditData.aggregate_credits.cast.entries()) {
		// there are ~3465 entries to loop over here, each api call is ~8ms. So this entire thing should take about 30 seconds to run per show
		for (const [roleIndex, role] of castMembers.roles.entries()) {
			console.count('roles');
			const credRes = await fetch(TV_SPECIFIC_CREDIT_EP(role.credit_id));
			const roleData = await credRes.json();
			creditData.aggregate_credits.cast[castMemberIndex].roles[roleIndex] = {
				...creditData.aggregate_credits.cast[castMemberIndex].roles[roleIndex],
				...roleData,
			};
		}
	}
	finalAggregateCredits.push(creditData);
}

fs.writeFile('stData.js', `export const data = ${JSON.stringify(finalAggregateCredits)}`, (err) => {
	if (err) {
		console.error(err);
	}
	// file written successfully
});

const getContent = async (url) => {
	// create a browser context inside the main Chromium process
	const browserContext = browserless.createContext();
	const promise = getHTML(url, { getBrowserless: () => browserContext });
	// close browser resources before return the result
	promise.then(() => browserContext).then((browser) => browser.destroyContext());
	return promise;
};
