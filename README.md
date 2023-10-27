# TypeScript Training w/ Mike North

This repo contains the code for

* [TypeScript Fundamentals v4](https://www.typescript-training.com/course/fundamentals-v4)
  * _[TypeScript Fundamentals v3](https://www.typescript-training.com/course/fundamentals-v3) - Legacy course_
* [Intermediate TypeScript v2](https://www.typescript-training.com/course/intermediate-v2)
  * _[Intermediate TypeScript v1](https://www.typescript-training.com/course/intermediate-v1) - Legacy course_
* [Enterprise-Scale TypeScript v2](https://www.typescript-training.com/course/enterprise-v2)
* [Making TypeScript Stick v1](https://www.typescript-training.com/course/making-typescript-stick)
* [Full stack TypeScript v1](https://www.typescript-training.com/course/full-stack-typescript)

The course website is at [www.typescript-training.com](https://www.typescript-training.com)

[![Website](https://github.com/mike-north/typescript-courses/actions/workflows/ci-website.yml/badge.svg)](https://github.com/mike-north/typescript-courses/actions/workflows/ci-website.yml)

## Operating System

This workshop project works best in a [POSIX-compliant][posix] dev environment
like Linux, macOS, or Windows 10 (with [Windows Subsystem for Linux][wsl2]).

### JavaScript Tool chain

* We'll be using `yarn` as our package manager, not `npm`
* Please install [Volta][volta], to ensure you run this project with the correct `node` and `yarn` versions

### Browser

We recommend using a Chromium-based browser like [Microsoft Edge][msedge], [Brave][brave], [Opera][opera] or [Chrome][googlechrome].

### Editor

Although TypeScript can theoretically work well in any authoring environment that
supports the [Language Server Protocol][lsp], [Visual Studio Code][vscode] is
the _officially_ supported editor for this course.

### Checking out the code & preparing to run

* If you don't yet have a [GitHub](https://github.com) account, [create a new one](https://docs.github.com/en/github/getting-started-with-github/signing-up-for-github/signing-up-for-a-new-github-account) and [set up your SSH keys](https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)

  * If you've done this correctly, you should be able to run `ssh git@github.com` in your terminal, and see something like `Hi mike-north! You've successfully authenticated, but GitHub does not provide shell access.`

* Clone this repo by running `git clone git@github.com:mike-north/typescript-courses`
* Enter the repo by running `cd typescript-courses`
* Install dependencies by running `yarn` ([volta][volta] may download the right version(s) automatically)

### Running the project(s)

Projects are found within the [packages](https://github.com/mike-north/typescript-courses/tree/main/packages) folder, each can be started using the command
`yarn dev-<project name>`.

For example

* `yarn dev-website` starts the website project

[posix]: https://en.wikipedia.org/wiki/POSIX
[wsl2]: https://docs.microsoft.com/en-us/windows/wsl/
[volta]: (https://volta.sh/)
[lsp]: (https://microsoft.github.io/language-server-protocol/)
[vscode]: (http://code.visualstudio.com/)
[brave]: (https://brave.com/)
[msedge]: (https://www.microsoft.com/en-us/edge)
[opera]: (https://www.opera.com/)
[googlechrome]: (https://www.google.com/chrome/)

## Legal

&copy; 2023, All Rights Reserved - Mike Works, Inc.
