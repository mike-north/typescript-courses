---
title: Hello Apollo
date: "2022-03-24T09:00:00.000Z"
description: |
  We'll get our GraphQL API up and running quickly and easily using Apollo server
course: full-stack-typescript
order: 4
---

Create a new file `server/src/apollo-server.ts` with the following contents

```ts
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core"
import {
  ApolloServer,
  ExpressContext,
  gql,
} from "apollo-server-express"
import * as express from "express"
import { Server } from "http"
import Db from "./db"

export async function createApolloServer(
  _db: Db,
  httpServer: Server,
  app: express.Application
): Promise<ApolloServer<ExpressContext>> {
  const typeDefs = gql`
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
  `

  const server = new ApolloServer({
    typeDefs,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
  })
  await server.start()
  server.applyMiddleware({ app })
  return server
}
```

In `server/src/index.ts` add the following imports

```ts
import { createApolloServer } from "./apollo-server"
import { createServer } from "http"
```

Next, add the following two lines immediately below the one that begins with `app.use('/static`

```ts
const httpServer = createServer(app)
const apolloServer = await createApolloServer(
  db,
  httpServer,
  app
)
```

To make your life easy, make one more change to the same file and give yourself a nice clickable link in your terminal to the apollo dev tools.

```diff
- chalk.bgWhite.black(`\thttp://localhost:${PORT}${''}\t`),
+ chalk.bgWhite.black(`\thttp://localhost:${PORT}${apolloServer.graphqlPath}\t`),
```

Make a git commit, and run `yarn dev` from within the `server` subfolder.

Looking for the link that says **"GraphQL API listening on [URL]"** and click on it. You should see the apollo dev tools.

BUT -- if you try to make a query of any kind, you'll immediately see an error. We have to create something called a **resolver** to actually grab the data that Apollo server will organize and deserialize for us.

Here's a basic query to try, **which we expect to fail at this point**.

```graphql
query CurrentUser {
  currentUser {
    name
  }
}
```
