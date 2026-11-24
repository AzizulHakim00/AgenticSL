/* Original module-level teaching figures. Each panel is a conceptual view, not measured results. */
window.AgenticFigureData=[
  {
    "module": 1,
    "days": [
      1,
      2
    ],
    "title": "HTTP request, authorization and response",
    "intro": "A request crosses the network boundary, while the server owns authentication, validation and business rules.",
    "columns": [
      {
        "name": "Client request",
        "tag": "Transport contract",
        "steps": [
          {
            "label": "Compose request",
            "detail": "Method, path, headers and optional body"
          },
          {
            "label": "Send HTTPS",
            "detail": "Protect data in transit"
          },
          {
            "label": "Read response",
            "detail": "Status, headers and body"
          },
          {
            "label": "Handle outcome",
            "detail": "Distinguish transport from business success"
          }
        ]
      },
      {
        "name": "Server processing",
        "tag": "Trusted application",
        "steps": [
          {
            "label": "Resolve route",
            "detail": "Match method and endpoint"
          },
          {
            "label": "Authenticate",
            "detail": "Establish the caller identity"
          },
          {
            "label": "Authorize and validate",
            "detail": "Check ownership, scope and input"
          },
          {
            "label": "Execute and respond",
            "detail": "Persist only permitted changes"
          }
        ]
      },
      {
        "name": "Failure handling",
        "tag": "Explicit outcomes",
        "steps": [
          {
            "label": "400 Bad request",
            "detail": "Input does not meet contract"
          },
          {
            "label": "401 Unauthorized",
            "detail": "Authentication is missing or invalid"
          },
          {
            "label": "403 Forbidden",
            "detail": "Caller lacks permission"
          },
          {
            "label": "5xx Server error",
            "detail": "Return safe error; retry only when appropriate"
          }
        ],
        "mode": "options"
      }
    ],
    "caption": "These columns show complementary responsibilities; the error codes are alternatives, not a sequence.",
    "sources": [
      "https://developer.mozilla.org/en-US/docs/Web/HTTP"
    ]
  },
  {
    "module": 2,
    "days": [
      3,
      5,
      6
    ],
    "title": "From prompt to reliable model output",
    "intro": "Separate model generation from the application checks that make its output usable.",
    "columns": [
      {
        "name": "Input preparation",
        "tag": "Context budget",
        "steps": [
          {
            "label": "Instructions",
            "detail": "Set task and constraints"
          },
          {
            "label": "Tokenization",
            "detail": "Encode input into tokens"
          },
          {
            "label": "Context assembly",
            "detail": "Fit evidence and history in budget"
          },
          {
            "label": "Model request",
            "detail": "Reserve output capacity"
          }
        ]
      },
      {
        "name": "Model generation",
        "tag": "Probabilistic output",
        "steps": [
          {
            "label": "Transformer",
            "detail": "Condition on supplied context"
          },
          {
            "label": "Next-token distribution",
            "detail": "Predict possible continuation"
          },
          {
            "label": "Decoding",
            "detail": "Select tokens using configured sampling"
          },
          {
            "label": "Generated output",
            "detail": "Text or structured response"
          }
        ]
      },
      {
        "name": "Application validation",
        "tag": "Independent controls",
        "steps": [
          {
            "label": "Parse result",
            "detail": "Check structure and schema"
          },
          {
            "label": "Check semantics",
            "detail": "Verify facts and allowed values"
          },
          {
            "label": "Budget and retry",
            "detail": "Handle transient failure within limits"
          },
          {
            "label": "Accept or reject",
            "detail": "Use only validated output"
          }
        ]
      }
    ],
    "caption": "Valid JSON and low temperature do not establish truth.",
    "sources": [
      "https://platform.openai.com/docs/overview"
    ]
  },
  {
    "module": 3,
    "days": [
      7,
      9,
      10,
      11
    ],
    "title": "Direct LLM, workflow and tool-using agent",
    "intro": "Compare increasingly dynamic control patterns without confusing tool proposals with authorization.",
    "columns": [
      {
        "name": "Direct LLM",
        "tag": "One model call",
        "steps": [
          {
            "label": "User task",
            "detail": "Provide instructions and context"
          },
          {
            "label": "LLM generation",
            "detail": "Produce a response"
          },
          {
            "label": "Check answer",
            "detail": "Validate support and format"
          },
          {
            "label": "Return result",
            "detail": "No autonomous tool loop"
          }
        ]
      },
      {
        "name": "Defined workflow",
        "tag": "Fixed control path",
        "steps": [
          {
            "label": "User task",
            "detail": "Start a predefined process"
          },
          {
            "label": "Step A",
            "detail": "Execute known operation"
          },
          {
            "label": "Step B",
            "detail": "Apply fixed validation or routing"
          },
          {
            "label": "Return result",
            "detail": "Finish according to code"
          }
        ]
      },
      {
        "name": "Tool-using agent",
        "tag": "Bounded feedback loop",
        "steps": [
          {
            "label": "User goal",
            "detail": "Define success and budget"
          },
          {
            "label": "Select action",
            "detail": "Model proposes a permitted tool"
          },
          {
            "label": "Tool execution",
            "detail": "Gateway checks arguments and scope"
          },
          {
            "label": "Observe and verify",
            "detail": "Repeat selection if needed; otherwise stop"
          }
        ]
      }
    ],
    "caption": "Agent feedback returns from observation to action selection only if budget and policy permit; fixed workflows may also include conditional logic.",
    "sources": [
      "https://platform.openai.com/docs/guides/function-calling"
    ]
  },
  {
    "module": 4,
    "days": [
      14,
      15,
      16
    ],
    "title": "Retrieval-augmented generation: indexing, retrieval, generation",
    "intro": "The indexing path prepares searchable evidence; the online path retrieves it before generation.",
    "columns": [
      {
        "name": "Offline indexing",
        "tag": "Prepare corpus",
        "steps": [
          {
            "label": "Documents",
            "detail": "Collect approved sources"
          },
          {
            "label": "Parse and chunk",
            "detail": "Preserve headings and source IDs"
          },
          {
            "label": "Embed chunks",
            "detail": "Use a compatible embedding model"
          },
          {
            "label": "Store index",
            "detail": "Vectors, text and metadata"
          }
        ]
      },
      {
        "name": "Online retrieval",
        "tag": "Find evidence",
        "steps": [
          {
            "label": "User query",
            "detail": "Represent information need"
          },
          {
            "label": "Embed query",
            "detail": "Use compatible vector space"
          },
          {
            "label": "Retrieve top candidates",
            "detail": "Search indexed chunks"
          },
          {
            "label": "Rank and filter",
            "detail": "Check relevance and metadata"
          }
        ]
      },
      {
        "name": "Grounded generation",
        "tag": "Use retrieved evidence",
        "steps": [
          {
            "label": "Context assembly",
            "detail": "Combine query and selected passages"
          },
          {
            "label": "LLM generation",
            "detail": "Produce a candidate answer"
          },
          {
            "label": "Support check",
            "detail": "Verify claims against cited spans"
          },
          {
            "label": "Cite or abstain",
            "detail": "Return evidence or missing information"
          }
        ]
      }
    ],
    "caption": "The online retrieval stage reads the prebuilt index. Similarity is not a truth score.",
    "sources": [
      "https://platform.openai.com/docs/guides/retrieval"
    ]
  },
  {
    "module": 5,
    "days": [
      18,
      22,
      24,
      25
    ],
    "title": "Agent SDK, state graph and durable review",
    "intro": "These are complementary implementation patterns, not mutually exclusive frameworks.",
    "columns": [
      {
        "name": "Agent SDK runner",
        "tag": "Tool-oriented control",
        "steps": [
          {
            "label": "Agent configuration",
            "detail": "Instructions and tool contracts"
          },
          {
            "label": "Runner",
            "detail": "Manage permitted agent iterations"
          },
          {
            "label": "Tool or handoff",
            "detail": "Validate scope before invoking"
          },
          {
            "label": "Trace and result",
            "detail": "Record observable events"
          }
        ]
      },
      {
        "name": "State graph",
        "tag": "Explicit transitions",
        "steps": [
          {
            "label": "Typed state",
            "detail": "Initialize request and evidence"
          },
          {
            "label": "Graph node",
            "detail": "Update state using defined logic"
          },
          {
            "label": "Conditional edge",
            "detail": "Choose next node from trusted state"
          },
          {
            "label": "End or loop",
            "detail": "Stop or continue by explicit rule"
          }
        ]
      },
      {
        "name": "Checkpoint and review",
        "tag": "Recoverable execution",
        "steps": [
          {
            "label": "Persist state",
            "detail": "Store thread and pending work"
          },
          {
            "label": "Interrupt",
            "detail": "Pause before sensitive effect"
          },
          {
            "label": "Human decision",
            "detail": "Approve or reject scoped action"
          },
          {
            "label": "Resume safely",
            "detail": "Check effect identity and idempotency"
          }
        ]
      }
    ],
    "caption": "A persisted checkpoint does not guarantee exactly-once external effects.",
    "sources": [
      "https://langchain-ai.github.io/langgraph/concepts/persistence/"
    ]
  },
  {
    "module": 6,
    "days": [
      26,
      27,
      29
    ],
    "title": "Single agent, parallel specialists and supervisor",
    "intro": "Compare how responsibility is distributed, not how intelligent the system appears.",
    "columns": [
      {
        "name": "Single agent",
        "tag": "Direct control",
        "steps": [
          {
            "label": "User goal",
            "detail": "One bounded task"
          },
          {
            "label": "Agent controller",
            "detail": "Choose permitted actions"
          },
          {
            "label": "Tools and observations",
            "detail": "Repeat if needed"
          },
          {
            "label": "Verify result",
            "detail": "Check evidence before returning"
          }
        ]
      },
      {
        "name": "Parallel specialists",
        "tag": "Independent subtasks",
        "steps": [
          {
            "label": "User goal",
            "detail": "Decompose independent work"
          },
          {
            "label": "Coordinator",
            "detail": "Assign typed tasks"
          },
          {
            "label": "Parallel workers",
            "detail": "Research / analysis / review run independently"
          },
          {
            "label": "Merge and verify",
            "detail": "Reconcile conflicts; report missing workers"
          }
        ]
      },
      {
        "name": "Supervisor pattern",
        "tag": "Adaptive delegation",
        "steps": [
          {
            "label": "User goal",
            "detail": "Specify constraints"
          },
          {
            "label": "Supervisor",
            "detail": "Select worker and task"
          },
          {
            "label": "Worker result",
            "detail": "Return evidence to supervisor"
          },
          {
            "label": "Review or delegate again",
            "detail": "Approve only checked outputs"
          }
        ]
      }
    ],
    "caption": "A supervisor is one form of multi-agent architecture; more workers do not guarantee higher quality.",
    "sources": [
      "https://openai.github.io/openai-agents-python/"
    ]
  },
  {
    "module": 7,
    "days": [
      40,
      42,
      44,
      45
    ],
    "title": "Production readiness: measure, protect and operate",
    "intro": "Reliable agents require quality evidence, independent security enforcement and recovery plans.",
    "columns": [
      {
        "name": "Evaluation",
        "tag": "Measure behavior",
        "steps": [
          {
            "label": "Frozen tasks",
            "detail": "Define reference outcomes"
          },
          {
            "label": "Agent runs",
            "detail": "Use matched configurations"
          },
          {
            "label": "Score traces",
            "detail": "Correctness, safety, cost and latency"
          },
          {
            "label": "Regression gate",
            "detail": "Compare with baseline"
          }
        ]
      },
      {
        "name": "Security",
        "tag": "Enforce boundaries",
        "steps": [
          {
            "label": "Untrusted content",
            "detail": "Treat retrieved text as data"
          },
          {
            "label": "Policy gateway",
            "detail": "Check tool, arguments and scope"
          },
          {
            "label": "Permit or deny",
            "detail": "Allowed or denied; approval when required"
          },
          {
            "label": "Audit",
            "detail": "Record sanitized effects"
          }
        ]
      },
      {
        "name": "Operations",
        "tag": "Sustain service",
        "steps": [
          {
            "label": "Build and deploy",
            "detail": "Package tested code"
          },
          {
            "label": "Readiness",
            "detail": "Check required dependencies"
          },
          {
            "label": "Monitor",
            "detail": "Observe errors and resource use"
          },
          {
            "label": "Recover",
            "detail": "Retry safely or roll back"
          }
        ]
      }
    ],
    "caption": "A passing build or a correct final answer alone does not demonstrate production readiness.",
    "sources": [
      "https://platform.openai.com/docs/guides/agent-evals"
    ]
  },
  {
    "module": 8,
    "days": [
      47,
      49,
      57,
      60
    ],
    "title": "Capstone product lifecycle",
    "intro": "A useful product connects user requirements, implementation and independently observed outcomes.",
    "columns": [
      {
        "name": "Define",
        "tag": "Understand the problem",
        "steps": [
          {
            "label": "User need",
            "detail": "Identify real workflow pain"
          },
          {
            "label": "Requirements",
            "detail": "Specify scope and constraints"
          },
          {
            "label": "Acceptance criteria",
            "detail": "Make success measurable"
          },
          {
            "label": "Architecture",
            "detail": "Map data and trust boundaries"
          }
        ]
      },
      {
        "name": "Build",
        "tag": "Implement incrementally",
        "steps": [
          {
            "label": "Backend",
            "detail": "Typed APIs and persistent records"
          },
          {
            "label": "Agent workflow",
            "detail": "Bounded actions and evidence"
          },
          {
            "label": "Frontend",
            "detail": "Accessible user interaction"
          },
          {
            "label": "Integration",
            "detail": "Test end-to-end and failure cases"
          }
        ]
      },
      {
        "name": "Validate and release",
        "tag": "Demonstrate evidence",
        "steps": [
          {
            "label": "Evaluate",
            "detail": "Compare against acceptance criteria"
          },
          {
            "label": "Deploy",
            "detail": "Verify health and recovery"
          },
          {
            "label": "User feedback",
            "detail": "Record issues and retest"
          },
          {
            "label": "Portfolio",
            "detail": "Publish code, methods and limitations"
          }
        ]
      }
    ],
    "caption": "The capstone is a software deliverable; scientific novelty requires separate research evidence.",
    "sources": [
      "https://docs.github.com/en/actions"
    ]
  },
  {
    "module": 9,
    "days": [
      61,
      62,
      63,
      65,
      66
    ],
    "title": "ReAct, plan-and-execute and Reflexion",
    "intro": "Three illustrative reasoning architectures differ in when they plan and how they use feedback.",
    "columns": [
      {
        "name": "ReAct",
        "tag": "Interleave decisions and actions",
        "steps": [
          {
            "label": "Task",
            "detail": "Specify the user goal"
          },
          {
            "label": "Decide next action",
            "detail": "Use current evidence"
          },
          {
            "label": "Act and observe",
            "detail": "Call permitted tool; receive result"
          },
          {
            "label": "Stop or repeat",
            "detail": "Return to decision if needed"
          }
        ]
      },
      {
        "name": "Plan and execute",
        "tag": "Decompose before acting",
        "steps": [
          {
            "label": "Task",
            "detail": "Identify deliverables"
          },
          {
            "label": "Planner",
            "detail": "Define steps and dependencies"
          },
          {
            "label": "Executor",
            "detail": "Run ready tasks; update state"
          },
          {
            "label": "Verify or replan",
            "detail": "Revise plan when assumptions fail"
          }
        ]
      },
      {
        "name": "Reflexion",
        "tag": "Learn from trial feedback",
        "steps": [
          {
            "label": "Attempt task",
            "detail": "Run actor on a trial"
          },
          {
            "label": "Evaluate attempt",
            "detail": "Collect task feedback"
          },
          {
            "label": "Reflect",
            "detail": "Write feedback into episodic memory"
          },
          {
            "label": "Next trial",
            "detail": "Use memory; evaluate again"
          }
        ]
      }
    ],
    "caption": "Reflexion is a particular verbal-feedback method, not merely a single self-review prompt. These examples are simplified.",
    "sources": [
      "https://arxiv.org/abs/2210.03629",
      "https://arxiv.org/abs/2303.11366"
    ]
  },
  {
    "module": 10,
    "days": [
      69,
      70,
      72,
      73,
      75
    ],
    "title": "RAG vs Agentic RAG vs GraphRAG",
    "intro": "Compare a fixed retrieval pipeline, adaptive retrieval, and Microsoft's graph-based retrieval approach.",
    "columns": [
      {
        "name": "RAG",
        "tag": "Fixed retrieval pipeline",
        "steps": [
          {
            "label": "Index preparation",
            "detail": "Chunk documents and embed text"
          },
          {
            "label": "User query",
            "detail": "Encode query for retrieval"
          },
          {
            "label": "Retrieve passages",
            "detail": "Vector or lexical search"
          },
          {
            "label": "Augment and generate",
            "detail": "LLM uses selected passages"
          },
          {
            "label": "Verify answer",
            "detail": "Cite support or abstain"
          }
        ]
      },
      {
        "name": "Agentic RAG",
        "tag": "Adaptive retrieval",
        "steps": [
          {
            "label": "Index preparation",
            "detail": "Connect approved corpora and tools"
          },
          {
            "label": "User query",
            "detail": "Plan or rewrite information need"
          },
          {
            "label": "Retrieve with tools",
            "detail": "Search authorized sources"
          },
          {
            "label": "Evaluate evidence",
            "detail": "If insufficient, replan within budget"
          },
          {
            "label": "Synthesize and verify",
            "detail": "Answer with citations or abstain"
          }
        ]
      },
      {
        "name": "GraphRAG",
        "tag": "Graph-aware retrieval",
        "steps": [
          {
            "label": "Offline indexing",
            "detail": "Extract entities, relationships and community reports"
          },
          {
            "label": "User query",
            "detail": "Select local or global (other strategies also exist)"
          },
          {
            "label": "Local OR global search",
            "detail": "Local: entities, relationships and text. Global: community reports with map-reduce. Choose the suitable query strategy."
          },
          {
            "label": "Synthesize and verify",
            "detail": "Use selected evidence; state limitations"
          }
        ]
      }
    ],
    "caption": "Local and global search are alternative strategies, not mandatory sequential stages. Graph construction and community report generation take place during indexing, not after the final answer.",
    "sources": [
      "https://microsoft.github.io/graphrag/",
      "https://microsoft.github.io/graphrag/index/overview/",
      "https://microsoft.github.io/graphrag/query/local_search/",
      "https://microsoft.github.io/graphrag/query/global_search/"
    ]
  },
  {
    "module": 11,
    "days": [
      77,
      78,
      79,
      80,
      83
    ],
    "title": "Multimodal perception and controlled computer use",
    "intro": "An observation is uncertain evidence, while acting on the environment needs separate authorization.",
    "columns": [
      {
        "name": "Visual input",
        "tag": "Perception",
        "steps": [
          {
            "label": "Image or document",
            "detail": "Supply source and region"
          },
          {
            "label": "Vision / OCR",
            "detail": "Extract observations and text"
          },
          {
            "label": "Evidence record",
            "detail": "Preserve location and uncertainty"
          },
          {
            "label": "Answer or clarify",
            "detail": "Flag unreadable fields"
          }
        ]
      },
      {
        "name": "Voice input",
        "tag": "Speech interaction",
        "steps": [
          {
            "label": "Audio",
            "detail": "Capture user utterance"
          },
          {
            "label": "Speech recognition",
            "detail": "Produce transcript with uncertainty"
          },
          {
            "label": "Interpret intent",
            "detail": "Resolve ambiguous commands"
          },
          {
            "label": "Respond or confirm",
            "detail": "Require consent for risky effects"
          }
        ]
      },
      {
        "name": "Computer use",
        "tag": "Action loop",
        "steps": [
          {
            "label": "Screen or DOM",
            "detail": "Observe current interface"
          },
          {
            "label": "Propose action",
            "detail": "Choose target and operation"
          },
          {
            "label": "Policy gate",
            "detail": "Validate target, permission and risk"
          },
          {
            "label": "Observe again",
            "detail": "Confirm effect or stop safely"
          }
        ]
      }
    ],
    "caption": "Perception confidence is not permission. An unreadable region must not be treated as a known value.",
    "sources": [
      "https://developers.openai.com/api/docs/guides/agents/sdk"
    ]
  },
  {
    "module": 12,
    "days": [
      85,
      86,
      87,
      88,
      90,
      91
    ],
    "title": "MCP host-client-server and A2A delegation",
    "intro": "The protocols serve different interaction boundaries and can be combined.",
    "columns": [
      {
        "name": "MCP host and client",
        "tag": "Context and tool access",
        "steps": [
          {
            "label": "Host application",
            "detail": "Owns user context and consent"
          },
          {
            "label": "Client inside host",
            "detail": "Connects to an MCP server"
          },
          {
            "label": "Capability exchange",
            "detail": "Discover supported tools, resources and prompts"
          },
          {
            "label": "Request and result",
            "detail": "Invoke or read allowed capability; handle response"
          }
        ]
      },
      {
        "name": "MCP server",
        "tag": "Exposes capabilities",
        "steps": [
          {
            "label": "Server connection",
            "detail": "Negotiate supported protocol capabilities"
          },
          {
            "label": "Tools / resources / prompts",
            "detail": "Distinct capability types, not sequential steps"
          },
          {
            "label": "Server authorization",
            "detail": "Enforce resource and operation access"
          },
          {
            "label": "Structured result",
            "detail": "Return requested data or typed error"
          }
        ],
        "mode": "options"
      },
      {
        "name": "A2A delegation",
        "tag": "Remote agent tasks",
        "steps": [
          {
            "label": "Agent discovery",
            "detail": "Read capability metadata; verify identity separately"
          },
          {
            "label": "Submit task or message",
            "detail": "Use authorized remote endpoint"
          },
          {
            "label": "Task lifecycle",
            "detail": "Receive updates, artifacts or terminal status"
          },
          {
            "label": "Verify artifact",
            "detail": "Check outcome before completing local task"
          }
        ]
      }
    ],
    "caption": "Host contains the client. The MCP client and server exchange messages; MCP capabilities are alternatives. A2A task delegation is a different interaction pattern.",
    "sources": [
      "https://modelcontextprotocol.io/docs/getting-started/intro",
      "https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2025-03-26/architecture/index.mdx",
      "https://a2a-protocol.org/latest/topics/key-concepts/"
    ]
  },
  {
    "module": 13,
    "days": [
      93,
      94,
      95,
      96,
      99
    ],
    "title": "Prompt injection and authorization defense",
    "intro": "Treat external content as data and enforce permissions outside the model.",
    "columns": [
      {
        "name": "Untrusted input",
        "tag": "Threat surface",
        "steps": [
          {
            "label": "User request",
            "detail": "Establish intended task"
          },
          {
            "label": "Retrieved content",
            "detail": "Documents, webpages and tool outputs"
          },
          {
            "label": "Model proposal",
            "detail": "Possible action derived from context"
          },
          {
            "label": "Trust boundary",
            "detail": "Never elevate source instructions"
          }
        ]
      },
      {
        "name": "Trusted policy gateway",
        "tag": "Independent enforcement",
        "steps": [
          {
            "label": "Identity",
            "detail": "Derive caller from authenticated session"
          },
          {
            "label": "Tool and schema",
            "detail": "Check allowlist and typed arguments"
          },
          {
            "label": "Scope and destination",
            "detail": "Validate ownership and egress"
          },
          {
            "label": "Risk and approval",
            "detail": "Require explicit consent where needed"
          }
        ]
      },
      {
        "name": "Decision outcomes",
        "tag": "Mutually exclusive routes",
        "steps": [
          {
            "label": "Allowed",
            "detail": "Execute only authorized bounded action"
          },
          {
            "label": "Denied",
            "detail": "Block invalid or unauthorized action"
          },
          {
            "label": "Audit both paths",
            "detail": "Record sanitized outcome and effect ID"
          },
          {
            "label": "Recover",
            "detail": "Review incidents; revoke access if needed"
          }
        ],
        "mode": "options"
      }
    ],
    "caption": "Allowed and denied are alternatives. Policy controls reduce risk but cannot guarantee detection of every injection.",
    "sources": [
      "https://genai.owasp.org/llmrisk/llm01-prompt-injection/"
    ]
  },
  {
    "module": 14,
    "days": [
      101,
      102,
      103,
      104,
      107
    ],
    "title": "Evaluation pipeline: benchmark, execution and analysis",
    "intro": "A credible experiment fixes its task distribution and scoring before comparing systems.",
    "columns": [
      {
        "name": "Benchmark design",
        "tag": "Before running",
        "steps": [
          {
            "label": "Research question",
            "detail": "Define measurable hypothesis"
          },
          {
            "label": "Task set",
            "detail": "Include normal, edge and failure cases"
          },
          {
            "label": "Reference rubric",
            "detail": "Specify correctness and safety criteria"
          },
          {
            "label": "Freeze split",
            "detail": "Separate tuning from held-out evaluation"
          }
        ]
      },
      {
        "name": "Execute and record",
        "tag": "Matched conditions",
        "steps": [
          {
            "label": "Baseline and variant",
            "detail": "Same task set and stated settings"
          },
          {
            "label": "Agent runs",
            "detail": "Record attempts including timeouts"
          },
          {
            "label": "Trajectory logs",
            "detail": "Capture observable tool calls and outcomes"
          },
          {
            "label": "Independent grading",
            "detail": "Calibrate judges against human labels"
          }
        ]
      },
      {
        "name": "Report and diagnose",
        "tag": "After running",
        "steps": [
          {
            "label": "Success rate",
            "detail": "Successful tasks / attempted tasks"
          },
          {
            "label": "Efficiency and safety",
            "detail": "Latency, cost, forbidden effects"
          },
          {
            "label": "Error analysis",
            "detail": "Classify failures and missing evidence"
          },
          {
            "label": "Ablation and limits",
            "detail": "Report uncertainty and scope"
          }
        ]
      }
    ],
    "caption": "Report denominators and failures; no benchmark result is implied by this conceptual diagram.",
    "sources": [
      "https://platform.openai.com/docs/guides/agent-evals"
    ]
  },
  {
    "module": 15,
    "days": [
      109,
      110,
      111,
      113,
      114
    ],
    "title": "Durable job orchestration and recovery",
    "intro": "Separate accepting a job from performing it, and protect external effects from duplicate delivery.",
    "columns": [
      {
        "name": "Intake",
        "tag": "Request lifecycle",
        "steps": [
          {
            "label": "Client API",
            "detail": "Validate identity and input"
          },
          {
            "label": "Durable job record",
            "detail": "Assign job and idempotency identifiers"
          },
          {
            "label": "Queue",
            "detail": "Enqueue pending work"
          },
          {
            "label": "Return job ID",
            "detail": "Expose status and cancellation"
          }
        ]
      },
      {
        "name": "Worker",
        "tag": "Bounded execution",
        "steps": [
          {
            "label": "Claim job",
            "detail": "Use lease and scoped credentials"
          },
          {
            "label": "Load checkpoint",
            "detail": "Read persisted state"
          },
          {
            "label": "Execute permitted step",
            "detail": "Check effect key before external write"
          },
          {
            "label": "Persist outcome",
            "detail": "Store result and status"
          }
        ]
      },
      {
        "name": "Recovery and observation",
        "tag": "Failure handling",
        "steps": [
          {
            "label": "Timeout or restart",
            "detail": "Detect interrupted attempt"
          },
          {
            "label": "Recover state",
            "detail": "Read checkpoint and effect ledger"
          },
          {
            "label": "Retry or cancel",
            "detail": "Respect budget and cancellation"
          },
          {
            "label": "Monitor and return",
            "detail": "Expose verified state and sanitized traces"
          }
        ]
      }
    ],
    "caption": "At-least-once delivery may replay work; checkpoints alone cannot make effects exactly once.",
    "sources": [
      "https://langchain-ai.github.io/langgraph/concepts/persistence/"
    ]
  },
  {
    "module": 16,
    "days": [
      115,
      116,
      118,
      119,
      120
    ],
    "title": "Research capstone: hypothesis to reproducible release",
    "intro": "Keep the software artifact and the empirical research claim independently verifiable.",
    "columns": [
      {
        "name": "Research design",
        "tag": "Before experimentation",
        "steps": [
          {
            "label": "Observed failure",
            "detail": "Identify specific phenomenon"
          },
          {
            "label": "Prior work",
            "detail": "Check related methods and gaps"
          },
          {
            "label": "Hypothesis and baseline",
            "detail": "Define falsifiable comparison"
          },
          {
            "label": "Freeze protocol",
            "detail": "Version data, splits and scoring"
          }
        ]
      },
      {
        "name": "Implementation and tests",
        "tag": "Controlled experiment",
        "steps": [
          {
            "label": "Implement variant",
            "detail": "Document intervention"
          },
          {
            "label": "Instrument runs",
            "detail": "Capture settings, effects and trace IDs"
          },
          {
            "label": "Matched evaluation",
            "detail": "Use same held-out cases"
          },
          {
            "label": "Ablation",
            "detail": "Change one component at a time"
          }
        ]
      },
      {
        "name": "Report and release",
        "tag": "Evidence and limits",
        "steps": [
          {
            "label": "Analyze results",
            "detail": "Include failed runs and uncertainty"
          },
          {
            "label": "Threats to validity",
            "detail": "State dataset and environment limits"
          },
          {
            "label": "Methods defense",
            "detail": "Support claims with traceable artifacts"
          },
          {
            "label": "Release",
            "detail": "Archive code, fixtures and reproduction guide"
          }
        ]
      }
    ],
    "caption": "Novelty and performance gains must be supported by actual literature review and observed results, not architecture diagrams.",
    "sources": [
      "https://docs.github.com/en/actions"
    ]
  }
];
