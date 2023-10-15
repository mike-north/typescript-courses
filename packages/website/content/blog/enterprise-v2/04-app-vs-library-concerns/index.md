---
title: App vs Library Concerns
date: "2023-10-27T09:00:00.000Z"
description: |
  A discussion of different concerns to optimize for, depending on whether you're building a library or an app
course: enterprise-v2
order: 4
---

## TypeScript: App vs. Library Concerns

## Myths (almost always)

- ❌ "No more runtime errors"
- ❌ "My code will run measurably faster"

## Most TS Codebases

- **Improved developer experience**, including in-editor docs for your dependencies
- **Reduced need to "drill into” files** to understand how adjacent code works
- **Micro “rigor” that adds up to macro benefits**
  I can type things well-enough and let the system help me when I cross the threshold beyond which I “remember” what’s going on, and what types a particular value could be
- Developers can encode more of their intent
- More formalized and stable contracts “between things” (i.e., one component to another)
- **Coloring inside the lines**
  - Stay on the public API surface of your dependencies
  - Catch incomplete refactorings
  - Some subset of runtime errors moved to compile time
  - Using an ES2020 feature while needing to support ES2017
  - Momentarily forgetting about browser or node APIs

## (mostly) App-specific concerns

- More richness when working with data
- Better encapsulation tools, to facilitate maintaining lazy loading boundaries
- Improved “major version upgrade” story for typed libraries

## (mostly) Library-specific concerns

- Create and maintain a deliberate public API surface
  ...while still being able to create a private API surface to use between modules or components
- Keep your users on track (i.e., enums allow you to signal allowed value sets better than `number`)
- SemVer (deprecations, breakage)
- API Docs
