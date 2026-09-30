# QA Review — Patient Dashboard (vitamind_frontend)

**Date:** 2026-09-30 · **Branch:** `feature/vitamind-ui-revamp` (with the uncommitted Lumina threads / Spark memory work) · **Tester:** Claude (Chrome + headless Chrome device emulation)

No fixes were made during this session. Every finding below was reproduced; nothing is inferred from reading code alone.

## Test setup

| Item | Value |
|---|---|
| Frontend | `next dev` on `localhost:3000` (your running instance) |
| Backend | NestJS on `localhost:5000`, local Postgres |
| Agents | Lumina `:8102`, Spark `:8103` (`python -m scripts.run_all --only lumina --only spark`) |
| Browser | Chrome (your window, zoom 80 %, viewport 1707×678 CSS px) for desktop flows; headless Chrome with device emulation for phone (390 px) and tablet (820 px) |
| Test patients | `qa.adhd.*`, `qa.bipolar.*`, `qa.schizo.*`, `qa.general.*` `@example.com` (created for this session; password `Passw0rd!Test1`) |

> **Environment note.** During most of the run the Chrome window was in the background (`document.visibilityState = "hidden"`), which pauses `requestAnimationFrame`. Entrance animations and the typewriter therefore looked frozen at partial opacity in screenshots. This is a browser behaviour, **not** an app bug; animation timing was verified in a visible headless Chrome instead.

## Summary

| # | Title | Severity | Area |
|---|---|---|---|
| 1 | Crisis banner ends with "You can also reach:" and lists nothing | **Critical** | Lumina · Spark · Onboarding crisis support |
| 2 | Reopened crisis thread shows no support banner or resources | **Major** | Lumina threads |
| 3 | Crisis text becomes the permanent thread title in the sidebar and header | **Major** | Lumina sidebar (privacy) |
| 4 | Journal-derived risk wording is shown to the patient as a "remembered" memory | **Major** | Lumina memory dialog · Settings |
| 5 | Memory dialog and Journal copy contradict the auto-activation behaviour | **Major** | Copy / trust |
| 6 | Spark replies are labelled "Lumina · Support companion" | Minor | Spark chat |
| 7 | "Talk with Lumina" after a heavy journal entry lands on the generic welcome | Minor | Journal → Lumina hand-off |
| 8 | Home page fires 33 API calls for 9 endpoints (`checkins/today` ×10) | Minor | Performance |
| 9 | Every Home card heading is announced twice by screen readers | Minor | Accessibility |
| 10 | Spark task titles keep leftover time words ("email James morning") | Minor | Spark agent parsing |
| 11 | Journal "Average mood" shows a bare number with no scale | Visual | Journal insights |
| 12 | Lumina welcome is clipped in short windows (fixed-height frame) | Visual | Lumina chat layout |
| 13 | No habit tracking exists on the ADHD dashboard | Scope gap | ADHD Home |

---

## Findings

### 1. Crisis banner ends with "You can also reach:" and lists nothing — **Critical**

- **Context:** All patients · Lumina chat, Spark chat, Onboarding (`LuminaChat.tsx:222`, `SparkChat.tsx:141`, `OnboardingChat.tsx:200`)
- **Steps:**
  1. Sign in as any patient (e.g. `qa.adhd.*`) and open **Lumina**.
  2. Send `I want to kill myself`.
- **Expected:** The support banner gives the patient at least one concrete way to get help (a clinic number, a configured hotline, or a clear "call your local emergency number" instruction), and the copy never ends with a dangling colon.
- **Actual:** Banner text is *"You matter — and you deserve support right now. If you're in immediate danger, please contact emergency services. You can also reach:"* followed by nothing. The patient has no clinician assigned, and `LUMINA_EMERGENCY_RESOURCES` is **not set** in `vitamind_backend/apps/api/.env` (it is empty in `.env.example`), so `emergencyResources` is `[]`. The UI renders `crisisBody` unconditionally and only hides the `<ul>`.
- **Console / network:** None. `POST /api/v1/me/lumina/chat` → 200 with `support: { level: "CRISIS", emergencyResources: [] }`.
- **Notes:** Two fixes are needed. (a) The UI should use copy that doesn't end in "You can also reach:" when the list is empty. (b) Every deployment must set `LUMINA_EMERGENCY_RESOURCES`; consider making the backend refuse to start without it in production.

### 2. Reopened crisis thread shows no support banner or resources — **Major**

- **Context:** All patients · Lumina thread history
- **Steps:**
  1. In Lumina, start a new conversation and send `I want to kill myself` (banner appears).
  2. Reload the page (or sign in on another device).
  3. Open the rail and select the thread titled *"I want to kill myself"*.
- **Expected:** The crisis turn is shown with its support resources, as it was live.
- **Actual:** The crisis reply text is shown but **no banner and no resources**. `GET /me/lumina/conversations/:id/messages` *does* return `support: { level: "CRISIS", emergencyResources: [...] }` for that turn, but `turnsToMessages` in `hooks/patient/useLumina.ts` drops `support`, and the banner is only ever set from a live reply.
- **Console / network:** None; the API response is correct.

