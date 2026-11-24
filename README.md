## Visual Lecture 2.0 — interactive academic classroom

The website includes **25 carefully authored, topic-specific visual lectures across all 16 modules**. A learner can read extended lesson-specific notes, inspect a worked case and a common misconception, and step through an offline simulation of the system in an accessible SVG diagram. Diagrams illustrate seven distinct topologies: linear pipelines, permission gates, feedback loops, retrieval pathways, conditional branches, dependency graphs and parallel workers.

Each featured lecture provides **Previous, Next, Play/Pause, Reset, success/failure comparison**, a detailed trace panel, a text-only transcript, an ungraded self-check with immediate feedback, print-friendly notes and an optional **25-minute focus mode**. Playback starts only after the learner requests it and follows reduced-motion accessibility preferences. A study timer is **not** counted as logged learning time; progress and server-side grades remain in the existing systems.

Content and implementation:
- `spring-app/src/main/resources/static/js/visual-lectures-data.js`: 25 authored lecture datasets, checks, examples, scenario traces and misconceptions.
- `spring-app/src/main/resources/static/js/visual-lectures.js`: reusable accessible offline simulation engine.
- `spring-app/src/main/resources/static/css/visual-lectures.css`: responsive diagram layout, focus mode, reduced motion and print layout.
- `scripts/verify-visual-lectures.cjs`: content, graph, integration, accessible markup and coverage regression tests. CI and live smoke tests check public assets.
- The original 60 Python examples, 120 session IDs, existing progress, validated quizzes and GitHub PR review rules are preserved; no new authentication, API key, model inference or paid service is needed.

The animations show deterministic educational examples, **not live agent execution**. Self-check questions here are explicitly ungraded, while formal assessment remains in the server-side quiz.

## Academic learning expansion (120 sessions)

The curriculum now has **16 modules and 120 sequential sessions**. Days **1–60 remain unchanged in identity and saved learning records**. Days **61–120** cover planning and agent reasoning strategies, hybrid RAG, multimodal/computer-use systems, MCP and A2A, security and governance, evaluation/research, distributed operations and a research capstone. Foundation sessions offer at least four guided study hours; advanced sessions offer five hours. Session pages include a lecture timetable, domain-specific academic notes, architecture SVG diagram, application case study, technical relation, viva questions and practical assignment.

The course is self-paced. Suggested hours are guidance, not an automated claim of completed study time. The existing 60 Python worked examples remain tested; new advanced tasks are guided projects that students must independently implement and evidence.

# AgenticSL — Agentic AI Learning Hub

A Spring Boot learning product with a 120-session academic curriculum, daily implementation tasks, short quizzes, private learner records and an admin-reviewed GitHub submission workflow.

## Learning accounts are independent of GitHub

- Learners can register with a **username, email, and 12+ character password**, sign in with a **verified Google account** (when configured), or continue using **GitHub OAuth**.
- Google and password accounts immediately access lessons, study logs, checklists, quizzes, and progress exports. They do **not** receive upstream repository privileges automatically.
- For coding submissions, learners select **Connections → Connect GitHub** to complete verified GitHub OAuth. **Typing a username is not proof of ownership.**
- Once verified, learners request contribution access separately. The admin approves, creates or verifies their unique learners/<verified-github-login> branch, and manually reviews/merges PRs into that branch.
- Existing GitHub learners retain their numeric GitHub-backed account IDs and existing learning history. Accounts are **never silently merged on matching email**.
- Google login is optional: register a free Google Cloud OAuth client with authorized redirect URI https://agenticsl-learning-hub.onrender.com/login/oauth2/code/google, then set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Render. The button is hidden until configured.
- Local passwords are stored as BCrypt hashes. The initial free build has no verified-email/password-reset flow or large-scale signup abuse controls. Complete those controls before unrestricted public rollout.
- Linking must be initiated by an authenticated learner and completed by that learner's own GitHub OAuth approval. Existing assignments or another person's GitHub identity cannot be silently claimed.
- The browser uses HttpOnly secure Spring Security session cookies; CSRF remains enforced for changes.

## Product

