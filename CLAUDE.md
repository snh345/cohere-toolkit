# CLAUDE.md - Cohere Toolkit Development Guidelines

## Build & Run Commands
- Start dev environment: `make dev`
- Build & run containers: `docker compose up --build`
- DB migrations: `make migrate`
- First time setup: `make first-run`

## Testing Commands
- Backend unit tests: `make run-unit-tests file=path/to/test.py`
- Integration tests: `make run-integration-tests file=path/to/test.py`
- Frontend tests: `cd src/interfaces/assistants_web && npm run test`

## Code Quality Commands
- Typecheck: `make typecheck` (pyright)
- Lint: `make lint` (ruff)
- Format frontend: `make format-web`

## Style Guidelines
- **Python**: snake_case for variables/functions, PascalCase for classes
- **TypeScript/React**: PascalCase for components/types, camelCase for variables/functions
- Explicit type annotations in both Python and TypeScript
- Use async/await pattern for asynchronous operations
- Group imports: stdlib → third-party → local
- Comprehensive test coverage with mocks for external dependencies
- Error handling: Use try/except in Python, capture/categorize errors in React components
- Follow existing component structures and patterns when adding new features