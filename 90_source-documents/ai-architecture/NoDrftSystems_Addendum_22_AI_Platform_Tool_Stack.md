<!--
Converted from: NoDrftSystems_Addendum_22_AI_Platform_Tool_Stack.docx
Conversion date: 2026-04-18
Classification: Internal — Confidential
Status: Source archive — see document-registry.md for operative status
-->

ADDENDUM 22
AI Platform Subscription Tool Stack
Free Tiers & Practical Paid Tiers for Multi-Product Development

# EXECUTIVE SUMMARY
This document defines the strategic AI platform tool stack for NoDrftSystems, organized by function with free tier capabilities and practical paid tier upgrades. The stack enables simultaneous multi-product development through shared infrastructure and specialized domain agents.

# 1. LARGE LANGUAGE MODELS (CORE INTELLIGENCE)
## 1.1 Claude (Anthropic) - PRIMARY

### What Can Be Built:
Complex code generation and refactoring (React, Node, Python)
Technical documentation and API specs
Agent system prompts and orchestration logic
Content strategy and long-form writing
Requirements analysis and specification documents
Security audit and vulnerability analysis

### Relevance: CRITICAL - Primary LLM for all agent systems

## 1.2 ChatGPT (OpenAI) - BACKUP/SECONDARY

### What Can Be Built:
Code generation (alternative to Claude)
Image generation with DALL-E 3
Data analysis and visualization
Custom GPTs for specific workflows
Embedding models for search/RAG

### Relevance: HIGH - Backup LLM, image generation, embeddings

## 1.3 DeepSeek - COST-EFFICIENT ALTERNATIVE

### What Can Be Built:
Code generation at 1/10th the cost of GPT-4
High-volume text processing
Non-critical agent operations
Batch processing jobs

### Relevance: MEDIUM - Cost optimization for high-volume operations

## 1.4 Grok (xAI) - REAL-TIME/RESEARCH

### What Can Be Built:
Real-time news and trend monitoring
X/Twitter social listening and analysis
Competitive intelligence
Breaking event response content

### Relevance: LOW-MEDIUM - Niche use for real-time data

# 2. CODE DEVELOPMENT & IDES
## 2.1 Visual Studio Code + Extensions - PRIMARY IDE

### What Can Be Built:
Full-stack web applications (React, Node, Python)
Mobile applications (React Native, Flutter)
APIs and backend services
Database schemas and migrations
DevOps scripts and configurations
All software products simultaneously

### Relevance: CRITICAL - Primary development environment

## 2.2 Replit - RAPID PROTOTYPING

### What Can Be Built:
Quick prototypes and MVPs
Live demos for client presentations
Educational content and tutorials
Small web applications
API testing and experimentation

### Relevance: MEDIUM - Rapid prototyping, demos, learning

# 3. VIDEO & MEDIA GENERATION
## 3.1 Sora (OpenAI) - AI VIDEO

### What Can Be Built:
Product demo videos
Marketing and explainer videos
Social media content
Training and onboarding videos
Concept visualization for clients

### Relevance: MEDIUM - Video content, demos, marketing

## 3.2 Invideo - AI VIDEO PLATFORM

### What Can Be Built:
YouTube videos and shorts
Social media ads and content
Product explainer videos
Client presentation videos
Training content
Marketing campaigns

### Relevance: MEDIUM-HIGH - Practical video production at scale

## 3.3 ImageFX (Google) - AI IMAGES

### What Can Be Built:
Website and app imagery
Marketing and social media graphics
Concept art and mockups
Blog post featured images
Client presentation visuals
Product mockups

### Relevance: HIGH - Free, unlimited, high quality images

# 4. RESEARCH & KNOWLEDGE MANAGEMENT
## 4.1 Perplexity - AI SEARCH

### What Can Be Built:
Competitive intelligence reports
Market research and analysis
Technical documentation research
Client industry deep-dives
Trend analysis and forecasting
Due diligence research

### Relevance: HIGH - Research engine for all domains

## 4.2 NotebookLM (Google) - DOCUMENT INTELLIGENCE

### What Can Be Built:
Client document analysis and summaries
Research synthesis and insights
Audio podcasts from documents
Knowledge bases and wikis
Competitive analysis reports
Training material creation

### Relevance: HIGH - Free, powerful document analysis

# 5. SPECIALIZED AGENTS & AUTOMATION
## 5.1 Manus - GENERAL AI AGENT

### What Can Be Built:
End-to-end task automation
Research and report generation
Data processing workflows
Content creation pipelines
Multi-step business processes

### Relevance: MEDIUM - Emerging, evaluate for fit

## 5.2 Kimi (Moonshot AI) - LONG-CONTEXT

### What Can Be Built:
Analysis of entire codebases (2M tokens)
Long document summarization
Multi-file project understanding
Book-length content analysis
Complex report generation