- **Home `/`**: course overview, all sixteen modules and access to the interactive demo.
- **Demo `/demo`**: all lessons, objectives, quizzes, study logging, assignment forms, skills and exports in an isolated, temporary session. Demo progress never becomes a real learner record.
- **Workspace `/dashboard`**: private dashboard for Google, password and GitHub learners, backed by MongoDB.
- **Admin `/admin`**: participation requests, learner-branch provisioning or verification, submitted evidence, suggested scores and final approvals.
- **Curriculum**: 120 sessions in 16 modules (60 original foundation lessons plus 60 advanced seminars), 360 learning objectives and 240 server-graded questions. Original day IDs and stored progress are preserved. All progress starts empty.
- **Evidence**: versioned explanations, code/output, PR URL and submitted commit. New submissions invalidate old review eligibility.
- **Reports**: study time, quiz results, module completion, self-assessed skills, weekly reflections, private JSON and CSV exports.

## Requested stack

| Component | Implementation |
| --- | --- |
| Application | Java 21, Spring Boot 3.5, Spring MVC |
| Interface | Thymeleaf, HTML, CSS and JavaScript |
| Security | Spring Security, CSRF protection and server-side authorization |
| Login | GitHub OAuth, Google OIDC, or BCrypt-backed username/password |
| Persistence | MongoDB Atlas; dedicated application database and least-privilege user |
| Code submissions | GitHub forks and PRs to `learners/<username>` |
| Evaluation | Deterministic quizzes, optional assignment CI and manual admin review |
| Container | Multistage Docker build, non-root runtime |
| Hosting | Render Docker web service, explicitly configured `free` plan |

The earlier Node/Vercel/Supabase prototype remains in the repository for history and curriculum generation. It is not the Spring product's runtime. The root Dockerfile builds only `spring-app/`; no Node service or Supabase project is needed by the Spring deployment.

## Learner and admin workflow

1. Register with Google or username/password (or sign in using an existing GitHub account). Connect GitHub and request contribution access when ready.
2. Admin approves after creating or verifying `learners/<github-username>` in the official repository. The optional repository token automates creation; without it, the admin creates the branch in GitHub and retries approval.
3. Learners fork the public repository, clone their fork and make an assignment branch.
4. Open a PR from that fork to the assigned learner branch, never to `main`.
5. Submit its URL, implementation explanation and evidence in the daily workspace.
6. The server reads GitHub to verify PR author ID, official repository and target branch, and saves the submitted head commit.
7. Admin reviews code and tests, merges the PR in GitHub, and records score, feedback and final approval in the admin panel.
8. Final approval rechecks GitHub. It requires a merged PR whose head commit matches the submitted commit and a review score of at least 70. All three objectives and a passing quiz are also required before the day becomes complete.

The repository owner/admin may submit their own study work from a branch in the official repository because GitHub does not permit a personal account to fork its own repository into the same account. Other learners must use forks. GitHub usernames are display and branch values; immutable numeric GitHub IDs determine identity and the admin role.

Main-branch push restrictions are **GitHub repository administration settings**, separate from app authorization. In a public GitHub organization repository, configure protection/rulesets for `main` and learner branches so only the designated admin can push or merge upstream. This code does not claim those external rules are installed. The repository can be moved into an organization later by updating `GITHUB_REPOSITORY`; no organization is created automatically.

## Run the product

```sh
mvn -f spring-app/pom.xml verify
COOKIE_SECURE=false mvn -f spring-app/pom.xml spring-boot:run
```

Open `http://localhost:8080` and choose **Explore the demo**. Java 21 and Maven 3.6.3 or later are required. In PowerShell set `$env:COOKIE_SECURE='false'` before the Maven command. This setting is only for local HTTP; production cookies remain Secure and HttpOnly.

```sh
docker build -t agenticsl .
docker run --rm -p 8080:8080 -e COOKIE_SECURE=false agenticsl
```

## Enable live login and persistence

Configure secrets only in Render's Environment settings, never in Git:

