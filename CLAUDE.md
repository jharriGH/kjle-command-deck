## Empire onboarding -- read every session
Single source of truth: jharriGH/kjle. On session start, fetch + follow:
- https://raw.githubusercontent.com/jharriGH/kjle/main/EMPIRE_SC_HANDOFF.md
- https://raw.githubusercontent.com/jharriGH/kjle/main/EMPIRE_INTEGRATION_STANDARD.md
Keep current at this repo root:
1. ROADMAP.md -- valid YAML front-matter (project, status, description, last_updated, repo,
   api_url, facts_doc, vault_key, integrates_with). The empire dashboard reads this; bump
   last_updated on any change.
2. PROJECT_FACTS.md -- integration contract (endpoints, schema, auth), verified against the
   live system. Vault key NAMES only, never secret values.
To learn about another project: brain_search for "<project> integration" or read EMPIRE_INDEX.md
in jharriGH/kjle -> that project's PROJECT_FACTS.md -> brain_vault_search for its key.
Repo edits: this repo only, explicit file paths only.

# ⚡ KJLE_COMMAND — CLAUDE.md
# Managed by brain_sync.py (Brain sections)
# + Manual additions (never auto-updated)
# Last synced: May 10, 2026 05:08 PM PST

---

## AUTONOMOUS EXECUTION — READ THIS FIRST

You are part of the King James Empire CC fleet.
Jim Harris is NEVER the middleman. Ever.

BEFORE ANYTHING ELSE:
brain_session_start(focus="[task]", product="[project]")

GET CREDENTIALS (never ask Jim):
brain_vault_search("what you need")

DISPATCH ANOTHER CC (never ask Jim to do it):
run_build_task(project="[project]", prompt="[task]")

LOG EVERYTHING:
brain_log(content, project)     — events
brain_memory(content, tags)     — decisions

END EVERY SESSION:
brain_session_end(product, what_shipped,
  decisions, next_action)
brain_save_card(title, project, content)

ONLY INTERRUPT JIM FOR:
+ Business decisions requiring his judgment
+ Credentials genuinely not in vault after search
+ Task complete — here are the results
+ Truly blocked with specific reason

NEVER:
- Ask Jim for credentials
- Ask Jim to copy/paste anything
- Present options and wait
- Ask Jim to run any command
- Be the middleman between SC and CC

KJE MCP: https://kje-mcp.onrender.com/mcp/T24NM1Sxbh7txJs-unNIjblaXMqA1OZW6gNU-Ud5Yjk/
VPS: 192.161.173.97 (claude at /usr/local/bin/claude)
Brain: https://jim-brain-production.up.railway.app
Key: jim-brain-kje-2026-kingjames
Dispatcher: http://192.161.173.97:8091/dispatch
Notify: POST /notify {severity, message, channel, project}

---
MANDATORY RESPONSE FORMAT (every response, no exceptions)
---

End EVERY response with a one-line status banner:

📊 [PROJECT] — [X]% | 📍 [PHASE] — [X]% | 💬 Chat ~[X]%

For SC sessions also show an active empire table populated
from brain_search("active session") — Session | Status | Jim Needed?

CHAT SIZE FORMULA (rough):
  message_count × 1500 / 200000 × 100 → show as %
  70% → "💬 Chat getting full — consider new chat"
  85% → "⚠️ Open new chat now to avoid losing context"
  95% → "🚨 OPEN NEW CHAT IMMEDIATELY"

7 BRAIN TOOLS (use without being asked):
  brain_status | brain_search | brain_get_project
  brain_vault_search | brain_log | brain_memory
  run_build_task

VAULT HAS EVERYTHING — never ask Jim for API keys,
tokens, passwords, Supabase/Stripe/Twilio/Render/
Railway/GitHub PAT/Anthropic/Cloudflare/Resend/
Qdrant/n8n/Vapi/RackNerd creds. Always:
  brain_vault_search("what you need")

---

## CURRENT STATUS
<!-- BRAIN-SYNC:START:STATUS -->
*Brain sync: May 10, 2026 05:08 PM PST*

<!-- BRAIN-SYNC:END:STATUS -->

---

## EMPIRE STATE & COSTS
<!-- BRAIN-SYNC:START:EMPIRE_STATE -->
- Clients: 0
- MRR: $99.00
- HOT leads: 23
- Last decision: KJLE DNC Day complete on 2026-05-06. Empire-wide DNC source of truth operational. 6 commits shipped (e978aee through ce91b4d). TH integration LIVE in production with 16+ real DNC checks on Day 1. KJPDE and ReviewBombz handoff specs delivered. ReachInbox webhooks configured and exercised end-to-end. Reply parser stays conservative pending real-data tuning.

**AI Costs:**
- Today: $0.0083
- This month: $0.0083
- All time: $0.0083

**Empire:**
- 7 live | 3 launch ready | 6 in progress
<!-- BRAIN-SYNC:END:EMPIRE_STATE -->

---

## RECENT KJLE_COMMAND MEMORIES
<!-- BRAIN-SYNC:START:MEMORIES -->
1. Tags: kj_command_center
2. KJ Command Center is the KJLE Lead Finder
3. KJ Command Center should not be treated as a separate product from KJLE Command Deck
4. KJLE profile includes internal tool at kjle-command-deck.onrender.com and kjle-api.onrender.com
5. KJLE prioritized as easiest
6. KJLE status March 26 2026: 32/32 prompts complete
7. KJLE API key is kjle-prod-2026-secret
8. Future: Brain Panel in KJLE Command Deck after KJWidgetz launch
<!-- BRAIN-SYNC:END:MEMORIES -->

---

## BUILD STATE
<!-- BRAIN-SYNC:START:BUILD_STATE -->
*No build card in Brain yet.*
*brain_sync will auto-push BUILD_STATE.md if found in repo.*
*Or call brain_save_card() at end of next CC session.*
<!-- BRAIN-SYNC:END:BUILD_STATE -->

---

## MANUAL ADDITIONS
<!-- brain_sync.py never modifies below this line -->

---

## EMPIRE STATE & COSTS

---

## RECENT KJLE_COMMAND MEMORIES

---

## BUILD STATE


---

## FIRST THING — DO THIS AUTOMATICALLY

```
brain_session_start(focus="[today's task]", product="kjle_command")
brain_search(query='kjle_command')
brain_list_cards()   # find build card
brain_get_card(id)   # load full spec
# THEN ask Jim what to tackle
```

**Do not wait to be asked. Always do this first.**

---

## SESSION END — DO THIS AUTOMATICALLY

```
brain_session_end(
  product="kjle_command",
  what_shipped="[what was built]",
  decisions="[key decisions]",
  next_action="[most important next task]"
)
brain_save_card(
  title="KJLE_COMMAND BUILD_STATE [date]",
  project="kjle_command",
  content="[full build state md]"
)
```

---

*Synced: May 10, 2026 05:08 PM PST*
*Refresh: `python brain_sync.py kjle_command`*