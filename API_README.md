# Node + Express CRUD API

## Getting started

1. Make sure you have **Node.js ≥ 18** installed.
2. Install dependencies:

```bash
npm install
```

3. Start development server with hot reload:

```bash
npm run dev
```

Open http://localhost:3000/api/items to see the (initially empty) list.

---

## Project structure

```
src/
  controllers/
  models/
  routes/
  app.js          Express instance
  index.js        Server entry
tests/            Jest + Supertest integration tests
```

## Available scripts

* `npm start` – start server (production mode)
* `npm run dev` – start server with nodemon
* `npm test` – run Jest tests

---

## CRUD endpoints

| Method | Path | Description |
| ------ | ---- | ----------- |
| GET    | /api/items        | List items |
| GET    | /api/items/:id    | Get single item |
| POST   | /api/items        | Create new item |
| PUT    | /api/items/:id    | Update item |
| DELETE | /api/items/:id    | Delete item |

Body for POST/PUT:

```json
{
  "name": "My Item",
  "description": "Optional"
}
```

---

## Qodo AI – Auto-generate tests

Qodo AI can expand the existing test suite or generate new tests automatically.

1. Install Qodo CLI globally (or use `npx`):

```bash
npm install -g @qodo-ai/cli  # or:  npx @qodo-ai/cli@latest
```

2. Produce a Cobertura coverage report (Jest):

```bash
npm test -- --coverage --coverageReporters="cobertura"
```

3. Run Qodo Cover locally:

```bash
qodo-cover \
  --project_language javascript \
  --code_coverage_report_path ./coverage.xml \
  --test_command "npm test -- --coverage --coverageReporters=cobertura"
```

The command will read coverage data, call OpenAI via your `OPENAI_API_KEY`, and create test files (or modify existing ones) to raise coverage.

> For CI-based generation, see `.github/workflows/ci.yml` and the [Qodo Cover documentation](README.md).

Make sure `OPENAI_API_KEY` is exported in your shell or configured as a repository secret in GitHub.

---

## Continuous Integration (CI)

The repository contains a minimal GitHub Actions workflow in `.github/workflows/ci.yml` that:

1. Checks out the code.
2. Sets up Node.js 20.
3. Installs dependencies with `npm ci`.
4. Runs the Jest test suite.

You can extend the workflow to run Qodo Cover after tests succeed:

```yaml
      - name: qodo-cover
        uses: qodo-ai/qodo-ci/.github/actions/qodo-cover@v0.1.12
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          project_language: javascript
          project_root: .
          code_coverage_report_path: ./coverage.xml
          coverage_type: cobertura
          test_command: "npm test -- --coverage --coverageReporters=cobertura"
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

This step will open a patch PR with any generated tests, just like in the examples for other languages.

---

Happy coding! 🎉 