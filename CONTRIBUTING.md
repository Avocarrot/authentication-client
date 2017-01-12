# Contributing to this repository

 - [Code documentation](#documentation)
 - [GIT commit guidelines](#commit)
 - [Testing](#testing)

---

## <a name="documentation"></a> Code documentation

This repository offers a script to generate an API Reference based on **JSDoc  annotations**. Please make sure that you follow the [JSDoc spec](http://usejsdoc.org/) when contributing, to ensure that the API Reference stays up to date.

---

## <a name="commit"></a> Git Commit Guidelines

### Commit Message Format
Each commit message consists of a **header**, a **body** and a **footer**.  The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The subject line of the commit message cannot be longer 100 characters. This allows the message to be easier to read on GitHub as well as in various git tools.

### Type

Please use one of the following:

* **feat**: A new feature
* **fix**: A bug fix
* **doc**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing
  semi-colons, etc)
* **refactor**: A code change that neither fixes a bug or adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing tests
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation
  generation

### Scope

The scope could be anything specifying the location of the commit change. For example `view-compiler` or `logger`.

### Subject

The subject contains a succinct description of the change:

* Use the imperative, present tense: "change" not "changed" nor "changes".
* Don't capitalize the first letter.
* Do not add a dot (.) at the end.

### Body

The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also the place to reference GitHub issues that this commit **Closes**.

---

## <a name="testing"></a> Testing
All Merge Requests should be submitted with the relevant tests. No code should be merged if no supporting tests are provided.

You are strongly encouraged to strive for a 100% test-coverage, even through it is not enforced in the continuous intergation process.
