# Adelfa Documentation

View the documentation at [adelfa-prover.org](https://adelfa-prover.org).

This website uses [Nextra](https://nextra.site) to generate documentation for
the Adelfa project.

Each push to the `main` branch will automatically trigger a deployment to the
website.

The site is currently fully static, meaning all HTML pages are generated at
build time.

## Customizations

We provide two custom [Shiki](https://shiki.matsu.io/) language definitions as [TextMate
grammars](https://macromates.com/manual/en/language_grammars).

- [Adelfa](public/syntax/grammar.adelfa.json)
- [Adelfa Signatures](public/syntax/grammar.lf.json)

To use either of these, you can define the markdown code block to be the
`adelfa` or `lf` language respectively.

## Local Development

First, make sure [npm](npmjs.com) is installed on your local machine.

```bash
node -v
npm -v
```

If these are not installed, follow the instructions here to install them: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

After npm has been installed, run `npm install` to install the dependencies.

Then, run `npm run dev` to start the development server and visit
https://localhost:3000 to see how the pages will appear on the website.

The code utilizes [Next.js's App Router](https://nextjs.org/docs) to generate
pages at the correct location. This means that to edit the
`/reference-guide/syntax/` page, the `app/reference-guide/syntax/page.mdx` file
will need to be edited.

Given this, open the desired `page.mdx` and begin editing it in the text editor
of your choice. After saving the file, your browser should automatically reload
the page to reflect your changes.

For example, to modify the home page, open https://localhost:3000 in your
browser and `app/page.mdx` in a text editor, make a change in the markdown file
and wait for the browser to reflect this change. You can verify this is
occurring by the following output in your terminal.

```
✓ Compiled / in 364ms (2274 modules)
GET / 200 in 446ms
```

One can also refresh the page in the browser if it does not properly detect an
update automatically.

## Markdown

The Adelfa documentation utilizes a modified [Markdown syntax](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) to generate static
HTML files. Listed below are the changes we have made from Github flavored Markdown
to support the documentation's needs.

### Displaying Adelfa Code

Adelfa signature and reasoning files code blocks can be specified by using a
[Markdown code block](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-and-highlighting-code-blocks),
setting the language to `lf` or `adelfa` respectively.

````md
```lf
nat : type.
...
```

```adelfa
Theorem foo : ...
```
````

One can specify a "filename" for the code block to help readers understand if
multiple code blocks are meant to be composed by adding an attribute to the code
block:

````md
```adelfa filename="my-development.ath"
Theorem foo : ...
```
````

The documentation also supports displaying the output of commands when hovering
over the relevant portion. This requires two changes to the code block:

1. Add the attribute `execute`

   ````md
   ```adelfa execute
   Theorem foo : true.
   ```
   ````

2. Include the output of the commands surrounded by `%{}%`.

   ````md
   ```adelfa execute
   Theorem foo : true.
   search.

   %{
   >> Theorem foo : true.

   Subgoal foo:


   ==================================
   True

   foo>> search.
   Proof Completed!
   }%
   ```
   ````

### Rendering Math

Math functions closely mirror LaTeX syntax, except denoting where the math
sections occur is different.

Inline math is denoted by surrounding the relevant portion with `$$`s, such as
`$$1 + 2 = 3$$`.

Display math is rendered by placing the LaTeX in a code block with the language
set to `math`.

````md
```math
\sum^{\infty}_{n=1}\left(\frac{1}{2}\right)^n = 1
```
````

Behind the scenes, this utilizes KaTeX which follows LaTeX syntax. Some
environments or functions may not be supported by KaTeX. [Here is a complete
list of the functions supported by KaTeX.](https://katex.org/docs/supported).

## License

This project is licensed under the MIT License.
