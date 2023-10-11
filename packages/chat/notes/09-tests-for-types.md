<p align='left'>
 <a href="./08-types-at-runtime.md">◀ Back: Types at Runtime</a>
</p>

---

# Tests for types

## Why should we care?

We need to do this for a couple of reasons:

- Type information is code too. Breaking your users’ types is a breaking change
- You can’t easily write useful negative test cases for type-equivalence in your value tests
- TS introduces breaking changes with each middle-digit release, and you’ll usually detect these w/ type information (includes your “value tests” too for some things)
- Maintaining compatibility w/ multiple TS versions
  - This normally wouldn’t be a big concern, but TS includes breaking changes with each “middle digit” release
  - It’s very easy (and very bad for users) to accidentally change your range of supported compiler versions

## Solutions to this problem

TL;DR: TypeScript professionals need to know BOTH. You won’t get away from dtslint yet because it’s still used for everything in DefinitelyTyped, and it’s still the easiest way to guard against compatibility regressions.

### [`dtslint`](https://github.com/microsoft/dtslint)

This is what’s used by DefinitelyTyped, and it effectively has 3 features

```
// $ExpectType
// $ExpectError
```

dtslint tests a range of TS compiler versions. This may sound like it’s less than we need, but it’s enough to get a
lot of release confidence. Because it’s a tool built on top of a linter, it can handle negative test cases
without early termination

#### Concerns

- **SETUP** - It’s very particular about how it’s set up, and you end up doing things “just because the tool wants you to do it that way” (i.e., the index.d.ts)
- **STRINGIFIED TYPES** - The \$ExpectType assertion is based on stringified types, which can change across compiler versions (i.e., `string|number` vs `number | string`)
- **BUILT ON TOP OF TSLINT** - The linter it’s built on top of is tslint, which is now deprecated in favor of ESLint. We’ll talk about the difference later, but it’s not great to be so entangled with something that’s on its way out

#### Benefits

- Automatically downloads compiler versions and caches them
- Tests against nightly TS builds
- Microsoft uses this for DefinitelyTyped (read into this for stability)
- Being built on top of a linter = you get lint-ish feedback in your editor

### [`tsd`](https://github.com/SamVerschueren/tsd)

This is “the new kid on the block”, but it’s my current favorite for basic typescript testing

#### Concerns

At the time of writing, it does not allow testing against multiple compiler versions (Issue)

#### Benefits

- **Better assertion mechanism**
  Test assertions are based on type equivalence rather than stringified types
- **Easier setup**
  Much less convoluted setup compared to dtslint
- **Better range of assertions**
  Much wider range of assertions, which allow your tests to become much more readable and much less convoluted
- **Support for deprecations**
  Catch that accidental (un-)deprecation. This is very important for responsible management of a stable API surface

# Challenge: tests for types

1. `tsd` and `dtslint` are both installed. Set up a subfolder in `tests/` for each of them
2. wire both commands up to `yarn test`

## What to test?

Make sure your new `isTypedArray` generic user-defined type guard works

For your `dtslint` tests, use the following config files

#### `tsconfig.json`

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "lib": ["ES2018", "DOM"],
    "strict": true,
    "baseUrl": "../.."
  },
  "include": [".", "../../src"]
}
```

#### `tslint.json`

```json
{
  "extends": "dtslint/dtslint.json",
  "rules": {
    "no-relative-import-in-test": false,
    "semicolon": true
  }
}
```

and run the command as follows

```sh
yarn dtslint tests/types-dtslint
```

For tsd, make just make sure you follow the README carefully

---

<p align='right'>
 <a href="./10-declaration-files.md">Next: Tests for Types ▶</a>
</p>
```
