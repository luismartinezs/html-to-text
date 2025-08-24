# VIBECODING GUIDE

# Notes (keep in mind)

- If you do not understand the code as if you were writing it without AI, things will break and become a mess
- keep it simple and fast, iterate as needed
- every prompt should be written using prompt engineering _once_ and stored for reuse and optimization
- do not blindly pick prompts. write and customize
- In claude code, get used to start from the correct context. In general you want to first gather context, and start all other steps from the gathered context

# PROCESS

1. **PMing**

- [x] start with codebase idea
- [x] iterate with SOTE AI to narrow it down (001-narrowing.md -> 001-narrowed.md)
- [x] create codebase folder with context folder to add all the docs
- [x] AI: gen PRD.md, read and validate
- [x] iterate with AI to draft tech-spec, wide-adoption, well-docu tech. Use score system to rank options
- [x] AI: gen tech-spec.md (it should include reasoning behind tech picks), read and validate
- [x] AI: gen API contract (api-contract.md), read and validate
- [x] AI: gen milestones.md (<= 5 milestones), read and validate
- outputs: prd.md, tech-spec.md, api-contract.md, milestones.md

1. **UI/UX**

- [ ] list simplest UI needed, simplest user flow
- [ ] sketch rough wireframes
- [ ] select premade component lib to get most of work done

1. **Codebase scaffold**

- [x] start with a premade template that uses the selected tech stack, the closest I find to what I need. It's okay if something needs to be integrated beside. Use gemini deep research to find best template
- [x] Make sure all gen docs from above live in /context folder
- [x] Run initial audit of the template (see audit)
- [x] scaffold CLAUDE.md
- Is codebase fairly complex and modular?
  - YES
  - [ ] scaffold CLAUDE.md for each key subfolder (/init:deep)
    - [ ] the /init:deep command should be written by hand customized to what I need
  - NO
    - [x] use /init command from CLAUDE.md (kinda depends on codebase size and complexity)
- [x] go over each CLAUDE.md file and customize by hand (see coding rules)

1. **Coding loop**

- [x] Select next milestone to complete
- [x] Split milestone into features. Provide PRD, tech spec and milestones docs as context
- [x] Select next feature to implement
- [x] Evaluate feature complexity (rough planning poker)
- [x] checkout to a new feature branch
- [ ] Break feature down into simple small components (if case of doubt, break it down further), each component should be scope 2 tops (in terms of poker planning)
- [ ] Implement in this order:
  - [ ] determine task complexity to decide prompting strategy (low, medium, high)
    - [ ] low: write prompt that directly executes (execute)
    - [ ] medium: EIPME loop: explore -> inquire -> gen plan -> minimize plan -> execute
    - [ ] high: use sote model (smartest model available), provide it as much context as possible. Ask it to generate 3+ plans. Pick simplest plan. Then run EIPME loop
  - [ ] Write detailed rich prompt, goal is to provide rich and detailed context for the task (need a detailed prompt template)
    - [ ] define "contract": types, interfaces, schemas, APIs, data models, auth patterns, error handling strategies..., get with AI and review carefully
    - [ ] define tests (TDD): gen with AI and review carefully
    - [ ] Include codebase samples with patterns I want AI to use
    - [ ] Review prompting strategies before sending prompt (see below)
    - [ ] Use context7 MCP, _always_ ask it to collect 3rd party docs with context7 (or copy paste docs in prompt)
- [ ] after implementing feature, before merging to main
  - [ ] perform security audit: repomix to gemini, gather security insights (see below security patterns). Take each issue and treat it like a task (same loop as above). Loop until Gemini no longer flags issues and you have verified them manually. Do _not_ blindly trust in anything gemini says, understand _everything_ you merge
  - [ ] Go over Quality Assurance Checklist (see checklist below)

1. **Codebase Audit**
   Do this before merging to main and before releasing to production

- [ ] security audit
  - [ ] repomix -> gemini: act as a security expert and spot flaws. take insights and copy to claude to fix (use coding loop). Loop until issues 100% fixed. Do not do it blindly! Curate each issue! Do not try to fix everything at the same time!
  - [ ] Check for security patterns (see below)
- [ ] Quality assurance checklist (see below)