### 3. Crisis text becomes the permanent thread title — **Major (privacy)**

- **Context:** All patients · Lumina rail, phone history sheet, conversation header
- **Steps:**
  1. Start a new conversation whose first message is `I want to kill myself`.
  2. Open the rail (or the phone history sheet).
- **Expected:** Sensitive first messages don't become visible labels, since the sidebar is readable at a glance by anyone near the screen.
- **Actual:** The thread is listed as **"I want to kill myself"** and the same text is the conversation header title. Titles come verbatim from the first message (`lumina-conversation.util.ts`), whatever its safety level.
- **Notes:** Suggest a neutral title (e.g. the date, or "A hard moment") when the first turn's safety level is ELEVATED or CRISIS. Existing titled threads would need a backfill.

### 4. Journal-derived risk wording is shown to the patient as a "remembered" memory — **Major**

- **Context:** General patient (any track) · Lumina **Memory** dialog and **Settings → Lumina's memory**
- **Steps:**
  1. Sign in as `qa.general.*`, open **Smart Journal**.
  2. Pick *Low* + *Sad*, write `I feel hopeless and nothing matters anymore. I do not see the point of trying.`, press **Keep this entry**.
  3. Open **Lumina → Memory** (or Settings).
- **Expected:** The patient never sees the agent's risk vocabulary. The Journal screen follows this rule itself: it only shows *"That sounded like a hard moment"*.
- **Actual:** The memory list shows **REMEMBERED — "Journal entries have expressed hopelessness."** after a single entry. An overload entry similarly produces *"Journal entries have described being overloaded by tasks."* These come from the journal analyzer's `MEMORY_WORTHY` sentences, now stored ACTIVE (auto-activation decision) and listed by `GET /me/lumina/memories`.
- **Console / network:** None.
- **Notes:** This is the patient-visible side of the auto-activation decision. Options: hide journal-origin memories (`origin` starts with `journal:`) from the patient list, give them patient-safe wording, or hide the Lumina memory UI as the original brief intended. The Onboarding copy ("you can change or remove anything I remember in Settings") needs to stay true under whichever option is chosen.

### 5. Memory dialog and Journal copy contradict the auto-activation behaviour — **Major (trust)**

- **Context:** Lumina Memory dialog subtitle; Smart Journal header
- **Steps:** Same as #4.
- **Expected:** Copy matches behaviour.
- **Actual:**
  - Memory dialog: *"Only what you've shared or confirmed shapes Lumina's replies."* But the journal memories above were never confirmed, and they show as **Remembered**.
  - Journal header: *"Lumina looks for patterns over time, never in a single entry."* But one entry creates a durable memory.
- **Console / network:** None.

### 6. Spark replies are labelled "Lumina · Support companion" — Minor