### Relevance: MEDIUM-HIGH - Long context for code analysis

# 6. PRODUCTIVITY & OFFICE SUITE
## 6.1 Microsoft 365 / Google Workspace

### What Can Be Built:
Business documents and proposals
Financial models and spreadsheets
Client presentations
Project plans and timelines
Team collaboration workspaces
All business documentation

### Relevance: CRITICAL - Business operations foundation

# 7. RECOMMENDED NODRFTSYSTEMS STACK
## 7.1 Starter Stack (Month 1-2)
Starter Stack Total: ~$260/mo (core tools)

## 7.2 Growth Stack (Month 3-6)
Growth Stack Total: ~$562/mo + API usage (~$200-400)

## 7.3 Free Tier Stack (Bootstrap Mode)
For maximum cost efficiency:
Claude Free - Limited daily messages
DeepSeek Free - Rate-limited but capable
ImageFX Free - Unlimited image generation
NotebookLM Free - Unlimited notebooks
VS Code Free - Full IDE functionality
Replit Free - Public projects
GitHub Free - Public repos, limited actions
Vercel Free - Hobby tier
Supabase Free - 500MB database
Figma Free - 3 projects
Perplexity Free - Basic searches

# 8. MULTI-PRODUCT DEVELOPMENT STRATEGY
## 8.1 Shared Infrastructure Model

## 8.2 Product Development Matrix

## 8.3 Tool-to-Product Mapping

# 9. KEY RECOMMENDATIONS
Start with Free Tiers: Validate workflows before committing to paid subscriptions
Upgrade Strategically: Move to paid tiers only when free limits block productivity
API-First Architecture: Build with programmatic access in mind for automation
Multi-Provider Strategy: Never depend on a single AI provider; maintain backups
Cost Monitoring: Track API usage monthly; set billing alerts
Shared Infrastructure: All products leverage same agent stack for efficiency
| Tier | Monthly Cost | Capabilities |
| Free Stack | $0 | Core development, basic AI assistance, limited API calls |
| Starter Stack | $200-400 | Enhanced AI, professional tools, moderate API usage |
| Growth Stack | $600-1,000 | Full agent orchestration, premium features, high volume |
| Enterprise Stack | $1,500+ | Unlimited usage, priority support, custom integrations |

| Tier | Cost | Capabilities | Use Cases |
| Free | $0 | Limited messages/day, Claude 3.5 Sonnet | Individual tasks, testing, learning |
| Pro | $20/mo | 5x more usage, priority access, early features | Daily development, agent prototyping |
| Team | $25/user/mo | Shared workspaces, higher limits | Collaborative agent development |
| API | Pay-per-use | Programmatic access, custom integration | Production agent systems, automation |

| Tier | Cost | Capabilities | Use Cases |
| Free | $0 | GPT-4o mini, limited messages | Quick queries, testing |
| Plus | $20/mo | GPT-4o, GPT-4, browsing, DALL-E | Daily use, image generation |
| Team | $25/user/mo | Higher limits, shared GPTs | Team collaboration |
| API | Pay-per-token | Full model access, fine-tuning | Production systems, embeddings |

| Tier | Cost | Capabilities | Use Cases |
| Free | $0 | DeepSeek-V3, rate limited | Testing, non-critical tasks |
| API | $0.50-2/M tokens | Very low cost vs GPT-4/Claude | High-volume, cost-sensitive operations |
| Pro | $10/mo | Higher rate limits, priority | Daily development on budget |

| Tier | Cost | Capabilities | Use Cases |
| Free | $0 | Limited queries, Grok-2 | Testing, X integration |
| Premium+ | $16/mo | Unlimited Grok-2, X Premium | Real-time research, social monitoring |
| API | Coming soon | Programmatic access | Production integration |

| Tier | Cost | Capabilities | Use Cases |
| Free | $0 | Full IDE, extensions marketplace | All development work |
| GitHub Copilot | $10/mo | AI code completion, chat | Accelerated coding |
| Copilot Pro | $19/mo | Advanced models, more requests | Complex development |
| Copilot Business | $19/user/mo | Team management, IP indemnity | Team development |

| Tier | Cost | Capabilities | Use Cases |
| Free | $0 | Public repls, limited resources | Learning, public demos |
| Core | $7/mo | Private repls, always-on, 2GB | Small projects, prototypes |
| Teams | $15/user/mo | Collaboration, 4GB, analytics | Team development |
| Enterprise | Custom | SSO, audit logs, dedicated | Large teams |

| Tier | Cost | Capabilities | Use Cases |
| ChatGPT Plus | $20/mo | Limited generations, watermark | Testing, internal content |
| Pro | $200/mo | Higher limits, priority, no watermark | Client deliverables |
| API | Coming soon | Programmatic access | Production integration |

