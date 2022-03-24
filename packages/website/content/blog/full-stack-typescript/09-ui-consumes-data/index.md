---
title: Data from the database
date: "2022-03-24T09:00:00.000Z"
description: |
  Let's get some data from our database flowing through GraphQL and into the UI
course: full-stack-typescript
order: 9
---

Open `server/src/resolvers/Query.ts` and replace the fixture array in `suggestions()` with a call
to the db.

```ts
  suggestions: (_, __, { db }) => {
    return db.getAllSuggestions();
  },
```

And do something similar for `currentUser`, using the first user in the DB as the "current one"

```ts
currentUser: (_, __, { db }) => {
  const [firstUser] = db.getAllUsers();
  if (!firstUser)
    throw new Error(
      'currentUser was requested, but there are no users in the database'
    );
  return firstUser;
},
```

Save everything, and you should now see **four suggestions** in the UI
![Four suggestions](./4-suggestions.png)

Next, let's deal with **nested data** in two different situations
