# VitaMind Frontend

A premium mental wellness and digital care frontend built with Next.js, TypeScript, and modern UI tooling. The application is designed to support guided experiences across onboarding, diagnostic journeys, dashboards, clinical guidance, subscriptions, and help flows in a calm, accessible format.

> This README has been written without personal or user-identifying information.

## Overview

VitaMind is structured as a modern web application focused on:

- patient-facing onboarding and authentication
- mental wellness diagnostics and guided flows
- account dashboard and progress tracking
- educational clinical guidance content
- subscription and payment experiences
- multilingual support and responsive accessibility

The frontend is built to feel polished, trustworthy, and clinically aware while remaining flexible enough for future feature expansion.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Radix UI primitives
- Recharts and charting utilities
- Socket.IO client
- GSAP and Lenis for motion and smooth scrolling
- ESLint and Next.js linting

## Project Structure

```text
vitamind_frontend/
├── app/
│   ├── api/
│   ├── auth/
│   ├── clinical-guide/
│   ├── dashboard/
│   ├── diagnostic/
│   ├── home/
│   ├── subscription/
│   ├── support/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   ├── clinical-guide/
│   ├── dashboard/
│   ├── diagnostic/
│   ├── home/
│   ├── layout/
│   ├── providers/
│   ├── shared/
│   ├── subscription/
│   ├── support/
│   └── ui/
├── contexts/
│   ├── AudioContext.tsx
│   ├── definitions.ts
│   ├── LanguageContext.tsx
│   └── ThemeContext.tsx
├── doc/
├── features/
├── hooks/
├── lib/
│   ├── api/
│   ├── config/
│   ├── diseases/
│   ├── i18n/
│   ├── socket/
│   ├── storage/
│   └── utils.ts
├── public/
├── .env.local.example
├── .gitignore
├── AGENTS.md
├── CLAUDE.md
├── components.json
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── tsconfig.json
└── ...
```

## Key Areas

### App layer
The `app/` directory contains the route structure and global app shell. It includes the main application pages and Next.js App Router conventions.

### Components
Reusable UI and feature components live under `components/` and are grouped by domain: authentication, dashboard, diagnostics, home, subscriptions, and support.

### Contexts and state
Shared app state and locale/theme logic are centralized under `contexts/`, making it easier to manage language switching and cross-feature behavior.

### Libraries and utilities
The `lib/` directory contains domain logic, API helpers, configuration, storage, i18n setup, and shared utilities.

### Motion and experience layer
The frontend uses cinematic motion patterns, premium gradients, and design-system-driven transitions to create a calming, modern healthcare experience.

## Prerequisites

Before starting, ensure you have:

- Node.js 20 or later
- npm, pnpm, or yarn
- A modern browser

## Installation

1. Open a terminal in the frontend folder:

```bash
cd vitamind_frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create environment variables if needed:

```bash
cp .env.local.example .env.local
```

4. Start the local development server:

```bash
npm run dev
```

5. Open the app in your browser:

```text
http://localhost:3000
```

## Environment Variables

Create a `.env.local` file for local configuration. The repository includes `.env.local.example` as a template. Use placeholders only and do not commit real secrets or production credentials.

Example:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_APP_ENV=development
```

Update values based on your backend and deployment configuration.

## Available Scripts

```bash
npm run dev      # start the Next.js development server
npm run build    # create a production build
npm run start    # run the production server
npm run lint     # run ESLint checks
```

## Development Notes

- The app uses the App Router pattern from Next.js.
- Global styling and theme configuration are managed in `app/globals.css`.
- Route-level modules are organized by feature domain for maintainability.
- Shared UI primitives and design-system patterns are centralized in the `components/ui` folder.
- Language-aware and accessibility-oriented behavior is handled at the app shell and context layer.

## Feature Modules

### Authentication
User sign-in and registration flows, along with shared auth layout components and branding.

### Diagnostic experience
Clinical assessment and diagnostic modules for guided patient interactions and structured evaluation pathways.

### Dashboard
User-facing overview, progress tracking, and account management screens.

### Clinical guidance
Educational and informational pages tailored to wellness and treatment support.

### Subscription experience
Pricing, plans, and checkout flow presentation.

### Support and help
Support pages and customer assistance structures.

## Styling and Design System

The project uses a component-based design system with:

- consistent spacing and typography rules
- re-usable UI primitives
- modern card and panel layouts
- premium gradients and soft motion treatment
- responsive layouts for mobile and desktop experiences

## Build and Deployment

Production builds can be created with:

```bash
npm run build
```

Then serve the production build locally:

```bash
npm run start
```

For deployment, use the hosting platform best suited for your environment, such as Vercel or a container-based deployment pipeline. Ensure all environment variables are managed securely outside the source repository.

## Privacy and Data Handling

- No personal data is included in this repository documentation.
- Avoid committing real user records, credentials, tokens, or private identifiers.
- Keep environment and deployment settings in secure secret stores rather than source-controlled files.

## Contributing

1. Create a feature branch.
2. Keep changes focused and domain-based.
3. Maintain consistent component and folder conventions.
4. Run linting before submitting changes.
5. Ensure no sensitive or personal data is added to the project.

## License

This project does not currently declare a public license in the repository. Before public distribution or external sharing, define the appropriate licensing terms for your organization or client.

## Support

For project-specific setup questions, contact the appropriate team maintainer through your internal project channels rather than exposing personal contact details in the repository.
