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

Enter in whatever show or movie you're curious about, and the site will list out any intersecting actors between said show and the Star Trek universe at large.

The project uses netlify and netlify functions implicitly, so you need to deploy there and pass in an `API_TOKEN` to the env (you can grab one by following instructions [here](https://developers.themoviedb.org/3/getting-started/introduction)).

The only items it's comparing against are [canonical](https://en.wikipedia.org/wiki/List_of_Star_Trek_films#:~:text=The%20Star%20Trek%20canon%20includes,animated%20series%2C%20and%20thirteen%20films.) entries in the series.

> The Star Trek canon includes the original series, seven spin-off television series, three animated series, and thirteen films.

It uses TMDB as well as [Memory Alpha](https://www.themoviedb.org/bible/general#59f792a29251413e93000002) to source data.

## Random Musings

It seems like sometimes the entire appearance list of an actor is not present. For example, the entry for Jeffrey Combs in DS9 gives only `Brunt` or `Weyoun / Officer Mulkahey`, but never just `Weyoun`. The latter character appears in _many_ episodes of DS9, but the API is only counting...limited/hybrid appearances. Not sure why this is the case..

As it turns out, the TMDB database itself was incomplete on certain appearances. It relies on [user](https://www.themoviedb.org/bible/general#59f792a29251413e93000002) lead corrections and entries; so any registered member is capable of making changes. As this project goes on, I suppose it may lead to a richer tmdb database compendium of star trek entries; mirroring data found on alpha prime.

Also after going with the angle of, lets crawl MemoryAlpha and fill out character data that way (which takes like 9 hours by the way); I discovered that the site has a [db dump](https://memory-alpha.fandom.com/wiki/Memory_Alpha:Database_download). _However_ it does not contain direct links to images, therefore its largely useless since I can't decipher the standard format of all the stuff that comes before the `fileName` that might be listed in the aforementioned xml dump.

See the url here: `https://static.wikia.nocookie.net/memoryalpha/images/9/9a/Q%2C_2364.jpg/revision/latest?cb=20220307152252&path-prefix=en`

compared to `https://static.wikia.nocookie.net/memoryalpha/images/3/38/Borg-symbol.jpg/revision/latest?cb=20091016022015&path-prefix=en`

While we have the `fileName` in the xml dump, we don't know what folder it can be in, `9/9a` etc. So the strategy of crawling stands for now. The only things to look out for missing characters or non-canonical names.
