---
title: "Challenge 1: Building a typed data store"
date: "2022-03-22T09:00:00.000Z"
description: |
  Let's practice using template literal types, mapped types and generics
  by building our typed data store.
course: making-typescript-stick
order: 4
---

## The Challenge

Let's get some hands on experience working with template literal types by building a
data store, whose method names are based on the type of entities we're managing.

If you look at [the starting point code](https://github.com/mike-north/making-typescript-stick/blob/ede0b030f21eda4caaa293cf7c4a605281cee72d/challenges/data-layer/src/index.ts) for this exercise, you'll
see the following

```ts twoslash {11-14}
export interface DataEntity {
  id: string
}
export interface Movie extends DataEntity {
  director: string
}
export interface Song extends DataEntity {
  singer: string
}

export type DataEntityMap = {
  movie: Movie
  song: Song
}

export class DataStore {}
```

This `DataEntityMap` object should drive a lot of what happens to `DataStore`.

Ultimately, `DataStore` should end up with methods like

```ts
const ds = new DataStore()
ds.addSong({ id: "song-123", singer: "The Flaming Lips" })
ds.addMovie({
  id: "movie-456",
  director: "Stephen Spielberg",
})
ds.getSong("song-123") // returns the song
ds.getMovie("movie-456") // returns the movie
ds.getAllSongs() // array of all songs
ds.getAllMovies() // array of all movies
ds.clearSongs() // clears all songs
ds.clearMovies() // clears all movies
```

It's ok to define these explicitly in the `DataStore` class, but they should be
type-checked against the `DataEntityMap` type in some way.

### Requirements

- If you mis-name a method on the class (e.g., `getSongs` instead of `getAllSongs`), you should
  get some sort of type error that alerts you that you've broken the established pattern
- If you add a new entity like `Comic` (shown below) _and make no other changes to your solution_,
  you should get some sort of type error that alerts you to the absence of a `clearComics`,
  `getAllComics` and `getAllSongs` method.

```diff
+export interface Comic extends DataEntity {
+  issueNumber: number
+}

export type DataEntityMap = {
  movie: Movie
  song: Song
+  comic: Comic
}
```

- There should be no externally-visible properties on an instance of `DataStore` beyond the required methods
- Your code, and the test suite should type-check
- All pre-existing tests should pass

## Setup

First, if you haven't done so already, clone the workshop project
for this course

```sh
git clone https://github.com/mike-north/making-typescript-stick
cd making-typescript-stick
```

Make sure you have [Volta](https://volta.sh/) installed. If you haven't
done so already, just run the following to install it

```sh
curl https://get.volta.sh | bash
```

Next, let's install our dependencies

```sh
yarn
```

and finally, let's navigate to the folder containing this specific challenge

```sh
cd challenges/data-layer
```

You can now run the test suite by running `yarn test`

Your job is to modify the code in `./src/index.ts` until all of the requirements of this exercise are met

## Hints

- Brush up on [indexed access types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)
- Brush up on [mapped types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html), and in particular [the new "key remapping" feature](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as) that landed in TS 4.1
- Brush up on [template literal types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
