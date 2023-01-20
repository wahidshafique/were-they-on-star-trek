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

const TV_AGG_CREDIT_EP = (tvId) =>
	`https://api.themoviedb.org/3/tv/${tvId}/aggregate_credits?api_key=${apiKey}`;

const TV_SPECIFIC_CREDIT_EP = (creditId) =>
	`https://api.themoviedb.org/3/credit/${creditId}?api_key=${apiKey}`;

let finalAggregateCredits = {};

// populate the tv shows first
for (const tvId of [...CANON_ST_TV_IDS, ...CANON_ANIMATED_IDS]) {
	// we want the entire cast/crew list
	const aggRes = await fetch(TV_AGG_CREDIT_EP(tvId));
	const aggCreditData = await aggRes.json();
	// in this data, we get roles that need to be expanded via another endpoint
	for (const castMembers of aggCreditData.cast) {
		// there are ~3465 entries to loop over here, each api call is ~8ms. So this entire thing should take about 30 seconds to run per show
		for (const role of castMembers.roles) {
			console.count('roles');
			const credRes = await fetch(TV_SPECIFIC_CREDIT_EP(role.credit_id));
			const roleData = await credRes.json();
			// TODO: maybe fetch meta data here about character, if applicable from mem-alpha
			// we only care about a persons 'credit id' which remains fixed;
			// the goal is to just keep building the compendium of characters an actor plays and key it to their real world id.
			// this also avoids misnomers; such as given names and stage names being in conflict
			// (under the assumption that TMDB is accurate)
			const totalityOfRoles = finalAggregateCredits[roleData.person.id]?.totalityOfRoles;
			finalAggregateCredits[roleData.person.id] = {
				original_name: roleData.person.original_name,
				totalityOfRoles: totalityOfRoles ? [...totalityOfRoles, roleData] : [roleData],
			};
		}
	}
}

fs.writeFile(
	'./src/routes/stData.js',
	`
	// fetched ${new Date().toJSON().slice(0, 10).replace(/-/g, '/')}
	export const data = ${JSON.stringify(finalAggregateCredits)}`,
	(err) => {
		if (err) {
			console.error(err);
		}
		console.log('write success');
		process.exit();
		// file written successfully
	},
);

const getContent = async (url) => {
	// create a browser context inside the main Chromium process
	const browserContext = browserless.createContext();
	const promise = getHTML(url, { getBrowserless: () => browserContext });
	// close browser resources before return the result
	promise.then(() => browserContext).then((browser) => browser.destroyContext());
	return promise;
};
