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
	totalityOfRoles: object[];
}
