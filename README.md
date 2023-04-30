# simple-strapi-types

This is a stripped down version of [@oak-digital/types-4-strapi-2](https://github.com/Oak-Digital/types-4-strapi-2)

types-4-strapi-2 is a rewrite of [francescolorenzetti/types-4-strapi](https://github.com/francescolorenzetti/types-4-strapi) written in TypeScript, with the goal of being much easier to extend and maintain.

## Requirements

* Node `>=v16`

## Getting started

Install the script for your project:

```bash
# NPM
npm install --save-dev @mgrdevport/simple-strapi-types
# YARN
yarn add -D @mgrdevport/simple-strapi-types
```

Then set up a script in your `package.json`

```jsonc
// package.json
{
    "scripts": {
        "types": "st4s"
    }
}
```

In some cases it is desirable to change the output directory which is `./types` by default.
This can be done with the `--out` flag like in the following example.

```jsonc
// package.json
{
    "scripts": {
        "types": "st4s --out ../frontend/src/lib/types"
    }
}
```

## Features

* Generate TypeScript interfaces for all your api content-types and components
* Generate TypeScript interfaces for builtin types such as `Media` and `MediaFormat`
* Select input and output directory
* Prettier formatting and ability to use your own `.prettierrc`.
* Generate types for plugins such as [url-alias](https://github.com/strapi-community/strapi-plugin-url-alias)
* Population by generics

### Planned features

* Support for localization

## Flags

| **Flag**                    | **Description**                                                                      | **Default** |
|-----------------------------|--------------------------------------------------------------------------------------|-------------|
| -i, --in <dir>              | The src directory for strapi                                                         | `./src`     |
| -o, --out <dir>             | The output directory to output the types to                                          | `./types`   |
| --prefix <prefix>           | A prefix for all generated interfaces                                                | `I`         |
| --component-prefix <prefix> | A prefix for components                                                              | none        |
| -D, --delete-old            | CAUTION: This option is equivalent to running `rm -rf` on the output directory first | `false`     |
| --prettier <file>           | The prettier config file to use for formatting TypeScript interfaces                 | none        |
| --plugins <plugins...>      | The plugins to use                                                                   | none        |

## Using plugins

It is possible to generate types for plugins, for example url-alias gives a new field on your content types, so that plugin will automatically add that field to your types.
You can see a list of builtin plugins below.
Some plugins might not be fully featured.

It will be possible in the future to add your own plugins in later versions.

### List of supported plugins

* url-alias

### example of using plugins

```bash
$ st4s --plugins url-alias
```

## Population
This stripped down version doesn't deal with population, just use the interfaces as they fall out of the generator.

## Building

To build this project, use the following command

```bash
npm run build
```

## Publishing

```bash
npm version # major | minor | patch
npm run build
npm publish
```
