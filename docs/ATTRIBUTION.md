# Attribution

`massaman` builds on top of, and re-uses material from, the following projects. Their licenses apply to the parts of `massaman` derived from them.

## es-toolkit

- **Project** — [github.com/toss/es-toolkit](https://github.com/toss/es-toolkit)
- **Site** — [es-toolkit.dev](https://es-toolkit.dev)
- **Author** — Viva Republica, Inc.
- **License** — MIT

`massaman/array`, `massaman/object`, `massaman/function`, `massaman/math`, `massaman/string`, `massaman/promise`, `massaman/error`, `massaman/predicate`, and the `assert`/`invariant` exports of `massaman/control` are re-exported from `es-toolkit`. The reference documentation for those symbols is mirrored verbatim from `es-toolkit`'s `docs/reference/` directory at the pinned version, with a "Direct proxy" callout indicating the source.

## ts-pattern

- **Project** — [github.com/gvergnaud/ts-pattern](https://github.com/gvergnaud/ts-pattern)
- **Author** — Gabriel Vergnaud
- **License** — MIT

`massaman/match` is a full re-export of `ts-pattern`'s public API. The reference pages under `docs/reference/match/` are hand-written by the `massaman` maintainers — `ts-pattern` doesn't ship per-symbol `.md` documentation.

## License of derived material

Mirrored upstream documentation retains the upstream license (MIT for both `es-toolkit` and `ts-pattern`). `massaman`'s own contributions — original utilities, hand-written reference pages, prose guides, and tooling — are also MIT-licensed. See [LICENSE](https://github.com/zrosenbauer/massaman/blob/main/LICENSE).

## Pinned versions

See [`_meta/upstream-versions.json`](./_meta/upstream-versions.json) for the upstream versions the current proxy docs were generated from.
