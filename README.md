# now-playing-feed

A Node.js server using [Express 4](http://expressjs.com/). Returns one latest #NowPlaying tweet with Spotify object about the playing item.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/)

```sh
$ git clone https://github.com/ossoa/now-playing-feed.git # or clone your own fork
$ cd now-playing-feed
$ yarn
$ yarn start
```

Set config variables with your Twitter and Spotify API keys, tokens and secrets. Create a new Twitter app [here](https://apps.twitter.com) and new Spotify app [here](https://developer.spotify.com/my-applications).

Your app should now be running on [localhost:3000](http://localhost:3000/).
