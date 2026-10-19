# Agent Handoff Protocol

Immutable versioned assignments between agents.

Standalone ES module. No npm install required. Works in **Node.js 20+** and modern browsers (serve over HTTP for browser demos).

## Install / import

Copy the files into your project, or clone this repository:

```js
import { createHandoff,validateHandoff } from './agent-handoff-protocol.js';
const handoff=createHandoff({id:'assignment-1',contractId:'invoice',
  from:'planner',to:'builder',task:'Produce invoice total 42',
  criterionIds:['total']});
console.log(validateHandoff(handoff));
```

## Use cases

### 1. Give a builder an explicit assignment

- **Scenario:** A planner delegates one invoice criterion to a builder.
- **Outcome:** Package the contract, role, attempt, and acceptance-criterion references together.

### 2. Reject incomplete agent messages

- **Scenario:** A verifier receives a handoff with no recipient or criterion IDs.
- **Outcome:** Validate the message before the agent acts on it.

## Exports

- `validateHandoff`
- `createHandoff`

## Notes

- Keep API keys and secrets out of this module and out of browser storage.
- Treat verification callbacks, ledger writers, and permission checks as trusted application code.
- This library is intentional local reliability plumbing, not a claim of cryptographic attestation unless stated in the source comments.

## License

MIT
