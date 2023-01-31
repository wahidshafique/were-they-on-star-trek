export enum mediaEntityEnum {
	movie = 'movie',
	tv = 'tv',
	person = 'person',
}

type mediaEntityType = keyof typeof mediaEntityEnum;
export interface FilteredSearchResult {
	image: string | null;
	/** normalized for both movies and tv */
	name: string;
	type: mediaEntityType;
	/** used for subsequent searching */
	id: string;
}

export type FilteredSearchResults = FilteredSearchResult[] | [];

export interface FoundPersonOnStarTrek {
	original_name: string;
	totalityOfRoles?: Role[];
}

export interface IntersectingPeopleOnStarTrek {
	original_name: string;
	totalityOfMatchingActors?: {
		queriedActor: FilteredSearchResult;
		totalityOfStarTrekRoles?: Role[];
	}[];
}

export interface Role {
	credit_type: string;
	department: string;
	media: TvMedia | MovieMedia;
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
