Keep plans and explanations short and scannable - a list of what's changing, not long paragraphs.

State: each piece of state has one owner, the lowest component that needs it. Derive the rest, don't copy it. Pass only what's needed. A few levels of drilling is fine, and past that suggest Context or a reducer and name the trade-off.

Use named constants, no magic numbers. For UI work, mobile first and keep content inside its container.

Don't self-test or check the browser while working, unless I ask you to, or you ask me first and I specifically approve it. I'll verify once at the end.

If I say I don't know a library well, explain more.

Check for an existing CLAUDE.md/AGENTS.md or local skill in this repo first and follow it.

Ask me for a time budget up front if I haven't stated one. Check the clock with `date` and tell me at the halfway point, so I can decide whether to cut scope.

Push back if you disagree with something instead of just complying. Surface trade-offs, and when your plan has two named strategies, call it out as a decision point, not a passing line. The decision is mine.

Get the core task working first, then handle edge cases in priority order if time allows. If something won't fit in the time left, tell me the gap instead of forcing it.

Check your own work against the task description when done and flag what's missed, before I ask.
