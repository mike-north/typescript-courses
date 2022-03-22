---
title: "Challenge 2: Typing jQuery"
date: "2022-03-22T09:00:00.000Z"
description: |
  Just for fun (and practice), we'll write our own version of jQuery, built on
  top of the now standardized DOM APIs.
course: making-typescript-stick
order: 6
---

## What's a jQuery?

Back in the age of inconsistent DOM APIs (I'm looking at you IE6)
there arose a _dominant_ solution that allowed us to do things
very similar to `document.querySelector` and many other things.

## The Challenge

We're going to write our own version of _part of_ this API surface, _with types!_.

Here are some slightly modified code snippets from the jQuery [getting started page](https://jquery.com/)

```ts twoslash
// @noImplicitAny: false
const $: any = {}

/**
 * Get the <button> element with the class 'continue'
 * and change its HTML to 'Next Step...'
 */
$("button.continue").html("Next Step...")

/**
 * Show the #banner-message element that is hidden with visibility:"hidden" in
 * its CSS when any button in #button-container is clicked.
 */
const hiddenBox = $("#banner-message")
$("#button-container button").on("click", (event) => {
  hiddenBox.show()
})

/**
 * Make an API call and fill a <div id="post-info">
 * with the response data
 */
$.ajax({
  url: "https://jsonplaceholder.typicode.com/posts/33",
  success: (result) => {
    $("#post-info").html(
      "<strong>" + result.title + "</strong>" + result.body
    )
  },
})
```

You're going to define something that emulates this kind of behavior.

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
cd challenges/jquery-clone
```

You can now run the test suite to see if you've defined an "equivalent" API
surface. Your job is to modify the code in `./src/index.ts` until all of the existing
tests pass.

## Hints

- For the `$.ajax` function, make sure to take advantage of `node-fetch`

```ts
import { default as fetch } from "node-fetch"
```

- Remember that we can stack a namespace on top of a function

```ts twoslash
function $() {}

namespace $ {
  export function ajax() {}
  export function html() {}
}

export default $
```
