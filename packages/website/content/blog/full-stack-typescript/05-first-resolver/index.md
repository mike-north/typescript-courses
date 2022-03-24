---
title: First Resolver
date: "2022-03-24T09:00:00.000Z"
description: |
  We'll make our first GraphQL resolver, to make our new API queryable
course: full-stack-typescript
order: 5
---

Go back to the `server/src/apollo-server.ts` file, remove the underscore before `_db` here

```diff
export async function createApolloServer(
-  _db: Db,
+  db: Db,
  httpServe
```

and insert the following code immediately before you create an instance of `ApolloServer`.

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
```

Pass this `resolvers` variable

```diff
  const server = new ApolloServer({
    typeDefs,
+    resolvers,
+    context: () => ({ db }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
```

You should now be able to run the following query in the apollo dev tools.

```graphql
query CurrentUser {
  currentUser {
    name
  }
}
```

and see a response like

```json twoslash
{
  "data": {
    "currentUser": {
      "name": "John Doe"
    }
  }
}
```
