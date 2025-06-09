---
title: "Introduction"
order: 1
date: "2025-06-10T09:00:00.000Z"
description: "Workshop overview, DDD motivation, and real-world context."
course: domain-modeling-with-ts
---

## What is DDD?

- An approach to building software such that it aligns well with business needs
- Emphasizes collaboration between technical and domain experts
- Involves defining a common language that developers and stakeholders can have common understanding and clear discussions

Modeling a domain involves coming up with an accurate understanding of how a problem space is structured, and how users or business stakeholders engage with it.

## Why I'm here to talk about it

- Stripe places a lot of value on domain modeling
- At Stripe, I'm the Product Architect for Stripe's developer platform. An important part of my job is making sure, across the company, that our products fit or compose together in ways that solve real problems for Stripe's users
- Learning how to practice domain modeling well, and the collaborative skills that DDD encourages, is a big part of what's fueled the latest phase of my career growth
- Agentic coding is changing the way we write software. Having well-defined software that clearly groups related concepts together allows LLMs to participate in the "shared language"

## Why DDD in TypeScript?

DDD can be applied with any programming language, but TypeScript is particularly well-suited to articulating a wide range of contracts and software shapes.

## What are we building today?

We need a complex set of problems to dive into, and I have a real set of problems that I wish I could solve with software. I have a big vegetable garden
![Garden downhill](./img/my-garden-2.jpeg)
We have a lot of raised beds
![Raised beds](./img/my-garden-1.jpeg)
And each raised bed contains a variety of plants
![Plants in a raised bed](./img/my-garden-3.jpeg)

There are so many things to manage here. We order seeds from catalogs
![Seed catalogs on a table](./img/catalogs-on-table.jpeg)
and now have a substantial collection of them
![Seed catalogs on a table](./img/seeds-on-table.jpeg)

  <h3 style="text-align: center"><em>Today, we're going to work on something to make this easier!</em></h3>

## Workshop Overview & Goals

We'll build a seed collection so we can keep track of what we have in the collection

![](./img/seed-catalog-ui.png)

And build an amazing drag and drop UI so that we can plan what we want to grow each year!

![](./img/garden-ui.png)

I'm going to be both your instructor and your Gardening Expert as we work on this app together. At the end of the course, you'll also be able to take your learning further as a "final project". This is a real app that will actually get used!

## Key points for the first part of content

- We're going to talk about domain modeling -- the process of taking a concept and manifesting it in software
- To do this well, you must understand the "domain" deeply.
- Stripe is known for doing this well. This is literally how the company made a name for itself. If you look at our API, you'll see concepts like `Customer`, `FinancialAccount`, `Invoice`, `Subscription` -- all of which are relatable names to anyone seeking a billing or payments solution (even a mechanic or pizza shop, etc...)
- Learning to do this well helps engineers working on products for non-coding users, connect with those users more effectively, and have conversations with them about the problem space and the software solution that solves/mitigates those problems
- At Stripe, I'm a Product Architect. I operate in this blurry area between Product and Eng on a very regular basis. Particularly with the trend of AI-assisted coding, if you're a product engineer, learning how to speak the language (and understand) the business is key to taking your career to the next level
- AI assisted coding is more effective if you encode more context about the business problem in your software. TypeScript is already great at doing this (compared to JS) because the information it adds (the types) are part of adding more information about the developer's intent to the source code. Variable names, class names, relationships, etc... matter more than ever if you want your AI tooling to be able to accelerate development of features/fixes using the language of the business (the customer). It's optimized for natural language, and you're giving AI things it can RAG in order to bring even more context into your workspace as you dig into development tasks. You can ask questions like "how is this solved in other products?" and it'll be more able to conenct what you're doing with relevant examples
