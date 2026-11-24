/* AgenticSL Visual Lecture 2.1: additional authored scenarios for all 120 sessions. */
window.AgenticVisualData.push(...[
  {
    "day": 2,
    "kind": "guard",
    "nodes": [
      "Request",
      "Identity check",
      "Owner policy",
      "Return record",
      "Access denied"
    ],
    "principle": "Authentication establishes who is calling; authorization decides what that caller may do. A valid login does not grant access to every record. Validate the request schema and check ownership on the server for every operation. An OpenAPI document describes methods, inputs, outputs and error responses; it does not enforce permissions by itself.",
    "caseStudy": "Illustrative classroom case: Learner A requests learner B's private assignment through the task API. The verified target is: A 403 response with no cross-user data. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: An authenticated learner is not authorized for another learner's record. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Add token authentication, request validation and an OpenAPI contract; show a rejected unauthorized request. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Request. Receive a proposed action along with authenticated context. Scenario: Learner A requests learner B's private assignment through the task API.",
      "Stage 2 — Identity check. Parse the fields that determine the operation's scope. Scenario: Learner A requests learner B's private assignment through the task API.",
      "Stage 3 — Owner policy. Enforce the trust policy independently of the model's wording. Scenario: Learner A requests learner B's private assignment through the task API.",
      "Stage 4 — Return record. Perform this allowed operation only after permission checks pass. Scenario: Learner A requests learner B's private assignment through the task API.",
      "Stage 5 — Access denied. Block a disallowed operation and record the reason without side effects. Scenario: Learner A requests learner B's private assignment through the task API."
    ],
    "failure": "An authenticated learner is not authorized for another learner's record",
    "packet": "{\"case\":\"Learner A requests learner B's private assignment through the task API\",\"expected\":\"A 403 response with no cross-user data\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Authentication & API contracts, which outcome demonstrates the intended result?",
      "options": [
        "Continue even after a stated permission, source, or state validation failure",
        "A 403 response with no cross-user data",
        "Ignore the evidence and report success without verification"
      ],
      "correct": 1
    }
  },
  {
    "day": 4,
    "kind": "branch",
    "nodes": [
      "User goal",
      "Prompt baseline",
      "Grounded answer",
      "Invented answer",
      "Compare results"
    ],
    "principle": "A useful prompt states the task, relevant context, constraints and output contract. Establish a baseline before adding examples or extra instructions. Compare versions on fixed inputs using a predefined criterion. Keep development examples separate from your final evaluation set so you do not mistake tuning to known examples for general improvement.",
    "caseStudy": "Illustrative classroom case: Summarize a paper with a neutral prompt versus a source-constrained prompt. The verified target is: A supported summary cites the supplied paper passage. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: A fluent summary invents a methodology not in the source. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Write a prompt with a clear task, constraints and output format; compare it on five fixed examples. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — User goal. Start with the task and the observable evidence available. Scenario: Summarize a paper with a neutral prompt versus a source-constrained prompt.",
      "Stage 2 — Prompt baseline. Evaluate the condition used to route between outcomes. Scenario: Summarize a paper with a neutral prompt versus a source-constrained prompt.",
      "Stage 3 — Grounded answer. Explain this supported and authorized path. Scenario: Summarize a paper with a neutral prompt versus a source-constrained prompt.",
      "Stage 4 — Invented answer. Explain the alternate missing denied or failure path. Scenario: Summarize a paper with a neutral prompt versus a source-constrained prompt.",
      "Stage 5 — Compare results. Return an auditable decision with its supporting state. Scenario: Summarize a paper with a neutral prompt versus a source-constrained prompt."
    ],
    "failure": "A fluent summary invents a methodology not in the source",
    "packet": "{\"case\":\"Summarize a paper with a neutral prompt versus a source-constrained prompt\",\"expected\":\"A supported summary cites the supplied paper passage\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Prompt design & baselines, which outcome demonstrates the intended result?",
      "options": [
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure",
        "A supported summary cites the supplied paper passage"
      ],
      "correct": 2
    }
  },
  {
    "day": 6,
    "kind": "cycle",
    "nodes": [
      "Client request",
      "LLM API",
      "Retry policy",
      "Cost meter",
      "Return or stop"
    ],
    "principle": "Transient failures need bounded recovery. Use a timeout, a limited retry count and backoff for retryable errors. Track total elapsed time as well as individual attempts. Retrying a write can duplicate side effects, so combine retries with idempotency where appropriate. Record usage and pricing assumptions instead of treating an estimated cost as a billed amount.",
    "caseStudy": "Illustrative classroom case: An LLM API returns HTTP 429 with a retry interval. The verified target is: The caller backs off within a fixed attempt and token budget. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: Unlimited retries exhaust the request budget. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Add timeout, capped retries and request cost logging; test a rate-limit response using a mock. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Client request. Define the goal tool budget and safe stop conditions. Scenario: An LLM API returns HTTP 429 with a retry interval.",
      "Stage 2 — LLM API. Select one permitted action in the illustrated process. Scenario: An LLM API returns HTTP 429 with a retry interval.",
      "Stage 3 — Retry policy. Inspect an external observation instead of guessing its content. Scenario: An LLM API returns HTTP 429 with a retry interval.",
      "Stage 4 — Cost meter. Check the available evidence and whether another action is justified. Scenario: An LLM API returns HTTP 429 with a retry interval.",
      "Stage 5 — Return or stop. Finish when the goal is verified or halt with a documented error. Scenario: An LLM API returns HTTP 429 with a retry interval."
    ],
    "failure": "Unlimited retries exhaust the request budget",
    "packet": "{\"case\":\"An LLM API returns HTTP 429 with a retry interval\",\"expected\":\"The caller backs off within a fixed attempt and token budget\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Retries, latency & budget, which outcome demonstrates the intended result?",
      "options": [
        "The caller backs off within a fixed attempt and token budget",
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure"
      ],
      "correct": 0
    }
  },
  {
    "day": 8,
    "kind": "guard",
    "nodes": [
      "Model tool call",
      "JSON parser",
      "Schema gate",
      "Execute tool",
      "Reject input"
    ],
    "principle": "A tool is a capability with a contract. Narrow tools such as get_task(id) are easier to validate than arbitrary commands. Define required properties, types, bounds and whether extra arguments are rejected. Validation belongs at the execution boundary even when the model was given a schema. Return actionable errors without exposing credentials.",
    "caseStudy": "Illustrative classroom case: The model proposes search_tasks with an unexpected ownerId field. The verified target is: Unknown fields are rejected before database lookup. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: Malformed tool arguments bypass the gate. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Implement two tools with typed inputs; test invalid and unexpected arguments. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Model tool call. Receive a proposed action along with authenticated context. Scenario: The model proposes search_tasks with an unexpected ownerId field.",
      "Stage 2 — JSON parser. Parse the fields that determine the operation's scope. Scenario: The model proposes search_tasks with an unexpected ownerId field.",
      "Stage 3 — Schema gate. Enforce the trust policy independently of the model's wording. Scenario: The model proposes search_tasks with an unexpected ownerId field.",
      "Stage 4 — Execute tool. Perform this allowed operation only after permission checks pass. Scenario: The model proposes search_tasks with an unexpected ownerId field.",
      "Stage 5 — Reject input. Block a disallowed operation and record the reason without side effects. Scenario: The model proposes search_tasks with an unexpected ownerId field."
    ],
    "failure": "Malformed tool arguments bypass the gate",
    "packet": "{\"case\":\"The model proposes search_tasks with an unexpected ownerId field\",\"expected\":\"Unknown fields are rejected before database lookup\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Tool schemas & validation, which outcome demonstrates the intended result?",
      "options": [
        "Continue even after a stated permission, source, or state validation failure",
        "Unknown fields are rejected before database lookup",
        "Ignore the evidence and report success without verification"
      ],
      "correct": 1
    }
  },
  {
    "day": 9,
    "kind": "linear",
    "nodes": [
      "Question",
      "Tool selection",
      "Typed arguments",
      "Tool invoke",
      "Observation"
    ],
    "principle": "Function calling asks the model for a tool name and arguments; your application decides whether to execute them. Dispatch through an explicit allowlist, validate arguments and preserve call identifiers when returning results. A model-generated name is not permission to run shell code. Test both an unknown name and invalid arguments.",
    "caseStudy": "Illustrative classroom case: A learner asks how many upcoming tasks exist using list_tasks. The verified target is: A structured count is checked before answering. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: The assistant trusts an unsupported count. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Build a tool dispatcher with an allowlist and a structured error for unknown tools. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Question. Frame the example's incoming request and acceptance conditions. Scenario: A learner asks how many upcoming tasks exist using list_tasks.",
      "Stage 2 — Tool selection. Translate inputs to the next typed representation. Scenario: A learner asks how many upcoming tasks exist using list_tasks.",
      "Stage 3 — Typed arguments. Inspect constraints metadata and state at this boundary. Scenario: A learner asks how many upcoming tasks exist using list_tasks.",
      "Stage 4 — Tool invoke. Apply the bounded operation without skipping validation. Scenario: A learner asks how many upcoming tasks exist using list_tasks.",
      "Stage 5 — Observation. Compare the final artifact against the known expected result. Scenario: A learner asks how many upcoming tasks exist using list_tasks."
    ],
    "failure": "The assistant trusts an unsupported count",
    "packet": "{\"case\":\"A learner asks how many upcoming tasks exist using list_tasks\",\"expected\":\"A structured count is checked before answering\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Function calling, which outcome demonstrates the intended result?",
      "options": [
        "A structured count is checked before answering",
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure"
      ],
      "correct": 0
    }
  },
  {
    "day": 11,
    "kind": "cycle",
    "nodes": [
      "Goal",
      "Choose action",
      "Tool result",
      "Success check",
      "Stop or replan"
    ],
    "principle": "Every loop needs code-enforced limits: maximum steps, wall-clock deadline and an explicit final-result contract. Stop when the goal is achieved, the budget is exhausted or a required capability is unavailable. A prompt saying do not loop forever is not a runtime guard. Test a mock that repeatedly requests the same tool.",
    "caseStudy": "Illustrative classroom case: An agent searches for a document with at most three lookups. The verified target is: It stops on verified evidence or an explicit budget limit. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: The agent repeats failed searches indefinitely. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Build a loop with maximum steps, a deadline and a final-result schema; test a looping mock model. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Goal. Define the goal tool budget and safe stop conditions. Scenario: An agent searches for a document with at most three lookups.",
      "Stage 2 — Choose action. Select one permitted action in the illustrated process. Scenario: An agent searches for a document with at most three lookups.",
      "Stage 3 — Tool result. Inspect an external observation instead of guessing its content. Scenario: An agent searches for a document with at most three lookups.",
      "Stage 4 — Success check. Check the available evidence and whether another action is justified. Scenario: An agent searches for a document with at most three lookups.",
      "Stage 5 — Stop or replan. Finish when the goal is verified or halt with a documented error. Scenario: An agent searches for a document with at most three lookups."
    ],
    "failure": "The agent repeats failed searches indefinitely",
    "packet": "{\"case\":\"An agent searches for a document with at most three lookups\",\"expected\":\"It stops on verified evidence or an explicit budget limit\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Agent loop & stop conditions, which outcome demonstrates the intended result?",
      "options": [
        "Continue even after a stated permission, source, or state validation failure",
        "It stops on verified evidence or an explicit budget limit",
        "Ignore the evidence and report success without verification"
      ],
      "correct": 1
    }
  },
  {
    "day": 12,
    "kind": "branch",
    "nodes": [
      "Tool error",
      "Classify status",
      "Retry path",
      "Stop path",
      "User report"
    ],
    "principle": "Classify failures before recovering. Invalid input usually needs correction; a temporary network error may justify a bounded retry; missing permission requires rejection or user action. Preserve the failed operation and its error in the trace. Verify whether a write already happened before repeating it. A partial result should identify what remains incomplete.",
    "caseStudy": "Illustrative classroom case: A document service returns 503 followed by 403. The verified target is: Temporary errors may retry but authorization failures stop. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: The controller retries a forbidden operation. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Simulate three tool failures and show whether the agent retries, requests input or stops. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Tool error. Start with the task and the observable evidence available. Scenario: A document service returns 503 followed by 403.",
      "Stage 2 — Classify status. Evaluate the condition used to route between outcomes. Scenario: A document service returns 503 followed by 403.",
      "Stage 3 — Retry path. Explain this supported and authorized path. Scenario: A document service returns 503 followed by 403.",
      "Stage 4 — Stop path. Explain the alternate missing denied or failure path. Scenario: A document service returns 503 followed by 403.",
      "Stage 5 — User report. Return an auditable decision with its supporting state. Scenario: A document service returns 503 followed by 403."
    ],
    "failure": "The controller retries a forbidden operation",
    "packet": "{\"case\":\"A document service returns 503 followed by 403\",\"expected\":\"Temporary errors may retry but authorization failures stop\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Failures & recovery, which outcome demonstrates the intended result?",
      "options": [
        "Temporary errors may retry but authorization failures stop",
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure"
      ],
      "correct": 0
    }
  },
  {
    "day": 13,
    "kind": "graph",
    "nodes": [
      "Task goal",
      "Implementation",
      "Failure trial",
      "Output check",
      "Recovery",
      "Report"
    ],
    "principle": "A checkpoint is evidence that a bounded system meets stated criteria. For your research helper, define five cases with expected behavior, including unavailable tools or unsupported claims. Use mock responses to make tests repeatable, then label any optional live-model runs separately. Record failures as well as successes in the demonstration.",
    "caseStudy": "Illustrative classroom case: A single agent succeeds for one task but times out on another. The verified target is: The report distinguishes tested success from failed recovery. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: A single demonstration is treated as reliability evidence. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Ship a single-agent research helper with mocks, tests and five documented example runs. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Task goal. Specify the initial state and dependency constraints. Scenario: A single agent succeeds for one task but times out on another.",
      "Stage 2 — Implementation. Review the first independent component or branch. Scenario: A single agent succeeds for one task but times out on another.",
      "Stage 3 — Failure trial. Review the second component or alternate branch. Scenario: A single agent succeeds for one task but times out on another.",
      "Stage 4 — Output check. Check required inputs before taking the next step. Scenario: A single agent succeeds for one task but times out on another.",
      "Stage 5 — Recovery. Resolve all validation errors and record state changes. Scenario: A single agent succeeds for one task but times out on another.",
      "Stage 6 — Report. Report the resulting artifact and reproducible evidence. Scenario: A single agent succeeds for one task but times out on another."
    ],
    "failure": "A single demonstration is treated as reliability evidence",
    "packet": "{\"case\":\"A single agent succeeds for one task but times out on another\",\"expected\":\"The report distinguishes tested success from failed recovery\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Single-agent checkpoint, which outcome demonstrates the intended result?",
      "options": [
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure",
        "The report distinguishes tested success from failed recovery"
      ],
      "correct": 2
    }
  },
  {
    "day": 16,
    "kind": "retrieval",
    "nodes": [
      "Claim",
      "Retrieve sources",
      "Supporting quote",
      "Distracting text",
      "Verify citation",
      "Publish answer"
    ],
    "principle": "Retrieval augmented generation supplies retrieved evidence to a model. Keep the document identifier, excerpt and any useful timestamp with each passage. Ask for claims supported by that evidence and verify citations against the actual text. If retrieval misses the answer, generating a confident sentence does not repair the evidence gap.",
    "caseStudy": "Illustrative classroom case: A citation claims an agent supports memory expiration settings. The verified target is: Only supporting spans are cited and unsupported claims withheld. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: A paper title is cited when the paragraph contradicts the claim. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Build a RAG answerer that cites retrieved passages and abstains when evidence is missing. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Claim. Define the exact information need and source scope. Scenario: A citation claims an agent supports memory expiration settings.",
      "Stage 2 — Retrieve sources. Collect candidate records while retaining their provenance. Scenario: A citation claims an agent supports memory expiration settings.",
      "Stage 3 — Supporting quote. Inspect the first possible supporting passage. Scenario: A citation claims an agent supports memory expiration settings.",
      "Stage 4 — Distracting text. Contrast an incomplete or distracting competing passage. Scenario: A citation claims an agent supports memory expiration settings.",
      "Stage 5 — Verify citation. Check whether the candidate truly entails the claim. Scenario: A citation claims an agent supports memory expiration settings.",
      "Stage 6 — Publish answer. Produce a cited answer or explicitly mark missing support. Scenario: A citation claims an agent supports memory expiration settings."
    ],
    "failure": "A paper title is cited when the paragraph contradicts the claim",
    "packet": "{\"case\":\"A citation claims an agent supports memory expiration settings\",\"expected\":\"Only supporting spans are cited and unsupported claims withheld\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Grounded answers & citations, which outcome demonstrates the intended result?",
      "options": [
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure",
        "Only supporting spans are cited and unsupported claims withheld"
      ],
      "correct": 2
    }
  },
  {
    "day": 17,
    "kind": "cycle",
    "nodes": [
      "User memory",
      "Consent gate",
      "Scoped storage",
      "Staleness check",
      "Update or delete"
    ],
    "principle": "Memory has scope and a lifetime. Session context, durable preferences and retrieved documents serve different purposes. Store only what is useful, preserve its origin and permit correction or removal. A timestamp helps identify stale evidence. Never retrieve another person’s private memory merely because it is semantically similar to the current query.",
    "caseStudy": "Illustrative classroom case: A learner changes their preferred programming language. The verified target is: The older preference is superseded with a timestamp. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: An expired preference is reused indefinitely. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Add source metadata, deletion and stale-document handling; write a small retrieval evaluation report. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — User memory. Define the goal tool budget and safe stop conditions. Scenario: A learner changes their preferred programming language.",
      "Stage 2 — Consent gate. Select one permitted action in the illustrated process. Scenario: A learner changes their preferred programming language.",
      "Stage 3 — Scoped storage. Inspect an external observation instead of guessing its content. Scenario: A learner changes their preferred programming language.",
      "Stage 4 — Staleness check. Check the available evidence and whether another action is justified. Scenario: A learner changes their preferred programming language.",
      "Stage 5 — Update or delete. Finish when the goal is verified or halt with a documented error. Scenario: A learner changes their preferred programming language."
    ],
    "failure": "An expired preference is reused indefinitely",
    "packet": "{\"case\":\"A learner changes their preferred programming language\",\"expected\":\"The older preference is superseded with a timestamp\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Memory lifecycle & RAG review, which outcome demonstrates the intended result?",
      "options": [
        "Continue even after a stated permission, source, or state validation failure",
        "The older preference is superseded with a timestamp",
        "Ignore the evidence and report success without verification"
      ],
      "correct": 1
    }
  },
  {
    "day": 18,
    "kind": "linear",
    "nodes": [
      "Agent config",
      "Instructions",
      "Tool registry",
      "Runner",
      "Observed trace"
    ],
    "principle": "An SDK packages model calls, tool dispatch and run state, but the application still owns its business rules. Start with one minimal agent and capture its final result. Keep tools and validation testable independently of a model provider. Pin and document the SDK version before following examples because interfaces can change.",
    "caseStudy": "Illustrative classroom case: Create an SDK agent with a read-only search tool. The verified target is: A typed tool result is returned with traceable steps. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: Instructions are mistaken for tool authorization. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Implement a minimal agent with a mockable model boundary and capture its result. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Agent config. Frame the example's incoming request and acceptance conditions. Scenario: Create an SDK agent with a read-only search tool.",
      "Stage 2 — Instructions. Translate inputs to the next typed representation. Scenario: Create an SDK agent with a read-only search tool.",
      "Stage 3 — Tool registry. Inspect constraints metadata and state at this boundary. Scenario: Create an SDK agent with a read-only search tool.",
      "Stage 4 — Runner. Apply the bounded operation without skipping validation. Scenario: Create an SDK agent with a read-only search tool.",
      "Stage 5 — Observed trace. Compare the final artifact against the known expected result. Scenario: Create an SDK agent with a read-only search tool."
    ],
    "failure": "Instructions are mistaken for tool authorization",
    "packet": "{\"case\":\"Create an SDK agent with a read-only search tool\",\"expected\":\"A typed tool result is returned with traceable steps\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Agents SDK setup, which outcome demonstrates the intended result?",
      "options": [
        "A typed tool result is returned with traceable steps",
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure"
      ],
      "correct": 0
    }
  },
  {
    "day": 19,
    "kind": "guard",
    "nodes": [
      "Tool proposal",
      "Argument parse",
      "Permission check",
      "Safe execution",
      "Rejection"
    ],
    "principle": "SDK tools should expose the same clear contracts as standalone functions. Use descriptive names, typed inputs and structured failures. Test the underlying function directly, then test registration and dispatch separately. A tool description helps selection; it does not replace validation or authorization. Keep side effects explicit in both documentation and tests.",
    "caseStudy": "Illustrative classroom case: An SDK agent proposes deleting a task with read-only credentials. The verified target is: Permissions reject the delete action. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: The SDK executes a write before checking scopes. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Register two tools, validate their inputs and demonstrate a structured failure. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Tool proposal. Receive a proposed action along with authenticated context. Scenario: An SDK agent proposes deleting a task with read-only credentials.",
      "Stage 2 — Argument parse. Parse the fields that determine the operation's scope. Scenario: An SDK agent proposes deleting a task with read-only credentials.",
      "Stage 3 — Permission check. Enforce the trust policy independently of the model's wording. Scenario: An SDK agent proposes deleting a task with read-only credentials.",
      "Stage 4 — Safe execution. Perform this allowed operation only after permission checks pass. Scenario: An SDK agent proposes deleting a task with read-only credentials.",
      "Stage 5 — Rejection. Block a disallowed operation and record the reason without side effects. Scenario: An SDK agent proposes deleting a task with read-only credentials."
    ],
    "failure": "The SDK executes a write before checking scopes",
    "packet": "{\"case\":\"An SDK agent proposes deleting a task with read-only credentials\",\"expected\":\"Permissions reject the delete action\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In SDK tools & validation, which outcome demonstrates the intended result?",
      "options": [
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure",
        "Permissions reject the delete action"
      ],
      "correct": 2
    }
  },
  {
    "day": 20,
    "kind": "branch",
    "nodes": [
      "Agent request",
      "Handoff rule",
      "Specialist agent",
      "Unsupported role",
      "Validated return"
    ],
    "principle": "A handoff transfers responsibility to a specialist with a narrower purpose. Define the trigger, the input summary and the tools the specialist may use. A vague handoff can lose constraints or expand permissions accidentally. Include a test where the coordinator should keep the task instead of transferring every request.",
    "caseStudy": "Illustrative classroom case: An assistant delegates citation checking to a reviewer. The verified target is: A reviewer checks sources and returns evidence. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: A specialist performs an unrelated write. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Create two specialists and a handoff rule; test a request that should remain with the first agent. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Agent request. Start with the task and the observable evidence available. Scenario: An assistant delegates citation checking to a reviewer.",
      "Stage 2 — Handoff rule. Evaluate the condition used to route between outcomes. Scenario: An assistant delegates citation checking to a reviewer.",
      "Stage 3 — Specialist agent. Explain this supported and authorized path. Scenario: An assistant delegates citation checking to a reviewer.",
      "Stage 4 — Unsupported role. Explain the alternate missing denied or failure path. Scenario: An assistant delegates citation checking to a reviewer.",
      "Stage 5 — Validated return. Return an auditable decision with its supporting state. Scenario: An assistant delegates citation checking to a reviewer."
    ],
    "failure": "A specialist performs an unrelated write",
    "packet": "{\"case\":\"An assistant delegates citation checking to a reviewer\",\"expected\":\"A reviewer checks sources and returns evidence\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In SDK handoffs & boundaries, which outcome demonstrates the intended result?",
      "options": [
        "Continue even after a stated permission, source, or state validation failure",
        "A reviewer checks sources and returns evidence",
        "Ignore the evidence and report success without verification"
      ],
      "correct": 1
    }
  },
  {
    "day": 21,
    "kind": "linear",
    "nodes": [
      "Agent run",
      "Span creation",
      "Tool call",
      "Sanitized logs",
      "Trace review"
    ],
    "principle": "Observability connects events across a run using stable identifiers. Capture status, tool latency, failures and selected non-sensitive metadata. Logging everything can expose private inputs or keys. Seed a fake secret in a test and verify redaction. Distinguish a trace of what happened from a claim that the result was correct.",
    "caseStudy": "Illustrative classroom case: A failing retrieval call logs request ID duration and redacted status. The verified target is: A reviewer can locate the failing boundary. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: API tokens appear in the trace. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Capture run IDs, tool duration and errors; redact a seeded fake secret in a log test. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Agent run. Frame the example's incoming request and acceptance conditions. Scenario: A failing retrieval call logs request ID duration and redacted status.",
      "Stage 2 — Span creation. Translate inputs to the next typed representation. Scenario: A failing retrieval call logs request ID duration and redacted status.",
      "Stage 3 — Tool call. Inspect constraints metadata and state at this boundary. Scenario: A failing retrieval call logs request ID duration and redacted status.",
      "Stage 4 — Sanitized logs. Apply the bounded operation without skipping validation. Scenario: A failing retrieval call logs request ID duration and redacted status.",
      "Stage 5 — Trace review. Compare the final artifact against the known expected result. Scenario: A failing retrieval call logs request ID duration and redacted status."
    ],
    "failure": "API tokens appear in the trace",
    "packet": "{\"case\":\"A failing retrieval call logs request ID duration and redacted status\",\"expected\":\"A reviewer can locate the failing boundary\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Traces & observability, which outcome demonstrates the intended result?",
      "options": [
        "A reviewer can locate the failing boundary",
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure"
      ],
      "correct": 0
    }
  },
  {
    "day": 25,
    "kind": "graph",
    "nodes": [
      "Same task",
      "Direct workflow",
      "Agent SDK",
      "LangGraph path",
      "Compare",
      "Select design"
    ],
    "principle": "Compare frameworks using the same task and acceptance criteria. Examine how each handles state, tool failures, tests, resumption and deployment. Count code and setup effort only as secondary signals. The useful conclusion explains which tradeoffs fit this task; it should not claim one framework is universally best.",
    "caseStudy": "Illustrative classroom case: Compare a function and two frameworks on fixed tasks. The verified target is: The architecture choice reflects reliability latency and cost. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: Framework branding is used as proof of superiority. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Implement the same small workflow with two approaches and compare control, testing and complexity. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Same task. Specify the initial state and dependency constraints. Scenario: Compare a function and two frameworks on fixed tasks.",
      "Stage 2 — Direct workflow. Review the first independent component or branch. Scenario: Compare a function and two frameworks on fixed tasks.",
      "Stage 3 — Agent SDK. Review the second component or alternate branch. Scenario: Compare a function and two frameworks on fixed tasks.",
      "Stage 4 — LangGraph path. Check required inputs before taking the next step. Scenario: Compare a function and two frameworks on fixed tasks.",
      "Stage 5 — Compare. Resolve all validation errors and record state changes. Scenario: Compare a function and two frameworks on fixed tasks.",
      "Stage 6 — Select design. Report the resulting artifact and reproducible evidence. Scenario: Compare a function and two frameworks on fixed tasks."
    ],
    "failure": "Framework branding is used as proof of superiority",
    "packet": "{\"case\":\"Compare a function and two frameworks on fixed tasks\",\"expected\":\"The architecture choice reflects reliability latency and cost\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Framework comparison, which outcome demonstrates the intended result?",
      "options": [
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure",
        "The architecture choice reflects reliability latency and cost"
      ],
      "correct": 2
    }
  },
  {
    "day": 26,
    "kind": "fanout",
    "nodes": [
      "Research goal",
      "Decomposition",
      "Source finder",
      "Data checker",
      "Writer",
      "Coordinator"
    ],
    "principle": "Decomposition helps when specialists have independent responsibilities and explicit outputs. Split a research task into evidence retrieval, claim checking and synthesis only if the boundaries reduce complexity. Specify a shared result schema and a budget. A specialist dependent on another result cannot safely start with an invented input.",
    "caseStudy": "Illustrative classroom case: Separate literature search calculations and writing roles. The verified target is: Typed worker results reach a validating coordinator. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: All workers duplicate work with broad permissions. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Break a research task into specialist roles and define inputs and outputs for each role. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Research goal. Establish the coordinator's task and permissions. Scenario: Separate literature search calculations and writing roles.",
      "Stage 2 — Decomposition. Split the goal into bounded typed subtasks. Scenario: Separate literature search calculations and writing roles.",
      "Stage 3 — Source finder. Inspect the first worker's independent contribution. Scenario: Separate literature search calculations and writing roles.",
      "Stage 4 — Data checker. Inspect the second worker's separate contribution. Scenario: Separate literature search calculations and writing roles.",
      "Stage 5 — Writer. Inspect the third worker's contribution with evidence IDs. Scenario: Separate literature search calculations and writing roles.",
      "Stage 6 — Coordinator. Merge only valid results and identify any missing evidence. Scenario: Separate literature search calculations and writing roles."
    ],
    "failure": "All workers duplicate work with broad permissions",
    "packet": "{\"case\":\"Separate literature search calculations and writing roles\",\"expected\":\"Typed worker results reach a validating coordinator\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Multi-agent task decomposition, which outcome demonstrates the intended result?",
      "options": [
        "Continue even after a stated permission, source, or state validation failure",
        "Typed worker results reach a validating coordinator",
        "Ignore the evidence and report success without verification"
      ],
      "correct": 1
    }
  },
  {
    "day": 28,
    "kind": "fanout",
    "nodes": [
      "Shared goal",
      "Message bus",
      "Agent A",
      "Agent B",
      "Agent C",
      "State merge"
    ],
    "principle": "Concurrent agents can overwrite the same record. Use stable identifiers and a version or transaction check to detect conflicts. Define a typed message containing sender, task, status and result. When two updates conflict, preserve the conflict and reconcile it explicitly instead of silently treating the last message as correct.",
    "caseStudy": "Illustrative classroom case: Three agents exchange task references instead of overwriting globals. The verified target is: Versioned messages merge without state races. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: Two agents overwrite the same state entry. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Define a message schema and resolve two simulated updates to the same record. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Shared goal. Establish the coordinator's task and permissions. Scenario: Three agents exchange task references instead of overwriting globals.",
      "Stage 2 — Message bus. Split the goal into bounded typed subtasks. Scenario: Three agents exchange task references instead of overwriting globals.",
      "Stage 3 — Agent A. Inspect the first worker's independent contribution. Scenario: Three agents exchange task references instead of overwriting globals.",
      "Stage 4 — Agent B. Inspect the second worker's separate contribution. Scenario: Three agents exchange task references instead of overwriting globals.",
      "Stage 5 — Agent C. Inspect the third worker's contribution with evidence IDs. Scenario: Three agents exchange task references instead of overwriting globals.",
      "Stage 6 — State merge. Merge only valid results and identify any missing evidence. Scenario: Three agents exchange task references instead of overwriting globals."
    ],
    "failure": "Two agents overwrite the same state entry",
    "packet": "{\"case\":\"Three agents exchange task references instead of overwriting globals\",\"expected\":\"Versioned messages merge without state races\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Shared state & messages, which outcome demonstrates the intended result?",
      "options": [
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure",
        "Versioned messages merge without state races"
      ],
      "correct": 2
    }
  },
  {
    "day": 30,
    "kind": "branch",
    "nodes": [
      "Disputed claim",
      "Evidence check",
      "Supported result",
      "Conflicted result",
      "Coordinator"
    ],
    "principle": "Specialists can disagree because they used different evidence, definitions or assumptions. Resolve factual claims by checking original sources and the scope of each claim. Majority voting is not verification. Preserve uncertainty when the sources do not resolve it and cite the evidence used in the final response.",
    "caseStudy": "Illustrative classroom case: Two agents disagree about a reported paper metric. The verified target is: The discrepancy resolves against primary source text. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: Agent consensus is mistaken for evidence. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Create conflicting specialist outputs and require the final answer to cite supporting evidence. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Disputed claim. Start with the task and the observable evidence available. Scenario: Two agents disagree about a reported paper metric.",
      "Stage 2 — Evidence check. Evaluate the condition used to route between outcomes. Scenario: Two agents disagree about a reported paper metric.",
      "Stage 3 — Supported result. Explain this supported and authorized path. Scenario: Two agents disagree about a reported paper metric.",
      "Stage 4 — Conflicted result. Explain the alternate missing denied or failure path. Scenario: Two agents disagree about a reported paper metric.",
      "Stage 5 — Coordinator. Return an auditable decision with its supporting state. Scenario: Two agents disagree about a reported paper metric."
    ],
    "failure": "Agent consensus is mistaken for evidence",
    "packet": "{\"case\":\"Two agents disagree about a reported paper metric\",\"expected\":\"The discrepancy resolves against primary source text\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Disagreement & verification, which outcome demonstrates the intended result?",
      "options": [
        "The discrepancy resolves against primary source text",
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure"
      ],
      "correct": 0
    }
  },
  {
    "day": 32,
    "kind": "linear",
    "nodes": [
      "MCP host",
      "Capability list",
      "Resource or tool",
      "Typed request",
      "Tool output"
    ],
    "principle": "A tool schema describes accepted arguments and helps a client present the operation. Pair it with server-side validation and an explicit result shape. For get_learning_progress, return measured records and empty states honestly. Do not put secret tokens in schema defaults, descriptions or example outputs.",
    "caseStudy": "Illustrative classroom case: A host discovers curriculum resources and a status tool. The verified target is: Only learner-authorized capabilities are invoked. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: Tool descriptions override user consent. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Expose a read-only progress tool with a JSON schema and a structured result. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — MCP host. Frame the example's incoming request and acceptance conditions. Scenario: A host discovers curriculum resources and a status tool.",
      "Stage 2 — Capability list. Translate inputs to the next typed representation. Scenario: A host discovers curriculum resources and a status tool.",
      "Stage 3 — Resource or tool. Inspect constraints metadata and state at this boundary. Scenario: A host discovers curriculum resources and a status tool.",
      "Stage 4 — Typed request. Apply the bounded operation without skipping validation. Scenario: A host discovers curriculum resources and a status tool.",
      "Stage 5 — Tool output. Compare the final artifact against the known expected result. Scenario: A host discovers curriculum resources and a status tool."
    ],
    "failure": "Tool descriptions override user consent",
    "packet": "{\"case\":\"A host discovers curriculum resources and a status tool\",\"expected\":\"Only learner-authorized capabilities are invoked\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In MCP tools & resources, which outcome demonstrates the intended result?",
      "options": [
        "Continue even after a stated permission, source, or state validation failure",
        "Only learner-authorized capabilities are invoked",
        "Ignore the evidence and report success without verification"
      ],
      "correct": 1
    }
  },
  {
    "day": 33,
    "kind": "graph",
    "nodes": [
      "Server startup",
      "Register tool",
      "Register resource",
      "Validate request",
      "Handle error",
      "Return"
    ],
    "principle": "A protocol server must distinguish valid methods, unknown methods and tool execution errors. Implement discovery and tool listing according to the supported protocol version. Test malformed requests and missing arguments. A failed persistence operation must produce an error rather than a fabricated saved result.",
    "caseStudy": "Illustrative classroom case: Build a read-only MCP curriculum lookup server. The verified target is: Known tools return typed results and unknown inputs fail. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: Unknown tool names execute because of loose dispatch. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Implement discovery, tools listing and tool calling; test an unknown method and invalid arguments. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Server startup. Specify the initial state and dependency constraints. Scenario: Build a read-only MCP curriculum lookup server.",
      "Stage 2 — Register tool. Review the first independent component or branch. Scenario: Build a read-only MCP curriculum lookup server.",
      "Stage 3 — Register resource. Review the second component or alternate branch. Scenario: Build a read-only MCP curriculum lookup server.",
      "Stage 4 — Validate request. Check required inputs before taking the next step. Scenario: Build a read-only MCP curriculum lookup server.",
      "Stage 5 — Handle error. Resolve all validation errors and record state changes. Scenario: Build a read-only MCP curriculum lookup server.",
      "Stage 6 — Return. Report the resulting artifact and reproducible evidence. Scenario: Build a read-only MCP curriculum lookup server."
    ],
    "failure": "Unknown tool names execute because of loose dispatch",
    "packet": "{\"case\":\"Build a read-only MCP curriculum lookup server\",\"expected\":\"Known tools return typed results and unknown inputs fail\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In MCP server implementation, which outcome demonstrates the intended result?",
      "options": [
        "Known tools return typed results and unknown inputs fail",
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure"
      ],
      "correct": 0
    }
  },
  {
    "day": 34,
    "kind": "cycle",
    "nodes": [
      "Transport open",
      "Initialize",
      "Invoke",
      "Network response",
      "Reconnect or close"
    ],
    "principle": "An HTTP-hosted tool server may handle each request on a different instance. Durable state belongs in a database rather than a module variable. Verify content types, request size limits, protocol errors and repeated calls. Transport success does not imply business success: inspect the returned operation result too.",
    "caseStudy": "Illustrative classroom case: A remote MCP link drops during a read-only request. The verified target is: The client reconnects within limits with safe replay. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: An interrupted write repeats without idempotency. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Host an HTTP tool endpoint locally and test content type, errors and multiple requests. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Transport open. Define the goal tool budget and safe stop conditions. Scenario: A remote MCP link drops during a read-only request.",
      "Stage 2 — Initialize. Select one permitted action in the illustrated process. Scenario: A remote MCP link drops during a read-only request.",
      "Stage 3 — Invoke. Inspect an external observation instead of guessing its content. Scenario: A remote MCP link drops during a read-only request.",
      "Stage 4 — Network response. Check the available evidence and whether another action is justified. Scenario: A remote MCP link drops during a read-only request.",
      "Stage 5 — Reconnect or close. Finish when the goal is verified or halt with a documented error. Scenario: A remote MCP link drops during a read-only request."
    ],
    "failure": "An interrupted write repeats without idempotency",
    "packet": "{\"case\":\"A remote MCP link drops during a read-only request\",\"expected\":\"The client reconnects within limits with safe replay\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Remote transport & sessions, which outcome demonstrates the intended result?",
      "options": [
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure",
        "The client reconnects within limits with safe replay"
      ],
      "correct": 2
    }
  },
  {
    "day": 36,
    "kind": "guard",
    "nodes": [
      "Learner role",
      "Requested effect",
      "Scope gate",
      "Allow read",
      "Deny write"
    ],
    "principle": "Read and write are different capabilities. A progress reader should not submit work or approve assignments. Enforce the distinction on the server, not only in tool descriptions. Test that a read-only caller is rejected when it attempts a write. Final approval can be a separate learner-controlled action even when a reviewer suggests scores.",
    "caseStudy": "Illustrative classroom case: A read-only user attempts to change assignment grades. The verified target is: Reading succeeds and grade modification is denied. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: Model-generated requests bypass authorization. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Create separate read and write capabilities and prove a read-only caller cannot submit work. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Learner role. Receive a proposed action along with authenticated context. Scenario: A read-only user attempts to change assignment grades.",
      "Stage 2 — Requested effect. Parse the fields that determine the operation's scope. Scenario: A read-only user attempts to change assignment grades.",
      "Stage 3 — Scope gate. Enforce the trust policy independently of the model's wording. Scenario: A read-only user attempts to change assignment grades.",
      "Stage 4 — Allow read. Perform this allowed operation only after permission checks pass. Scenario: A read-only user attempts to change assignment grades.",
      "Stage 5 — Deny write. Block a disallowed operation and record the reason without side effects. Scenario: A read-only user attempts to change assignment grades."
    ],
    "failure": "Model-generated requests bypass authorization",
    "packet": "{\"case\":\"A read-only user attempts to change assignment grades\",\"expected\":\"Reading succeeds and grade modification is denied\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Read & write permissions, which outcome demonstrates the intended result?",
      "options": [
        "Reading succeeds and grade modification is denied",
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure"
      ],
      "correct": 0
    }
  },
  {
    "day": 37,
    "kind": "branch",
    "nodes": [
      "Authenticated user",
      "Account scope",
      "Own progress",
      "Other user data",
      "Safe response"
    ],
    "principle": "Two accounts can share an external learning workspace after each is explicitly authorized. Their conversation histories remain separate. Store the workspace identifier independently of the caller identity and retain the actor for auditing. Verify both invited identities see the same record while an uninvited caller is rejected by the access boundary.",
    "caseStudy": "Illustrative classroom case: Two learners query records via the same endpoint. The verified target is: Each receives only their own progress records. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: Request userId overrides the session principal. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Use two test identities to access the same explicitly shared profile; verify an uninvited identity is rejected. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Authenticated user. Start with the task and the observable evidence available. Scenario: Two learners query records via the same endpoint.",
      "Stage 2 — Account scope. Evaluate the condition used to route between outcomes. Scenario: Two learners query records via the same endpoint.",
      "Stage 3 — Own progress. Explain this supported and authorized path. Scenario: Two learners query records via the same endpoint.",
      "Stage 4 — Other user data. Explain the alternate missing denied or failure path. Scenario: Two learners query records via the same endpoint.",
      "Stage 5 — Safe response. Return an auditable decision with its supporting state. Scenario: Two learners query records via the same endpoint."
    ],
    "failure": "Request userId overrides the session principal",
    "packet": "{\"case\":\"Two learners query records via the same endpoint\",\"expected\":\"Each receives only their own progress records\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Cross-account learning records, which outcome demonstrates the intended result?",
      "options": [
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure",
        "Each receives only their own progress records"
      ],
      "correct": 2
    }
  },
  {
    "day": 38,
    "kind": "cycle",
    "nodes": [
      "MCP request",
      "Tool failure",
      "Retry budget",
      "Audit log",
      "Recover or halt"
    ],
    "principle": "Integration tests should exercise the actual boundaries between identity, protocol handling, validation and persistence. Include missing identity, malformed input, a storage failure and an unauthorized operation. Check the resulting database state after failure so a rejected request does not quietly leave a partial write.",
    "caseStudy": "Illustrative classroom case: An MCP server emits malformed JSON then times out. The verified target is: Failures are typed and bounded without inventing results. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: The agent silently discards tool exceptions. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Test missing identity, invalid inputs, failed persistence and unauthorized tool calls. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — MCP request. Define the goal tool budget and safe stop conditions. Scenario: An MCP server emits malformed JSON then times out.",
      "Stage 2 — Tool failure. Select one permitted action in the illustrated process. Scenario: An MCP server emits malformed JSON then times out.",
      "Stage 3 — Retry budget. Inspect an external observation instead of guessing its content. Scenario: An MCP server emits malformed JSON then times out.",
      "Stage 4 — Audit log. Check the available evidence and whether another action is justified. Scenario: An MCP server emits malformed JSON then times out.",
      "Stage 5 — Recover or halt. Finish when the goal is verified or halt with a documented error. Scenario: An MCP server emits malformed JSON then times out."
    ],
    "failure": "The agent silently discards tool exceptions",
    "packet": "{\"case\":\"An MCP server emits malformed JSON then times out\",\"expected\":\"Failures are typed and bounded without inventing results\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Integration failure tests, which outcome demonstrates the intended result?",
      "options": [
        "Continue even after a stated permission, source, or state validation failure",
        "Failures are typed and bounded without inventing results",
        "Ignore the evidence and report success without verification"
      ],
      "correct": 1
    }
  },
  {
    "day": 39,
    "kind": "graph",
    "nodes": [
      "Project brief",
      "Agent roles",
      "MCP tools",
      "Threat test",
      "Acceptance test",
      "Review"
    ],
    "principle": "Demonstrate the full connected workflow: a client reads objectives, submits real evidence, receives review feedback and reloads the persisted record. Capture rejected calls as well as successful ones. Tool names in a README prove only an intended interface; observed, durable results prove an implemented path.",
    "caseStudy": "Illustrative classroom case: Combine a coordinator with a constrained document server. The verified target is: Verified outputs use only authorized tools. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: Integration is completed without failure tests. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Connect a progress reader and submission tool; save traces for success and rejection cases. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Project brief. Specify the initial state and dependency constraints. Scenario: Combine a coordinator with a constrained document server.",
      "Stage 2 — Agent roles. Review the first independent component or branch. Scenario: Combine a coordinator with a constrained document server.",
      "Stage 3 — MCP tools. Review the second component or alternate branch. Scenario: Combine a coordinator with a constrained document server.",
      "Stage 4 — Threat test. Check required inputs before taking the next step. Scenario: Combine a coordinator with a constrained document server.",
      "Stage 5 — Acceptance test. Resolve all validation errors and record state changes. Scenario: Combine a coordinator with a constrained document server.",
      "Stage 6 — Review. Report the resulting artifact and reproducible evidence. Scenario: Combine a coordinator with a constrained document server."
    ],
    "failure": "Integration is completed without failure tests",
    "packet": "{\"case\":\"Combine a coordinator with a constrained document server\",\"expected\":\"Verified outputs use only authorized tools\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Multi-agent & MCP checkpoint, which outcome demonstrates the intended result?",
      "options": [
        "Verified outputs use only authorized tools",
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure"
      ],
      "correct": 0
    }
  },
  {
    "day": 40,
    "kind": "graph",
    "nodes": [
      "Task population",
      "Gold cases",
      "Holdout split",
      "Agent outputs",
      "Independent score",
      "Report"
    ],
    "principle": "An evaluation dataset contains representative inputs and predefined expected behavior. Include routine tasks, ambiguous requests and failure cases. Record provenance and exclusions. Keep a development set for iteration and a separate final set for reporting so changes are not repeatedly tuned to the same held-out examples.",
    "caseStudy": "Illustrative classroom case: Create thirty benchmark tasks with known expected outputs. The verified target is: All attempted cases and exclusions are reported. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: Only successful examples are counted. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Write ten representative evaluation cases with expected behavior and a separate development set. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Task population. Specify the initial state and dependency constraints. Scenario: Create thirty benchmark tasks with known expected outputs.",
      "Stage 2 — Gold cases. Review the first independent component or branch. Scenario: Create thirty benchmark tasks with known expected outputs.",
      "Stage 3 — Holdout split. Review the second component or alternate branch. Scenario: Create thirty benchmark tasks with known expected outputs.",
      "Stage 4 — Agent outputs. Check required inputs before taking the next step. Scenario: Create thirty benchmark tasks with known expected outputs.",
      "Stage 5 — Independent score. Resolve all validation errors and record state changes. Scenario: Create thirty benchmark tasks with known expected outputs.",
      "Stage 6 — Report. Report the resulting artifact and reproducible evidence. Scenario: Create thirty benchmark tasks with known expected outputs."
    ],
    "failure": "Only successful examples are counted",
    "packet": "{\"case\":\"Create thirty benchmark tasks with known expected outputs\",\"expected\":\"All attempted cases and exclusions are reported\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Evaluation datasets, which outcome demonstrates the intended result?",
      "options": [
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure",
        "All attempted cases and exclusions are reported"
      ],
      "correct": 2
    }
  },
  {
    "day": 41,
    "kind": "linear",
    "nodes": [
      "Agent trace",
      "Failure labels",
      "Metric counts",
      "Regression check",
      "Findings"
    ],
    "principle": "Measure different outcomes separately: task success, groundedness, latency and estimated cost. Define each metric before inspecting results and compare against a baseline. A longer answer or more tool calls is not automatically better. Preserve per-case results so an average cannot hide a critical failure.",
    "caseStudy": "Illustrative classroom case: A revised prompt raises tool errors from four to six in twenty runs. The verified target is: Regression is caught and quantified. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: Only mean answer fluency is tracked. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Track task success, latency, cost and unsupported claims for a fixed suite. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Agent trace. Frame the example's incoming request and acceptance conditions. Scenario: A revised prompt raises tool errors from four to six in twenty runs.",
      "Stage 2 — Failure labels. Translate inputs to the next typed representation. Scenario: A revised prompt raises tool errors from four to six in twenty runs.",
      "Stage 3 — Metric counts. Inspect constraints metadata and state at this boundary. Scenario: A revised prompt raises tool errors from four to six in twenty runs.",
      "Stage 4 — Regression check. Apply the bounded operation without skipping validation. Scenario: A revised prompt raises tool errors from four to six in twenty runs.",
      "Stage 5 — Findings. Compare the final artifact against the known expected result. Scenario: A revised prompt raises tool errors from four to six in twenty runs."
    ],
    "failure": "Only mean answer fluency is tracked",
    "packet": "{\"case\":\"A revised prompt raises tool errors from four to six in twenty runs\",\"expected\":\"Regression is caught and quantified\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Metrics & regressions, which outcome demonstrates the intended result?",
      "options": [
        "Continue even after a stated permission, source, or state validation failure",
        "Regression is caught and quantified",
        "Ignore the evidence and report success without verification"
      ],
      "correct": 1
    }
  },
  {
    "day": 43,
    "kind": "guard",
    "nodes": [
      "Incoming text",
      "Data class",
      "Access policy",
      "Redacted logs",
      "Blocked leak"
    ],
    "principle": "Minimize stored data and define who may access it. Keep secrets in server-side runtime configuration, redact logs and exclude private datasets from public source control. Authorization must protect each record operation. Document retention and recovery expectations using implemented behavior rather than broad promises.",
    "caseStudy": "Illustrative classroom case: A diagnostic agent encounters a secret environment variable. The verified target is: The credential is redacted from prompts and logs. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: A trace includes a private credential. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Document data retention, redact logs and test server-side record authorization. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Incoming text. Receive a proposed action along with authenticated context. Scenario: A diagnostic agent encounters a secret environment variable.",
      "Stage 2 — Data class. Parse the fields that determine the operation's scope. Scenario: A diagnostic agent encounters a secret environment variable.",
      "Stage 3 — Access policy. Enforce the trust policy independently of the model's wording. Scenario: A diagnostic agent encounters a secret environment variable.",
      "Stage 4 — Redacted logs. Perform this allowed operation only after permission checks pass. Scenario: A diagnostic agent encounters a secret environment variable.",
      "Stage 5 — Blocked leak. Block a disallowed operation and record the reason without side effects. Scenario: A diagnostic agent encounters a secret environment variable."
    ],
    "failure": "A trace includes a private credential",
    "packet": "{\"case\":\"A diagnostic agent encounters a secret environment variable\",\"expected\":\"The credential is redacted from prompts and logs\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Secrets, privacy & access, which outcome demonstrates the intended result?",
      "options": [
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure",
        "The credential is redacted from prompts and logs"
      ],
      "correct": 2
    }
  },
  {
    "day": 45,
    "kind": "branch",
    "nodes": [
      "Release build",
      "Readiness check",
      "Healthy service",
      "Failed service",
      "Rollback"
    ],
    "principle": "A build validates an artifact, while deployment validation checks the running service. Test health, rejected unauthorized requests and persistence across separate requests or restarts. Keep local test records separate from production. Record the exact revision deployed so failures can be traced and a rollback can identify its source.",
    "caseStudy": "Illustrative classroom case: A Docker web service starts without database connectivity. The verified target is: Readiness prevents live work until dependencies recover. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: An HTTP response alone is treated as sufficient readiness. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Deploy a demo and test health, persistence after restart and a rejected unauthorized request. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Release build. Start with the task and the observable evidence available. Scenario: A Docker web service starts without database connectivity.",
      "Stage 2 — Readiness check. Evaluate the condition used to route between outcomes. Scenario: A Docker web service starts without database connectivity.",
      "Stage 3 — Healthy service. Explain this supported and authorized path. Scenario: A Docker web service starts without database connectivity.",
      "Stage 4 — Failed service. Explain the alternate missing denied or failure path. Scenario: A Docker web service starts without database connectivity.",
      "Stage 5 — Rollback. Return an auditable decision with its supporting state. Scenario: A Docker web service starts without database connectivity."
    ],
    "failure": "An HTTP response alone is treated as sufficient readiness",
    "packet": "{\"case\":\"A Docker web service starts without database connectivity\",\"expected\":\"Readiness prevents live work until dependencies recover\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Deployment & health checks, which outcome demonstrates the intended result?",
      "options": [
        "Readiness prevents live work until dependencies recover",
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure"
      ],
      "correct": 0
    }
  },
  {
    "day": 46,
    "kind": "graph",
    "nodes": [
      "Feature inventory",
      "Security review",
      "Load test",
      "Recovery test",
      "Approval",
      "Launch"
    ],
    "principle": "Readiness combines reliability, access controls, observability, recovery and operating limits. For each item, state the evidence, result and remaining gap. A demo can be useful with documented limitations. Avoid claiming production reliability from a single successful request or from tests that never exercise deployment.",
    "caseStudy": "Illustrative classroom case: A release is reviewed for auth persistence load and cost. The verified target is: All critical acceptance conditions pass before launch. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: Launch is approved from a single demo. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Run a readiness checklist against reliability, permissions, recovery and costs; record remaining gaps. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Feature inventory. Specify the initial state and dependency constraints. Scenario: A release is reviewed for auth persistence load and cost.",
      "Stage 2 — Security review. Review the first independent component or branch. Scenario: A release is reviewed for auth persistence load and cost.",
      "Stage 3 — Load test. Review the second component or alternate branch. Scenario: A release is reviewed for auth persistence load and cost.",
      "Stage 4 — Recovery test. Check required inputs before taking the next step. Scenario: A release is reviewed for auth persistence load and cost.",
      "Stage 5 — Approval. Resolve all validation errors and record state changes. Scenario: A release is reviewed for auth persistence load and cost.",
      "Stage 6 — Launch. Report the resulting artifact and reproducible evidence. Scenario: A release is reviewed for auth persistence load and cost."
    ],
    "failure": "Launch is approved from a single demo",
    "packet": "{\"case\":\"A release is reviewed for auth persistence load and cost\",\"expected\":\"All critical acceptance conditions pass before launch\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Production readiness review, which outcome demonstrates the intended result?",
      "options": [
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure",
        "All critical acceptance conditions pass before launch"
      ],
      "correct": 2
    }
  },
  {
    "day": 47,
    "kind": "branch",
    "nodes": [
      "Community need",
      "Scope check",
      "Real problem",
      "Vague problem",
      "User outcome"
    ],
    "principle": "Choose one real user and one bounded problem for the capstone. Describe their current workflow, the friction and a measurable improvement. List constraints such as data access, budget and latency. The product should still be useful if its AI component is replaced with a deterministic baseline.",
    "caseStudy": "Illustrative classroom case: A university team interviews students about assignment tracking. The verified target is: The project targets a documented workflow problem. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: A hypothetical market size is asserted as observed demand. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Write a one-page problem statement with one target user, constraints and a measurable outcome. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Community need. Start with the task and the observable evidence available. Scenario: A university team interviews students about assignment tracking.",
      "Stage 2 — Scope check. Evaluate the condition used to route between outcomes. Scenario: A university team interviews students about assignment tracking.",
      "Stage 3 — Real problem. Explain this supported and authorized path. Scenario: A university team interviews students about assignment tracking.",
      "Stage 4 — Vague problem. Explain the alternate missing denied or failure path. Scenario: A university team interviews students about assignment tracking.",
      "Stage 5 — User outcome. Return an auditable decision with its supporting state. Scenario: A university team interviews students about assignment tracking."
    ],
    "failure": "A hypothetical market size is asserted as observed demand",
    "packet": "{\"case\":\"A university team interviews students about assignment tracking\",\"expected\":\"The project targets a documented workflow problem\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Capstone problem & user, which outcome demonstrates the intended result?",
      "options": [
        "Continue even after a stated permission, source, or state validation failure",
        "The project targets a documented workflow problem",
        "Ignore the evidence and report success without verification"
      ],
      "correct": 1
    }
  },
  {
    "day": 48,
    "kind": "graph",
    "nodes": [
      "Stakeholder goal",
      "Functional need",
      "Security need",
      "Acceptance test",
      "Out-of-scope",
      "Approved spec"
    ],
    "principle": "Acceptance criteria define observable pass or fail behavior. Replace vague goals such as smart interface with concrete outcomes such as a saved submission remains after reload. Map each requirement to a test, walkthrough or measured case. Include empty, error and unauthorized states alongside the happy path.",
    "caseStudy": "Illustrative classroom case: Translate the learning app brief into verifiable requirements. The verified target is: Requirements have owners and measurable pass criteria. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: An ambiguous requirement is accepted without a test. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Write five acceptance criteria and map each to a test or review activity. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Stakeholder goal. Specify the initial state and dependency constraints. Scenario: Translate the learning app brief into verifiable requirements.",
      "Stage 2 — Functional need. Review the first independent component or branch. Scenario: Translate the learning app brief into verifiable requirements.",
      "Stage 3 — Security need. Review the second component or alternate branch. Scenario: Translate the learning app brief into verifiable requirements.",
      "Stage 4 — Acceptance test. Check required inputs before taking the next step. Scenario: Translate the learning app brief into verifiable requirements.",
      "Stage 5 — Out-of-scope. Resolve all validation errors and record state changes. Scenario: Translate the learning app brief into verifiable requirements.",
      "Stage 6 — Approved spec. Report the resulting artifact and reproducible evidence. Scenario: Translate the learning app brief into verifiable requirements."
    ],
    "failure": "An ambiguous requirement is accepted without a test",
    "packet": "{\"case\":\"Translate the learning app brief into verifiable requirements\",\"expected\":\"Requirements have owners and measurable pass criteria\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Requirements & acceptance criteria, which outcome demonstrates the intended result?",
      "options": [
        "Requirements have owners and measurable pass criteria",
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure"
      ],
      "correct": 0
    }
  },
  {
    "day": 50,
    "kind": "graph",
    "nodes": [
      "Data source",
      "Audit records",
      "Define split",
      "Freeze gold cases",
      "Measure results",
      "Report"
    ],
    "principle": "Select data that is relevant, lawful to use and sufficient for the bounded task. Record origin, preprocessing and exclusions. Create expected outputs or review criteria before tuning the system. Separate evaluation cases from examples used to develop prompts or retrieval settings.",
    "caseStudy": "Illustrative classroom case: A research team separates training tuning and heldout evaluation tasks. The verified target is: The split and rubric are frozen before experiments. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: Heldout examples are repeatedly tuned to. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Build a small lawful dataset and evaluation set; record provenance and exclusions. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Data source. Specify the initial state and dependency constraints. Scenario: A research team separates training tuning and heldout evaluation tasks.",
      "Stage 2 — Audit records. Review the first independent component or branch. Scenario: A research team separates training tuning and heldout evaluation tasks.",
      "Stage 3 — Define split. Review the second component or alternate branch. Scenario: A research team separates training tuning and heldout evaluation tasks.",
      "Stage 4 — Freeze gold cases. Check required inputs before taking the next step. Scenario: A research team separates training tuning and heldout evaluation tasks.",
      "Stage 5 — Measure results. Resolve all validation errors and record state changes. Scenario: A research team separates training tuning and heldout evaluation tasks.",
      "Stage 6 — Report. Report the resulting artifact and reproducible evidence. Scenario: A research team separates training tuning and heldout evaluation tasks."
    ],
    "failure": "Heldout examples are repeatedly tuned to",
    "packet": "{\"case\":\"A research team separates training tuning and heldout evaluation tasks\",\"expected\":\"The split and rubric are frozen before experiments\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Dataset & evaluation plan, which outcome demonstrates the intended result?",
      "options": [
        "Continue even after a stated permission, source, or state validation failure",
        "The split and rubric are frozen before experiments",
        "Ignore the evidence and report success without verification"
      ],
      "correct": 1
    }
  },
  {
    "day": 51,
    "kind": "linear",
    "nodes": [
      "HTTP endpoint",
      "Session scope",
      "Service logic",
      "Database write",
      "Verified state"
    ],
    "principle": "A vertical slice connects a validated request, authorization, a durable write and a subsequent read. Implement this small path before broadening the feature set. Use parameterized queries and stable identifiers. Verify invalid requests do not write anything and a new request can read the saved object.",
    "caseStudy": "Illustrative classroom case: A learner saves a checklist item to a MongoDB-backed Spring app. The verified target is: The item persists only under the authenticated learner ID. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: A submitted ownerId changes another learner's task. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Build the core create/read flow with validation, authorization and persistence. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — HTTP endpoint. Frame the example's incoming request and acceptance conditions. Scenario: A learner saves a checklist item to a MongoDB-backed Spring app.",
      "Stage 2 — Session scope. Translate inputs to the next typed representation. Scenario: A learner saves a checklist item to a MongoDB-backed Spring app.",
      "Stage 3 — Service logic. Inspect constraints metadata and state at this boundary. Scenario: A learner saves a checklist item to a MongoDB-backed Spring app.",
      "Stage 4 — Database write. Apply the bounded operation without skipping validation. Scenario: A learner saves a checklist item to a MongoDB-backed Spring app.",
      "Stage 5 — Verified state. Compare the final artifact against the known expected result. Scenario: A learner saves a checklist item to a MongoDB-backed Spring app."
    ],
    "failure": "A submitted ownerId changes another learner's task",
    "packet": "{\"case\":\"A learner saves a checklist item to a MongoDB-backed Spring app\",\"expected\":\"The item persists only under the authenticated learner ID\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Backend & persistence, which outcome demonstrates the intended result?",
      "options": [
        "The item persists only under the authenticated learner ID",
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure"
      ],
      "correct": 0
    }
  },
  {
    "day": 52,
    "kind": "cycle",
    "nodes": [
      "Agent request",
      "Tool selection",
      "Tool response",
      "Policy check",
      "Finish or stop"
    ],
    "principle": "Build the minimum useful agent path with narrow tools and explicit stopping rules. Use a mock model to test routing and failures without paid requests. Record the allowed actions and their results. Add a live model only after the business rules and error behavior are independently testable.",
    "caseStudy": "Illustrative classroom case: A decision assistant retrieves course deadlines before making suggestions. The verified target is: An answer uses verified tool responses within a bounded loop. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: A failed tool causes the model to invent deadlines. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Implement the core agent with bounded actions, a mock model and recorded tool results. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Agent request. Define the goal tool budget and safe stop conditions. Scenario: A decision assistant retrieves course deadlines before making suggestions.",
      "Stage 2 — Tool selection. Select one permitted action in the illustrated process. Scenario: A decision assistant retrieves course deadlines before making suggestions.",
      "Stage 3 — Tool response. Inspect an external observation instead of guessing its content. Scenario: A decision assistant retrieves course deadlines before making suggestions.",
      "Stage 4 — Policy check. Check the available evidence and whether another action is justified. Scenario: A decision assistant retrieves course deadlines before making suggestions.",
      "Stage 5 — Finish or stop. Finish when the goal is verified or halt with a documented error. Scenario: A decision assistant retrieves course deadlines before making suggestions."
    ],
    "failure": "A failed tool causes the model to invent deadlines",
    "packet": "{\"case\":\"A decision assistant retrieves course deadlines before making suggestions\",\"expected\":\"An answer uses verified tool responses within a bounded loop\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Core agent workflow, which outcome demonstrates the intended result?",
      "options": [
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure",
        "An answer uses verified tool responses within a bounded loop"
      ],
      "correct": 2
    }
  },
  {
    "day": 53,
    "kind": "branch",
    "nodes": [
      "User input",
      "Interaction check",
      "Accessible UI",
      "Inaccessible UI",
      "Learning result"
    ],
    "principle": "An interface should communicate loading, empty, error and saved states. Preserve a user’s input after a failed save and avoid showing success before the server confirms persistence. Make controls usable by keyboard and on narrow screens. Show actual progress values instead of seeded demonstration scores.",
    "caseStudy": "Illustrative classroom case: A student navigates a lesson using a keyboard and mobile viewport. The verified target is: Focusable controls and readable status feedback are available. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: The diagram is clickable only with a mouse. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Build the main interaction with loading, error, empty and success states. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — User input. Start with the task and the observable evidence available. Scenario: A student navigates a lesson using a keyboard and mobile viewport.",
      "Stage 2 — Interaction check. Evaluate the condition used to route between outcomes. Scenario: A student navigates a lesson using a keyboard and mobile viewport.",
      "Stage 3 — Accessible UI. Explain this supported and authorized path. Scenario: A student navigates a lesson using a keyboard and mobile viewport.",
      "Stage 4 — Inaccessible UI. Explain the alternate missing denied or failure path. Scenario: A student navigates a lesson using a keyboard and mobile viewport.",
      "Stage 5 — Learning result. Return an auditable decision with its supporting state. Scenario: A student navigates a lesson using a keyboard and mobile viewport."
    ],
    "failure": "The diagram is clickable only with a mouse",
    "packet": "{\"case\":\"A student navigates a lesson using a keyboard and mobile viewport\",\"expected\":\"Focusable controls and readable status feedback are available\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Frontend learning experience, which outcome demonstrates the intended result?",
      "options": [
        "Continue even after a stated permission, source, or state validation failure",
        "Focusable controls and readable status feedback are available",
        "Ignore the evidence and report success without verification"
      ],
      "correct": 1
    }
  },
  {
    "day": 54,
    "kind": "guard",
    "nodes": [
      "Pending answer",
      "Rubric",
      "Human review",
      "Approved result",
      "Rejected result"
    ],
    "principle": "A review connects feedback and a suggested score to a specific submission version. A new submission should invalidate the old approval. Keep reviewer judgment separate from the learner’s final approval and record both actions. Explain that reading pasted output does not independently execute or verify the submitted program.",
    "caseStudy": "Illustrative classroom case: A learner submits a coding PR with an AI-suggested score. The verified target is: Final authorization comes from the assigned reviewer. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: A model self-approves the learner's work. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Add a submission review with score, feedback and an explicit approval decision. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Pending answer. Receive a proposed action along with authenticated context. Scenario: A learner submits a coding PR with an AI-suggested score.",
      "Stage 2 — Rubric. Parse the fields that determine the operation's scope. Scenario: A learner submits a coding PR with an AI-suggested score.",
      "Stage 3 — Human review. Enforce the trust policy independently of the model's wording. Scenario: A learner submits a coding PR with an AI-suggested score.",
      "Stage 4 — Approved result. Perform this allowed operation only after permission checks pass. Scenario: A learner submits a coding PR with an AI-suggested score.",
      "Stage 5 — Rejected result. Block a disallowed operation and record the reason without side effects. Scenario: A learner submits a coding PR with an AI-suggested score."
    ],
    "failure": "A model self-approves the learner's work",
    "packet": "{\"case\":\"A learner submits a coding PR with an AI-suggested score\",\"expected\":\"Final authorization comes from the assigned reviewer\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Human review & feedback, which outcome demonstrates the intended result?",
      "options": [
        "Final authorization comes from the assigned reviewer",
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure"
      ],
      "correct": 0
    }
  },
  {
    "day": 55,
    "kind": "guard",
    "nodes": [
      "Agent input",
      "Threat model",
      "Permission gate",
      "Allowed tool",
      "Blocked effect"
    ],
    "principle": "Security tests should match the product’s actual data and capabilities. Try unauthorized reads, invalid writes and malicious retrieved instructions. Assert what must remain unchanged after rejection. A cosmetic UI check cannot establish authorization. Document the boundary tested and the limits of local mocks.",
    "caseStudy": "Illustrative classroom case: A capstone retrieves a hostile webpage asking for stored keys. The verified target is: The gateway prevents secret disclosure. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: Retrieved instructions gain tool permissions. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Run prompt injection, unauthorized access and invalid-input tests against the capstone. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Agent input. Receive a proposed action along with authenticated context. Scenario: A capstone retrieves a hostile webpage asking for stored keys.",
      "Stage 2 — Threat model. Parse the fields that determine the operation's scope. Scenario: A capstone retrieves a hostile webpage asking for stored keys.",
      "Stage 3 — Permission gate. Enforce the trust policy independently of the model's wording. Scenario: A capstone retrieves a hostile webpage asking for stored keys.",
      "Stage 4 — Allowed tool. Perform this allowed operation only after permission checks pass. Scenario: A capstone retrieves a hostile webpage asking for stored keys.",
      "Stage 5 — Blocked effect. Block a disallowed operation and record the reason without side effects. Scenario: A capstone retrieves a hostile webpage asking for stored keys."
    ],
    "failure": "Retrieved instructions gain tool permissions",
    "packet": "{\"case\":\"A capstone retrieves a hostile webpage asking for stored keys\",\"expected\":\"The gateway prevents secret disclosure\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Security & adversarial cases, which outcome demonstrates the intended result?",
      "options": [
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure",
        "The gateway prevents secret disclosure"
      ],
      "correct": 2
    }
  },
  {
    "day": 56,
    "kind": "graph",
    "nodes": [
      "Workload",
      "Latency test",
      "Token budget",
      "Cost model",
      "Tradeoff",
      "Decision"
    ],
    "principle": "Measure latency and cost on representative cases before optimizing. Record p50 and p95 only when the sample size supports useful interpretation, and disclose small samples. Separate model time, retrieval and tool execution. Set explicit budgets and test behavior when a request reaches them.",
    "caseStudy": "Illustrative classroom case: Compare two agent runs with different tool call counts. The verified target is: Quality and cost per success are measured together. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: A cheap model is chosen despite failing required tasks. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Measure latency and estimated cost across ten cases; set explicit limits. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Workload. Specify the initial state and dependency constraints. Scenario: Compare two agent runs with different tool call counts.",
      "Stage 2 — Latency test. Review the first independent component or branch. Scenario: Compare two agent runs with different tool call counts.",
      "Stage 3 — Token budget. Review the second component or alternate branch. Scenario: Compare two agent runs with different tool call counts.",
      "Stage 4 — Cost model. Check required inputs before taking the next step. Scenario: Compare two agent runs with different tool call counts.",
      "Stage 5 — Tradeoff. Resolve all validation errors and record state changes. Scenario: Compare two agent runs with different tool call counts.",
      "Stage 6 — Decision. Report the resulting artifact and reproducible evidence. Scenario: Compare two agent runs with different tool call counts."
    ],
    "failure": "A cheap model is chosen despite failing required tasks",
    "packet": "{\"case\":\"Compare two agent runs with different tool call counts\",\"expected\":\"Quality and cost per success are measured together\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Performance & cost budget, which outcome demonstrates the intended result?",
      "options": [
        "Continue even after a stated permission, source, or state validation failure",
        "Quality and cost per success are measured together",
        "Ignore the evidence and report success without verification"
      ],
      "correct": 1
    }
  },
  {
    "day": 57,
    "kind": "cycle",
    "nodes": [
      "Release candidate",
      "Deploy",
      "Health probe",
      "Runbook",
      "Rollback or keep"
    ],
    "principle": "A release needs a known revision, migration plan and recovery procedure. Export records, restore them into a separate test environment and compare key fields. A file named backup is not proof of recoverability. Keep production credentials separate and document any manual steps honestly.",
    "caseStudy": "Illustrative classroom case: A new Spring release fails to connect to its database. The verified target is: The failed release is reverted with data intact. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: A deployment is considered healthy because the build passed. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Deploy the capstone, export its records and demonstrate one recovery scenario. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Release candidate. Define the goal tool budget and safe stop conditions. Scenario: A new Spring release fails to connect to its database.",
      "Stage 2 — Deploy. Select one permitted action in the illustrated process. Scenario: A new Spring release fails to connect to its database.",
      "Stage 3 — Health probe. Inspect an external observation instead of guessing its content. Scenario: A new Spring release fails to connect to its database.",
      "Stage 4 — Runbook. Check the available evidence and whether another action is justified. Scenario: A new Spring release fails to connect to its database.",
      "Stage 5 — Rollback or keep. Finish when the goal is verified or halt with a documented error. Scenario: A new Spring release fails to connect to its database."
    ],
    "failure": "A deployment is considered healthy because the build passed",
    "packet": "{\"case\":\"A new Spring release fails to connect to its database\",\"expected\":\"The failed release is reverted with data intact\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Deploy & recover, which outcome demonstrates the intended result?",
      "options": [
        "The failed release is reverted with data intact",
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure"
      ],
      "correct": 0
    }
  },
  {
    "day": 58,
    "kind": "graph",
    "nodes": [
      "User workflow",
      "Task scenario",
      "Usability test",
      "Failure task",
      "Feedback",
      "Iteration"
    ],
    "principle": "User acceptance checks whether the main workflow serves its intended user. Observe a walkthrough, record reproducible failures and map them to acceptance criteria. Fix the issue that blocks the primary task before adding decoration. Re-run the failed criterion after the change and retain the result.",
    "caseStudy": "Illustrative classroom case: Five students test a new lesson navigation and submission flow. The verified target is: Observed struggles are recorded and improvements retested. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: The team calls its own demo user acceptance. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Ask a tester or perform a documented walkthrough; fix the highest-impact failed acceptance criterion. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — User workflow. Specify the initial state and dependency constraints. Scenario: Five students test a new lesson navigation and submission flow.",
      "Stage 2 — Task scenario. Review the first independent component or branch. Scenario: Five students test a new lesson navigation and submission flow.",
      "Stage 3 — Usability test. Review the second component or alternate branch. Scenario: Five students test a new lesson navigation and submission flow.",
      "Stage 4 — Failure task. Check required inputs before taking the next step. Scenario: Five students test a new lesson navigation and submission flow.",
      "Stage 5 — Feedback. Resolve all validation errors and record state changes. Scenario: Five students test a new lesson navigation and submission flow.",
      "Stage 6 — Iteration. Report the resulting artifact and reproducible evidence. Scenario: Five students test a new lesson navigation and submission flow."
    ],
    "failure": "The team calls its own demo user acceptance",
    "packet": "{\"case\":\"Five students test a new lesson navigation and submission flow\",\"expected\":\"Observed struggles are recorded and improvements retested\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In User acceptance & iteration, which outcome demonstrates the intended result?",
      "options": [
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure",
        "Observed struggles are recorded and improvements retested"
      ],
      "correct": 2
    }
  },
  {
    "day": 59,
    "kind": "linear",
    "nodes": [
      "Source code",
      "README",
      "Setup guide",
      "Test evidence",
      "Portfolio artifact"
    ],
    "principle": "Documentation should let another developer run the project and understand its limits. Include setup, architecture, environment variable names, evaluation results and a short demo script. Keep keys and private learning records out of the repository. Distinguish implemented behavior from planned features.",
    "caseStudy": "Illustrative classroom case: Package a documented agent project with reproducible commands. The verified target is: A reviewer can reproduce the documented result. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: Only screenshots are supplied without code or methodology. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Write setup instructions, architecture, evaluation results, limitations and a short demo script. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Source code. Frame the example's incoming request and acceptance conditions. Scenario: Package a documented agent project with reproducible commands.",
      "Stage 2 — README. Translate inputs to the next typed representation. Scenario: Package a documented agent project with reproducible commands.",
      "Stage 3 — Setup guide. Inspect constraints metadata and state at this boundary. Scenario: Package a documented agent project with reproducible commands.",
      "Stage 4 — Test evidence. Apply the bounded operation without skipping validation. Scenario: Package a documented agent project with reproducible commands.",
      "Stage 5 — Portfolio artifact. Compare the final artifact against the known expected result. Scenario: Package a documented agent project with reproducible commands."
    ],
    "failure": "Only screenshots are supplied without code or methodology",
    "packet": "{\"case\":\"Package a documented agent project with reproducible commands\",\"expected\":\"A reviewer can reproduce the documented result\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Documentation & portfolio evidence, which outcome demonstrates the intended result?",
      "options": [
        "Continue even after a stated permission, source, or state validation failure",
        "A reviewer can reproduce the documented result",
        "Ignore the evidence and report success without verification"
      ],
      "correct": 1
    }
  },
  {
    "day": 60,
    "kind": "graph",
    "nodes": [
      "Final task",
      "Live walkthrough",
      "Negative test",
      "Metric summary",
      "Limitations",
      "Defense"
    ],
    "principle": "Compare the final product with your Day 1 baseline using comparable evidence. Demonstrate the deployed workflow, acceptance results and remaining limitations. Identify which skills you can explain, implement and teach. A streak is useful motivation, but reproducible work and observed improvement support your engineering claims.",
    "caseStudy": "Illustrative classroom case: Demonstrate a capstone with success and adversarial cases. The verified target is: The presentation includes reproducible evidence and limitations. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: An untested architecture is claimed production ready. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Run the acceptance suite, show the deployed product and compare your skills with Day 1. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Final task. Specify the initial state and dependency constraints. Scenario: Demonstrate a capstone with success and adversarial cases.",
      "Stage 2 — Live walkthrough. Review the first independent component or branch. Scenario: Demonstrate a capstone with success and adversarial cases.",
      "Stage 3 — Negative test. Review the second component or alternate branch. Scenario: Demonstrate a capstone with success and adversarial cases.",
      "Stage 4 — Metric summary. Check required inputs before taking the next step. Scenario: Demonstrate a capstone with success and adversarial cases.",
      "Stage 5 — Limitations. Resolve all validation errors and record state changes. Scenario: Demonstrate a capstone with success and adversarial cases.",
      "Stage 6 — Defense. Report the resulting artifact and reproducible evidence. Scenario: Demonstrate a capstone with success and adversarial cases."
    ],
    "failure": "An untested architecture is claimed production ready",
    "packet": "{\"case\":\"Demonstrate a capstone with success and adversarial cases\",\"expected\":\"The presentation includes reproducible evidence and limitations\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Final demonstration & reflection, which outcome demonstrates the intended result?",
      "options": [
        "The presentation includes reproducible evidence and limitations",
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure"
      ],
      "correct": 0
    }
  },
  {
    "day": 62,
    "kind": "cycle",
    "nodes": [
      "Question",
      "Choose tool",
      "Observe output",
      "Policy review",
      "Answer or retry"
    ],
    "principle": "Use tool observations as data, not as new instructions; each iteration must reduce uncertainty or stop. Academic learning objective: Contrast observe-act loops with grounded tool feedback.",
    "caseStudy": "Illustrative classroom case: A ReAct executor receives a fabricated tool failure. The verified target is: The loop stops or retries according to a fixed budget. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: The tool error is treated as new authority. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Implement a bounded ReAct executor with a fabricated tool error. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Question. Define the goal tool budget and safe stop conditions. Scenario: A ReAct executor receives a fabricated tool failure.",
      "Stage 2 — Choose tool. Select one permitted action in the illustrated process. Scenario: A ReAct executor receives a fabricated tool failure.",
      "Stage 3 — Observe output. Inspect an external observation instead of guessing its content. Scenario: A ReAct executor receives a fabricated tool failure.",
      "Stage 4 — Policy review. Check the available evidence and whether another action is justified. Scenario: A ReAct executor receives a fabricated tool failure.",
      "Stage 5 — Answer or retry. Finish when the goal is verified or halt with a documented error. Scenario: A ReAct executor receives a fabricated tool failure."
    ],
    "failure": "The tool error is treated as new authority",
    "packet": "{\"case\":\"A ReAct executor receives a fabricated tool failure\",\"expected\":\"The loop stops or retries according to a fixed budget\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In ReAct agent variants, which outcome demonstrates the intended result?",
      "options": [
        "Continue even after a stated permission, source, or state validation failure",
        "The loop stops or retries according to a fixed budget",
        "Ignore the evidence and report success without verification"
      ],
      "correct": 1
    }
  },
  {
    "day": 63,
    "kind": "graph",
    "nodes": [
      "Goal",
      "Planner",
      "Ready tasks",
      "Executor",
      "Replanner",
      "Verification"
    ],
    "principle": "A planner proposes a task list while an executor performs one step at a time; replan only on meaningful invalidation. Academic learning objective: Evaluate high-level planning against local reactive choice.",
    "caseStudy": "Illustrative classroom case: A planner schedules two independent queries before synthesis. The verified target is: Execution respects task prerequisites and state changes. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: The original plan is used after a required input changed. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Implement a two-stage planner and measure unnecessary replans. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Goal. Specify the initial state and dependency constraints. Scenario: A planner schedules two independent queries before synthesis.",
      "Stage 2 — Planner. Review the first independent component or branch. Scenario: A planner schedules two independent queries before synthesis.",
      "Stage 3 — Ready tasks. Review the second component or alternate branch. Scenario: A planner schedules two independent queries before synthesis.",
      "Stage 4 — Executor. Check required inputs before taking the next step. Scenario: A planner schedules two independent queries before synthesis.",
      "Stage 5 — Replanner. Resolve all validation errors and record state changes. Scenario: A planner schedules two independent queries before synthesis.",
      "Stage 6 — Verification. Report the resulting artifact and reproducible evidence. Scenario: A planner schedules two independent queries before synthesis."
    ],
    "failure": "The original plan is used after a required input changed",
    "packet": "{\"case\":\"A planner schedules two independent queries before synthesis\",\"expected\":\"Execution respects task prerequisites and state changes\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Plan-and-execute architecture, which outcome demonstrates the intended result?",
      "options": [
        "Execution respects task prerequisites and state changes",
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure"
      ],
      "correct": 0
    }
  },
  {
    "day": 64,
    "kind": "graph",
    "nodes": [
      "Plan variables",
      "First tool",
      "Second tool",
      "Bind values",
      "Resolve references",
      "Synthesize"
    ],
    "principle": "Reasoning WithOut Observation-style plans can reference prior tool outputs through typed variables; invalid references must be rejected.",
    "caseStudy": "Illustrative classroom case: A ReWOO-style plan references earlier tool outputs by ID. The verified target is: Each variable resolves from a verified prior result. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: An undefined variable is silently substituted. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Build an offline variable-resolution executor that catches missing references. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Plan variables. Specify the initial state and dependency constraints. Scenario: A ReWOO-style plan references earlier tool outputs by ID.",
      "Stage 2 — First tool. Review the first independent component or branch. Scenario: A ReWOO-style plan references earlier tool outputs by ID.",
      "Stage 3 — Second tool. Review the second component or alternate branch. Scenario: A ReWOO-style plan references earlier tool outputs by ID.",
      "Stage 4 — Bind values. Check required inputs before taking the next step. Scenario: A ReWOO-style plan references earlier tool outputs by ID.",
      "Stage 5 — Resolve references. Resolve all validation errors and record state changes. Scenario: A ReWOO-style plan references earlier tool outputs by ID.",
      "Stage 6 — Synthesize. Report the resulting artifact and reproducible evidence. Scenario: A ReWOO-style plan references earlier tool outputs by ID."
    ],
    "failure": "An undefined variable is silently substituted",
    "packet": "{\"case\":\"A ReWOO-style plan references earlier tool outputs by ID\",\"expected\":\"Each variable resolves from a verified prior result\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In ReWOO and variable binding, which outcome demonstrates the intended result?",
      "options": [
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure",
        "Each variable resolves from a verified prior result"
      ],
      "correct": 2
    }
  },
  {
    "day": 65,
    "kind": "cycle",
    "nodes": [
      "Initial draft",
      "Independent test",
      "Critique",
      "Bounded revision",
      "Verify again"
    ],
    "principle": "Reflection should consume external test results and produce a bounded patch plan; ungrounded self-critique may amplify errors. Academic learning objective: Distinguish genuine feedback loops from repeated generation.",
    "caseStudy": "Illustrative classroom case: An agent's generated code fails a deterministic unit test. The verified target is: The patch fixes the measured failure within a retry limit. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: Unverified self-criticism replaces external feedback. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Implement one correction iteration using a failing unit test. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Initial draft. Define the goal tool budget and safe stop conditions. Scenario: An agent's generated code fails a deterministic unit test.",
      "Stage 2 — Independent test. Select one permitted action in the illustrated process. Scenario: An agent's generated code fails a deterministic unit test.",
      "Stage 3 — Critique. Inspect an external observation instead of guessing its content. Scenario: An agent's generated code fails a deterministic unit test.",
      "Stage 4 — Bounded revision. Check the available evidence and whether another action is justified. Scenario: An agent's generated code fails a deterministic unit test.",
      "Stage 5 — Verify again. Finish when the goal is verified or halt with a documented error. Scenario: An agent's generated code fails a deterministic unit test."
    ],
    "failure": "Unverified self-criticism replaces external feedback",
    "packet": "{\"case\":\"An agent's generated code fails a deterministic unit test\",\"expected\":\"The patch fixes the measured failure within a retry limit\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Reflexion and self-correction, which outcome demonstrates the intended result?",
      "options": [
        "Continue even after a stated permission, source, or state validation failure",
        "The patch fixes the measured failure within a retry limit",
        "Ignore the evidence and report success without verification"
      ],
      "correct": 1
    }
  },
  {
    "day": 66,
    "kind": "graph",
    "nodes": [
      "Search root",
      "Option A",
      "Option B",
      "Prune weak",
      "Expand best",
      "Check goal"
    ],
    "principle": "Branching increases exploration cost; define scoring, pruning, and termination before considering alternatives. Academic learning objective: Compare branching thought search with deterministic tree exploration.",
    "caseStudy": "Illustrative classroom case: Compare a beam search with one greedy next-step decision. The verified target is: Candidates are scored by a fixed objective and budget. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: Unbounded branching causes runaway model calls. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Write a beam-search toy planner and compare beam widths. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Search root. Specify the initial state and dependency constraints. Scenario: Compare a beam search with one greedy next-step decision.",
      "Stage 2 — Option A. Review the first independent component or branch. Scenario: Compare a beam search with one greedy next-step decision.",
      "Stage 3 — Option B. Review the second component or alternate branch. Scenario: Compare a beam search with one greedy next-step decision.",
      "Stage 4 — Prune weak. Check required inputs before taking the next step. Scenario: Compare a beam search with one greedy next-step decision.",
      "Stage 5 — Expand best. Resolve all validation errors and record state changes. Scenario: Compare a beam search with one greedy next-step decision.",
      "Stage 6 — Check goal. Report the resulting artifact and reproducible evidence. Scenario: Compare a beam search with one greedy next-step decision."
    ],
    "failure": "Unbounded branching causes runaway model calls",
    "packet": "{\"case\":\"Compare a beam search with one greedy next-step decision\",\"expected\":\"Candidates are scored by a fixed objective and budget\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Tree-of-Thought and search, which outcome demonstrates the intended result?",
      "options": [
        "Candidates are scored by a fixed objective and budget",
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure"
      ],
      "correct": 0
    }
  },
  {
    "day": 67,
    "kind": "guard",
    "nodes": [
      "Model proposal",
      "Parse action",
      "Rule engine",
      "Allowed operation",
      "Rejected operation"
    ],
    "principle": "Policies should enforce permission, input types, budget, and allowed operations independently of model text. Academic learning objective: Use deterministic code to constrain model decisions.",
    "caseStudy": "Illustrative classroom case: The model attempts an unapproved network request. The verified target is: The firewall denies a destination outside its allowlist. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: A generated justification overrides a denied action. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Implement a tool-policy firewall with deny-by-default behavior. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Model proposal. Receive a proposed action along with authenticated context. Scenario: The model attempts an unapproved network request.",
      "Stage 2 — Parse action. Parse the fields that determine the operation's scope. Scenario: The model attempts an unapproved network request.",
      "Stage 3 — Rule engine. Enforce the trust policy independently of the model's wording. Scenario: The model attempts an unapproved network request.",
      "Stage 4 — Allowed operation. Perform this allowed operation only after permission checks pass. Scenario: The model attempts an unapproved network request.",
      "Stage 5 — Rejected operation. Block a disallowed operation and record the reason without side effects. Scenario: The model attempts an unapproved network request."
    ],
    "failure": "A generated justification overrides a denied action",
    "packet": "{\"case\":\"The model attempts an unapproved network request\",\"expected\":\"The firewall denies a destination outside its allowlist\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Programmatic agent policies, which outcome demonstrates the intended result?",
      "options": [
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure",
        "The firewall denies a destination outside its allowlist"
      ],
      "correct": 2
    }
  },
  {
    "day": 68,
    "kind": "graph",
    "nodes": [
      "Task corpus",
      "Direct baseline",
      "ReAct variant",
      "Planner variant",
      "Metrics",
      "Conclusion"
    ],
    "principle": "Compare direct answer, ReAct, planning, and fixed workflow on identical tasks and score accuracy, steps, latency and cost. Academic learning objective: Choose architectures using measurable workload evidence.",
    "caseStudy": "Illustrative classroom case: Test three agent architectures on the same synthetic tasks. The verified target is: Success rates latency and cost use identical denominators. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: One cherry-picked win determines the architecture choice. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Benchmark ten synthetic tasks with identical success criteria. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Task corpus. Specify the initial state and dependency constraints. Scenario: Test three agent architectures on the same synthetic tasks.",
      "Stage 2 — Direct baseline. Review the first independent component or branch. Scenario: Test three agent architectures on the same synthetic tasks.",
      "Stage 3 — ReAct variant. Review the second component or alternate branch. Scenario: Test three agent architectures on the same synthetic tasks.",
      "Stage 4 — Planner variant. Check required inputs before taking the next step. Scenario: Test three agent architectures on the same synthetic tasks.",
      "Stage 5 — Metrics. Resolve all validation errors and record state changes. Scenario: Test three agent architectures on the same synthetic tasks.",
      "Stage 6 — Conclusion. Report the resulting artifact and reproducible evidence. Scenario: Test three agent architectures on the same synthetic tasks."
    ],
    "failure": "One cherry-picked win determines the architecture choice",
    "packet": "{\"case\":\"Test three agent architectures on the same synthetic tasks\",\"expected\":\"Success rates latency and cost use identical denominators\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Reasoning architecture benchmark, which outcome demonstrates the intended result?",
      "options": [
        "Continue even after a stated permission, source, or state validation failure",
        "Success rates latency and cost use identical denominators",
        "Ignore the evidence and report success without verification"
      ],
      "correct": 1
    }
  },
  {
    "day": 70,
    "kind": "branch",
    "nodes": [
      "User question",
      "Rewrite policy",
      "Faithful query",
      "Drifted query",
      "Search audit"
    ],
    "principle": "A rewrite can resolve terminology but must not invent claims or silently discard constraints. Academic learning objective: Improve retrieval queries without contaminating user intent.",
    "caseStudy": "Illustrative classroom case: A retrieval system rewrites a question containing a hard date constraint. The verified target is: The rewritten query retains all user constraints. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: The date requirement disappears during rewriting. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Test four rewrite strategies against a baseline retrieval set. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — User question. Start with the task and the observable evidence available. Scenario: A retrieval system rewrites a question containing a hard date constraint.",
      "Stage 2 — Rewrite policy. Evaluate the condition used to route between outcomes. Scenario: A retrieval system rewrites a question containing a hard date constraint.",
      "Stage 3 — Faithful query. Explain this supported and authorized path. Scenario: A retrieval system rewrites a question containing a hard date constraint.",
      "Stage 4 — Drifted query. Explain the alternate missing denied or failure path. Scenario: A retrieval system rewrites a question containing a hard date constraint.",
      "Stage 5 — Search audit. Return an auditable decision with its supporting state. Scenario: A retrieval system rewrites a question containing a hard date constraint."
    ],
    "failure": "The date requirement disappears during rewriting",
    "packet": "{\"case\":\"A retrieval system rewrites a question containing a hard date constraint\",\"expected\":\"The rewritten query retains all user constraints\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Query rewriting agents, which outcome demonstrates the intended result?",
      "options": [
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure",
        "The rewritten query retains all user constraints"
      ],
      "correct": 2
    }
  },
  {
    "day": 71,
    "kind": "retrieval",
    "nodes": [
      "Question",
      "Candidates",
      "Relevant span",
      "Verbose distractor",
      "Rerank",
      "Condense"
    ],
    "principle": "Rerank retrieved candidates with a separate relevance signal and retain minimal source spans for citation. Academic learning objective: Select evidence under a hard context budget.",
    "caseStudy": "Illustrative classroom case: A reranker selects source paragraphs for a fixed token budget. The verified target is: A short passage with the critical negation is retained. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: Compression removes a not from the cited evidence. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Implement scored passage selection and token budgeting. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Question. Define the exact information need and source scope. Scenario: A reranker selects source paragraphs for a fixed token budget.",
      "Stage 2 — Candidates. Collect candidate records while retaining their provenance. Scenario: A reranker selects source paragraphs for a fixed token budget.",
      "Stage 3 — Relevant span. Inspect the first possible supporting passage. Scenario: A reranker selects source paragraphs for a fixed token budget.",
      "Stage 4 — Verbose distractor. Contrast an incomplete or distracting competing passage. Scenario: A reranker selects source paragraphs for a fixed token budget.",
      "Stage 5 — Rerank. Check whether the candidate truly entails the claim. Scenario: A reranker selects source paragraphs for a fixed token budget.",
      "Stage 6 — Condense. Produce a cited answer or explicitly mark missing support. Scenario: A reranker selects source paragraphs for a fixed token budget."
    ],
    "failure": "Compression removes a not from the cited evidence",
    "packet": "{\"case\":\"A reranker selects source paragraphs for a fixed token budget\",\"expected\":\"A short passage with the critical negation is retained\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Reranking and contextual compression, which outcome demonstrates the intended result?",
      "options": [
        "Continue even after a stated permission, source, or state validation failure",
        "A short passage with the critical negation is retained",
        "Ignore the evidence and report success without verification"
      ],
      "correct": 1
    }
  },
  {
    "day": 72,
    "kind": "graph",
    "nodes": [
      "Entity question",
      "Graph node",
      "Relation A",
      "Relation B",
      "Provenance",
      "Answer"
    ],
    "principle": "Graph edges encode relationships; retrieval must distinguish established links from inferred links and track hop depth. Academic learning objective: Connect entities and relations to support multi-hop retrieval.",
    "caseStudy": "Illustrative classroom case: A knowledge graph connects a project to its dataset and evaluation. The verified target is: Multi-hop answers retain verified edge provenance. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: An inferred relation is stated as a database fact. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Build a small provenance-labeled knowledge graph. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Entity question. Specify the initial state and dependency constraints. Scenario: A knowledge graph connects a project to its dataset and evaluation.",
      "Stage 2 — Graph node. Review the first independent component or branch. Scenario: A knowledge graph connects a project to its dataset and evaluation.",
      "Stage 3 — Relation A. Review the second component or alternate branch. Scenario: A knowledge graph connects a project to its dataset and evaluation.",
      "Stage 4 — Relation B. Check required inputs before taking the next step. Scenario: A knowledge graph connects a project to its dataset and evaluation.",
      "Stage 5 — Provenance. Resolve all validation errors and record state changes. Scenario: A knowledge graph connects a project to its dataset and evaluation.",
      "Stage 6 — Answer. Report the resulting artifact and reproducible evidence. Scenario: A knowledge graph connects a project to its dataset and evaluation."
    ],
    "failure": "An inferred relation is stated as a database fact",
    "packet": "{\"case\":\"A knowledge graph connects a project to its dataset and evaluation\",\"expected\":\"Multi-hop answers retain verified edge provenance\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Knowledge graph augmented RAG, which outcome demonstrates the intended result?",
      "options": [
        "Multi-hop answers retain verified edge provenance",
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure"
      ],
      "correct": 0
    }
  },
  {
    "day": 73,
    "kind": "branch",
    "nodes": [
      "Long document",
      "Budget choice",
      "Long context",
      "RAG evidence",
      "Compare support"
    ],
    "principle": "More tokens do not guarantee stronger recall; assess information position, price, freshness and answer grounding. Academic learning objective: Decide between stuffing documents and selective retrieval.",
    "caseStudy": "Illustrative classroom case: A team compares placing a full paper in context with retrieving spans. The verified target is: The choice is based on measured grounding and cost. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: A long input is assumed to guarantee recall. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Measure evidence retrieval at the start, middle and end of a document. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Long document. Start with the task and the observable evidence available. Scenario: A team compares placing a full paper in context with retrieving spans.",
      "Stage 2 — Budget choice. Evaluate the condition used to route between outcomes. Scenario: A team compares placing a full paper in context with retrieving spans.",
      "Stage 3 — Long context. Explain this supported and authorized path. Scenario: A team compares placing a full paper in context with retrieving spans.",
      "Stage 4 — RAG evidence. Explain the alternate missing denied or failure path. Scenario: A team compares placing a full paper in context with retrieving spans.",
      "Stage 5 — Compare support. Return an auditable decision with its supporting state. Scenario: A team compares placing a full paper in context with retrieving spans."
    ],
    "failure": "A long input is assumed to guarantee recall",
    "packet": "{\"case\":\"A team compares placing a full paper in context with retrieving spans\",\"expected\":\"The choice is based on measured grounding and cost\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Long-context versus RAG, which outcome demonstrates the intended result?",
      "options": [
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure",
        "The choice is based on measured grounding and cost"
      ],
      "correct": 2
    }
  },
  {
    "day": 74,
    "kind": "cycle",
    "nodes": [
      "Personal note",
      "User scope",
      "Stored memory",
      "Expiry check",
      "Revise or delete"
    ],
    "principle": "Memories require identity scope, timestamps, source, expiration, and correction procedures. Academic learning objective: Prevent stale memories and cross-user contamination.",
    "caseStudy": "Illustrative classroom case: A learner corrects an outdated study preference. The verified target is: The current user-scoped value supersedes stale memory. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: Cross-user notes or expired facts are reused. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Design memory records with explicit scope and retention. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Personal note. Define the goal tool budget and safe stop conditions. Scenario: A learner corrects an outdated study preference.",
      "Stage 2 — User scope. Select one permitted action in the illustrated process. Scenario: A learner corrects an outdated study preference.",
      "Stage 3 — Stored memory. Inspect an external observation instead of guessing its content. Scenario: A learner corrects an outdated study preference.",
      "Stage 4 — Expiry check. Check the available evidence and whether another action is justified. Scenario: A learner corrects an outdated study preference.",
      "Stage 5 — Revise or delete. Finish when the goal is verified or halt with a documented error. Scenario: A learner corrects an outdated study preference."
    ],
    "failure": "Cross-user notes or expired facts are reused",
    "packet": "{\"case\":\"A learner corrects an outdated study preference\",\"expected\":\"The current user-scoped value supersedes stale memory\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Temporal and personalized memory, which outcome demonstrates the intended result?",
      "options": [
        "Continue even after a stated permission, source, or state validation failure",
        "The current user-scoped value supersedes stale memory",
        "Ignore the evidence and report success without verification"
      ],
      "correct": 1
    }
  },
  {
    "day": 75,
    "kind": "guard",
    "nodes": [
      "Question",
      "Retrieved span",
      "Support check",
      "Grounded answer",
      "Abstain"
    ],
    "principle": "Grounded generation should require evidence spans and abstain when retrieval fails; external checks matter more than self-confidence.",
    "caseStudy": "Illustrative classroom case: A question asks a fact absent from all indexed papers. The verified target is: The system explicitly abstains or requests more evidence. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: A well-formed citation is fabricated. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Build an answer-citation consistency checker. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Question. Receive a proposed action along with authenticated context. Scenario: A question asks a fact absent from all indexed papers.",
      "Stage 2 — Retrieved span. Parse the fields that determine the operation's scope. Scenario: A question asks a fact absent from all indexed papers.",
      "Stage 3 — Support check. Enforce the trust policy independently of the model's wording. Scenario: A question asks a fact absent from all indexed papers.",
      "Stage 4 — Grounded answer. Perform this allowed operation only after permission checks pass. Scenario: A question asks a fact absent from all indexed papers.",
      "Stage 5 — Abstain. Block a disallowed operation and record the reason without side effects. Scenario: A question asks a fact absent from all indexed papers."
    ],
    "failure": "A well-formed citation is fabricated",
    "packet": "{\"case\":\"A question asks a fact absent from all indexed papers\",\"expected\":\"The system explicitly abstains or requests more evidence\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In RAG hallucination and abstention, which outcome demonstrates the intended result?",
      "options": [
        "The system explicitly abstains or requests more evidence",
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure"
      ],
      "correct": 0
    }
  },
  {
    "day": 76,
    "kind": "graph",
    "nodes": [
      "Query set",
      "BM25 baseline",
      "Vector baseline",
      "Hybrid variant",
      "Holdout scoring",
      "Findings"
    ],
    "principle": "Control dataset, query set and metrics; change one retrieval component at a time and report denominators. Academic learning objective: Audit chunking and retrieval settings with held-out cases.",
    "caseStudy": "Illustrative classroom case: Evaluate retrieval on twenty-five fixed questions. The verified target is: Precision and support are reported under fixed splits. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: The best retrieval examples are handpicked. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Evaluate precision at k and answer support on 25 questions. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Query set. Specify the initial state and dependency constraints. Scenario: Evaluate retrieval on twenty-five fixed questions.",
      "Stage 2 — BM25 baseline. Review the first independent component or branch. Scenario: Evaluate retrieval on twenty-five fixed questions.",
      "Stage 3 — Vector baseline. Review the second component or alternate branch. Scenario: Evaluate retrieval on twenty-five fixed questions.",
      "Stage 4 — Hybrid variant. Check required inputs before taking the next step. Scenario: Evaluate retrieval on twenty-five fixed questions.",
      "Stage 5 — Holdout scoring. Resolve all validation errors and record state changes. Scenario: Evaluate retrieval on twenty-five fixed questions.",
      "Stage 6 — Findings. Report the resulting artifact and reproducible evidence. Scenario: Evaluate retrieval on twenty-five fixed questions."
    ],
    "failure": "The best retrieval examples are handpicked",
    "packet": "{\"case\":\"Evaluate retrieval on twenty-five fixed questions\",\"expected\":\"Precision and support are reported under fixed splits\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Retrieval benchmark and ablations, which outcome demonstrates the intended result?",
      "options": [
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure",
        "Precision and support are reported under fixed splits"
      ],
      "correct": 2
    }
  },
  {
    "day": 78,
    "kind": "branch",
    "nodes": [
      "Image region",
      "Visual observation",
      "Readable evidence",
      "Ambiguous region",
      "Answer"
    ],
    "principle": "Image regions may be ambiguous; distinguish OCR text, object presence and inferred intent. Academic learning objective: Ground visual claims in regions and observable evidence.",
    "caseStudy": "Illustrative classroom case: A vision agent reads a timetable with a blurry date cell. The verified target is: Legible cells are reported and the ambiguous date flagged. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: The model guesses a date from visual context. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Create a mock vision tool with explicit bounding-box evidence. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Image region. Start with the task and the observable evidence available. Scenario: A vision agent reads a timetable with a blurry date cell.",
      "Stage 2 — Visual observation. Evaluate the condition used to route between outcomes. Scenario: A vision agent reads a timetable with a blurry date cell.",
      "Stage 3 — Readable evidence. Explain this supported and authorized path. Scenario: A vision agent reads a timetable with a blurry date cell.",
      "Stage 4 — Ambiguous region. Explain the alternate missing denied or failure path. Scenario: A vision agent reads a timetable with a blurry date cell.",
      "Stage 5 — Answer. Return an auditable decision with its supporting state. Scenario: A vision agent reads a timetable with a blurry date cell."
    ],
    "failure": "The model guesses a date from visual context",
    "packet": "{\"case\":\"A vision agent reads a timetable with a blurry date cell\",\"expected\":\"Legible cells are reported and the ambiguous date flagged\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Visual question answering agents, which outcome demonstrates the intended result?",
      "options": [
        "Legible cells are reported and the ambiguous date flagged",
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure"
      ],
      "correct": 0
    }
  },
  {
    "day": 79,
    "kind": "cycle",
    "nodes": [
      "Audio input",
      "Transcribe",
      "Confidence check",
      "Confirm intent",
      "Execute or retry"
    ],
    "principle": "Voice workflows need timestamps, transcription confidence, silence handling and explicit confirmation for side effects. Academic learning objective: Manage recognition uncertainty and turn-taking.",
    "caseStudy": "Illustrative classroom case: A voice agent hears a command to delete a file with low ASR confidence. The verified target is: The agent asks for explicit confirmation before side effects. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: An uncertain transcript triggers deletion. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Prototype a text transcript-based voice command dispatcher. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Audio input. Define the goal tool budget and safe stop conditions. Scenario: A voice agent hears a command to delete a file with low ASR confidence.",
      "Stage 2 — Transcribe. Select one permitted action in the illustrated process. Scenario: A voice agent hears a command to delete a file with low ASR confidence.",
      "Stage 3 — Confidence check. Inspect an external observation instead of guessing its content. Scenario: A voice agent hears a command to delete a file with low ASR confidence.",
      "Stage 4 — Confirm intent. Check the available evidence and whether another action is justified. Scenario: A voice agent hears a command to delete a file with low ASR confidence.",
      "Stage 5 — Execute or retry. Finish when the goal is verified or halt with a documented error. Scenario: A voice agent hears a command to delete a file with low ASR confidence."
    ],
    "failure": "An uncertain transcript triggers deletion",
    "packet": "{\"case\":\"A voice agent hears a command to delete a file with low ASR confidence\",\"expected\":\"The agent asks for explicit confirmation before side effects\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Speech-to-text and voice agents, which outcome demonstrates the intended result?",
      "options": [
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure",
        "The agent asks for explicit confirmation before side effects"
      ],
      "correct": 2
    }
  },
  {
    "day": 80,
    "kind": "guard",
    "nodes": [
      "Screenshot",
      "Proposed click",
      "UI policy",
      "Allowed click",
      "Blocked click"
    ],
    "principle": "A computer-use agent observes UI state and proposes actions but needs permissions, stop conditions and post-action verification. Academic learning objective: Understand screenshots, clicks and untrusted page content.",
    "caseStudy": "Illustrative classroom case: A computer-use assistant encounters a delete button. The verified target is: The application requires approval before the action. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: On-screen text impersonates a system command. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Model a sandbox browser task state machine. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Screenshot. Receive a proposed action along with authenticated context. Scenario: A computer-use assistant encounters a delete button.",
      "Stage 2 — Proposed click. Parse the fields that determine the operation's scope. Scenario: A computer-use assistant encounters a delete button.",
      "Stage 3 — UI policy. Enforce the trust policy independently of the model's wording. Scenario: A computer-use assistant encounters a delete button.",
      "Stage 4 — Allowed click. Perform this allowed operation only after permission checks pass. Scenario: A computer-use assistant encounters a delete button.",
      "Stage 5 — Blocked click. Block a disallowed operation and record the reason without side effects. Scenario: A computer-use assistant encounters a delete button."
    ],
    "failure": "On-screen text impersonates a system command",
    "packet": "{\"case\":\"A computer-use assistant encounters a delete button\",\"expected\":\"The application requires approval before the action\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Computer-use agent boundaries, which outcome demonstrates the intended result?",
      "options": [
        "Continue even after a stated permission, source, or state validation failure",
        "The application requires approval before the action",
        "Ignore the evidence and report success without verification"
      ],
      "correct": 1
    }
  },
  {
    "day": 81,
    "kind": "cycle",
    "nodes": [
      "Page state",
      "DOM locator",
      "Click",
      "Fresh observation",
      "Retry or stop"
    ],
    "principle": "DOM locators are structured but may drift; visual coordinates are contextual and need re-observation. Academic learning objective: Distinguish DOM automation from screenshot automation.",
    "caseStudy": "Illustrative classroom case: A form button moves after the page layout changes. The verified target is: The agent re-observes and validates its next locator. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: A stale coordinate clicks an unrelated control. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Test selectors under page layout changes. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Page state. Define the goal tool budget and safe stop conditions. Scenario: A form button moves after the page layout changes.",
      "Stage 2 — DOM locator. Select one permitted action in the illustrated process. Scenario: A form button moves after the page layout changes.",
      "Stage 3 — Click. Inspect an external observation instead of guessing its content. Scenario: A form button moves after the page layout changes.",
      "Stage 4 — Fresh observation. Check the available evidence and whether another action is justified. Scenario: A form button moves after the page layout changes.",
      "Stage 5 — Retry or stop. Finish when the goal is verified or halt with a documented error. Scenario: A form button moves after the page layout changes."
    ],
    "failure": "A stale coordinate clicks an unrelated control",
    "packet": "{\"case\":\"A form button moves after the page layout changes\",\"expected\":\"The agent re-observes and validates its next locator\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Browser automation reliability, which outcome demonstrates the intended result?",
      "options": [
        "The agent re-observes and validates its next locator",
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure"
      ],
      "correct": 0
    }
  },
  {
    "day": 82,
    "kind": "linear",
    "nodes": [
      "Table file",
      "Extract headers",
      "Parse rows",
      "Check units",
      "Validated result"
    ],
    "principle": "Extraction should retain page, table header, row identity and numeric units; generated formulas need verification. Academic learning objective: Preserve document structure and spreadsheet formulas.",
    "caseStudy": "Illustrative classroom case: A document agent extracts research table measurements. The verified target is: Headers and measurement units remain aligned. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: An OCR error swaps numeric columns. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Parse an HTML table and verify totals with deterministic code. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Table file. Frame the example's incoming request and acceptance conditions. Scenario: A document agent extracts research table measurements.",
      "Stage 2 — Extract headers. Translate inputs to the next typed representation. Scenario: A document agent extracts research table measurements.",
      "Stage 3 — Parse rows. Inspect constraints metadata and state at this boundary. Scenario: A document agent extracts research table measurements.",
      "Stage 4 — Check units. Apply the bounded operation without skipping validation. Scenario: A document agent extracts research table measurements.",
      "Stage 5 — Validated result. Compare the final artifact against the known expected result. Scenario: A document agent extracts research table measurements."
    ],
    "failure": "An OCR error swaps numeric columns",
    "packet": "{\"case\":\"A document agent extracts research table measurements\",\"expected\":\"Headers and measurement units remain aligned\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Document and table agents, which outcome demonstrates the intended result?",
      "options": [
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure",
        "Headers and measurement units remain aligned"
      ],
      "correct": 2
    }
  },
  {
    "day": 83,
    "kind": "retrieval",
    "nodes": [
      "Image and text",
      "OCR output",
      "Visual feature",
      "Metadata match",
      "Fuse evidence",
      "Answer"
    ],
    "principle": "Cross-modal scores are not automatically comparable; use normalization, calibration and evidence attribution. Academic learning objective: Combine OCR, image embeddings and metadata safely.",
    "caseStudy": "Illustrative classroom case: Search for a diagram by text label and visual shape. The verified target is: The answer identifies which modality supports each claim. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: Raw similarity scores are treated as calibrated confidence. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Compare a mock OCR pipeline to embedding similarity. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Image and text. Define the exact information need and source scope. Scenario: Search for a diagram by text label and visual shape.",
      "Stage 2 — OCR output. Collect candidate records while retaining their provenance. Scenario: Search for a diagram by text label and visual shape.",
      "Stage 3 — Visual feature. Inspect the first possible supporting passage. Scenario: Search for a diagram by text label and visual shape.",
      "Stage 4 — Metadata match. Contrast an incomplete or distracting competing passage. Scenario: Search for a diagram by text label and visual shape.",
      "Stage 5 — Fuse evidence. Check whether the candidate truly entails the claim. Scenario: Search for a diagram by text label and visual shape.",
      "Stage 6 — Answer. Produce a cited answer or explicitly mark missing support. Scenario: Search for a diagram by text label and visual shape."
    ],
    "failure": "Raw similarity scores are treated as calibrated confidence",
    "packet": "{\"case\":\"Search for a diagram by text label and visual shape\",\"expected\":\"The answer identifies which modality supports each claim\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Multi-modal retrieval and fusion, which outcome demonstrates the intended result?",
      "options": [
        "Continue even after a stated permission, source, or state validation failure",
        "The answer identifies which modality supports each claim",
        "Ignore the evidence and report success without verification"
      ],
      "correct": 1
    }
  },
  {
    "day": 84,
    "kind": "graph",
    "nodes": [
      "Observation set",
      "Perception score",
      "Reasoning score",
      "Action score",
      "Error audit",
      "Report"
    ],
    "principle": "An accurate answer can hide a perception failure; evaluate observation, reasoning, action and final outcome in stages. Academic learning objective: Measure perception and action errors separately.",
    "caseStudy": "Illustrative classroom case: Evaluate a multimodal agent with twenty fixed cases. The verified target is: Perception and action failures are reported separately. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: Correct final answers conceal unsafe intermediate clicks. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Design a 20-case multimodal evaluation protocol. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Observation set. Specify the initial state and dependency constraints. Scenario: Evaluate a multimodal agent with twenty fixed cases.",
      "Stage 2 — Perception score. Review the first independent component or branch. Scenario: Evaluate a multimodal agent with twenty fixed cases.",
      "Stage 3 — Reasoning score. Review the second component or alternate branch. Scenario: Evaluate a multimodal agent with twenty fixed cases.",
      "Stage 4 — Action score. Check required inputs before taking the next step. Scenario: Evaluate a multimodal agent with twenty fixed cases.",
      "Stage 5 — Error audit. Resolve all validation errors and record state changes. Scenario: Evaluate a multimodal agent with twenty fixed cases.",
      "Stage 6 — Report. Report the resulting artifact and reproducible evidence. Scenario: Evaluate a multimodal agent with twenty fixed cases."
    ],
    "failure": "Correct final answers conceal unsafe intermediate clicks",
    "packet": "{\"case\":\"Evaluate a multimodal agent with twenty fixed cases\",\"expected\":\"Perception and action failures are reported separately\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Multimodal capstone evaluation, which outcome demonstrates the intended result?",
      "options": [
        "Perception and action failures are reported separately",
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure"
      ],
      "correct": 0
    }
  },
  {
    "day": 86,
    "kind": "guard",
    "nodes": [
      "Tool request",
      "Schema parse",
      "Permission check",
      "Typed result",
      "Structured error"
    ],
    "principle": "A tool contract should specify required fields, allowed values, side effects, output schema and safe error messages. Academic learning objective: Define minimal types and robust errors for tools.",
    "caseStudy": "Illustrative classroom case: An MCP client passes an extra unrecognized argument. The verified target is: The server rejects unknown fields and returns a typed error. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: A tool ignores its input contract. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Expose a read-only task-query tool using a test fixture. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Tool request. Receive a proposed action along with authenticated context. Scenario: An MCP client passes an extra unrecognized argument.",
      "Stage 2 — Schema parse. Parse the fields that determine the operation's scope. Scenario: An MCP client passes an extra unrecognized argument.",
      "Stage 3 — Permission check. Enforce the trust policy independently of the model's wording. Scenario: An MCP client passes an extra unrecognized argument.",
      "Stage 4 — Typed result. Perform this allowed operation only after permission checks pass. Scenario: An MCP client passes an extra unrecognized argument.",
      "Stage 5 — Structured error. Block a disallowed operation and record the reason without side effects. Scenario: An MCP client passes an extra unrecognized argument."
    ],
    "failure": "A tool ignores its input contract",
    "packet": "{\"case\":\"An MCP client passes an extra unrecognized argument\",\"expected\":\"The server rejects unknown fields and returns a typed error\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In MCP tool schema design, which outcome demonstrates the intended result?",
      "options": [
        "Continue even after a stated permission, source, or state validation failure",
        "The server rejects unknown fields and returns a typed error",
        "Ignore the evidence and report success without verification"
      ],
      "correct": 1
    }
  },
  {
    "day": 87,
    "kind": "linear",
    "nodes": [
      "Host session",
      "Resource URI",
      "Prompt template",
      "Tool invocation",
      "Bounded result"
    ],
    "principle": "Resources provide addressable data; prompts provide templates; tools perform actions under authorization. Academic learning objective: Separate passive context from invokable operations.",
    "caseStudy": "Illustrative classroom case: A curriculum host exposes a read-only resource and a prompt. The verified target is: Resources are read while tools remain explicitly invoked. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: A shared prompt contains an access token. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Expose a read-only curriculum resource and prompt template. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Host session. Frame the example's incoming request and acceptance conditions. Scenario: A curriculum host exposes a read-only resource and a prompt.",
      "Stage 2 — Resource URI. Translate inputs to the next typed representation. Scenario: A curriculum host exposes a read-only resource and a prompt.",
      "Stage 3 — Prompt template. Inspect constraints metadata and state at this boundary. Scenario: A curriculum host exposes a read-only resource and a prompt.",
      "Stage 4 — Tool invocation. Apply the bounded operation without skipping validation. Scenario: A curriculum host exposes a read-only resource and a prompt.",
      "Stage 5 — Bounded result. Compare the final artifact against the known expected result. Scenario: A curriculum host exposes a read-only resource and a prompt."
    ],
    "failure": "A shared prompt contains an access token",
    "packet": "{\"case\":\"A curriculum host exposes a read-only resource and a prompt\",\"expected\":\"Resources are read while tools remain explicitly invoked\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In MCP resources and prompts, which outcome demonstrates the intended result?",
      "options": [
        "Resources are read while tools remain explicitly invoked",
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure"
      ],
      "correct": 0
    }
  },
  {
    "day": 88,
    "kind": "guard",
    "nodes": [
      "Client identity",
      "OAuth consent",
      "Scope check",
      "Authorized tool",
      "Denied tool"
    ],
    "principle": "Authenticate the correct user, constrain each tool by scope and protect tokens from logs and prompt text. Academic learning objective: Apply OAuth scopes and user-specific consent.",
    "caseStudy": "Illustrative classroom case: A remote MCP integration requests progress write scope. The verified target is: The server validates consent and token audience. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: A read token is used to write grades. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Threat-model a remote MCP server with read/write scopes. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Client identity. Receive a proposed action along with authenticated context. Scenario: A remote MCP integration requests progress write scope.",
      "Stage 2 — OAuth consent. Parse the fields that determine the operation's scope. Scenario: A remote MCP integration requests progress write scope.",
      "Stage 3 — Scope check. Enforce the trust policy independently of the model's wording. Scenario: A remote MCP integration requests progress write scope.",
      "Stage 4 — Authorized tool. Perform this allowed operation only after permission checks pass. Scenario: A remote MCP integration requests progress write scope.",
      "Stage 5 — Denied tool. Block a disallowed operation and record the reason without side effects. Scenario: A remote MCP integration requests progress write scope."
    ],
    "failure": "A read token is used to write grades",
    "packet": "{\"case\":\"A remote MCP integration requests progress write scope\",\"expected\":\"The server validates consent and token audience\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In MCP authorization and consent, which outcome demonstrates the intended result?",
      "options": [
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure",
        "The server validates consent and token audience"
      ],
      "correct": 2
    }
  },
  {
    "day": 89,
    "kind": "cycle",
    "nodes": [
      "MCP connect",
      "Initialize",
      "Discover",
      "Invoke",
      "Cancel or retry"
    ],
    "principle": "Transport choice changes deployment behavior; define readiness, timeouts, reconnection and cancellation. Academic learning objective: Handle connection loss, capability discovery and limits.",
    "caseStudy": "Illustrative classroom case: An MCP client loses a connection mid-request. The verified target is: Cancellation and recovery obey explicit lifecycle rules. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: An orphaned task continues after disconnect. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Build a simulated MCP client lifecycle with cancellation. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — MCP connect. Define the goal tool budget and safe stop conditions. Scenario: An MCP client loses a connection mid-request.",
      "Stage 2 — Initialize. Select one permitted action in the illustrated process. Scenario: An MCP client loses a connection mid-request.",
      "Stage 3 — Discover. Inspect an external observation instead of guessing its content. Scenario: An MCP client loses a connection mid-request.",
      "Stage 4 — Invoke. Check the available evidence and whether another action is justified. Scenario: An MCP client loses a connection mid-request.",
      "Stage 5 — Cancel or retry. Finish when the goal is verified or halt with a documented error. Scenario: An MCP client loses a connection mid-request."
    ],
    "failure": "An orphaned task continues after disconnect",
    "packet": "{\"case\":\"An MCP client loses a connection mid-request\",\"expected\":\"Cancellation and recovery obey explicit lifecycle rules\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In MCP transports and lifecycle, which outcome demonstrates the intended result?",
      "options": [
        "Continue even after a stated permission, source, or state validation failure",
        "Cancellation and recovery obey explicit lifecycle rules",
        "Ignore the evidence and report success without verification"
      ],
      "correct": 1
    }
  },
  {
    "day": 90,
    "kind": "linear",
    "nodes": [
      "Agent card",
      "Task request",
      "Remote agent",
      "Artifact review",
      "Task outcome"
    ],
    "principle": "A2A supports interaction across independently operated agents; Agent Cards advertise endpoints, capabilities and authentication. Academic learning objective: Compare A2A delegation with in-process agent handoff.",
    "caseStudy": "Illustrative classroom case: A coordinator delegates source verification to an independent A2A agent. The verified target is: Returned artifact provenance is checked before completion. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: The Agent Card text is treated as proof of identity. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Draft an Agent Card and typed task exchange example. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Agent card. Frame the example's incoming request and acceptance conditions. Scenario: A coordinator delegates source verification to an independent A2A agent.",
      "Stage 2 — Task request. Translate inputs to the next typed representation. Scenario: A coordinator delegates source verification to an independent A2A agent.",
      "Stage 3 — Remote agent. Inspect constraints metadata and state at this boundary. Scenario: A coordinator delegates source verification to an independent A2A agent.",
      "Stage 4 — Artifact review. Apply the bounded operation without skipping validation. Scenario: A coordinator delegates source verification to an independent A2A agent.",
      "Stage 5 — Task outcome. Compare the final artifact against the known expected result. Scenario: A coordinator delegates source verification to an independent A2A agent."
    ],
    "failure": "The Agent Card text is treated as proof of identity",
    "packet": "{\"case\":\"A coordinator delegates source verification to an independent A2A agent\",\"expected\":\"Returned artifact provenance is checked before completion\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Agent2Agent A2A concepts, which outcome demonstrates the intended result?",
      "options": [
        "Returned artifact provenance is checked before completion",
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure"
      ],
      "correct": 0
    }
  },
  {
    "day": 91,
    "kind": "cycle",
    "nodes": [
      "Task request",
      "Submitted state",
      "Running state",
      "Artifact review",
      "Complete or cancel"
    ],
    "principle": "Remote tasks may be submitted, running, completed, failed or canceled; validate returned artifacts and deadlines. Academic learning objective: Design remote delegation state machines and artifact validation.",
    "caseStudy": "Illustrative classroom case: An independent agent produces a delayed report artifact. The verified target is: The coordinator verifies the artifact before marking the task done. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: A remote task is declared completed merely because it was submitted. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Simulate polling and timeout of a delegated task. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Task request. Define the goal tool budget and safe stop conditions. Scenario: An independent agent produces a delayed report artifact.",
      "Stage 2 — Submitted state. Select one permitted action in the illustrated process. Scenario: An independent agent produces a delayed report artifact.",
      "Stage 3 — Running state. Inspect an external observation instead of guessing its content. Scenario: An independent agent produces a delayed report artifact.",
      "Stage 4 — Artifact review. Check the available evidence and whether another action is justified. Scenario: An independent agent produces a delayed report artifact.",
      "Stage 5 — Complete or cancel. Finish when the goal is verified or halt with a documented error. Scenario: An independent agent produces a delayed report artifact."
    ],
    "failure": "A remote task is declared completed merely because it was submitted",
    "packet": "{\"case\":\"An independent agent produces a delayed report artifact\",\"expected\":\"The coordinator verifies the artifact before marking the task done\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In A2A task lifecycle and artifacts, which outcome demonstrates the intended result?",
      "options": [
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure",
        "The coordinator verifies the artifact before marking the task done"
      ],
      "correct": 2
    }
  },
  {
    "day": 92,
    "kind": "graph",
    "nodes": [
      "User goal",
      "MCP tool call",
      "A2A task request",
      "Trust comparison",
      "Artifact check",
      "Decision"
    ],
    "principle": "MCP commonly connects an application to tools/context, while A2A coordinates autonomous services; compare boundaries empirically. Academic learning objective: Evaluate MCP and A2A according to trust and workload.",
    "caseStudy": "Illustrative classroom case: Compare a read-only tool lookup with a remote specialist delegation. The verified target is: Each protocol has a documented permission and ownership boundary. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: An MCP tool is treated as interchangeable with an autonomous remote agent. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Build a side-by-side architecture and threat model. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — User goal. Specify the initial state and dependency constraints. Scenario: Compare a read-only tool lookup with a remote specialist delegation.",
      "Stage 2 — MCP tool call. Review the first independent component or branch. Scenario: Compare a read-only tool lookup with a remote specialist delegation.",
      "Stage 3 — A2A task request. Review the second component or alternate branch. Scenario: Compare a read-only tool lookup with a remote specialist delegation.",
      "Stage 4 — Trust comparison. Check required inputs before taking the next step. Scenario: Compare a read-only tool lookup with a remote specialist delegation.",
      "Stage 5 — Artifact check. Resolve all validation errors and record state changes. Scenario: Compare a read-only tool lookup with a remote specialist delegation.",
      "Stage 6 — Decision. Report the resulting artifact and reproducible evidence. Scenario: Compare a read-only tool lookup with a remote specialist delegation."
    ],
    "failure": "An MCP tool is treated as interchangeable with an autonomous remote agent",
    "packet": "{\"case\":\"Compare a read-only tool lookup with a remote specialist delegation\",\"expected\":\"Each protocol has a documented permission and ownership boundary\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Interoperability comparison project, which outcome demonstrates the intended result?",
      "options": [
        "Continue even after a stated permission, source, or state validation failure",
        "Each protocol has a documented permission and ownership boundary",
        "Ignore the evidence and report success without verification"
      ],
      "correct": 1
    }
  },
  {
    "day": 94,
    "kind": "guard",
    "nodes": [
      "Tool proposal",
      "Destination check",
      "Data policy",
      "Authorized URL",
      "Blocked egress"
    ],
    "principle": "An agent with network/file tools can leak secrets even if its final answer appears safe; validate target and scope. Academic learning objective: Apply allowlists and output egress controls.",
    "caseStudy": "Illustrative classroom case: An agent proposes sending private notes to an unknown host. The verified target is: The outbound request is rejected by a host allowlist. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: A malicious retrieved document chooses an exfiltration address. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Build an allowlisted HTTP tool and deny unapproved hosts. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Tool proposal. Receive a proposed action along with authenticated context. Scenario: An agent proposes sending private notes to an unknown host.",
      "Stage 2 — Destination check. Parse the fields that determine the operation's scope. Scenario: An agent proposes sending private notes to an unknown host.",
      "Stage 3 — Data policy. Enforce the trust policy independently of the model's wording. Scenario: An agent proposes sending private notes to an unknown host.",
      "Stage 4 — Authorized URL. Perform this allowed operation only after permission checks pass. Scenario: An agent proposes sending private notes to an unknown host.",
      "Stage 5 — Blocked egress. Block a disallowed operation and record the reason without side effects. Scenario: An agent proposes sending private notes to an unknown host."
    ],
    "failure": "A malicious retrieved document chooses an exfiltration address",
    "packet": "{\"case\":\"An agent proposes sending private notes to an unknown host\",\"expected\":\"The outbound request is rejected by a host allowlist\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Tool misuse and exfiltration, which outcome demonstrates the intended result?",
      "options": [
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure",
        "The outbound request is rejected by a host allowlist"
      ],
      "correct": 2
    }
  },
  {
    "day": 95,
    "kind": "branch",
    "nodes": [
      "Authenticated principal",
      "Ownership filter",
      "Own document",
      "Foreign document",
      "Response"
    ],
    "principle": "An application must associate every operation with authenticated principals and scoped resources, not model-suggested IDs. Academic learning objective: Enforce per-user and per-tenant access to stored state.",
    "caseStudy": "Illustrative classroom case: A learner requests a record through a model-suggested user ID. The verified target is: The server uses authenticated identity to scope database reads. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: The model's user ID overrides trusted authorization. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Test cross-tenant reads against a mock repository. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Authenticated principal. Start with the task and the observable evidence available. Scenario: A learner requests a record through a model-suggested user ID.",
      "Stage 2 — Ownership filter. Evaluate the condition used to route between outcomes. Scenario: A learner requests a record through a model-suggested user ID.",
      "Stage 3 — Own document. Explain this supported and authorized path. Scenario: A learner requests a record through a model-suggested user ID.",
      "Stage 4 — Foreign document. Explain the alternate missing denied or failure path. Scenario: A learner requests a record through a model-suggested user ID.",
      "Stage 5 — Response. Return an auditable decision with its supporting state. Scenario: A learner requests a record through a model-suggested user ID."
    ],
    "failure": "The model's user ID overrides trusted authorization",
    "packet": "{\"case\":\"A learner requests a record through a model-suggested user ID\",\"expected\":\"The server uses authenticated identity to scope database reads\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Identity and authorization for agents, which outcome demonstrates the intended result?",
      "options": [
        "Continue even after a stated permission, source, or state validation failure",
        "The server uses authenticated identity to scope database reads",
        "Ignore the evidence and report success without verification"
      ],
      "correct": 1
    }
  },
  {
    "day": 96,
    "kind": "guard",
    "nodes": [
      "Proposed action",
      "Risk classification",
      "Approval gate",
      "Executed write",
      "Denied write"
    ],
    "principle": "Classify tools by read, low-risk write, high-risk write and irreversible action; require explicit approval for dangerous changes. Academic learning objective: Choose approval thresholds based on action reversibility.",
    "caseStudy": "Illustrative classroom case: An agent proposes deleting a learning record permanently. The verified target is: High-risk actions require explicit scoped approval. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: An old approval silently authorizes an unrelated deletion. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Design an approval workflow for database writes. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Proposed action. Receive a proposed action along with authenticated context. Scenario: An agent proposes deleting a learning record permanently.",
      "Stage 2 — Risk classification. Parse the fields that determine the operation's scope. Scenario: An agent proposes deleting a learning record permanently.",
      "Stage 3 — Approval gate. Enforce the trust policy independently of the model's wording. Scenario: An agent proposes deleting a learning record permanently.",
      "Stage 4 — Executed write. Perform this allowed operation only after permission checks pass. Scenario: An agent proposes deleting a learning record permanently.",
      "Stage 5 — Denied write. Block a disallowed operation and record the reason without side effects. Scenario: An agent proposes deleting a learning record permanently."
    ],
    "failure": "An old approval silently authorizes an unrelated deletion",
    "packet": "{\"case\":\"An agent proposes deleting a learning record permanently\",\"expected\":\"High-risk actions require explicit scoped approval\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Human-in-the-loop risk tiers, which outcome demonstrates the intended result?",
      "options": [
        "High-risk actions require explicit scoped approval",
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure"
      ],
      "correct": 0
    }
  },
  {
    "day": 97,
    "kind": "cycle",
    "nodes": [
      "User consent",
      "Data inventory",
      "Storage scope",
      "Retention rule",
      "Delete or renew"
    ],
    "principle": "Consent, collection purpose, retention, access controls and deletion mechanisms must be documented and tested. Academic learning objective: Minimize sensitive data and define deletion boundaries.",
    "caseStudy": "Illustrative classroom case: A learner requests deletion of an old agent trace. The verified target is: Data is removed according to documented retention rules. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: Sensitive traces are stored without expiry or scope. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Create a redaction and retention policy for agent traces. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — User consent. Define the goal tool budget and safe stop conditions. Scenario: A learner requests deletion of an old agent trace.",
      "Stage 2 — Data inventory. Select one permitted action in the illustrated process. Scenario: A learner requests deletion of an old agent trace.",
      "Stage 3 — Storage scope. Inspect an external observation instead of guessing its content. Scenario: A learner requests deletion of an old agent trace.",
      "Stage 4 — Retention rule. Check the available evidence and whether another action is justified. Scenario: A learner requests deletion of an old agent trace.",
      "Stage 5 — Delete or renew. Finish when the goal is verified or halt with a documented error. Scenario: A learner requests deletion of an old agent trace."
    ],
    "failure": "Sensitive traces are stored without expiry or scope",
    "packet": "{\"case\":\"A learner requests deletion of an old agent trace\",\"expected\":\"Data is removed according to documented retention rules\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Data retention and privacy engineering, which outcome demonstrates the intended result?",
      "options": [
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure",
        "Data is removed according to documented retention rules"
      ],
      "correct": 2
    }
  },
  {
    "day": 98,
    "kind": "guard",
    "nodes": [
      "New dependency",
      "Source integrity",
      "Package policy",
      "Approved install",
      "Quarantine"
    ],
    "principle": "Dependency pinning, provenance, signed artifacts and restricted tokens reduce risks from compromised components. Academic learning objective: Evaluate dependencies, tools and external servers as attack surfaces.",
    "caseStudy": "Illustrative classroom case: A developer adds an unsigned external MCP package. The verified target is: Dependency provenance and permissions are reviewed before use. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: Unknown third-party code runs with production credentials. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Audit an example lockfile and MCP server permission set. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — New dependency. Receive a proposed action along with authenticated context. Scenario: A developer adds an unsigned external MCP package.",
      "Stage 2 — Source integrity. Parse the fields that determine the operation's scope. Scenario: A developer adds an unsigned external MCP package.",
      "Stage 3 — Package policy. Enforce the trust policy independently of the model's wording. Scenario: A developer adds an unsigned external MCP package.",
      "Stage 4 — Approved install. Perform this allowed operation only after permission checks pass. Scenario: A developer adds an unsigned external MCP package.",
      "Stage 5 — Quarantine. Block a disallowed operation and record the reason without side effects. Scenario: A developer adds an unsigned external MCP package."
    ],
    "failure": "Unknown third-party code runs with production credentials",
    "packet": "{\"case\":\"A developer adds an unsigned external MCP package\",\"expected\":\"Dependency provenance and permissions are reviewed before use\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Supply-chain and plugin security, which outcome demonstrates the intended result?",
      "options": [
        "Continue even after a stated permission, source, or state validation failure",
        "Dependency provenance and permissions are reviewed before use",
        "Ignore the evidence and report success without verification"
      ],
      "correct": 1
    }
  },
  {
    "day": 99,
    "kind": "guard",
    "nodes": [
      "Model output",
      "JSON schema",
      "Semantic policy",
      "Use result",
      "Reject output"
    ],
    "principle": "Schema validation prevents malformed data but does not prove factual correctness; verify evidence before side effects. Academic learning objective: Validate model text, JSON, code and retrieved metadata separately.",
    "caseStudy": "Illustrative classroom case: A model emits valid JSON containing a forbidden resource ID. The verified target is: The parser succeeds but semantic authorization rejects the action. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: The system treats parse success as proof of safety. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Implement schema plus semantic checks for structured agent output. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Model output. Receive a proposed action along with authenticated context. Scenario: A model emits valid JSON containing a forbidden resource ID.",
      "Stage 2 — JSON schema. Parse the fields that determine the operation's scope. Scenario: A model emits valid JSON containing a forbidden resource ID.",
      "Stage 3 — Semantic policy. Enforce the trust policy independently of the model's wording. Scenario: A model emits valid JSON containing a forbidden resource ID.",
      "Stage 4 — Use result. Perform this allowed operation only after permission checks pass. Scenario: A model emits valid JSON containing a forbidden resource ID.",
      "Stage 5 — Reject output. Block a disallowed operation and record the reason without side effects. Scenario: A model emits valid JSON containing a forbidden resource ID."
    ],
    "failure": "The system treats parse success as proof of safety",
    "packet": "{\"case\":\"A model emits valid JSON containing a forbidden resource ID\",\"expected\":\"The parser succeeds but semantic authorization rejects the action\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Model and tool output validation, which outcome demonstrates the intended result?",
      "options": [
        "The parser succeeds but semantic authorization rejects the action",
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure"
      ],
      "correct": 0
    }
  },
  {
    "day": 100,
    "kind": "cycle",
    "nodes": [
      "Incident alert",
      "Contain access",
      "Trace review",
      "Rollback plan",
      "Resume or stop"
    ],
    "principle": "Every critical run should capture inputs references, tool decisions, identities and effect IDs without storing passwords. Academic learning objective: Prepare audit trails, rollback and containment actions.",
    "caseStudy": "Illustrative classroom case: An agent makes an unauthorized tool-call attempt during a test. The verified target is: The team revokes access and audits the action before recovery. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: The system retries the compromised capability immediately. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Write an incident playbook for a rogue tool invocation. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Incident alert. Define the goal tool budget and safe stop conditions. Scenario: An agent makes an unauthorized tool-call attempt during a test.",
      "Stage 2 — Contain access. Select one permitted action in the illustrated process. Scenario: An agent makes an unauthorized tool-call attempt during a test.",
      "Stage 3 — Trace review. Inspect an external observation instead of guessing its content. Scenario: An agent makes an unauthorized tool-call attempt during a test.",
      "Stage 4 — Rollback plan. Check the available evidence and whether another action is justified. Scenario: An agent makes an unauthorized tool-call attempt during a test.",
      "Stage 5 — Resume or stop. Finish when the goal is verified or halt with a documented error. Scenario: An agent makes an unauthorized tool-call attempt during a test."
    ],
    "failure": "The system retries the compromised capability immediately",
    "packet": "{\"case\":\"An agent makes an unauthorized tool-call attempt during a test\",\"expected\":\"The team revokes access and audits the action before recovery\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Agent incident response, which outcome demonstrates the intended result?",
      "options": [
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure",
        "The team revokes access and audits the action before recovery"
      ],
      "correct": 2
    }
  },
  {
    "day": 102,
    "kind": "graph",
    "nodes": [
      "Agent run",
      "Action trace",
      "Policy audit",
      "Output grade",
      "Trajectory score",
      "Diagnosis"
    ],
    "principle": "A correct final answer can arise from unsafe or wasteful tool steps; inspect sequences and permissions. Academic learning objective: Check intermediate tool choices, not just final answers.",
    "caseStudy": "Illustrative classroom case: An agent reaches the correct answer after repeated forbidden tool attempts. The verified target is: Final correctness and tool safety are reported separately. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: A good final answer conceals unsafe intermediate steps. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Compute invalid-tool-call and unnecessary-step rates. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Agent run. Specify the initial state and dependency constraints. Scenario: An agent reaches the correct answer after repeated forbidden tool attempts.",
      "Stage 2 — Action trace. Review the first independent component or branch. Scenario: An agent reaches the correct answer after repeated forbidden tool attempts.",
      "Stage 3 — Policy audit. Review the second component or alternate branch. Scenario: An agent reaches the correct answer after repeated forbidden tool attempts.",
      "Stage 4 — Output grade. Check required inputs before taking the next step. Scenario: An agent reaches the correct answer after repeated forbidden tool attempts.",
      "Stage 5 — Trajectory score. Resolve all validation errors and record state changes. Scenario: An agent reaches the correct answer after repeated forbidden tool attempts.",
      "Stage 6 — Diagnosis. Report the resulting artifact and reproducible evidence. Scenario: An agent reaches the correct answer after repeated forbidden tool attempts."
    ],
    "failure": "A good final answer conceals unsafe intermediate steps",
    "packet": "{\"case\":\"An agent reaches the correct answer after repeated forbidden tool attempts\",\"expected\":\"Final correctness and tool safety are reported separately\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Trajectory and step-level evaluation, which outcome demonstrates the intended result?",
      "options": [
        "Final correctness and tool safety are reported separately",
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure"
      ],
      "correct": 0
    }
  },
  {
    "day": 103,
    "kind": "branch",
    "nodes": [
      "Human rubric",
      "Judge comparison",
      "Agreed score",
      "Disagreement",
      "Calibration"
    ],
    "principle": "A model judge may be inconsistent, biased by formatting or miss failure modes; compare against human labels. Academic learning objective: Study judge agreement and blind spots.",
    "caseStudy": "Illustrative classroom case: An automated judge mis-scores a concise but correct answer. The verified target is: A human-labeled subset identifies disagreement and bias. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: Judge scores are assumed to be ground truth. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Score 20 labeled examples with a mock judge and confusion matrix. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Human rubric. Start with the task and the observable evidence available. Scenario: An automated judge mis-scores a concise but correct answer.",
      "Stage 2 — Judge comparison. Evaluate the condition used to route between outcomes. Scenario: An automated judge mis-scores a concise but correct answer.",
      "Stage 3 — Agreed score. Explain this supported and authorized path. Scenario: An automated judge mis-scores a concise but correct answer.",
      "Stage 4 — Disagreement. Explain the alternate missing denied or failure path. Scenario: An automated judge mis-scores a concise but correct answer.",
      "Stage 5 — Calibration. Return an auditable decision with its supporting state. Scenario: An automated judge mis-scores a concise but correct answer."
    ],
    "failure": "Judge scores are assumed to be ground truth",
    "packet": "{\"case\":\"An automated judge mis-scores a concise but correct answer\",\"expected\":\"A human-labeled subset identifies disagreement and bias\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In LLM-as-judge calibration, which outcome demonstrates the intended result?",
      "options": [
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure",
        "A human-labeled subset identifies disagreement and bias"
      ],
      "correct": 2
    }
  },
  {
    "day": 104,
    "kind": "linear",
    "nodes": [
      "Task attempts",
      "Timeout counts",
      "Success count",
      "Latency sort",
      "Confidence report"
    ],
    "principle": "Report task success, retry rates, latency percentiles and cost per success with repeated trials. Academic learning objective: Define denominators and repeated-run confidence.",
    "caseStudy": "Illustrative classroom case: An agent passes sixteen of twenty tasks with two timeouts. The verified target is: All twenty attempts appear in success and latency accounting. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: Timeouts are removed from denominator. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Benchmark repeated deterministic agent tasks and report rates. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Task attempts. Frame the example's incoming request and acceptance conditions. Scenario: An agent passes sixteen of twenty tasks with two timeouts.",
      "Stage 2 — Timeout counts. Translate inputs to the next typed representation. Scenario: An agent passes sixteen of twenty tasks with two timeouts.",
      "Stage 3 — Success count. Inspect constraints metadata and state at this boundary. Scenario: An agent passes sixteen of twenty tasks with two timeouts.",
      "Stage 4 — Latency sort. Apply the bounded operation without skipping validation. Scenario: An agent passes sixteen of twenty tasks with two timeouts.",
      "Stage 5 — Confidence report. Compare the final artifact against the known expected result. Scenario: An agent passes sixteen of twenty tasks with two timeouts."
    ],
    "failure": "Timeouts are removed from denominator",
    "packet": "{\"case\":\"An agent passes sixteen of twenty tasks with two timeouts\",\"expected\":\"All twenty attempts appear in success and latency accounting\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Task success and reliability metrics, which outcome demonstrates the intended result?",
      "options": [
        "Continue even after a stated permission, source, or state validation failure",
        "All twenty attempts appear in success and latency accounting",
        "Ignore the evidence and report success without verification"
      ],
      "correct": 1
    }
  },
  {
    "day": 105,
    "kind": "retrieval",
    "nodes": [
      "Generated claim",
      "Source lookup",
      "Supporting span",
      "Contradicting span",
      "Entailment check",
      "Audit"
    ],
    "principle": "Judge each cited claim against the source span, not simply whether a citation link exists. Academic learning objective: Audit citation accuracy and attribution coverage.",
    "caseStudy": "Illustrative classroom case: A generated answer cites a paper that actually contradicts its claim. The verified target is: Only citations with supporting source spans pass. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: A clickable citation is mistaken for factual grounding. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Create a five-question evidence attribution rubric. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Generated claim. Define the exact information need and source scope. Scenario: A generated answer cites a paper that actually contradicts its claim.",
      "Stage 2 — Source lookup. Collect candidate records while retaining their provenance. Scenario: A generated answer cites a paper that actually contradicts its claim.",
      "Stage 3 — Supporting span. Inspect the first possible supporting passage. Scenario: A generated answer cites a paper that actually contradicts its claim.",
      "Stage 4 — Contradicting span. Contrast an incomplete or distracting competing passage. Scenario: A generated answer cites a paper that actually contradicts its claim.",
      "Stage 5 — Entailment check. Check whether the candidate truly entails the claim. Scenario: A generated answer cites a paper that actually contradicts its claim.",
      "Stage 6 — Audit. Produce a cited answer or explicitly mark missing support. Scenario: A generated answer cites a paper that actually contradicts its claim."
    ],
    "failure": "A clickable citation is mistaken for factual grounding",
    "packet": "{\"case\":\"A generated answer cites a paper that actually contradicts its claim\",\"expected\":\"Only citations with supporting source spans pass\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Retrieval-grounding evaluations, which outcome demonstrates the intended result?",
      "options": [
        "Only citations with supporting source spans pass",
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure"
      ],
      "correct": 0
    }
  },
  {
    "day": 106,
    "kind": "guard",
    "nodes": [
      "Safe test fixture",
      "Attack input",
      "Policy test",
      "Defended action",
      "Rejected effect"
    ],
    "principle": "Run controlled prompt-injection and tool-misuse tests with no production secrets; record successful defenses and misses. Academic learning objective: Measure attack outcomes under explicit safety constraints.",
    "caseStudy": "Illustrative classroom case: A synthetic prompt injection instructs an agent to export a fake secret. The verified target is: The gateway blocks the prohibited tool call in the sandbox. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: The evaluation attempts real credential exfiltration. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Develop ten safe malicious-input fixtures. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Safe test fixture. Receive a proposed action along with authenticated context. Scenario: A synthetic prompt injection instructs an agent to export a fake secret.",
      "Stage 2 — Attack input. Parse the fields that determine the operation's scope. Scenario: A synthetic prompt injection instructs an agent to export a fake secret.",
      "Stage 3 — Policy test. Enforce the trust policy independently of the model's wording. Scenario: A synthetic prompt injection instructs an agent to export a fake secret.",
      "Stage 4 — Defended action. Perform this allowed operation only after permission checks pass. Scenario: A synthetic prompt injection instructs an agent to export a fake secret.",
      "Stage 5 — Rejected effect. Block a disallowed operation and record the reason without side effects. Scenario: A synthetic prompt injection instructs an agent to export a fake secret."
    ],
    "failure": "The evaluation attempts real credential exfiltration",
    "packet": "{\"case\":\"A synthetic prompt injection instructs an agent to export a fake secret\",\"expected\":\"The gateway blocks the prohibited tool call in the sandbox\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Security red teaming for agents, which outcome demonstrates the intended result?",
      "options": [
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure",
        "The gateway blocks the prohibited tool call in the sandbox"
      ],
      "correct": 2
    }
  },
  {
    "day": 107,
    "kind": "graph",
    "nodes": [
      "Fixed baseline",
      "Change one part",
      "Ablation variant",
      "Frozen tests",
      "Metric comparison",
      "Decision"
    ],
    "principle": "Modify one component at a time, preserve a fixed test split and compare quality against added cost. Academic learning objective: Improve architecture using targeted ablations.",
    "caseStudy": "Illustrative classroom case: Replace a retrieval reranker while preserving tasks and scoring. The verified target is: The measured effect is attributable to one changed component. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: Prompt model and dataset all change together. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Test tool-description changes against a fixed task set. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Fixed baseline. Specify the initial state and dependency constraints. Scenario: Replace a retrieval reranker while preserving tasks and scoring.",
      "Stage 2 — Change one part. Review the first independent component or branch. Scenario: Replace a retrieval reranker while preserving tasks and scoring.",
      "Stage 3 — Ablation variant. Review the second component or alternate branch. Scenario: Replace a retrieval reranker while preserving tasks and scoring.",
      "Stage 4 — Frozen tests. Check required inputs before taking the next step. Scenario: Replace a retrieval reranker while preserving tasks and scoring.",
      "Stage 5 — Metric comparison. Resolve all validation errors and record state changes. Scenario: Replace a retrieval reranker while preserving tasks and scoring.",
      "Stage 6 — Decision. Report the resulting artifact and reproducible evidence. Scenario: Replace a retrieval reranker while preserving tasks and scoring."
    ],
    "failure": "Prompt model and dataset all change together",
    "packet": "{\"case\":\"Replace a retrieval reranker while preserving tasks and scoring\",\"expected\":\"The measured effect is attributable to one changed component\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Evaluation-driven optimization, which outcome demonstrates the intended result?",
      "options": [
        "Continue even after a stated permission, source, or state validation failure",
        "The measured effect is attributable to one changed component",
        "Ignore the evidence and report success without verification"
      ],
      "correct": 1
    }
  },
  {
    "day": 108,
    "kind": "linear",
    "nodes": [
      "Versioned data",
      "Model settings",
      "Seeded tests",
      "Output archive",
      "Methods report"
    ],
    "principle": "Version data, code, model configuration, prompts, seeds and test artifacts; report uncertainty honestly. Academic learning objective: Produce an auditable methods and results section.",
    "caseStudy": "Illustrative classroom case: A research team publishes a reproducible agent evaluation. The verified target is: Code prompts metrics and artifacts can be inspected independently. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: Only a polished result chart is shared. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Create an evaluation card with reproducible commands. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Versioned data. Frame the example's incoming request and acceptance conditions. Scenario: A research team publishes a reproducible agent evaluation.",
      "Stage 2 — Model settings. Translate inputs to the next typed representation. Scenario: A research team publishes a reproducible agent evaluation.",
      "Stage 3 — Seeded tests. Inspect constraints metadata and state at this boundary. Scenario: A research team publishes a reproducible agent evaluation.",
      "Stage 4 — Output archive. Apply the bounded operation without skipping validation. Scenario: A research team publishes a reproducible agent evaluation.",
      "Stage 5 — Methods report. Compare the final artifact against the known expected result. Scenario: A research team publishes a reproducible agent evaluation."
    ],
    "failure": "Only a polished result chart is shared",
    "packet": "{\"case\":\"A research team publishes a reproducible agent evaluation\",\"expected\":\"Code prompts metrics and artifacts can be inspected independently\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Research reproducibility and reporting, which outcome demonstrates the intended result?",
      "options": [
        "Code prompts metrics and artifacts can be inspected independently",
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure"
      ],
      "correct": 0
    }
  },
  {
    "day": 110,
    "kind": "cycle",
    "nodes": [
      "Durable state",
      "Checkpoint write",
      "Worker restart",
      "Effect lookup",
      "Safe resume"
    ],
    "principle": "A checkpoint stores workflow state and action history so restarts do not repeat dangerous side effects. Academic learning objective: Resume work from durable state after failure.",
    "caseStudy": "Illustrative classroom case: An agent worker restarts after an external upload completes. The verified target is: An effect ID prevents the upload from replaying. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: The checkpoint restores state but repeats the write. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Implement a resume-capable state machine in SQLite. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Durable state. Define the goal tool budget and safe stop conditions. Scenario: An agent worker restarts after an external upload completes.",
      "Stage 2 — Checkpoint write. Select one permitted action in the illustrated process. Scenario: An agent worker restarts after an external upload completes.",
      "Stage 3 — Worker restart. Inspect an external observation instead of guessing its content. Scenario: An agent worker restarts after an external upload completes.",
      "Stage 4 — Effect lookup. Check the available evidence and whether another action is justified. Scenario: An agent worker restarts after an external upload completes.",
      "Stage 5 — Safe resume. Finish when the goal is verified or halt with a documented error. Scenario: An agent worker restarts after an external upload completes."
    ],
    "failure": "The checkpoint restores state but repeats the write",
    "packet": "{\"case\":\"An agent worker restarts after an external upload completes\",\"expected\":\"An effect ID prevents the upload from replaying\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Checkpointing and recovery, which outcome demonstrates the intended result?",
      "options": [
        "Continue even after a stated permission, source, or state validation failure",
        "An effect ID prevents the upload from replaying",
        "Ignore the evidence and report success without verification"
      ],
      "correct": 1
    }
  },
  {
    "day": 111,
    "kind": "linear",
    "nodes": [
      "POST job",
      "Job identifier",
      "Status stream",
      "Cancellation",
      "Final result"
    ],
    "principle": "Long-running tasks need job IDs, status polling or streaming, cancellation, timeouts and backpressure. Academic learning objective: Design endpoints for jobs, progress and partial results.",
    "caseStudy": "Illustrative classroom case: A long-running research agent accepts an async report request. The verified target is: The caller receives status updates and can cancel work. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: A synchronous HTTP request hangs without a deadline. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Prototype a job-status API with mock event updates. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — POST job. Frame the example's incoming request and acceptance conditions. Scenario: A long-running research agent accepts an async report request.",
      "Stage 2 — Job identifier. Translate inputs to the next typed representation. Scenario: A long-running research agent accepts an async report request.",
      "Stage 3 — Status stream. Inspect constraints metadata and state at this boundary. Scenario: A long-running research agent accepts an async report request.",
      "Stage 4 — Cancellation. Apply the bounded operation without skipping validation. Scenario: A long-running research agent accepts an async report request.",
      "Stage 5 — Final result. Compare the final artifact against the known expected result. Scenario: A long-running research agent accepts an async report request."
    ],
    "failure": "A synchronous HTTP request hangs without a deadline",
    "packet": "{\"case\":\"A long-running research agent accepts an async report request\",\"expected\":\"The caller receives status updates and can cancel work\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Agent API and streaming patterns, which outcome demonstrates the intended result?",
      "options": [
        "The caller receives status updates and can cancel work",
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure"
      ],
      "correct": 0
    }
  },
  {
    "day": 112,
    "kind": "branch",
    "nodes": [
      "Scoped request",
      "Cache key",
      "Fresh response",
      "Stale response",
      "Result"
    ],
    "principle": "Cache only deterministic or safely scoped outputs; key by model, prompt, tool version, user scope and freshness. Academic learning objective: Balance cache correctness against token and latency savings.",
    "caseStudy": "Illustrative classroom case: Two learners ask for similar but private retrieval results. The verified target is: User and data version are included in cache identity. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: One learner receives another learner's cached notes. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Implement a versioned retrieval-result cache. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Scoped request. Start with the task and the observable evidence available. Scenario: Two learners ask for similar but private retrieval results.",
      "Stage 2 — Cache key. Evaluate the condition used to route between outcomes. Scenario: Two learners ask for similar but private retrieval results.",
      "Stage 3 — Fresh response. Explain this supported and authorized path. Scenario: Two learners ask for similar but private retrieval results.",
      "Stage 4 — Stale response. Explain the alternate missing denied or failure path. Scenario: Two learners ask for similar but private retrieval results.",
      "Stage 5 — Result. Return an auditable decision with its supporting state. Scenario: Two learners ask for similar but private retrieval results."
    ],
    "failure": "One learner receives another learner's cached notes",
    "packet": "{\"case\":\"Two learners ask for similar but private retrieval results\",\"expected\":\"User and data version are included in cache identity\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Caching and cost optimization, which outcome demonstrates the intended result?",
      "options": [
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure",
        "User and data version are included in cache identity"
      ],
      "correct": 2
    }
  },
  {
    "day": 113,
    "kind": "linear",
    "nodes": [
      "Trace ID",
      "Model span",
      "Tool span",
      "Latency metric",
      "Incident view"
    ],
    "principle": "Link model steps, tools and external calls by trace IDs; choose latency and reliability budgets from user needs. Academic learning objective: Use trace correlation and actionable service objectives.",
    "caseStudy": "Illustrative classroom case: A tool latency spike slows half of agent requests. The verified target is: The correlated trace identifies the slow dependency. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: Only total request time is logged. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Build an example tracing dashboard from mock JSON logs. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Trace ID. Frame the example's incoming request and acceptance conditions. Scenario: A tool latency spike slows half of agent requests.",
      "Stage 2 — Model span. Translate inputs to the next typed representation. Scenario: A tool latency spike slows half of agent requests.",
      "Stage 3 — Tool span. Inspect constraints metadata and state at this boundary. Scenario: A tool latency spike slows half of agent requests.",
      "Stage 4 — Latency metric. Apply the bounded operation without skipping validation. Scenario: A tool latency spike slows half of agent requests.",
      "Stage 5 — Incident view. Compare the final artifact against the known expected result. Scenario: A tool latency spike slows half of agent requests."
    ],
    "failure": "Only total request time is logged",
    "packet": "{\"case\":\"A tool latency spike slows half of agent requests\",\"expected\":\"The correlated trace identifies the slow dependency\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Observability and SLOs, which outcome demonstrates the intended result?",
      "options": [
        "Continue even after a stated permission, source, or state validation failure",
        "The correlated trace identifies the slow dependency",
        "Ignore the evidence and report success without verification"
      ],
      "correct": 1
    }
  },
  {
    "day": 114,
    "kind": "graph",
    "nodes": [
      "Release artifact",
      "Secrets check",
      "Migration",
      "Health probe",
      "Rollback",
      "Readiness"
    ],
    "principle": "Promote only tested artifacts, verify migrations and monitor health after rollout. Academic learning objective: Apply secrets management, rollback and post-deploy checks.",
    "caseStudy": "Illustrative classroom case: A new Docker release changes its database schema. The verified target is: The release validates migration and readiness before traffic. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: A failing migration leaves live data inconsistent. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Containerize a small agent API and run acceptance tests. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Release artifact. Specify the initial state and dependency constraints. Scenario: A new Docker release changes its database schema.",
      "Stage 2 — Secrets check. Review the first independent component or branch. Scenario: A new Docker release changes its database schema.",
      "Stage 3 — Migration. Review the second component or alternate branch. Scenario: A new Docker release changes its database schema.",
      "Stage 4 — Health probe. Check required inputs before taking the next step. Scenario: A new Docker release changes its database schema.",
      "Stage 5 — Rollback. Resolve all validation errors and record state changes. Scenario: A new Docker release changes its database schema.",
      "Stage 6 — Readiness. Report the resulting artifact and reproducible evidence. Scenario: A new Docker release changes its database schema."
    ],
    "failure": "A failing migration leaves live data inconsistent",
    "packet": "{\"case\":\"A new Docker release changes its database schema\",\"expected\":\"The release validates migration and readiness before traffic\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Deployment and operational readiness, which outcome demonstrates the intended result?",
      "options": [
        "The release validates migration and readiness before traffic",
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure"
      ],
      "correct": 0
    }
  },
  {
    "day": 116,
    "kind": "graph",
    "nodes": [
      "System design",
      "Dataset hash",
      "Fixed split",
      "Version ledger",
      "Reproduce build",
      "Freeze"
    ],
    "principle": "Freeze architecture, permissions and task splits before optimization; preserve versions and hashes. Academic learning objective: Reproduce system structure and hold-out evaluation inputs.",
    "caseStudy": "Illustrative classroom case: A research project finalizes its architecture and evaluation inputs. The verified target is: Frozen hashes and versions prevent uncontrolled drift. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: The heldout set is edited to raise measured accuracy. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Create an architecture diagram and evaluation manifest. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — System design. Specify the initial state and dependency constraints. Scenario: A research project finalizes its architecture and evaluation inputs.",
      "Stage 2 — Dataset hash. Review the first independent component or branch. Scenario: A research project finalizes its architecture and evaluation inputs.",
      "Stage 3 — Fixed split. Review the second component or alternate branch. Scenario: A research project finalizes its architecture and evaluation inputs.",
      "Stage 4 — Version ledger. Check required inputs before taking the next step. Scenario: A research project finalizes its architecture and evaluation inputs.",
      "Stage 5 — Reproduce build. Resolve all validation errors and record state changes. Scenario: A research project finalizes its architecture and evaluation inputs.",
      "Stage 6 — Freeze. Report the resulting artifact and reproducible evidence. Scenario: A research project finalizes its architecture and evaluation inputs."
    ],
    "failure": "The heldout set is edited to raise measured accuracy",
    "packet": "{\"case\":\"A research project finalizes its architecture and evaluation inputs\",\"expected\":\"Frozen hashes and versions prevent uncontrolled drift\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Architecture and dataset freeze, which outcome demonstrates the intended result?",
      "options": [
        "Continue even after a stated permission, source, or state validation failure",
        "Frozen hashes and versions prevent uncontrolled drift",
        "Ignore the evidence and report success without verification"
      ],
      "correct": 1
    }
  },
  {
    "day": 117,
    "kind": "fanout",
    "nodes": [
      "Validated task",
      "Agent worker",
      "Tool gateway",
      "Trace recorder",
      "Verifier",
      "Integration"
    ],
    "principle": "Every side effect must pass policy checks and be observable; use deterministic mocks when API budget is unavailable. Academic learning objective: Integrate agent, tools, trace IDs and verification gates.",
    "caseStudy": "Illustrative classroom case: Build a bounded agent with separate tool execution logging and verification. The verified target is: Traceable authorized steps produce a checked artifact. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: The model directly performs writes outside the policy gateway. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Implement a full bounded system with monitoring. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Validated task. Establish the coordinator's task and permissions. Scenario: Build a bounded agent with separate tool execution logging and verification.",
      "Stage 2 — Agent worker. Split the goal into bounded typed subtasks. Scenario: Build a bounded agent with separate tool execution logging and verification.",
      "Stage 3 — Tool gateway. Inspect the first worker's independent contribution. Scenario: Build a bounded agent with separate tool execution logging and verification.",
      "Stage 4 — Trace recorder. Inspect the second worker's separate contribution. Scenario: Build a bounded agent with separate tool execution logging and verification.",
      "Stage 5 — Verifier. Inspect the third worker's contribution with evidence IDs. Scenario: Build a bounded agent with separate tool execution logging and verification.",
      "Stage 6 — Integration. Merge only valid results and identify any missing evidence. Scenario: Build a bounded agent with separate tool execution logging and verification."
    ],
    "failure": "The model directly performs writes outside the policy gateway",
    "packet": "{\"case\":\"Build a bounded agent with separate tool execution logging and verification\",\"expected\":\"Traceable authorized steps produce a checked artifact\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Implementation and instrumentation, which outcome demonstrates the intended result?",
      "options": [
        "Traceable authorized steps produce a checked artifact",
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure"
      ],
      "correct": 0
    }
  },
  {
    "day": 118,
    "kind": "graph",
    "nodes": [
      "Reference baseline",
      "Agent variant",
      "Repeated runs",
      "Same scoring",
      "Interval estimate",
      "Findings"
    ],
    "principle": "Use the same tasks, grading and budgets across variants; log latency, quality, failures and compute cost. Academic learning objective: Compare your design to credible and simpler baselines.",
    "caseStudy": "Illustrative classroom case: Compare an idempotent workflow against a naive retry baseline. The verified target is: The comparison reports repeats failures and uncertainty under matched tasks. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: A single unmatched demonstration is claimed statistically superior. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Run 30 held-out tasks across two architectures. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Reference baseline. Specify the initial state and dependency constraints. Scenario: Compare an idempotent workflow against a naive retry baseline.",
      "Stage 2 — Agent variant. Review the first independent component or branch. Scenario: Compare an idempotent workflow against a naive retry baseline.",
      "Stage 3 — Repeated runs. Review the second component or alternate branch. Scenario: Compare an idempotent workflow against a naive retry baseline.",
      "Stage 4 — Same scoring. Check required inputs before taking the next step. Scenario: Compare an idempotent workflow against a naive retry baseline.",
      "Stage 5 — Interval estimate. Resolve all validation errors and record state changes. Scenario: Compare an idempotent workflow against a naive retry baseline.",
      "Stage 6 — Findings. Report the resulting artifact and reproducible evidence. Scenario: Compare an idempotent workflow against a naive retry baseline."
    ],
    "failure": "A single unmatched demonstration is claimed statistically superior",
    "packet": "{\"case\":\"Compare an idempotent workflow against a naive retry baseline\",\"expected\":\"The comparison reports repeats failures and uncertainty under matched tasks\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Benchmarking and ablation study, which outcome demonstrates the intended result?",
      "options": [
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure",
        "The comparison reports repeats failures and uncertainty under matched tasks"
      ],
      "correct": 2
    }
  },
  {
    "day": 119,
    "kind": "linear",
    "nodes": [
      "Research question",
      "Architecture figure",
      "Methods",
      "Limitations",
      "Defense"
    ],
    "principle": "Present methodology, dataset, evaluation, error analysis and uncertainty with diagrams and live traces. Academic learning objective: Explain model choices, architectural trade-offs and evidence.",
    "caseStudy": "Illustrative classroom case: A student presents a reproducible agent evaluation to faculty. The verified target is: Diagrams and results support each methodological claim. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: Unsupported performance gains appear only on slides. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Deliver a slide deck with a system diagram and demo. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Research question. Frame the example's incoming request and acceptance conditions. Scenario: A student presents a reproducible agent evaluation to faculty.",
      "Stage 2 — Architecture figure. Translate inputs to the next typed representation. Scenario: A student presents a reproducible agent evaluation to faculty.",
      "Stage 3 — Methods. Inspect constraints metadata and state at this boundary. Scenario: A student presents a reproducible agent evaluation to faculty.",
      "Stage 4 — Limitations. Apply the bounded operation without skipping validation. Scenario: A student presents a reproducible agent evaluation to faculty.",
      "Stage 5 — Defense. Compare the final artifact against the known expected result. Scenario: A student presents a reproducible agent evaluation to faculty."
    ],
    "failure": "Unsupported performance gains appear only on slides",
    "packet": "{\"case\":\"A student presents a reproducible agent evaluation to faculty\",\"expected\":\"Diagrams and results support each methodological claim\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Presentation and methods defense, which outcome demonstrates the intended result?",
      "options": [
        "Continue even after a stated permission, source, or state validation failure",
        "Diagrams and results support each methodological claim",
        "Ignore the evidence and report success without verification"
      ],
      "correct": 1
    }
  },
  {
    "day": 120,
    "kind": "graph",
    "nodes": [
      "Source release",
      "Reproduction guide",
      "Security note",
      "Acceptance report",
      "Archive",
      "Publish"
    ],
    "principle": "Write a full report, security limitations, reproducibility guide, source documentation and next steps. Academic learning objective: Publish reproducible artifacts and bounded conclusions.",
    "caseStudy": "Illustrative classroom case: A final research repository is tagged with code and evaluation artifacts. The verified target is: Readers can reproduce claims and inspect known limitations. Follow the diagram to understand which component establishes this result rather than assuming a model response proves it.",
    "misconception": "Failure investigation: A release omits dependencies test evidence or security assumptions. Trace the control boundary that should detect this problem. Inspect the evidence and record a safe recovery or rejection instead of presenting the failure as a completed task.",
    "lab": "Publish tagged code, acceptance report and portfolio demonstration. Deliver runnable code or a reproducible mock, architecture explanation, unit tests and the negative-case result. Include a pull request to your verified learner branch. Implement a deterministic mock when external tools are unavailable; preserve one working trace and a negative-case assertion.",
    "steps": [
      "Stage 1 — Source release. Specify the initial state and dependency constraints. Scenario: A final research repository is tagged with code and evaluation artifacts.",
      "Stage 2 — Reproduction guide. Review the first independent component or branch. Scenario: A final research repository is tagged with code and evaluation artifacts.",
      "Stage 3 — Security note. Review the second component or alternate branch. Scenario: A final research repository is tagged with code and evaluation artifacts.",
      "Stage 4 — Acceptance report. Check required inputs before taking the next step. Scenario: A final research repository is tagged with code and evaluation artifacts.",
      "Stage 5 — Archive. Resolve all validation errors and record state changes. Scenario: A final research repository is tagged with code and evaluation artifacts.",
      "Stage 6 — Publish. Report the resulting artifact and reproducible evidence. Scenario: A final research repository is tagged with code and evaluation artifacts."
    ],
    "failure": "A release omits dependencies test evidence or security assumptions",
    "packet": "{\"case\":\"A final research repository is tagged with code and evaluation artifacts\",\"expected\":\"Readers can reproduce claims and inspect known limitations\",\"source\":\"illustrative test fixture\"}",
    "check": {
      "question": "In Final technical report and release, which outcome demonstrates the intended result?",
      "options": [
        "Readers can reproduce claims and inspect known limitations",
        "Ignore the evidence and report success without verification",
        "Continue even after a stated permission, source, or state validation failure"
      ],
      "correct": 0
    }
  }
]);