# (A)EIPME loop

## Ask

- [ ] Consider a initial step, prompt AI to ask questions about task. You can ask AI to score task clarity from 0 to 100 and have 95 threshold

## Explore

- start here for medium complexity tasks

* [ ] prompt AI to explore related code and functions, gather context. Do not code

## Inquire

- [ ] read output from "explore" and ask questions, the goal is to collect all the necessary minimal context, and also ignore unnecessary context

## Plan

- [ ] based on all the gathered context, write implementation plan, do not code

## Minimize

- [ ] review the plan, simplify it to something minimal that can be tested. Do not code

## Execute

- start here directly for low complexity tasks

* [ ] write execute prompt, based on prewritten plan, and send, to generate code. _never_ trust the first response
* [ ] Execute step by step. If plan has steps, execute one at a time
* [ ] review code
  - [ ] understand code changes _always_, as AI to explain code in simple terms and to add comments to the code
  - [ ] code changes must fulfill security checklist (see below security patterns)
  - [ ] be aware of new any deprecated or legacy code
* [ ] refactor code based on the review
* [ ] test code: _always_ test manually, all tests must pass, update any necessary tests, add any necessary tests. If anything is broken, see debugging
* [ ] Document changes: update CHANGELOG.md, update CLAUDE.md files if necessary. Commit changes and go to next step

# debugging

- [ ] ask AI to fix it (with error as context), if after 3 attempts still broken, REVERT (undo everything, tweak prompt and start from scratch)
- [ ] stubborn bugs: overview of the components the error is coming from and list top suspects that cause the error. Add logs. Give logs as context to diagnose cause of error. Then fix cause

# agent / command / CLAUDE.md / context generation

Steps to generate agents, commands and CLAUDE.md files

- [ ] ask gemini deep research to research and find best practices for a specific field
- [ ] ask Opus or chatgpt to summarize research results
- [ ] ask claude code to create agent / command / CLAUDE.md following best practices summary (paste best practices summary in the claude console, do not reference a file)
- [ ] ask claude to review anthropic best practices and make sure the new agent / command / CLAUDE.md adheres to them
- general best practices: https://www.anthropic.com/engineering/claude-code-best-practices
- subagents: https://docs.anthropic.com/en/docs/claude-code/sub-agents
- commands: https://docs.anthropic.com/en/docs/claude-code/slash-commands

# security patterns

- Always validate & sanitize on server; escape output
- Keep secrets server-side only (env vars, ensure .env is in .gitignore).
- Server must verify auth permissions for every action & resource
- Generic error messages for users; detailed logs for devs
- Server must confirm current user owns/can access the specific resource ID
- Define data access rules directly in your database (e.g., RLS)
- Rate limit APIs (middleware); encrypt sensitive data at rest; always use HTTPS
- OWASP

# Quality Assurance Checklist

## Technical Quality

- Code follows consistent patterns and conventions
- No unnecessary duplication or complexity
- Proper error handling and logging
- Performance optimizations implemented
- Security best practices followed

## Architecture

- Clear separation of concerns
- Proper abstraction layers
- Scalable design patterns
- Integration points well-defined
- Database design optimized

## Testing & Documentation

- Comprehensive test coverage (>80%)
- API documentation complete
- Setup and deployment instructions clear
- Architecture decisions documented
- Security considerations outlined

# Coding rules (take as reference, do not copy paste)

- Explain what you’ll do first and ask for my confirmation before coding
- Do the simple thing first. Use modules instead of just a single file
- Only make requested changes
- Do not write duplicate code - please look for existing solutions in the codebase
- Use vertical architecture: features end to end in small complete slices

# Prompting strategies

- Explicitly narrow scope to certain files or functions
- Explicitly ask the model to implement simplest solution
- Prompt AI to ask questions as a first step
- Use a scoring system: ask AI to score from 0 to 100, and enforce a threshold
- Add this to the end of execution prompts: "Do not change anything I did not ask for. Just do only what I told you"
- When asking AI to review plan or implementation, say: "my developer did this"
- Add images to the prompt whenever it makes sense

# References

- https://www.anthropic.com/engineering/claude-code-best-practices
- https://www.anthropic.com/engineering/building-effective-agents
