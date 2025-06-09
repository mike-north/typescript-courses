---
title: "Introduction"
order: 1
date: "2025-06-10T09:00:00.000Z"
description: "Workshop overview, DDD motivation, and real-world context."
course: domain-modeling-with-ts

---


## Workshop Overview & Goals
- What is Domain-Driven Design? (DDD)
- Why TypeScript for DDD?
- Real-world motivation: Problems DDD solves


## Key points for the first part of content
* We're going to talk about domain modeling -- the process of taking a concept and manifesting it in software
* To do this well, you must understand the "domain" deeply. 
* Stripe is known for doing this well. This is literally how the company made a name for itself. If you look at our API, you'll see concepts like `Customer`, `FinancialAccount`, `Invoice`, `Subscription` -- all of which are relatable names to anyone seeking a billing or payments solution (even a mechanic or pizza shop, etc...) 
* Learning to do this well helps engineers working on products for non-coding users, connect with those users more effectively, and have conversations with them about the problem space and the software solution that solves/mitigates those problems
* At Stripe, I'm a Product Architect. I operate in this blurry area between Product and Eng on a very regular basis. Particularly with the trend of AI-assisted coding, if you're a product engineer, learning how to speak the language (and understand) the business is key to taking your career to the next level
* AI assisted coding is more effective if you encode more context about the business problem in your software. TypeScript is already great at doing this (compared to JS) because the information it adds (the types) are part of adding more information about the developer's intent to the source code. Variable names, class names, relationships, etc... matter more than ever if you want your AI tooling to be able to accelerate development of features/fixes using the language of the business (the customer). It's optimized for natural language, and you're giving AI things it can RAG in order to bring even more context into your workspace as you dig into development tasks. You can ask questions like "how is this solved in other products?" and it'll be more able to conenct what you're doing with relevant examples