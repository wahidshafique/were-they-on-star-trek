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

## Random Musings

It seems like sometimes the entire appearance list of an actor is not present. For example, the entry for Jeffrey Combs in DS9 gives only `Brunt` or `Weyoun / Officer Mulkahey`, but never just `Weyoun`. The latter character appears in _many_ episodes of DS9, but the API is only counting...limited/hybrid appearances. Not sure what this is the case..
