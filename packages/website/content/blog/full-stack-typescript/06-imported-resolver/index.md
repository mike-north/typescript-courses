---
title: Imported Resolver
date: "2022-03-24T09:00:00.000Z"
description: |
  To get the full advantage of one GraphQL schema that both client and server
  sub-projects use, we need to break it out into a separate file.
course: full-stack-typescript
order: 6
---

In this chapter, we'll get both our schema and resolver out of the `apollo-server.ts` file. Ideal

## Getting the schema out

Go back to the `server/src/apollo-server.ts` file take everything in the `gql` string template,
and put it in a file called `schema.graphql` in the root of the project (the repo root)

```graphql
# schema.graphql
type Query {
  currentUser: User!
  suggestions: [Suggestion!]!
}
type User {
  id: String!
  name: String!
  handle: String!
  coverUrl: String!
  avatarUrl: String!
  createdAt: String!
  updatedAt: String!
}
type Suggestion {
  name: String!
  handle: String!
  avatarUrl: String!
  reason: String!
}
```

Next go back to `server/src/apollo-server.ts` so we can import this file as our schema

Add the following imports

```ts
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader"
import { loadSchemaSync } from "@graphql-tools/load"
import { addResolversToSchema } from "@graphql-tools/schema"
import { GRAPHQL_SCHEMA_PATH } from "./constants"
```

This `GRAPHQL_SCHEMA_PATH` variable is the path of the `schema.graphql` file you just created

Next add this code right below the imports, in top-level module scope

```ts
const SCHEMA = loadSchemaSync(GRAPHQL_SCHEMA_PATH, {
  loaders: [new GraphQLFileLoader()],
})
```

And then where you're instantiating your `ApolloServer`

```diff
  const server = new ApolloServer({
-   typeDefs,
+   schema: addResolversToSchema({
+     schema: SCHEMA,
+   }),
    context: () => ({ db }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
```

You should be able to start up the server again, try this simple query again

```graphql
query CurrentUser {
  currentUser {
    name
  }
}
```

and get the same result as before

```json twoslash
{
  "data": {
    "currentUser": {
      "name": "John Doe"
    }
  }
}
```

## Getting the resolvers out

Create a new file in your project `server/src/resolvers.ts`.

Move the value held by the `resolvers` variable into this file, and make that value the default export

```ts
const resolvers = {
  Query: {
    currentUser: () => {
      return {
        id: "123",
        name: "John Doe",
        handle: "johndoe",
        coverUrl: "",
        avatarUrl: "",
        createdAt: "",
        updatedAt: "",
      }
    },
    suggestions: () => {
      return []
    },
  },
}
export default resolvers
```

Go back to `server/src/apollo-server.ts` and add the following import

```ts
import resolvers from "./resolvers"
```

Test the query again in Apollo explorer, and it should still work.

## Breaking up your resolver

If we keep this `resolvers.ts` as one big file, things will get unmanageable quickly.
We can break establish a pattern for breaking this file up into sub-parts

Create a new folder `server/src/resolvers` and a new file `server/src/resolvers/Query.ts`.

Move the object containing the `Query:` family of resolvers (`Query.currentUser`, `Query.suggestions`) into this new file

```ts
const queryTwitterResolvers = {
  currentUser: () => {
    return {
      id: "123",
      name: "John Doe",
      handle: "johndoe",
      coverUrl: "",
      avatarUrl: "",
      createdAt: "",
      updatedAt: "",
    }
  },
  suggestions: () => {
    return []
  },
}

export default queryTwitterResolvers
```

Finally, in your `server/src/resolvers.ts`, import this object, and wire it up where it was before

```ts
import queryTwitterResolvers from "./resolvers/Query"

const resolvers = {
  Query: queryTwitterResolvers,
}

export default resolvers
```

Test the example query in Apollo explorer one last time to make sure everything works.

Next, let's add some types before things get any more complicated!
