export interface FilteredSearchResult {
	image: string;
	/** normalized for both movies and tv */
	name: string;
}

export type FilteredSearchResults = FilteredSearchResult[] | [];
