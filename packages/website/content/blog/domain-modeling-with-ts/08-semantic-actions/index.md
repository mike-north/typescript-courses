---
title: "Semantic Actions"
order: 9
date: "2025-06-10T09:00:00.000Z"
description: "Build highly-specific operations as the verbs of your domain"
course: domain-modeling-with-ts
---

You may have dealt with CRUD APIs before -- that's not what we're going to be doing today. Yes, we have a couple of list endpoints, but when it comes to mutations, we want to have some very specific operations that give us an opportunity for some real business logic!

## Task 1

We have some client-side validation in `packages/client/src/lib/controllers/workspace-controller.ts` to help ensure we don't place a plant out-of-bounds (ideally this would be a shared piece of validation logic that could _also_ run on the back end). You may notice there's a fairly modular system that allows for validation rules to be flexibly defined.

> Have a conversation with your domain expert (or LLM) about the kinds of things that should prevent a plant from being placed in a given position within a bed (or within the bed at all)

## Task 2

In `packages/client/src/lib/repositories/workspace.repository.ts` you may notice that we're immediately throwing errors `addItemToWorkspace`. This method is called when a plant is dragged from the toolbar into one of the `Zone`s. Build an API endpoint on our server (handled by `packages/server/src/application/gardens-router.ts`) that places the plant in the raised bed (using whatever domain modeling you previously decided on) and returns the latest representation of a `Workspace`. You'll need to design new request/response types in `packages/types/src/resources/*`

## Bonus task

There's a "clone" operation as well that's called when you alt/command + drag an existing tile that's in a raised bed to create a copy. Wire this up similarly
