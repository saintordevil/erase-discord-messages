# Changelog

User-facing changes to Erase. The same release notes are available in **Advanced settings > View changelog**.

## 1.2.6 · Clearer webhook cards

- Webhook reports use a compact Discord card with blue completed-run and purple preview accents, prominent message totals, and neatly grouped progress, duration and newest-message protection.
- Issues, stopped runs and failures have distinct headings and colors. Extra details appear only when needed, and previews and test reports remain clearly labelled.

## 1.2.5 · Clear counts at every size

- All numeric ratios use compact formatting such as 15/15, including queue selections, progress, missing-friend checks and webhook reports.
- The progress footer adapts to the panel's width when resized. Status text, percentage, counters and Auto-scroll wrap into separate rows instead of overlapping.

## 1.2.4 · History until you clear it

- Recently deleted history no longer expires after seven days or drops older records after 200 chats. Existing saved activity carries forward automatically.
- Clear history in the queue popup removes this account's deletion badges after confirmation, without changing its saved queue or messages.
- History saves only changed records, keeping updates small as the list grows. Missing friends and closed DMs keep their badges across later runs.

## 1.2.3 · Remember closed DMs

- Recently deleted badges follow verified people as well as their chats, including friends whose DMs are missing from the current chat list.
- Recently used closed DMs remain available in the queue after a reload, with their saved names and activity badges. They are never selected automatically.
- Runs with nothing left to delete keep the earlier deletion record. Existing history gains identity details from matching saved queues and loaded chats where available.

## 1.2.2 · Paste, test, and confirm

- Webhook URLs save and validate as you type, without clicking a button or leaving the field.
- A complete URL automatically sends one labelled test after a short typing pause, with live delivery or error feedback.
- Changing or clearing the URL cancels outdated tests. Reloading saved settings does not resend a test; Test again remains available.

## 1.2.1 · GitHub release

- Install and update Erase from its official GitHub repository.
- Find a concise usage guide, synthetic previews and the full changelog alongside the script.

## 1.2.0 · Pick up where you left off

- Saved queues retain your original chats, order, filters and progress after a pause or browser restart.
- Restore the first unfinished target with its newest-message protection preserved. Deletion resumes only when you choose.
- Recently deleted bubbles beside queue names help you track where you have worked during the last seven days.

## 1.1.9 · Queue closed DMs

- Select missing friends and add their existing DMs without reopening chats in Discord.
- Select all matching friends, cancel lookups, and see clear results for found or unavailable chats.

## 1.1.8 · See which chats are missing

- All and DMs show how many friends have detected conversations.
- A searchable list identifies missing friends by display name and username.
- Open DMs with non-friends stay available and are counted separately.

## 1.1.7 · A steadier start

- The trash icon waits for Discord's loaded header before appearing in its final position.

## 1.1.5–1.1.6 · Cleaner reports and logs

- Optional Discord webhooks report the result of a single run or an entire queue, including failures, stops and previews.
- Webhook settings are private to your userscript manager, and the on/off status updates immediately.
- Each message gets one concise outcome row in the log.
- Webhook has its own section below queued deleting. The old archive-import panel was removed.

## 1.1.3–1.1.4 · Faster empty-chat handling

- Chats with fewer messages than your keep-newest setting are skipped with a clear notice.
- Empty search results no longer cause repeated page loops.
- Queues move promptly past targets with nothing to delete while still respecting Discord's rate limits.

## 1.1.1–1.1.2 · Easier selection

- Select all works within the current All, DMs, Groups or Servers view and respects search.
- Selected chats are highlighted, and overlapping server/channel selections are avoided.
- The keep-newest explanation updates as you change the number.
- Current-chat details and Follow current chat sit together in General. Unused legacy interface code was removed.

## 1.1.0 · Queues and stronger protection

- Queue DMs, group chats and servers together, with a preview before deletion.
- Keep a custom number of newest messages per conversation, plus an optional before-date cutoff.
- Recent-message boundaries and account checks guard every deletion; server protection applies separately to each channel.
- Follow the current chat, detect age-restricted channels automatically, and read toggle explanations on hover.
- A screen-contained panel, larger action text and detailed live activity make longer runs easier to follow.

## 1.0.8 · Earlier baseline

Existing message deletion, search filters, intervals, pacing controls and the Erase panel formed the baseline for the releases above.
