export enum mediaEntityEnum {
	movie = 'movie',
	tv = 'tv',
	person = 'person',
}

type mediaEntityType = keyof typeof mediaEntityEnum;

/** This is a user defined type that comes from our server. It melds together people/tv/movies
 * into a format used only for the search cards
 */
export interface FilteredSearchResult {
	image: string | null;
	/** normalized for both movies and tv */
	name: string;
	type: mediaEntityType;
	/** used for subsequent searching */
	id: number;
	/** when coming from pop json **/
	hits?: number;
	actor_overlaps?: number;
	originalTmdbUrl?: string;
	/** person specific, only when called via person search (not multi) */
	birthday?: string;
	deathday?: string;
	biography?: string;
}

export type FilteredSearchResults = FilteredSearchResult[] | [];

export interface FoundPersonOnStarTrek extends FilteredSearchResult {
	totalityOfRoles?: Role[];
}

interface ServerActorData extends FilteredSearchResult {
	profile_path: string;
	original_name: string;
	roles: Role[];
	/** if its a movie, then we get simply character */
	character?: string;
}

export interface IntersectingPeopleOnStarTrek extends FilteredSearchResult {
	original_name: string;
	totalityOfMatchingActors?: {
		queriedActorData: ServerActorData;
		totalityOfRoles?: Role[];
	}[];
}

export interface Role {
	credit_type: string;
	department: string;
	media: TvMedia | MovieMedia;
	character?: string;
	episode_count?: string;
	/** crawled data */
	memAlphaMeta?: {
		image: string;
		description: string;
		url: string;
	};
}

interface sharedRoleMediaProps {
	media_type: mediaEntityType;
	character: string;
}

interface TvMedia extends sharedRoleMediaProps {
	media_type: 'tv';
	original_name: string;
	episodes: {
		name: string;
		overview: string;
		air_date: string;
		season_number: number;
		episode_number: number;
		still_path: string;
	}[];
}

interface MovieMedia extends sharedRoleMediaProps {
	media_type: 'movie';
	original_title: string;
	overview: string;
	release_date: string;
}