| Tier | Cost | Capabilities | Use Cases |
| Free | $0 | Watermark, 10 min exports, limited AI | Testing, learning |
| Plus | $20/mo | No watermark, 50 min AI, 1080p | Regular content creation |
| Max | $48/mo | 200 min AI, 4K, brand kits | Agency/client work |
| Unlimited | $96/mo | Unlimited AI, team features | High-volume production |

| Tier | Cost | Capabilities | Use Cases |
| Free | $0 | Unlimited generations, Imagen 3 | All image needs |
| Labs | $0 | Experimental features | Testing new capabilities |
| API | Pay-per-use | Programmatic access | Production integration |

| Tier | Cost | Capabilities | Use Cases |
| Free | $0 | Basic search, limited pro searches | General research |
| Pro | $20/mo | 300+ pro searches, GPT-4, Claude | Deep research |
| Enterprise | Custom | Team features, API, SSO | Organization-wide |
| API | Pay-per-query | Programmatic access | Production systems |

| Tier | Cost | Capabilities | Use Cases |
| Free | $0 | Unlimited notebooks, sources, audio | All document analysis |
| Workspace | $6/user/mo | Team collaboration, shared | Team knowledge management |
| Enterprise | Custom | Advanced security, admin | Large organizations |

| Tier | Cost | Capabilities | Use Cases |
| Waitlist | $0 | Limited access, beta features | Testing, evaluation |
| Standard | $39/mo | Full agent capabilities | General automation |
| Professional | $99/mo | Higher limits, priority | Production workflows |

| Tier | Cost | Capabilities | Use Cases |
| Free | $0 | 200K context, rate limited | Long document analysis |
| Premium | $10/mo | Higher limits, priority | Regular long-context work |
| API | Pay-per-use | 2M context window | Production systems |

| Tier | Cost | Capabilities | Use Cases |
| Free Tier | $0 | Web apps, limited storage | Basic document work |
| Personal | $7/mo | Desktop apps, 1TB storage | Individual productivity |
| Business | $12/user/mo | Team features, admin, security | Team collaboration |
| Enterprise | $22/user/mo | Advanced security, compliance | Organization-wide |

| Tool | Tier | Monthly Cost |
| Claude | Pro | $20 |
| ChatGPT Plus | Plus | $20 |
| VS Code + Copilot | Individual | $10 |
| GitHub | Teams | $20 |
| Vercel | Pro | $20 |
| Supabase | Pro | $25 |
| Figma | Professional | $15 |
| Apollo.io | Basic | $60 |
| Instantly.ai | Growth | $50 |
| Perplexity | Pro | $20 |

| Tool | Tier | Monthly Cost |
| Claude API | Usage-based | $100 |
| ChatGPT Plus | Plus | $20 |
| DeepSeek API | Usage-based | $50 |
| VS Code + Copilot | Business | $19 |
| GitHub | Teams | $20 |
| Vercel | Pro | $20 |
| Supabase | Pro | $50 |
| Figma | Professional | $15 |
| Apollo.io | Professional | $100 |
| Instantly.ai | Hypergrowth | $100 |
| Perplexity | Pro | $20 |
| Invideo | Max | $48 |

| Layer | Shared Resources | Products Served |
| Tier 1: Supervisors | MOA, QAS, CSM, HHC | All products |
| Tier 2: Revenue | SDA, OOA, CRMA, PEA | CasaClara, RepairForge, client work |
| Tier 2: Delivery | PMA, SEA, DAA, AAA | All product development |
| Tier 2: Quality | QDA, IPGA, SCA, BPA | All deliverables |
| Infrastructure | Vercel, Supabase, GitHub | All deployments |

| Product | Primary Tools | Timeline | Revenue Model | Priority |
| Client Services | Claude, VS Code, Copilot | Immediate | Project/Retainer | CRITICAL |
| CasaClara (PropTech) | Claude, VS Code, Figma | Month 3-4 | SaaS + Licensing | HIGH |
| RepairForge (Services AI) | Claude, DeepSeek, Supabase | Month 4-6 | SaaS Subscription | HIGH |
| NoDrft Platform | Claude, VS Code, Vercel | Month 6-9 | Subscription + Usage | MEDIUM |
| Content/Agency Products | Invideo, ImageFX, ChatGPT | Ongoing | Productized Services | MEDIUM |

| Tool Category | Products Enabled | Example Outputs |
| LLMs (Claude/GPT) | All products | Code, content, analysis, documentation |
| IDE (VS Code) | All software products | Full-stack applications, APIs |
| Video (Invideo/Sora) | Marketing, demos, training | Product videos, tutorials, ads |
| Images (ImageFX) | All products | UI assets, marketing, mockups |
| Research (Perplexity) | Strategy, content, sales | Market reports, competitive intel |
| Docs (NotebookLM) | Knowledge products | Research synthesis, training |
| Design (Figma) | All UI/UX products | Design systems, prototypes, mockups |
