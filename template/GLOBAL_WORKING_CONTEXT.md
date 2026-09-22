# Global Working Context

---

## Communication Language

- **Chat/Discussion**: Vietnamese (Tiếng Việt)
- **Code/Comments**: English
- **Technical Documentation**: English

## User Identity

- **Nickname**: Soda
- **Instruction**: Always address the user as "Soda" when replying (e.g. when opening a response or referring to them directly).

---

## Working Rules

### When Multiple Solutions Exist

- Present possible solution directions and their tradeoffs to the user.
- Wait for the user to choose the execution direction.
- Never automatically choose a direction or proceed with an unchosen solution.

### General Scope Authorization and Review

- Existing authorization to execute an agreed plan is sufficient for its included steps; do not request repetitive confirmation for each step.
- Honor explicit review checkpoints, and return scope changes to the user for a new decision.
- If the user stops or cancels the work, immediately stop active execution tasks.
- The final report is delivered directly in the session chat and states the changes plus any errors or blockers that prevented requested completion, backed by verified check evidence. Do not create an unsolicited report file.

### Token Efficiency

- **Context as a Limited Resource**: Treat repository and task working context as a limited resource. Avoid unnecessary working-context growth during repository investigation and implementation.
- **Targeted Investigation**: Start investigation from the most specific known evidence and expand outward only when needed. Prefer targeted file reads, symbol searches, exact paths, focused diffs, relevant log excerpts, and bounded command output over broad repository dumps.
- **Eliminate Redundant Reads and Searches**: Do not repeatedly read unchanged files, context, diffs, logs, command outputs, or findings that are already available and still valid in the current working session. Avoid redundant searches and duplicate investigation.
- **Reuse Verified Findings**: Reuse verified findings from previous work in the same session instead of rediscovering the same information.
- **Output Handling**: Summarize large outputs when possible while preserving exact errors, failing checks, affected files, and evidence necessary for review.
- **Correctness Over Efficiency**: Expand context whenever correctness requires it. Token efficiency must never justify guessing, skipping required verification, hiding uncertainty, or prematurely stopping investigation.
- **No Arbitrary Limits**: Do not apply arbitrary constraints (such as fixed line limits, file caps, search count limits, or artificial token budgets).

### File Creation

- Create authorized code files when needed.
- Do not create unsolicited documentation, notes, guides, summaries, or README files. Create documentation only when the user requests it or explicitly approves it as part of the agreed task.
- Record required project test evidence according to the supplied project context; do not create unsolicited reports or evidence files.

### Code Changes

- **Minimal changes**: Only modify what's necessary
- **Follow existing patterns**: Stay consistent with codebase
- **Verify before commit**: Test to ensure code works
- **No unrequested refactoring**: Do not modify, format, or refactor existing code outside the strict scope of the current task

---

## Testing Rule

Run checks relevant to the change. Run the full suite when the supplied project context requires it. If a check fails, diagnose it and fix it within the authorized scope when possible; otherwise report the error and blocker. Distinguish pass, fail, not run, blocked, and pre-existing failures in the report. Do not claim a pass or commit/push while required checks fail or remain blocked; pre-existing failures are not an automatic exemption. Do not report completion without verification; for documentation or configuration changes, use meaningful document/configuration checks instead of unrelated code tests.

## Change Verification and Git Push Rule

For every code or configuration change, follow this order:

1. Make the change.
2. Run the relevant checks and the required full test suite when applicable.
3. If a check fails, diagnose it and fix it within the authorized scope when possible, or report the error and blocker. Continue toward completion only when all required checks succeed with no unresolved build errors; do not commit or push while required checks fail or remain blocked.
4. Record the verification result when required by the project context.
5. Commit and push only when explicitly authorized in the task or session. Reuse that authorization without asking again.

## Git Workflow

### Commit Message Format (Conventional Commits)

```
<type>: <description>

[optional body]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring (no functionality change)
- `test`: Adding or updating tests
- `style`: Code style changes (formatting, semicolons, etc.)
- `chore`: Maintenance tasks (dependencies, config, etc.)

**Examples:**

```bash
feat: add user authentication
fix: resolve login timeout issue
docs: update API documentation
refactor: restructure user service
chore: update dependencies
```

### Stage, Commit, and Push

From the repository root, the user explicitly wants all repository changes staged with `git add .`, including new untracked nonignored files, modifications, and deletions. Do not selectively stage tracked files or require manual prior tracking. Exclusions remain the user's `.gitignore` preference; remember that `.gitignore` does not untrack an existing tracked file. Check status before staging and staged status/diff afterward to verify that required new files are included. Before committing, inspect the full staged diff, including a secrets check. If sensitive undesired files are present, identify them and handle their exclusion appropriately; never commit secrets. Do not assume a branch, remote, or default target. Run Git steps sequentially and only after the preceding step succeeds:

```bash
git add .
git commit -m "type: description"
git push <remote> <branch>
```

Use the actual project remote and branch. Do not commit or push without explicit authorization.

### Security

- **Do NOT push files containing sensitive information**:
  - API keys, tokens, passwords
  - Database connection strings
  - Private keys, certificates
  - `.env` files (must be in `.gitignore`)
- Always check before pushing

---

## Code Quality

### General Principles

- **Readability**: Code should be self-documenting
- **Consistency**: Follow existing patterns in codebase
- **Simplicity**: Prefer simple over complex solutions
- **Security**: Always consider security implications

### Error Handling

- **Meaningful messages**: Help with debugging
- **Proper status codes**: Use appropriate codes
- **Log with context**: Always log errors with details

### Docker Logs

- **Always use `--tail 100`**: Never use real-time logs (`-f` flag)
- **Correct command**: `docker logs <container-name> --tail 100`
- **Never use**: `docker logs -f <container-name>` (real-time monitoring)

---

## Usage Instructions

**For AI Agent:**

1. Read this GLOBAL_WORKING_CONTEXT first
2. Follow the active agent profile defined in this context
3. Use the Project Context file(s) supplied by the user; do not automatically discover, select, or guess project contexts
4. If a required Project Context has not been supplied, ask for it. If the user explicitly states that Project Context is not needed yet, respect that instruction and continue without repeatedly requesting it. If Project Context has already been supplied in the current working session, do not ask for it again. If multiple supplied Project Contexts are ambiguous, clarify rather than selecting one by guesswork
5. Read only the supplied relevant context file(s)
6. Start working with the shared context, active agent profile, and relevant supplied project context(s)

**For User:**

1. Supply or load this shared file at the start of a new project or session
2. Supply the relevant project context file(s), including contexts from multiple projects when needed (or explicitly indicate if not needed yet)
3. Begin working

---

**Purpose**: Universal working standards for ALL projects  
**Scope**: Language, workflow, code quality, working style  
**Next Step**: Load project-specific context file

Global Context contains common rules and the active agent profile. Project Context contains project-specific information.
