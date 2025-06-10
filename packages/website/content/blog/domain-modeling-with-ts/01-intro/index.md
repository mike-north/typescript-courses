---
title: "Introduction"
order: 1
date: "2025-06-10T09:00:00.000Z"
description: "Workshop overview, DDD motivation, and real-world context."
course: domain-modeling-with-ts
---

<!-- Dark High contrast -->

## What is Domain Modeling?

- Creating a **conceptual representation of a business problem and its rules**
- Involves identifying key entities, their relationships and constraints
- Translating this understanding into a structured model that can guide software design

An example from Stripe

- Key entities: Payment, Dispute
- Relationship: Disputes must be associated with a payment
- Constraints: A dispute can only be opened if a payment has been successfully processed

We'll be talking a bit about _Domain Driven Design_ in this course.

- An approach to building software such that it aligns well with business needs
- Emphasizes collaboration between technical and domain experts
- Involves defining a common language that developers and stakeholders can have common understanding and clear discussions

Modeling a domain involves coming up with an accurate understanding of how a problem space is structured, and how users or business stakeholders engage with it.

## Why I'm here to talk about it

- Agentic coding is changing the way we write software. Having well-defined software that clearly groups related concepts together allows LLMs to participate in the "shared language"
- At Stripe, I'm the Product Architect for Stripe's developer platform. An important part of my job is making sure, across the company, that our products fit or compose together in ways that solve real problems for Stripe's users
- Learning how to practice domain modeling well, and the collaborative skills that DDD encourages, is a big part of what's fueled the latest phase of my career growth

## Why domain modeling in TypeScript?

TypeScript is particularly well-suited to articulating a wide range of contracts and software shapes.

## What are we building today?

We need a complex set of problems to dive into, and I have a real set of problems that I wish I could solve with software. I have a big vegetable garden
![Garden downhill](./img/my-garden-2.jpeg)
We have a lot of raised beds
![Raised beds](./img/my-garden-1.jpeg)

There are so many things to manage here. We order seeds from catalogs
![Seed catalogs on a table](./img/catalogs-on-table.jpeg)
and now have a substantial collection of them
![Seed catalogs on a table](./img/seeds-on-table.jpeg)
and then start the seedlings indoors
![Hydroponic bins](./img/hydroponics.jpeg)
And then when the time is right, I transplant them outside into the raised beds. The "right time" has to do with the size of the plant, the temperature, whether it's been hardened (gradually exposed to the outdoor environment, a few hours at a time at first and ramping up).
![Plants in a raised bed](./img/my-garden-3.jpeg)

  <h3 style="text-align: center"><em>Today, we're going to work on something to make this easier!</em></h3>

## Workshop Overview & Goals

We'll build a seed collection so we can keep track of what we have in the collection

![seed catalog](./img/seed-catalog-ui.png)

And build an amazing drag and drop UI so that we can plan what we want to grow each year!

![garden ui](./img/garden-ui.png)

I'm going to be both your instructor and your Gardening Expert as we work on this app together. At the end of the course, you'll also be able to take your learning further as a "final project". This is a real app that will actually get used!
