---
title: Project Tour
date: "2022-03-24T09:00:00.000Z"
description: |
  Let's take a look at the starting point code for our workshop project, a twitter clone
course: full-stack-typescript
order: 3
---

The GitHub repo for the workshop project is [here](https://github.com/mike-north/full-stack-ts).

## Project Setup

First, if you want to ensure you're using the correct Node.js and package manager versions, [install Volta](http://volta.sh)

```sh
# install Volta
curl https://get.volta.sh | bash

# install Node
volta install node
```

Then, check out a local copy of this repository

```sh
git clone git@github.com:mike-north/full-stack-ts
cd full-stack-typescript
```

Next, install the project dependencies

```sh
yarn
```

Build the project for the first time

```sh
yarn build
```

And finally, start the project

```sh
yarn dev
```

After the client and server build processes complete, you should see an "imitation Twitter" running on [http://localhost:1234](http://localhost:1234).

## Project tour

There are three top level folders

- `/client` - A React frontend
- `/server` - A Node.js backend
- `/shared` - Code that can be imported by both the frontend and backend

Each has its own `package.json`, and we're using [yarn workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/). This is a monorepo, but it's very simple in terms of tooling and running things.

Some interesting things to study before we dig in

- The `.eslintrc` file
- The `tsconfig.json` files
- The `db.json` file (this is the data for our database)
- Take a look at the entry points for both client and server
  - `/server/src/index.ts`
  - `/client/src/index.tsx`

## Commands we can run in this project

You can run the following, either within a sub-project (`client`, `server` or `shared`) or at the
top level folder for the repo.

- `yarn dev` "runs the thing"
- `yarn build` "builds the thing"
- `yarn lint` "lints the thing"

Give these a try.

**Note that running `yarn dev` in the `server` component will _also_ build and start the `client` project**. Effectively this means starting `server` will start the "whole app".

There's one more command we'll get into later, but doesn't work (yet) in the
starting point code

- `yarn codegen` "runs all code generation stuff for the thing"

## What state are we in at the start?

On the `master` branch of the course project,

- `client` runs on _all hardcoded data_ that's held in top-level module scope of various components. It is built with [parcel](https://parceljs.org/)
- `server` does not have any kind of API at all, but it has a working data store (built on [lowdb](https://github.com/typicode/lowdb)) in `./db.ts` that you can use to get records of various kinds.

## Where will we be by the end of the course?

- You'll be able to create new tweets
- Most of what you see on the screen will be driven by information in the database, and coming from the backend
- You'll be able to like and un-like tweets

## What won't we end up having to touch in this course?

- We won't mess with any CSS
- We won't have to install any dependencies
- We won't have to change the typescript config
- We won't have to worry about how the backend interacts with the database

Once you're ready, let's jump in to the project!
