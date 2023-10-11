<p align='left'>
 <a href="./09-tests-for-types.md">◀ Back: Tests for Types</a>
</p>

---

# Declaration Files & DefinitelyTyped

## What is a declaration file?

If TypeScript is “JS with added type information”, these files are purely the type information made to layer on top of an existing JS file.
Why declaration files exist

- TS is a language that compiles to JavaScript -- This is a critical driver of adoption
- ...but it only provides value if type information comes along with dependencies
- You rarely, if ever end up consuming .ts code directly -- it’ll nearly always be a declaration file and the matching JS source

## When I might find myself working in a declaration file

- Overriding something broken in a DefinitelyTyped package
- Typing runtime features that may not be totally standard (i.e., chrome/safari-specific APIs, a piece of code that might run in a Node.js sandbox)
- Augmenting types with something more convenient (i.e., Object.keys returns a special string[])

## How is it different from a regular .ts file?

- You’re limited in terms of what you can put here
  - No values, although it can contain things that typically would have a value aspect to them
    - initializers can only be string/numeric/enum literals
  - No statements, only expressions
  - Nothing reassignable (i.e., `let`)
- Source `.d.ts` files completely disappear as part of the compile process
- You used to only be able to create ones from TypeScript source, but as of TS 3.7 you can now create them from `.js` as well
  - These usually are just a starting point and need some significant manual touch up
- They’re code. You need tests (we’ll talk about this later)

- **Manually created .d.ts:** they can become misaligned with the JS code they aim to describe
  - TypeScript’s type-checking is done exclusively using type information
  - This can create a situation where everything looks great

## DefinitelyTyped

**A giant place for shared ambient type packages**
Over 6k libraries are typed here

**Publishes packages of the form `@types/*`**
i.e., @types/react, @types/lodash

**Community-run**
People may list themselves as “owners” of certain types by adding their names to types/<package_name>/index.d.ts

When new PRs come in that touch files in the folder for these types, you get mentioned by a bot and asked to perform a code review within a few (7) days.

- If an owner “requests changes” in their review, you proceed with normal code review norms
- As soon as any owner gives an approving review, the code is eligible for automated merge/publish
- If nobody reviews the PR, the code gets merged anyway

PRs from owners themselves are merged almost immediately

### Definitely Challenges

There’s no mechanism (other than asking submitters to not do it) for maintainers to keep “ownership” in the same sense as “some authors can commit to React.js and some cannot”

Maintainers have very little control over version numbers. They can only have a stream of types associated with each major version of the library being typed -- if they fix a bug in `@types/foo 3.4.5` and have already released `3.5.0`, there’s no way to release a `3.4.6`.

### Versioning Challenges

On the issue of versioning, there’s an additional challenge.

SemVer instructs us to use x.y.z version numbers as follows

- **Major** - Incremented “when you make incompatible API changes”
- **Minor** - Incremented “when you add functionality in a backwards compatible manner”
- **Patch** - Incremented “when you make backwards compatible bug fixes”

This way, particularly for a consumer of a lib, we know how much risk we’re exposing ourselves to when bumping from version A to B.

Things get way more complicated when dealing with types

- **Lib Major, Minor, Patch** - Which version of the library is being typed
- **TypeMajor** - Incremented for breaking changes to types (i.e., dropping a compiler version
- **TypeMinor** - Incremented for non-breaking functionality improvements to types
- **TypePatch** - Incremented for “backwards compatible bug fixes” to types

So we have 6 pieces of information here.

We can reduce this to 5 if we’re willing to consider “backwards compatible bug fixes” to be “a similar thing” in users’ eyes, regardless of whether they happen in “values” or “types”.

We can make other tough compromises (i.e., “we always track latest minor”) and get this to 4, but this will already either limit the kinds of changes that can be made

## Type Acquisition

`--traceResolution` to log out extra information

**Prioritization based on file type**
.ts > .tsx > .js+.d.ts

**Prioritization based on type of location**

- tsconfig.json paths: {}
- “Type roots”
- Explicit module declarations
- @types/\*

**Prioritization based on location**

Same as Node’s require.resolve algorithm, as long as moduleResolution: “Node”

---

<p align='right'>
 <a href="./11-api-extractor.md">Next: API Extractor ▶</a>
</p>
```
