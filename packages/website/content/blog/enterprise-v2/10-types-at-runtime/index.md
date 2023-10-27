---
title: Types At Runtime
date: "2023-10-27T09:00:00.000Z"
description: |
  We'll add some type guards to our project, and use them as the all-important "glue" joining compile-time type-checking and runtime behavior
course: enterprise-v2
order: 10
---

## Types at Runtime

TypeScript is a build-time-only tool, and this is part of why it performs well.
The cost of a runtime type system is not trivial, and in browsers (particularly
on limited-performance devices like cheap android phones) there's not a whole
lot of performance to spare.

What we can do is take advantage of places where compile-time type-checking and
runtime behavior align, to ensure that our static tools (like TS) provide
information that's as _complete_ as possible.

User-defined type guards are one of the most important tools available to
accomplish this.

We're going to start exactly where we left off in the previous exercise

```ts
--- a/src/utils/networking.ts
+++ b/src/utils/networking.ts
@@ -28,7 +28,7 @@ async function getJSON(input: RequestInfo, init?: RequestInit) {
  * @param path
  * @param init
  */
-export async function apiCall(path: string, init?: RequestInit) {
+export async function apiCall(path: string, init?: RequestInit): Promise<unknown> {
   let response;
   let json;
   try {
```

and use type guards to ensure that we have _some_ validation of incoming
data at runtime, without doing something foolish like attempting to
run the ts compiler in each user's browser. All of the files that use this `apiCall` function will now be unhappy, and it's your job to make some user-defined type guards to make things work again.

create a new file [`src/type-guards.ts`](../src/type-guards.ts) and build
the following functions such that they provide a meaningful runtime check that can be used as a guard for compile-time type-checking.

```ts
import { IChannel, IMessage, ITeam } from './types';

export function isTypedArray<T>(
  arr: unknown,
  check: (x: any) => x is T,
): arr is T[] {}

export function isTeam(arg: any): arg is ITeam {}

export function isChannel(arg: any): arg is IChannel {}

export function isMessage(arg: any): arg is IMessage {}
```

and then apply these guards for all files in the [`/src/data/`](../src/data) folder using patterns like

```ts twoslash
function apiCall(path: string): Promise<unknown> {return Promise.resolve(null as unknown)}
const id: string = 'asd'
function isChannel(arg: any): arg is IChannel {return true}
function isTypedArray<T>(
  arr: unknown,
  check: (x: any) => x is T,
): arr is T[] { return true}
interface IChannel {}
/// ---cut---
// Single resource
apiCall(`Channels/${id}`)
  .then(channel => {
//         ^?
    if (!isChannel(channel))
      throw new Error('getChannelById: received invalid data from server')
    return channel;
//          ^?
  })

// Collection
apiCall(`Channels`)
  .then(channels => {
//         ^?
    if (!isTypedArray(channels, isChannel))
      throw new Error('getChannels: received invalid data from server')
    return channels;
//          ^?
  })

```
