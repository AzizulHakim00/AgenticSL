window.AgenticVisualData=[
  {
    "day": 1,
    "kind": "linear",
    "nodes": [
      "Browser",
      "HTTP request",
      "Route",
      "Validate",
      "Respond"
    ],
    "principle": "HTTP carries a method, URL, headers and sometimes a body. Routes resolve the request, while trusted application logic validates both its shape and the caller's permissions. A successful transport response is not proof of a correct business outcome.",
    "caseStudy": "A student sends POST /tasks with a title. The server authenticates the session, validates the task, stores it and returns 201 with an identifier. Repeat with a missing title to compare 400 and the associated validation error.",
    "misconception": "Do not confuse JSON with HTTP or let the model choose the authenticated user's ID. A 200 response from a downstream service is not sufficient proof of correctness.",
    "lab": "Build a local task API with GET and POST. Record the status, sanitized request and returned body for success and invalid input.",
    "steps": [
      "The browser prepares a task request with a typed JSON body.",
      "The HTTP layer carries method, headers, route and body.",
      "A route dispatches the request without trusting its contents.",
      "Validation checks types, required fields and authenticated ownership.",
      "The server returns the result or a structured error; verify it."
    ],
    "failure": "An invalid request must stop at validation with 400; no database write should occur.",
    "packet": "POST /tasks → 201 {id:42} | invalid → 400",
    "check": {
      "question": "What should happen when an API receives a valid JSON body containing an unauthorized owner ID?",
      "options": [
        "Allow it because the JSON is valid",
        "Derive or authorize the owner from the trusted principal",
        "Silently overwrite the whole database"
      ],
      "correct": 1
    }
  },
  {
    "day": 3,
    "kind": "linear",
    "nodes": [
      "Input",
      "Tokenizer",
      "Context",
      "Inference",
      "Output"
    ],
    "principle": "Tokenization maps text into subword or symbol tokens. The model produces a conditional distribution over subsequent tokens; sampling changes outputs but does not provide measured certainty. The context window is bounded and is not durable memory.",
    "caseStudy": "Ask a model to summarize a technical document and count the tokens allotted to instructions, source text and answer. Remove a critical paragraph and compare whether the model still makes a supported claim.",
    "misconception": "Low temperature does not guarantee correctness, and putting long text in a prompt does not guarantee faithful recall of every detail.",
    "lab": "Construct a mock token-budget calculator and compare two prompt configurations. Explain what must be trimmed when the context limit is reached.",
    "steps": [
      "Text is supplied with instructions and evidence.",
      "A tokenizer converts symbols into token IDs.",
      "The application allocates a finite context budget.",
      "The model predicts output tokens conditioned on context.",
      "A validator checks the format and supporting evidence."
    ],
    "failure": "Over-budget inputs must be rejected or trimmed explicitly; the model must not fabricate omitted evidence.",
    "packet": "input 980 + context 1200 + output 400 = 2580 tokens",
    "check": {
      "question": "Which statement about sampling temperature is correct?",
      "options": [
        "It changes the sampling distribution but cannot verify truth",
        "It guarantees the answer is factual",
        "It stores memories across sessions"
      ],
      "correct": 0
    }
  },
  {
    "day": 5,
    "kind": "guard",
    "nodes": [
      "Task",
      "Model JSON",
      "Parse schema",
      "Accepted",
      "Rejected"
    ],
    "principle": "Structured outputs constrain representation, not truth. The application must parse a model response, validate required fields and allowed values, then check semantics against an authoritative source before using it for a side effect.",
    "caseStudy": "An extraction prompt requests a research-paper title, year and citation span. The response contains valid JSON but an invented publication date. Schema validation passes; independent source verification must still fail.",
    "misconception": "A syntactically valid result can still be false or unsafe; do not send parsed fields straight to a write-capable tool.",
    "lab": "Define a JSON schema, test malformed JSON and a plausible but unsupported value, and log two separate validation outcomes.",
    "steps": [
      "The application specifies a typed extraction task.",
      "The model proposes a JSON record.",
      "The parser checks schema and semantic constraints.",
      "Supported fields are accepted for further handling.",
      "Invalid or unsupported records are rejected with reasons."
    ],
    "failure": "Unsupported metadata must enter the rejected path even when the output parses successfully.",
    "packet": "{\"year\":2027,\"validSchema\":true,\"verifiedSource\":false}",
    "check": {
      "question": "Can schema validation alone establish factual correctness?",
      "options": [
        "Yes when keys are correct",
        "No; the meaning and evidence require separate checks",
        "Yes if the output is low-temperature"
      ],
      "correct": 1
    }
  },
  {
    "day": 7,
    "kind": "cycle",
    "nodes": [
      "User goal",
      "Decide",
      "Tool",
      "Observe",
      "Stop / retry"
    ],
    "principle": "An agent is an application that selects bounded actions based on observations. The model can propose a tool, but programmatic policy controls authentication, arguments, budget and effects. The loop must reach a verified result or stop safely.",
    "caseStudy": "A learner asks for upcoming deadlines. The agent calls a read-only task tool; the response is checked against task IDs before the assistant summarizes it. A timeout produces an explicit unavailable result rather than a guessed deadline.",
    "misconception": "Tool calls are not automatically trustworthy. Endless thinking loops and repeated calls do not demonstrate intelligence or progress.",
    "lab": "Implement an agent controller with a maximum of four steps and a read-only task tool. Simulate timeout and invalid arguments.",
    "steps": [
      "The user's goal establishes the target and constraints.",
      "A controller decides whether a permitted tool is needed.",
      "The validated tool performs one authorized operation.",
      "The observation updates state and is checked for support.",
      "The controller either stops or retries within its budget."
    ],
    "failure": "If the tool times out or the run budget is exhausted, stop with a transparent failure state.",
    "packet": "{\"tool\":\"list_deadlines\",\"status\":\"ok\",\"count\":3}",
    "check": {
      "question": "What must enforce an agent's maximum tool-call budget?",
      "options": [
        "Trusted application code",
        "The model's own promise",
        "Text from a retrieved webpage"
      ],
      "correct": 0
    }
  },
  {
    "day": 10,
    "kind": "cycle",
    "nodes": [
      "Question",
      "Reason / decide",
      "Tool call",
      "Observation",
      "Answer / stop"
    ],
    "principle": "ReAct interleaves decisions with external observations. The agent should select a tool only when it helps resolve uncertainty; observations must be verified before answering. Each additional iteration consumes budget and creates another failure opportunity.",
    "caseStudy": "Given an unfamiliar error code, the agent queries documentation, examines the returned passage and identifies the supported cause. A fake tool result containing an instruction to reveal credentials should be treated as data.",
    "misconception": "An observation is not a new system prompt. Repeating the same query without new evidence is usually a loop failure.",
    "lab": "Create a deterministic ReAct simulation with one successful lookup, one repeated call and one malicious tool response.",
    "steps": [
      "The user asks a question requiring outside evidence.",
      "The controller selects a read-only retrieval action.",
      "The tool returns a passage or a structured failure.",
      "The agent evaluates the evidence and remaining uncertainty.",
      "A grounded response is issued or the loop stops."
    ],
    "failure": "An instruction embedded in a retrieved passage must not be executed; the agent can still quote or summarize the source safely.",
    "packet": "{\"tool\":\"lookup_error\",\"result\":\"DOC-17\",\"verified\":true}",
    "check": {
      "question": "What gives retrieved text authority to call new tools?",
      "options": [
        "Its formatting",
        "Being returned by a search tool",
        "Nothing: trusted policy still controls tools"
      ],
      "correct": 2
    }
  },
  {
    "day": 14,
    "kind": "retrieval",
    "nodes": [
      "Query",
      "Encode",
      "Vector search",
      "Metadata",
      "Rank / cite",
      "Answer"
    ],
    "principle": "Embedding similarity can retrieve related meaning, but a nearby vector is not automatically relevant evidence. Scores are dataset- and model-dependent. Preserve source IDs and inspect both relevant and irrelevant neighbors before writing an answer.",
    "caseStudy": "Search a set of short research abstracts for 'agent memory expiry'. Compare a lexical match with a semantically related passage about stale state. Determine whether either actually describes a retention policy.",
    "misconception": "High cosine similarity is not factual entailment. A retrieved neighbor can be topically similar while contradicting the question.",
    "lab": "Build a tiny offline embedding-rank mock. Show top three candidates with IDs and explicitly mark the unsupported one.",
    "steps": [
      "A query represents the learner's information need.",
      "The same embedding model maps it into a vector space.",
      "A nearest-neighbor index finds candidate records.",
      "Metadata preserves document identity and source position.",
      "Candidates are reranked and checked against the claim.",
      "Only supported text is used in the response."
    ],
    "failure": "If the top result lacks evidence, abstain or retrieve again rather than making up an answer.",
    "packet": "{\"query\":\"memory expiry\",\"topK\":[12,7,19]}",
    "check": {
      "question": "Does a high vector-similarity score prove that a passage answers a question?",
      "options": [
        "Yes by definition",
        "No; relevance and support need evaluation",
        "Yes if k=1"
      ],
      "correct": 1
    }
  },
  {
    "day": 15,
    "kind": "retrieval",
    "nodes": [
      "Documents",
      "Chunk",
      "Index",
      "Retrieve",
      "Reconstruct",
      "Cite"
    ],
    "principle": "Chunk boundaries determine which facts a retriever can see together. Tiny chunks may lose context while very large chunks dilute ranking. Overlap can preserve boundary information but creates duplication and additional storage cost.",
    "caseStudy": "A paragraph gives the setup in one sentence and the exception in the next. If chunking separates them, retrieval may omit the exception and produce a misleading answer. Try multiple chunk sizes with fixed queries.",
    "misconception": "A larger chunk is not always better, and overlap cannot replace source metadata or quality checks.",
    "lab": "Simulate fixed-size and heading-aware splitting on one document. Compare which chunk recovers an important qualifier.",
    "steps": [
      "The document is parsed with headings and source locations.",
      "A chunker divides text while retaining source metadata.",
      "Chunks are indexed using lexical or semantic signals.",
      "A question retrieves candidate chunks.",
      "The app reconstructs enough neighboring context to check meaning.",
      "The answer cites the specific supporting span."
    ],
    "failure": "When a retrieved chunk omits a critical negation, request neighboring context instead of concluding.",
    "packet": "{\"chunkSize\":180,\"overlap\":30,\"source\":\"paper-2\"}",
    "check": {
      "question": "What is the most direct danger of chopping a document into very small isolated chunks?",
      "options": [
        "Loss of local context and qualifiers",
        "Guaranteed faster and correct answers",
        "A token budget of zero"
      ],
      "correct": 0
    }
  },
  {
    "day": 22,
    "kind": "graph",
    "nodes": [
      "Start",
      "Fetch",
      "Plan",
      "Validate",
      "Execute",
      "End"
    ],
    "principle": "LangGraph models execution as nodes and edges over explicit state. A node can read and update state; edges determine the next action. State schema, retries and permission checks remain application responsibilities.",
    "caseStudy": "Build a document-review workflow with fetch, summarize and verify nodes. If fetching fails, return a recoverable error rather than continuing with an imaginary document. Inspect how state changes between nodes.",
    "misconception": "A graph is not automatically superior to a function. Its value comes from useful branching, checkpoints and clearer control flow.",
    "lab": "Draw a state graph, define typed state and test a node failure. Explain what extra complexity the framework introduced.",
    "steps": [
      "A typed state is initialized for one task.",
      "A fetch node obtains approved evidence.",
      "A planning branch selects the required processing path.",
      "A validation node rejects missing or invalid state.",
      "A bounded executor performs work after passing checks.",
      "A final node returns an auditable result."
    ],
    "failure": "A failed fetch should take a controlled error route, not implicitly reuse unrelated prior state.",
    "packet": "{\"thread\":\"demo-001\",\"node\":\"validate\",\"status\":\"ok\"}",
    "check": {
      "question": "Which component determines a LangGraph workflow's next node?",
      "options": [
        "Only the last model token",
        "Defined graph edges and routing logic",
        "The CSS layout"
      ],
      "correct": 1
    }
  },
  {
    "day": 23,
    "kind": "branch",
    "nodes": [
      "State",
      "Condition",
      "Supported",
      "Missing",
      "Final"
    ],
    "principle": "Conditional routing chooses different paths based on trusted state. The decision should be deterministic when the condition is machine-checkable. The missing-data path is an essential part of the workflow, not an exception to hide.",
    "caseStudy": "If a claim has supporting passages, send it to answer synthesis; otherwise send it to an abstention or retrieval-retry path. Test a passage that looks related but does not actually support the claim.",
    "misconception": "Do not let an LLM choose a branch by asserting that its own output is valid. The routing predicate must be independently evaluated.",
    "lab": "Implement supported vs unsupported branches, record the predicate's inputs and test both paths with fixed evidence.",
    "steps": [
      "The graph receives the current request and evidence state.",
      "A guarded condition evaluates whether support is sufficient.",
      "The supported branch proceeds with a cited claim.",
      "The missing-evidence branch requests more data or abstains.",
      "Both paths end with an explicit, verifiable outcome."
    ],
    "failure": "When evidence is missing, route to abstention or review rather than synthesis.",
    "packet": "{\"hasEvidence\":false,\"route\":\"abstain\"}",
    "check": {
      "question": "What should a conditional graph do if required evidence is absent?",
      "options": [
        "Continue silently",
        "Produce a plausible guess",
        "Route to a documented missing-evidence path"
      ],
      "correct": 2
    }
  },
  {
    "day": 24,
    "kind": "guard",
    "nodes": [
      "State",
      "Checkpoint",
      "Approval gate",
      "Resume",
      "Stop"
    ],
    "principle": "Checkpointing persists workflow state so processing can resume after failure or human review. A side effect must be protected by an idempotency key; resume should not repeat a successful external operation merely because a node is re-executed.",
    "caseStudy": "Pause an upload workflow before writing a file. After approval, execute the upload once and store the effect ID. Restart the worker and verify that the upload is not duplicated.",
    "misconception": "Persisting state is not the same as exactly-once effects. A checkpoint can be restored but still replay unsafe external calls.",
    "lab": "Implement a small checkpoint table and approval flag. Restart a simulated worker twice and count committed writes.",
    "steps": [
      "The workflow creates a state snapshot.",
      "A checkpoint stores completed work and pending actions.",
      "The approval gate verifies explicit human consent.",
      "A resumed run checks idempotency keys before effects.",
      "Unauthorized or duplicate work stops safely."
    ],
    "failure": "Do not run the write action without approval or twice after a restart.",
    "packet": "{\"checkpoint\":\"cp-7\",\"approved\":true,\"writeCount\":1}",
    "check": {
      "question": "Why should a resumed write be idempotent?",
      "options": [
        "It makes outputs prettier",
        "It prevents duplicate effects after retries",
        "It eliminates authorization checks"
      ],
      "correct": 1
    }
  },
  {
    "day": 27,
    "kind": "fanout",
    "nodes": [
      "User question",
      "Coordinator",
      "Researcher",
      "Analyst",
      "Reviewer",
      "Synthesis"
    ],
    "principle": "A coordinator decomposes a task into bounded specialist responsibilities. Workers receive only the tools and information they need. Independent review can uncover errors, but agreement between agents is not proof that the source is correct.",
    "caseStudy": "Researcher gathers candidate references, analyst verifies quantitative claims and reviewer checks citation spans. Coordinator synthesizes only after validating outputs against the original evidence.",
    "misconception": "Giving three agents the same broad prompt is duplication, not specialization. More agents may increase cost without improving task success.",
    "lab": "Prototype a three-worker coordinator with mock responses and deliberately contradictory findings. Resolve them using source evidence.",
    "steps": [
      "A user asks for a research-backed comparison.",
      "The coordinator divides the work into typed tasks.",
      "The researcher retrieves verifiable source passages.",
      "The analyst validates calculations and units.",
      "The reviewer checks citation support and missing assumptions.",
      "The coordinator merges only independently checked results."
    ],
    "failure": "If one specialist submits an unsupported claim, do not include it in final synthesis.",
    "packet": "{\"workers\":3,\"verified\":2,\"rejected\":1}",
    "check": {
      "question": "How should a coordinator resolve conflicting agent claims?",
      "options": [
        "Trust the longest response",
        "Consult the original evidence and verification rubric",
        "Vote by agent names"
      ],
      "correct": 1
    }
  },
  {
    "day": 29,
    "kind": "fanout",
    "nodes": [
      "Batch",
      "Scheduler",
      "Agent A",
      "Agent B",
      "Agent C",
      "Merge"
    ],
    "principle": "Parallel workers can reduce wall time for independent tasks. Their outputs still need schemas, deadlines and a deterministic merge policy. Shared mutable state can cause races even when each worker is correct in isolation.",
    "caseStudy": "Three independent document classifiers run concurrently; one times out. The merge process should report two verified classifications and an explicit missing result without inventing the third.",
    "misconception": "Parallel work does not imply independent tool permissions or safe simultaneous writes to the same record.",
    "lab": "Simulate three workers with varied completion times and one timeout. Measure duration and completeness with a single-worker baseline.",
    "steps": [
      "The scheduler accepts a bounded set of independent tasks.",
      "Work is allocated with timeouts and ownership rules.",
      "Worker A processes the first independent item.",
      "Worker B processes the second item.",
      "Worker C processes the third item.",
      "A deterministic merge validates all completed artifacts."
    ],
    "failure": "If a worker times out, mark its contribution missing and do not substitute a guessed result.",
    "packet": "{\"workers\":3,\"completed\":2,\"timedOut\":1}",
    "check": {
      "question": "When one of three parallel agents times out, what is a correct merge behavior?",
      "options": [
        "Invent its likely result",
        "Wait forever",
        "Report partial results with the missing task identified"
      ],
      "correct": 2
    }
  },
  {
    "day": 31,
    "kind": "linear",
    "nodes": [
      "Host",
      "MCP client",
      "MCP server",
      "Tool",
      "Result"
    ],
    "principle": "An MCP host controls user context and which connected servers are available. Its client communicates with a server that advertises tool, resource and prompt capabilities. The host remains responsible for consent and how responses influence model behavior.",
    "caseStudy": "A learning assistant discovers a read-only curriculum lookup tool. The host checks whether the learner authorized the server, requests the tool with typed input and checks the returned lesson ID before displaying it.",
    "misconception": "An MCP server is not automatically trusted because its description appears in a tool list. It cannot grant itself additional user permissions.",
    "lab": "Design a read-only curriculum MCP tool contract. Include argument validation, capability discovery and a rejected unauthorized request.",
    "steps": [
      "The host receives the learner's information request.",
      "The MCP client negotiates allowed capabilities.",
      "The server advertises supported read-only functions.",
      "An authorized tool invocation returns structured data.",
      "The host validates and presents the result to the learner."
    ],
    "failure": "Unknown capabilities or missing authorization must stop tool execution.",
    "packet": "{\"method\":\"tools/list\",\"tool\":\"get_curriculum\",\"access\":\"read\"}",
    "check": {
      "question": "Who ultimately controls which MCP server capabilities an application uses?",
      "options": [
        "The trusted host and its authorization rules",
        "The server description alone",
        "An arbitrary webpage"
      ],
      "correct": 0
    }
  },
  {
    "day": 35,
    "kind": "guard",
    "nodes": [
      "User",
      "Consent",
      "Scope check",
      "Allowed",
      "Denied"
    ],
    "principle": "OAuth lets a user delegate a scoped capability without revealing their password. Authorization must validate identity, audience, state, expiry and applicable scopes. A successful authentication alone does not permit an unrelated write action.",
    "caseStudy": "A learner authorizes read-only progress access. A plugin tries to modify quiz results with the same token. The server rejects the write because it exceeds the authorized scope.",
    "misconception": "Signing in and granting write permission are different decisions. Access tokens should never be stored in lesson notes or exposed to the model.",
    "lab": "Model OAuth consent and test read-only, expired and wrong-scope tokens. Use fake credentials, never production secrets.",
    "steps": [
      "A user initiates a specific connection.",
      "The consent screen describes permissions and purpose.",
      "The service validates the token's audience and scopes.",
      "An in-scope read operation is permitted.",
      "An out-of-scope or expired request is rejected."
    ],
    "failure": "Read-only scopes cannot authorize grade changes or branch merges.",
    "packet": "{\"scope\":\"progress:read\",\"requested\":\"progress:write\",\"allowed\":false}",
    "check": {
      "question": "What can a progress:read token authorize?",
      "options": [
        "Reading approved progress data",
        "Changing assessment grades",
        "Merging a learner's PR"
      ],
      "correct": 0
    }
  },
  {
    "day": 42,
    "kind": "guard",
    "nodes": [
      "Retrieved page",
      "Trust boundary",
      "Policy check",
      "Summarize",
      "Block"
    ],
    "principle": "Prompt injection uses untrusted content to impersonate higher-priority instructions. Retrieved documents, websites and tool outputs should be treated as evidence, not as commands. The application's policy and tool permissions must enforce the boundary independently.",
    "caseStudy": "A retrieved research abstract includes a fake instruction to send local files elsewhere. The assistant may identify that instruction as suspicious, but its file/network tools must refuse the request regardless of generated text.",
    "misconception": "Merely asking a model to ignore bad instructions is weaker than removing unauthorized tool access.",
    "lab": "Create a harmless prompt-injection test fixture and a deny-by-default tool policy. Demonstrate blocked actions and safe summarization.",
    "steps": [
      "An external page is retrieved as untrusted data.",
      "The system marks source content below policy authority.",
      "A programmatic gate checks proposed tool effects.",
      "The agent may summarize the source's factual content.",
      "Any unauthorized action request is blocked and logged."
    ],
    "failure": "Do not elevate instructions found inside a webpage or retrieved paragraph to system authority.",
    "packet": "{\"source\":\"untrusted_web\",\"request\":\"send_file\",\"result\":\"DENIED\"}",
    "check": {
      "question": "What is the strongest defense against unauthorized tools triggered by retrieved text?",
      "options": [
        "Clearer styling on the malicious page",
        "More confident prompting alone",
        "A separate programmatic permission gate"
      ],
      "correct": 2
    }
  },
  {
    "day": 44,
    "kind": "cycle",
    "nodes": [
      "Job intake",
      "State record",
      "Worker",
      "Commit",
      "Verify / retry"
    ],
    "principle": "A durable job records its identity, status and idempotency key before work begins. At-least-once delivery can rerun tasks; the application must detect duplicate committed effects. Checkpoints and recovery are more reliable when state and side effects have explicit owners.",
    "caseStudy": "An upload worker receives the same job twice after a network timeout. It checks the idempotency key, returns the existing effect ID and avoids uploading a second copy.",
    "misconception": "Retrying is not automatically harmless. A duplicate request can create duplicate payments, messages or files.",
    "lab": "Build an in-memory idempotency store and simulate two identical job deliveries. Assert one committed effect.",
    "steps": [
      "An API accepts a job with a unique idempotency key.",
      "The pending job and owner are persisted.",
      "A worker claims the job within a bounded lease.",
      "The effect is committed once and its identifier is recorded.",
      "A retried job reuses the committed record or safely resumes."
    ],
    "failure": "When the same job is delivered twice, do not perform the irreversible write twice.",
    "packet": "{\"key\":\"job-42\",\"deliveries\":2,\"writes\":1}",
    "check": {
      "question": "Why does a durable worker require an idempotency key?",
      "options": [
        "To guarantee prettier logs",
        "To prevent duplicate side effects under retry",
        "To eliminate the need for access control"
      ],
      "correct": 1
    }
  },
  {
    "day": 49,
    "kind": "graph",
    "nodes": [
      "User problem",
      "Evidence",
      "Scenario A",
      "Scenario B",
      "Verify",
      "Explain"
    ],
    "principle": "A decision-support capstone needs explicit user preferences, sourced evidence, deterministic calculations and uncertainty. Agentic steps can gather evidence, but numerical scenario outcomes should come from documented formulas and not model-invented probabilities.",
    "caseStudy": "A student compares two master's programs using tuition, deadlines and preferences. The tool fetches published values, then a deterministic weighted model computes sensitivity across different assumptions.",
    "misconception": "A high-looking model confidence does not make a forecast reliable. Separating provenance and assumptions is essential.",
    "lab": "Create a schema for alternatives, weights, evidence URLs and calculation versions. Test missing tuition and changed preferences.",
    "steps": [
      "The user specifies a decision and required constraints.",
      "The research step gathers source-attributed input values.",
      "Scenario A is computed from documented assumptions.",
      "Scenario B uses the same scoring model and measured units.",
      "A verifier checks every value and sensitivity range.",
      "A report separates factual input from hypothetical outcome."
    ],
    "failure": "Do not invent scholarship odds or missing admission deadlines.",
    "packet": "{\"alternatives\":2,\"scoring\":\"versioned\",\"assumptions\":3}",
    "check": {
      "question": "Where should numeric scenario scores originate?",
      "options": [
        "A versioned deterministic calculation over sourced inputs",
        "An unsupported LLM prediction",
        "A random number chosen by the interface"
      ],
      "correct": 0
    }
  },
  {
    "day": 61,
    "kind": "graph",
    "nodes": [
      "Goal",
      "Dependency A",
      "Dependency B",
      "Checks",
      "Executor",
      "Done"
    ],
    "principle": "Planning graphs encode prerequisites so independent steps can run safely while dependent steps wait. A topological order is valid only for an acyclic graph. State transitions should record the task owner, evidence and completion condition.",
    "caseStudy": "A research agent must retrieve two documents before writing a comparison. If one retrieval fails, the comparison node remains blocked. A task with a circular dependency must be rejected during validation.",
    "misconception": "An agent-generated plan does not become executable merely because its steps sound plausible.",
    "lab": "Build a dependency graph validator. Detect cycles and execute only nodes whose prerequisites have succeeded.",
    "steps": [
      "The goal is translated into typed deliverables.",
      "The first prerequisite is retrieved and checked.",
      "The second prerequisite is completed independently.",
      "A gate verifies all required dependencies are satisfied.",
      "An executor performs the downstream task after prerequisites.",
      "The final artifact is checked against success criteria."
    ],
    "failure": "A missing prerequisite or dependency cycle must prevent downstream execution.",
    "packet": "{\"ready\":[\"compare\"],\"blocked\":[],\"acyclic\":true}",
    "check": {
      "question": "When can a dependent task safely enter the ready queue?",
      "options": [
        "As soon as its title is written",
        "After all required predecessor tasks are verified",
        "When any one predecessor is pending"
      ],
      "correct": 1
    }
  },
  {
    "day": 69,
    "kind": "retrieval",
    "nodes": [
      "Question",
      "Lexical rank",
      "Vector rank",
      "Fusion",
      "Rerank",
      "Cite"
    ],
    "principle": "Hybrid retrieval combines exact-term matching with semantic similarity. Reciprocal rank fusion merges ordered candidates but does not prove that a result supports the answer. A reranker should preserve candidate provenance and avoid dropping important qualifiers.",
    "caseStudy": "A technical question contains an exact error code plus a paraphrase of its symptom. BM25 finds the exact string, embeddings find conceptual neighbors, and fusion combines them. Source passages are checked for actual support.",
    "misconception": "A single similarity score should not be interpreted as factual confidence. A high-ranked item still needs citation validation.",
    "lab": "Construct a fixed five-document corpus and compare lexical-only, vector-only and fused rankings on the same held-out questions.",
    "steps": [
      "A question contains both precise terms and broader intent.",
      "Lexical retrieval ranks exact names and rare tokens.",
      "Vector retrieval finds paraphrases and related concepts.",
      "A rank-fusion stage merges candidates and removes duplicates.",
      "A reranker checks query-specific relevance and qualifiers.",
      "The answer cites only verified supporting spans."
    ],
    "failure": "An attractive but unsupported reranked item must not be cited as a source for a claim.",
    "packet": "{\"bm25\":[3,1],\"vector\":[2,3],\"fusion\":[3,2,1]}",
    "check": {
      "question": "What must happen after fusion picks a high-ranked document?",
      "options": [
        "Treat rank as a final truth score",
        "Verify that the cited passage supports the claim",
        "Discard source IDs"
      ],
      "correct": 1
    }
  },
  {
    "day": 77,
    "kind": "branch",
    "nodes": [
      "Image/audio",
      "Perception",
      "Supported",
      "Uncertain",
      "Response"
    ],
    "principle": "Multimodal agents combine text with visual, audio or document observations. Perception results are uncertain and should carry modality, timestamp and source references. Downstream actions must distinguish an observed fact from an inferred interpretation.",
    "caseStudy": "A classroom image contains a blurry timetable. OCR identifies several entries but one date is unreadable. The assistant provides supported entries and flags the unreadable date rather than guessing.",
    "misconception": "Visual confidence does not grant authority to perform an action, and an unseen region is not evidence of absence.",
    "lab": "Create a mock multimodal observation record with confidence and source regions. Test one unreadable observation.",
    "steps": [
      "A multimodal question arrives with a named input modality.",
      "A perception tool emits structured observations and source positions.",
      "A supported observation can be used in the answer.",
      "An ambiguous region is marked unknown and sent for review.",
      "The response distinguishes what was observed from inferred context."
    ],
    "failure": "Missing OCR text or low-confidence regions must remain unknown rather than fabricated.",
    "packet": "{\"modality\":\"image\",\"field\":\"date\",\"confidence\":0.41,\"status\":\"uncertain\"}",
    "check": {
      "question": "How should a multimodal agent describe an unreadable text region?",
      "options": [
        "Invent the most likely number",
        "Declare uncertainty and request better evidence",
        "Assume the region is empty"
      ],
      "correct": 1
    }
  },
  {
    "day": 85,
    "kind": "linear",
    "nodes": [
      "Host",
      "MCP client",
      "Discovery",
      "MCP server",
      "Tool result"
    ],
    "principle": "The MCP host owns the user-facing session and authorization choices, while a client maintains a connection to a specific server. Tool/resource/prompt capabilities are discovered and invoked through standardized contracts. The server remains a lower-trust boundary.",
    "caseStudy": "A university learning host connects to a curriculum MCP server. It discovers a read-only lesson lookup, calls it with a lesson ID and validates the returned resource before showing it.",
    "misconception": "Remote servers do not become trusted system components just by advertising a capability or providing persuasive descriptions.",
    "lab": "Sketch the host/client/server lifecycle and simulate an unrecognized tool response under a deny-by-default policy.",
    "steps": [
      "The host authorizes an external capability for the learner.",
      "The MCP client initializes its connection and scope.",
      "Discovery returns available capabilities and their contracts.",
      "The chosen server validates a bounded read-only request.",
      "The host checks the result before using it in a response."
    ],
    "failure": "An unknown tool or scope mismatch must fail before execution.",
    "packet": "{\"method\":\"tools/list\",\"capability\":\"curriculum.read\"}",
    "check": {
      "question": "What responsibility remains with the MCP host?",
      "options": [
        "User consent and policy enforcement",
        "Unlimited server write access",
        "Treating every tool result as a system command"
      ],
      "correct": 0
    }
  },
  {
    "day": 93,
    "kind": "guard",
    "nodes": [
      "Source text",
      "Boundary",
      "Policy",
      "Safe answer",
      "Denied tool"
    ],
    "principle": "A prompt-injection attack attempts to cross the data/instruction trust boundary. Security controls should constrain what tools can read, write and transmit, independently of how the model interprets source text. The evaluation must include an attempted unauthorized effect.",
    "caseStudy": "A retrieved PDF says it contains a higher-priority instruction to reveal stored passwords. The assistant should treat the phrase as untrusted document content, refuse the credential request and continue only authorized reading.",
    "misconception": "A self-reported successful defense is not evidence; inspect the tool log to ensure no forbidden action occurred.",
    "lab": "Write safe mock injection fixtures. Measure whether any prohibited tool call was actually attempted or executed.",
    "steps": [
      "The agent encounters untrusted document content.",
      "The trust boundary marks it as non-authoritative data.",
      "A policy module validates proposed actions and destinations.",
      "A safe explanation may summarize the document topic.",
      "A credential or exfiltration attempt is blocked and audited."
    ],
    "failure": "If a tool request attempts credential disclosure, deny it and record the attempted action.",
    "packet": "{\"attack\":\"instruction_spoof\",\"tool\":\"secrets.read\",\"effect\":\"blocked\"}",
    "check": {
      "question": "Which signal proves an injection defense actually held?",
      "options": [
        "The model says it was safe",
        "The forbidden tool effect was prevented and audited",
        "The final answer looks professional"
      ],
      "correct": 1
    }
  },
  {
    "day": 101,
    "kind": "graph",
    "nodes": [
      "Hypothesis",
      "Gold labels",
      "Normal tasks",
      "Edge cases",
      "Metrics",
      "Audit"
    ],
    "principle": "An evaluation dataset needs a defined task distribution, stable reference labels and acceptance criteria set before model outputs are observed. Include normal, adversarial, edge and failure cases. Track exclusions and denominators.",
    "caseStudy": "Compare a simple retrieval baseline against a tool-using agent on a frozen set of 30 questions. Grade answer support, wrong tool calls, timeouts and latency using the same rubric.",
    "misconception": "A demo that selects only the most impressive outputs cannot establish reliable task success.",
    "lab": "Build a 30-task fixture with an annotation guide, version IDs and held-out records. Publish the denominator for every metric.",
    "steps": [
      "A falsifiable hypothesis defines the comparison.",
      "Gold labels and expected behavior are frozen before tests.",
      "Ordinary tasks represent the main use case.",
      "Edge and adversarial tasks expose failure modes.",
      "Metrics are computed with the same scoring rules.",
      "An audit inspects errors, exclusions and uncertainty."
    ],
    "failure": "Never remove failed or timed-out runs from the denominator without reporting the exclusion.",
    "packet": "{\"cases\":30,\"attempted\":30,\"passed\":22,\"successRate\":0.733}",
    "check": {
      "question": "What belongs in the denominator of a reported success rate?",
      "options": [
        "Only successful trials",
        "All defined attempted tasks including timeouts",
        "Only demonstrations shown in the report"
      ],
      "correct": 1
    }
  },
  {
    "day": 109,
    "kind": "cycle",
    "nodes": [
      "Job API",
      "Queue",
      "Worker",
      "Checkpoint",
      "Return / retry"
    ],
    "principle": "Event-driven orchestration separates accepting a request from processing a long-running task. Queues may redeliver jobs; durable state and idempotency prevent duplicate side effects. The API should expose status, cancellation and verified results.",
    "caseStudy": "A course grader receives a job, writes a pending record and acknowledges its ID. The worker processes the task, records an audit trace and handles one simulated timeout without marking unfinished work complete.",
    "misconception": "At-least-once delivery is not exactly-once execution, and a lost HTTP connection does not mean the job was never accepted.",
    "lab": "Implement a small queued-job state machine with accepted, running, completed, failed and cancelled transitions.",
    "steps": [
      "The API accepts a bounded request and returns a job ID.",
      "A queue stores the pending task durably.",
      "A worker claims the task with a lease.",
      "A checkpoint records verified progress and side-effect IDs.",
      "The controller returns a result or schedules a safe retry."
    ],
    "failure": "If a worker restarts, resume the saved state without duplicating committed side effects.",
    "packet": "{\"job\":\"run-82\",\"state\":\"completed\",\"attempts\":2,\"writes\":1}",
    "check": {
      "question": "Why should the API return a job ID for a long-running agent?",
      "options": [
        "To support status checks and cancellation",
        "To guarantee that work always succeeds",
        "To remove the need for durable storage"
      ],
      "correct": 0
    }
  },
  {
    "day": 115,
    "kind": "graph",
    "nodes": [
      "Research gap",
      "Baseline",
      "System design",
      "Held-out tests",
      "Ablations",
      "Report"
    ],
    "principle": "A research capstone starts with a demonstrable failure and a falsifiable hypothesis. An architecture only merits a novelty claim after checking closely related prior work. Evaluation needs credible baselines, frozen tasks, versioned settings and limitations.",
    "caseStudy": "A student studies duplicate tool actions under retries. The baseline replays a write; a revised design uses idempotency and approval. Both run on the same fixed cases, and the report includes failures and resource cost.",
    "misconception": "An elegant architecture diagram or a high result from one task is not evidence of scientific novelty or generalization.",
    "lab": "Draft a methods section and reproduce a benchmark of 20 fixed tasks, including one ablation of the new control.",
    "steps": [
      "Define the concrete failure and prior-work gap.",
      "Construct the simplest credible baseline.",
      "Specify the intervention and its trust boundaries.",
      "Freeze the test cases and scoring rubric.",
      "Change one component to isolate its effect.",
      "Report observed results, negative cases and limitations."
    ],
    "failure": "A claim of superiority must be limited to the measured task distribution and baselines.",
    "packet": "{\"baseline\":0.55,\"treatment\":0.75,\"cases\":20,\"limitation\":\"small\"}",
    "check": {
      "question": "What makes a research claim reproducible?",
      "options": [
        "A polished interface",
        "A model's self-reported confidence",
        "Versioned code, frozen tests, methods and traceable outputs"
      ],
      "correct": 2
    }
  }
];