- **Context:** ADHD patient · Spark chat (desktop and phone)
- **Steps:** Sign in as `qa.adhd.*` → **Spark** → send `I need to email James tomorrow morning and finish my presentation slides by Friday`.
- **Expected:** The reply is attributed to Spark (name, role, and ideally Spark's icon).
- **Actual:** The reply header reads **"Lumina · Support companion"**, with Lumina's logo. `SparkChat` reuses `LuminaMessage`, which hard-codes `copy.chat.title` / `copy.chat.role`.

### 7. "Talk with Lumina" after a heavy journal entry lands on the generic welcome — Minor

- **Context:** Journal → Lumina hand-off
- **Steps:** Save the heavy entry from #4 → click **Talk with Lumina**.
- **Expected:** Lumina opens ready to follow up the entry.
- **Actual:** It lands on the generic welcome ("Hi Gia — What's on your mind today?", starters *I'm feeling stuck / I can't sleep…*). The safety follow-up *does* trigger on the patient's first message (sending `Hi` returned *"I want to check in on how you are doing right now…"*), but the patient has to write first, and the new thread is titled "Hi".

### 8. Home page fires 33 API calls for 9 endpoints — Minor (performance)

- **Context:** Any patient · Home (`/dashboard`), full page load
- **Steps:** Load `/dashboard` and count `performance.getEntriesByType('resource')` for `:5000`.
- **Expected:** Roughly one request per endpoint.
- **Actual:** 33 requests, 9 unique. Duplicates: `checkins/today` ×10, `checkins?from=…-17` ×6, `exercises/catalog` ×4, `lumina/state` ×4, plus several ×2. Part of this is React StrictMode's double effects in dev. ×10 means `usePatientResource` doesn't share in-flight requests between the several cards that use the same key. Each request also triggers a CORS preflight.
- **Console / network:** All requests return 200. No polling while idle (0 requests in 20 s).

### 9. Every Home card heading is announced twice — Minor (accessibility)

- **Context:** Home cards ("Today's wellbeing", "Your wellbeing trend", "Recent signals", "Today's Lumina plan")
- **Steps:** Inspect headings on `/dashboard`.
- **Expected:** One heading per card.
- **Actual:** Each card renders a visible `<h2>` **and** an `sr-only` `<h2>` with the same text inside `.lm-glass.lm-card`, so screen readers read every heading twice.

### 10. Spark task titles keep leftover time words — Minor (agent)

- **Context:** ADHD · Spark task list
- **Steps:** Send `I need to email James tomorrow morning and finish my presentation slides by Friday`.
- **Expected:** Tasks "Email James" (tomorrow morning) and "Finish my presentation slides" (due Fri, Oct 2).
- **Actual:** Tasks **"email James morning"** (Tomorrow) and "finish my presentation slides" (Oct 2). "tomorrow" is extracted, but "morning" is left in the title, and titles aren't capitalised. The due date is correct.

### 11. Journal "Average mood" shows a bare number — Visual

- **Context:** Smart Journal · "How this fits your picture"
- **Steps:** Save an entry with mood *A little low*.
- **Actual:** Tile shows **"4 — Average mood"** with no scale. The patient picked a face, not a number, so "4" (out of 10) is unexplained.

### 12. Lumina welcome is clipped in short windows — Visual

- **Context:** Lumina chat, desktop window ~540 px tall (reproduced in your Chrome window)
- **Steps:** Open `/dashboard/lumina` in a short window.
- **Actual:** The welcome (logo, "Hi …", starters) is cut off: only the logo and greeting are visible above the composer, and the starters are hidden. `FRAME` in `LuminaChat.tsx` fixes the height (`h-[calc(100dvh-…)] min-h-[34rem]`), and the welcome isn't laid out for short heights. This predates the threads work.

### 13. No habit tracking exists on the ADHD dashboard — Scope gap

- **Context:** ADHD Home
- **Actual:** The ADHD Home differs from the others only by the Lumina chat side panel, the ADHD wellbeing rings (Mood / Energy / Focus / Follow-through), a focus-sprint exercise and the Spark nav entry. There is **no habit tracker** in the product; the Spark task list lives on the Spark page. Listed so the test plan and the product scope can be aligned.

---

## Verified working (passed)

| Area | Check | Result |
|---|---|---|
| ADHD | Home: Lumina chat panel, Spark in nav, ADHD rings, blue theme | ✅ |
| ADHD | Spark chat creates tasks; list refreshes via `/me/spark/memories` | ✅ |
| ADHD | "What Spark has noticed" badge counts pending patterns; confirm → ACTIVE with confidence 0.8 / evidence 5 unchanged; badge clears | ✅ |
| ADHD | Settings shows **Spark's memory** and **Lumina's memory** as separate lists; Forget on Spark leaves Lumina untouched | ✅ |
| Bipolar | Home side panel swapped for **3 curated articles** ("Reads for you"); lavender theme; no Spark; rings Mood/Energy/Sleep/Stress | ✅ |
| Bipolar | Article opens in a modal with headings, body and "General information, not medical advice." | ✅ |
| Schizophrenia | Home shows schizophrenia-specific reads; sage theme; no Spark | ✅ |
| Schizophrenia | Lumina page is motion-free (`.lm-mote` and `.lm-orbit` animation `none`) | ✅ |
| General | Home shows the Lumina chat panel; no Spark | ✅ |
| All | Sign out → sign in as another patient **in the same session**: no threads, memories or theme leak | ✅ |
| Lumina | Landing opens a fresh conversation (welcome + 4 starters); rail collapsed (68 px) | ✅ |
| Lumina | First message creates a thread; New conversation → welcome; switching threads loads history (not re-typed); `aria-current` marks the open thread | ✅ |
| Lumina | Rail open/closed state remembered across reloads | ✅ |
| Lumina | Thinking indicator while waiting; typewriter reveals word by word; full text available to screen readers once | ✅ (headless, visible tab) |
| Lumina | **CRISIS:** reply rendered whole ~360 ms after send, no typewriter, banner shown at once | ✅ (but see #1, #2, #3) |
| Lumina | New thread after a crisis opens with the safety check-in (`recent_safety`) | ✅ |
| Lumina | Reduced motion: replies appear whole | ✅ |
| Journal | Entry save → 201; patient sees everyday cues + practical follow-up, never risk categories | ✅ |
| Journal | Heavy entry → gentle "hard moment" card + Talk with Lumina; next Lumina turn is a safety check-in | ✅ |
| Console | No JavaScript errors or failed API calls on any page tested in Chrome | ✅ |

## Phone & tablet pass

_Running at the time of writing (headless Chrome, 390 px EN/AR and 820 px). Results will be appended below._

## Suggested fix order

1. **#1 + #2** (crisis support must always be concrete and must survive a reload).
2. **#3 + #4 + #5** (patient-visible sensitive text: titles and memory wording, plus the copy that describes them).
3. **#6, #7** (identity and hand-off polish).
4. **#8, #9, #11, #12** (performance, accessibility, visual).
5. **#10** (Spark agent parsing, agent repo).