| Variable | Purpose |
| --- | --- |
| `PUBLIC_BASE_URL` | Exact HTTPS Render URL, with no trailing slash |
| `GITHUB_CLIENT_ID` | GitHub OAuth App client ID |
| `GITHUB_CLIENT_SECRET` | Matching OAuth App secret |
| `GOOGLE_CLIENT_ID` | Optional Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Matching Google client secret |
| `MONGODB_URI` | Connection URI with a dedicated app user's credentials |
| `MONGODB_DATABASE` | `agenticsl` by default |
| `ADMIN_GITHUB_ID` | Numeric ID of the admin; defaults to repository owner's current known ID |
| `GITHUB_REPOSITORY` | Official `owner/repo`; defaults to `AzizulHakim00/AgenticSL` |
| `GITHUB_ADMIN_TOKEN` | Optional fine-grained token restricted to the official repo, contents read/write for branch creation |

Register a GitHub OAuth App with Homepage URL equal to `PUBLIC_BASE_URL` and callback `PUBLIC_BASE_URL/login/oauth2/code/github`. Requesting the GitHub password is never part of this app. The registered owner must create/configure the OAuth App; connecting GitHub to this chat does not supply application OAuth credentials.

Use an Atlas user with `readWrite` only on `agenticsl`, restricted to the intended cluster. Live records and enrolments are stored in MongoDB; local container disk is not used for permanent learning history. Atlas network access must permit the Render service's outbound ranges.

`render.yaml` records the free Docker service configuration. The service can also be created through the connected Render integration; in that case Render settings are the operational source of truth and this file is a reproducible reference. `/actuator/health` verifies that the application is serving; real login, database read/write and GitHub operations must be verified separately before calling the live private workflow complete.

## Deterministic assignment tests

Day 1 includes a WSGI API starter and four executable tests in `assignments/day-01/`. The starter intentionally fails until the learner implements it. The **Assignment evidence** workflow runs only on relevant PRs targeting learner branches, with read-only repository permissions, no persisted checkout credentials and a five-minute timeout. The application never executes submitted code.

The remaining daily assignments have requirements and review rubrics; dedicated coding test suites are not yet supplied for all 120 sessions. Passing a PR check is supporting evidence, not automatic approval: the admin must inspect changes to tests/workflows and review the implementation before merging and approving it.

## Verification and limits

The **Spring product** CI builds the jar and tests the curriculum, rendered pages, demo session isolation, server-side quiz grading, CSRF rejection, private/API boundaries, enrolment approval, PR validation and approval rejection for changed/unmerged commits. It then starts the actual jar and runs an HTTP save/reload smoke check. Tests use no production learner data.

- Demo sessions are temporary, isolated and capped; container restarts can reset them. Live MongoDB records persist independently.
- Render's free workspace hours are shared with other free services, and free services can sleep. Free does not mean unlimited or always on.
- No paid OpenAI API or automated GPT grading is used. Export evidence for manual ChatGPT review, then let the admin record the evaluation.
- Direct ChatGPT MCP synchronization, automatic webhook merging, public learner profiles and automatic testing for all 60 coding assignments are not implemented.
- No live login or third-party database can be claimed verified until its credentials are configured and its actual workflow is exercised.

Curriculum source lives in `src/curriculum.mjs`, `src/notes.mjs` and `src/practice-questions.mjs`. `node scripts/generate-spring-assets.mjs` regenerates the committed Java resources; the deployed Java app itself requires no Node process.

## Interactive coding lessons

The original 60 foundation days retain syntax-highlighted, copyable and CI-verified Python examples. Every session now includes academic lecture notes, an SVG architecture diagram, guided study plan, a case study, failure analysis, viva questions and rubric-based assessment. Days 61–120 add guided advanced implementation laboratories; they are not falsely described as pre-executed Python examples. Every example runs with Python 3.11+ and the standard library; model, framework and MCP protocol illustrations are explicitly local patterns, not live integrations. Run `python scripts/verify-tutorials.py` to execute every example and compare its actual output with the displayed result.

Each daily workspace also has an editable HTML/CSS playground with a real rendered preview. A capability-free iframe sandbox and restrictive preview CSP disable scripts, network requests, forms and navigation privileges. Python examples run locally, never on the learning server. Preview edits are temporary and separate from assignment evidence. Reading text is fixed at 18px with responsive layouts for narrow screens. There are no manual text-size controls or saved text-size preferences.
