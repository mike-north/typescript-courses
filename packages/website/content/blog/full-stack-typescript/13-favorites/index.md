---
title: Favorites Interactivity
date: "2022-03-24T09:00:00.000Z"
description: |
  Let's make our "like" button clickable, by creating and deleting a "favorite" resource
course: full-stack-typescript
order: 13
---

## Schema

Update your `graphql.schema` by adding the following

```graphql
input FavoriteInput {
  userId: String!
  tweetId: String!
}
```

and add add two new mutations

```diff
type Mutation {
  createTweet(userId: String!, body: String!): Tweet!
+ createFavorite(favorite: FavoriteInput!): Favorite!
+ deleteFavorite(favorite: FavoriteInput!): Favorite!
}
```

In `client/src/Tweet.tsx` add these imports

```ts
import { gql } from "@apollo/client"
import {
  useCreateFavoriteMutation,
  useDeleteFavoriteMutation,
} from "./generated/graphql"
import { GET_TIMELINE_TWEETS } from "./Timeline"
import { GET_CURRENT_USER } from "./App"
```

and add two new mutations

```ts
export const CREATE_FAVORITE = gql`
  mutation CreateFavorite($favorite: FavoriteInput!) {
    createFavorite(favorite: $favorite) {
      id
    }
  }
`
export const DELETE_FAVORITE = gql`
  mutation DeleteFavorite($favorite: FavoriteInput!) {
    deleteFavorite(favorite: $favorite) {
      id
    }
  }
`
```

Run `yarn codegen` in both the `client` and `server` sub-projects to get
updated TS types that include this change to the schema and queries

## Backend

In `server/src/resolvers/Mutation.ts` add an import

```ts
import { favoriteTransform } from "../transforms"
```

and add two new resolvers for the new mutations

```ts
  async createFavorite(_parent, args, { db }) {
    const { favorite } = args;
    const fav = await db.createFavorite(favorite);
    return {
      ...favoriteTransform(fav),
      user: db.getUserById(fav.userId),
      tweet: tweetTransform(db.getTweetById(fav.tweetId)),
    };
  },
  async deleteFavorite(_parent, args, { db }) {
    const { favorite } = args;
    const fav = await db.deleteFavorite(favorite);
    return {
      ...favoriteTransform(fav),
      user: db.getUserById(fav.userId),
      tweet: tweetTransform(db.getTweetById(fav.tweetId)),
    };
  },

```

## Frontend

In `client/src/Tweet.tsx`, inside the component

Make a small adjustment to the destructured assignment of the tweet object

```diff
-  id: _id,
+  id,
```

add hooks for the two new mutations

```ts
const [createFavorite, { error: createFavoriteError }] =
  useCreateFavoriteMutation({
    variables: {
      favorite: { tweetId: id, userId: currentUserId },
    },
    refetchQueries: [GET_TIMELINE_TWEETS, GET_CURRENT_USER],
  })
const [deleteFavorite, { error: deleteFavoriteError }] =
  useDeleteFavoriteMutation({
    variables: {
      favorite: { tweetId: id, userId: currentUserId },
    },
    refetchQueries: [GET_TIMELINE_TWEETS, GET_CURRENT_USER],
  })

if (createFavoriteError) {
  return (
    <p>
      Error creating favorite: {createFavoriteError.message}
    </p>
  )
}
if (deleteFavoriteError) {
  return (
    <p>
      Error deleting favorite: {deleteFavoriteError.message}
    </p>
  )
}
```

replace the contents of `handleFavoriteClick` with

```ts
if (isFavorited)
  deleteFavorite().catch((err) =>
    console.error("error while deleting favorite", err)
  )
else
  createFavorite().catch((err) =>
    console.error("error while creating favorite", err)
  )
```

Now try liking and un-liking tweets. You should see the like count and icon change!
