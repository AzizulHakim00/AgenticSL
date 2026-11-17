# AgenticSL

A private, evidence-based 60-day Agentic AI learning hub for Azizul Hakim Omor.

## Implemented

- Eight modules, 60 daily lessons, 180 objectives and 120 server-graded quiz questions.
- Daily coding assignments with versioned explanations, HTTPS evidence links and pasted code/output.
- Quiz attempt history, study sessions, understanding ratings and weekly reflections.
- Dashboard, module completion, study time, activity streak in Asia/Dhaka and concepts to revisit.
- Skills matrix with starting, current and target self-assessments, separate from reviewed evidence.
- Suggested assignment scores and feedback, followed by the learner's explicit final approval.
- Light/dark themes, responsive navigation, CSV progress export and full JSON record export.
- Eight authenticated MCP tools and a REST API over the same durable database.

No learning progress, assignment approvals or scores are seeded. A completed day requires all three objectives, a quiz score of at least 70%, a review score of at least 70 and final learner approval of that review. With two questions, a passing quiz currently requires both answers correct. New submissions and reviews invalidate earlier approvals. This is a learning aid, not a proficiency certification.

## Architecture

The app uses a dependency-free ES module Worker with an embedded HTML/CSS/JavaScript interface and Cloudflare D1. Hosted identity and private access are supplied by ChatGPT Sites. This keeps the app and its MCP tools on one host without separate Next.js, FastAPI, PostgreSQL and OAuth services. The local development adapter uses Node's SQLite implementation.

The repository contains application source only. Private notes, evidence and learning records are excluded from Git and remain in the database.

## Local development

Requires Node.js 22.13 or newer (tested with Node 24).

```sh
npm test
npm run dev
```

Open the printed loopback URL, normally `http://127.0.0.1:4173`. The local adapter injects a development identity and binds only to loopback. It is **not** an internet-facing production server. It creates `data/learning.sqlite`, which is ignored by Git. Local and hosted records are separate.

```sh
npm run build
node scripts/verify-build.mjs
```

The build produces `dist/server/index.js` and `dist/.openai/hosting.json`. The checked-in hosting manifest identifies the existing private Site and its DB binding. Use the supported Sites source/package/deploy workflow; publishing applies the schema-only SQL migration in `drizzle/` before the Worker runs. Do not run request-time schema creation or expose the local identity adapter in production.

Each successful GitHub Actions run also produces an `agenticsl-release-<commit>` artifact containing the compiled Worker archive, schema and exact source revision. Download it from the completed run's Artifacts section. It contains no learning records or credentials and is retained for 30 days. A verified artifact is ready for deployment; it does not mean the private Site has been published.

The compiled release check uses a temporary in-memory database to verify authenticated API behavior, a saved objective read back through MCP and the generated client script's syntax. It does not replace visual browser QA or verification of the hosted identity gateway.

## REST interface

All learning routes require identity supplied by the trusted hosting boundary. Browser writes additionally require a matching Origin header. Do not accept arbitrary internet-supplied identity headers in a standalone deployment.

| Method and route | Purpose |
| --- | --- |
| `GET /api/health` | Basic service health; does not check storage |
| `GET /api/state` | Curriculum, modules and shared learning state |
| `GET /api/days/1` | Day details, assignment evidence and attempt history |
| `GET /api/weeks/1` | Evidence, time and reflections for a week |
| `GET /api/skills` | Self-reported skills and evidence-based progress indicators |
| `POST /api/action` | Validated task, submission, quiz, study, review, approval, skill or reflection action |
| `GET /api/export?format=csv` | Spreadsheet-friendly progress snapshot |
| `GET /api/export` | Private full JSON record export |

Example action bodies:

```json
{"type":"task","day":1,"index":0,"checked":true,"requestId":"unique-request-0001"}
```

```json
{"type":"submission","day":1,"answer":"Built GET and POST task routes","evidence":"POST /tasks returned 201; malformed input returned 400","evidenceUrl":"https://github.com/owner/repo/commit/COMMIT"}
```

Supply one stable `requestId` when retrying a logical action. Matching requests are deduplicated; conflicting reuse is rejected. Inputs are parameterized and validated. Quiz answer keys are omitted from lesson responses and returned with feedback after an attempt.

## ChatGPT connection

The stateless `POST /mcp` endpoint exposes:

1. `get_learning_progress`
2. `get_day_details`
3. `update_task_status`
4. `submit_assignment`
5. `submit_quiz`
6. `evaluate_submission`
7. `get_skill_report`
8. `generate_weekly_report`

Discovery supports MCP 2026-07-28. The endpoint also implements initialization, notifications, ping and structured tool errors. Hosted Sites authenticates callers and checks their access before forwarding requests. Tools do not execute submitted code or call a paid AI model. `evaluate_submission` records the calling reviewer's suggested score and feedback; it cannot grant final learner approval.

After successful publication, connect the plugin provisioned for the Site. Another ChatGPT account must first receive explicit access to the private workspace and then connect the same plugin where supported. Both accounts operate on the same personal learning records; they do not share conversation history. The platform gate is the access boundary: do not make this single-profile Site public, because authorized visitors can read and update the shared learning profile.

Example prompt:

> Read my Day 1 assignment and rubric. Inspect the latest evidence, explain what it demonstrates and what remains unverified, then record a suggested score and feedback. I will make the final approval in the website.

## Limits and operational status

- Public progress sharing, autonomous paid AI grading, file uploads and Excel import are not implemented. Use evidence links/pasted output, manual ChatGPT review, CSV and JSON exports.
- The existing Excel tracker is a separate starting tool; it is not automatically synchronized with the app.
- Exports are downloadable snapshots. There is no tested automatic restore feature; protect the hosted database and keep exports privately.
- Self-reported study time and skill ratings are labelled accordingly. Reviews assess supplied evidence; code is not independently executed.
- The local integration tests cover curriculum structure, completion rules, approval invalidation, validation, idempotency, authentication handling, MCP, skills and exports. Hosting-level identity/access and browser behavior require verification after deployment.
- Publication is not established by a build or a repository commit. See the deployment result in the task's final response for the observed hosting status.

## Editing the curriculum

Edit module ranges and daily exercise contracts in `src/curriculum.mjs`, and day-specific teaching notes in `src/notes.mjs`. Keep 60 ordered days, three objectives per day and two valid questions per day, or update the corresponding UI and validation rules deliberately. Use the linked primary documentation and pin dependency versions when doing framework exercises.
