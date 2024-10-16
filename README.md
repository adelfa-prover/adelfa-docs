# Adelfa Documentation

View the documentation at [adelfa-prover.org](https://adelfa-prover.org).

This website uses [Nextra](https://nextra.site) to generate documentation for
the Adelfa project.

Each push to the `main` branch will trigger a deployment to the website.

Many of the pages are fully static, but we generate the publications at build
time from the [`pubs.bib`](public/pubs.bib) file.

## Customizations

We provide two custom [Shiki](https://shiki.matsu.io/) language definitions as [TextMate
grammars](https://macromates.com/manual/en/language_grammars).

- [Adelfa](public/syntax/grammar.adelfa.json)
- [Adelfa Signatures](public/syntax/grammar.lf.json)

To use either of these, you can define the markdown code block to be the
`adelfa` or `lf` language respectively.

## Local Development

First, run `npm i` to install the dependencies.

Then, run `npm dev` to start the development server and visit localhost:3000.

## License

This project is licensed under the MIT License.
