---
title: Project tour
date: "2025-06-12T09:00:00.000Z"
description: |
  A quick overview of this simple project structure
course: monorepos-v2
order: 2
---

This project, currently a small monolith, consists of a couple of things. We'll end up turning each of these areas into a dedicated package by the end of the course

### Model(s)

A TypeScript interface describing the file data (search for `seed-packet-model.ts`)

### Server

#### Data

A data file with some info about seed packets (search for `seeds.yml`)

#### API

A server that loads the data file and starts an express server to serve the data as JSON (entry point is `src/server/main.ts`). **This API is on [`http://localhost:3000/api/seeds`](http://localhost:3000/api/seeds)**

### UI

A Svelte 5 UI for fetching the data from the server and rendering some components in the browser (search for `App.svelte` as the entry point). **This UI is served on [`http://localhost:5173/`](http://localhost:5173/)**

### Utilities

Some utility functions in `src/utils`
