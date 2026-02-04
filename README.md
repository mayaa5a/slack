# Slack MVP Demo (Friday Prototype)

A demo-ready Slack-like web app built with Next.js + TypeScript + Tailwind. It recreates core Slack navigation patterns and adds a cross-workspace AI Dashboard for missed updates.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## What's implemented

- Slack-like main view at `/`
  - Workspace switcher (UT Org, Internship, Class Project)
  - Left navigation and channel list
  - Message feed per selected channel
  - Thread side panel (opens on message click or "Reply in thread")
  - Top search bar and user area
- AI Dashboard at `/dashboard`
  - Top priorities
  - Workspace-by-workspace summaries
  - Extracted action items with checkbox UI
  - "Jump to message" links back to exact workspace/channel/message in `/`
- Deep-link behavior
  - Main view reads query params and scrolls/highlights the linked message

## Data and architecture

- Mock data lives in `src/data/mockData.ts` (3 workspaces + channels + messages + DMs)
- Types live in `src/types/slack.ts`
- State store lives in `src/lib/store/slack-store.tsx`
- Integration-ready service layer lives in `src/lib/services/slackService.ts`
  - Current implementation: `MockSlackDataService`
  - Future swap point: replace with a real Slack API-backed service

## AI dashboard logic

- Summarization is deterministic/rules-based for offline demo reliability.
- Core logic lives in `src/lib/summarize/summarizer.ts`.
- Inputs: unread/mention/action-required messages across all workspaces.
- Outputs:
  - 3-bullet "what you missed"
  - prioritized list with rationale
  - extracted action items

## Mocked vs integration-ready

- **Mocked today**
  - Message/channel/workspace content
  - AI summarization logic (rules-based)
  - Composer inputs and checkbox interactions (UI only)
- **Integration-ready design**
  - Service boundary in `src/lib/services/slackService.ts`
  - Summary function API in `src/lib/summarize/summarizer.ts`
  - Deep-link shape for cross-view navigation
