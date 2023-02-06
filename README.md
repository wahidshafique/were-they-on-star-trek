## Were they on star trek!?

This is a website that is largely just from my own curiosity as a Star Trek and general TV/Movie watcher.

It happened by me remembering if I saw a character from Better Call Saul (and Breaking Bad), Tuco Salamanca (played by Raymond Cruz) anywhere in Star Trek.

This guy on the left over here:

<img src="https://s.abcnews.com/images/Entertainment/ht_better_call_saul_raymond_cruz_js_150217_16x9_992.jpg" width="300">

Well, turns out he had a small role in [Star Trek Deep Space 9](https://en.wikipedia.org/wiki/Star_Trek:_Deep_Space_Nine)!

<img src=
"https://pbs.twimg.com/media/DbUi3fjU0AAEFKz?format=jpg&name=medium"
width="300">

Its always interesting to see how many actors got their breaks on Star Trek.

## How it works

Enter in whatever show, actor, or movie you're curious about, and the site will list out any intersecting actors/appearances between said media entity and the Star Trek universe at large.

The project uses netlify and netlify functions implicitly, so I deployed there and passed in an `API_TOKEN` via the following instructions [here](https://developers.themoviedb.org/3/getting-started/introduction)).

The only items it's comparing against are [canonical](https://en.wikipedia.org/wiki/List_of_Star_Trek_films#:~:text=The%20Star%20Trek%20canon%20includes,animated%20series%2C%20and%20thirteen%20films.) entries in the series. As of now only actors are considered.

> The Star Trek canon includes the original series, seven spin-off television series, three animated series, and thirteen films.

The app uses TMDB as well as [Memory Alpha](https://www.themoviedb.org/bible/general#59f792a29251413e93000002) to source data.

## Popularity Score

I used Supabase, so a `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` is used to aggregate what a user searches.

The first page displays a list of popular searches. These are added to a Supabase and are only ever upserted, so after an initial entry is created, any subsequent hits increases a counter. Everything is anonymized, and uses a simple [rpc](https://supabase.com/docs/reference/javascript/rpc)

```
BEGIN
    INSERT INTO popular_searches(media_id, name)
    VALUES (media_id_to_upsert, name_to_upsert)
    ON CONFLICT (media_id)
    DO
        UPDATE SET hits = popular_searches.hits + 1;
END
```

"Partial" searches are never honored, only when a user clicks into a media entity (like a tv show or movie), does the database get updated.

The list of displayed popular items is updated on `build` periodically, as having it be real time is a bit of an overkill at this point.

## Random Musings

It seems like sometimes the entire appearance list of an actor is not present. For example, the entry for Jeffrey Combs in DS9 gives only `Brunt` or `Weyoun / Officer Mulkahey`, but never just `Weyoun`. The latter character appears in _many_ episodes of DS9, but the API is only counting...limited/hybrid appearances. Not sure why this is the case..

As it turns out, the TMDB database itself was incomplete on certain appearances. It relies on [user](https://www.themoviedb.org/bible/general#59f792a29251413e93000002) lead corrections and entries; so any registered member is capable of making changes. As this project goes on, I suppose it may lead to a richer TMDB database compendium of star trek entries; mirroring data found on Memory Alpha.

Also after going with the angle of, lets crawl MemoryAlpha and fill out character data that way (which takes like 9 hours by the way); I discovered that the site has a [db dump](https://memory-alpha.fandom.com/wiki/Memory_Alpha:Database_download). _However_ it did not contain direct links to images, therefore it is largely useless since I can't decipher the standard format of all the stuff that comes before the `fileName` that might be listed in the aforementioned xml dump.

See the url here:

`https://static.wikia.nocookie.net/memoryalpha/images/9/9a/Q%2C_2364.jpg/revision/latest?cb=20220307152252&path-prefix=en`

compared to:

`https://static.wikia.nocookie.net/memoryalpha/images/3/38/Borg-symbol.jpg/revision/latest?cb=20091016022015&path-prefix=en`

While we have the `fileName` in the xml dump, we don't know what folder it can be in, `9/9a` etc. So the strategy of crawling Memory Alpha stands for now. The only things to look out for missing characters or non-canonical names.

## Reddit

At some point I posted this to Reddit [here](https://www.reddit.com/r/startrek/comments/10uhoiv/i_made_a_site_to_answer_were_they_on_star_trek/) and within 24hrs it got about ~15k impressions, and the popularity data set had about ~2k requests made to it.

One interesting outcome of pre-populating the "most searched" with my own data to start with was that rather than it reflect what the subreddit truly was interesting in, it actually just attenuated the "fake" top searches so that they became the real top searches. I guess I should have wiped the db clean before hand to ensure there was no biasing.

Another fun meta game people came up with was trying to find the most overlapped show. Currently its CSI according to this [comment](https://www.reddit.com/r/startrek/comments/10uhoiv/comment/j7cx020/?utm_source=share&utm_medium=web2x&context=3).

I hope the app is useful, and as time goes on, the delta between non-canonical names listed on TMDB vs Memory Alpha closes (see [here](dataOperations/errata/readme.md)).
