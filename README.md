# VitaMind Frontend

The web frontend for **VitaMind** — an AI-powered mental health platform designed to provide continuous, personalized, and human-centered support while facilitating collaboration with mental health professionals.

> **VitaMind is designed to support, not replace, qualified mental health professionals.**

## Overview

The VitaMind frontend provides the user-facing web experience for the VitaMind ecosystem, including:

- AI-powered conversations and orientation
- Mental health assessments and guided experiences
- Personalized user experiences
- Wellbeing and progress tracking
- Patient information and history
- Subscription and account management
- Professional care workflows
- Bilingual **English / Arabic** experience
- Responsive and accessible web interfaces

The frontend focuses on presentation, interaction, user experience, and communication with the VitaMind backend. Sensitive business logic, AI orchestration, authorization, and data access remain backend responsibilities.

---

## Application Architecture

```text
┌──────────────────────┐
│        User          │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  VitaMind Frontend   │
│      Next.js         │
└──────────┬───────────┘
           │ HTTPS / API
           ▼
┌──────────────────────┐
│   VitaMind Backend   │
│       NestJS         │
├──────────────────────┤
│ Authentication       │
│ Authorization        │
│ Business Logic       │
│ AI Services          │
│ Agent Orchestration  │
│ Tool Calling         │
│ Data Access          │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────┐
│ External Services / Database │
│ AI Providers / Data Sources  │
└──────────────────────────────┘
```

---

## Project Structure

```text
vitamind_frontend/
│
├── app/                    # Next.js application routes and pages
├── components/             # Reusable UI components
├── contexts/               # Global React contexts
├── hooks/                  # Reusable React hooks
├── lib/                    # Shared utilities and frontend services
├── public/                 # Static assets
│
├── AGENTS.md               # AI coding-agent instructions
├── next.config.ts          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── eslint.config.mjs       # ESLint configuration
├── postcss.config.mjs      # PostCSS configuration
└── package.json            # Dependencies and scripts
```

The architecture follows a modular approach so that UI components, application logic, reusable hooks, and shared utilities remain separated and maintainable.

---

## AI-Powered Experience

VitaMind uses AI-powered experiences while keeping the frontend and backend responsibilities clearly separated.

### Frontend Responsibilities

The frontend is responsible for:

- Conversational interfaces
- User input and interaction
- Assessment interfaces
- AI response presentation
- Loading and error states
- Conversation history
- Visual feedback and interaction states
- Responsive user experiences

### Backend Responsibilities

The backend is responsible for:

- AI provider communication
- Agent orchestration
- Tool calling
- Authentication and authorization
- Business logic
- Data access
- Validation
- Security-sensitive operations

### Tool Calling Architecture

```text
User Question
      │
      ▼
   Frontend
      │
      ▼
Backend / Agent Orchestrator
      │
      ▼
     LLM
      │
      │  Tool required?
      ▼
 Tool Call
(tool + parameters)
      │
      ▼
Backend Tool Router / Executor
      │
      ├──────────────► Database
      │
      ├──────────────► External API
      │
      └──────────────► Other Data Source
      │
      ▼
   Tool Result
      │
      ▼
     LLM
      │
      ▼
Final Response
      │
      ▼
   Frontend
```

**Core principle:**

> **The LLM decides. The backend controls and executes.**

The frontend should never be responsible for executing privileged tools or directly accessing protected data sources.

---

## Technology Stack

### Core

- **Next.js**
- **React**
- **TypeScript**

### UI & Styling

- **Tailwind CSS**
- **Radix UI**
- **Lucide React**
- **Iconify**

### Animation & Interaction

- **Framer Motion**
- **GSAP**

### Forms & Validation

- **React Hook Form**
- **Zod**

### Data Visualization & Real-Time

- **Recharts**
- **Socket.IO Client**

### 3D & Interactive Experiences

- **Three.js**
- **React Three Fiber**

---

## Language

The VitaMind frontend currently supports:

- **English**
- **Arabic**

The application is designed with bilingual support, including **right-to-left (RTL)** experiences for Arabic where applicable.

---

## Getting Started

### Requirements

Make sure the following are installed:

- Node.js
- npm
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/VitaMind-Labs/vitamind_frontend.git
```

Navigate to the project:

```bash
cd vitamind_frontend
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a local environment file:

```bash
cp .env.example .env.local
```

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Environment variables containing secrets or private credentials must never be committed to the repository.

---

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

## Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

---

## Code Quality

Run the linter:

```bash
npm run lint
```

Before opening a pull request, verify:

- TypeScript errors are resolved
- ESLint passes
- Components remain reusable
- API responsibilities remain separated from UI responsibilities
- Sensitive logic stays on the backend
- English and Arabic interfaces remain consistent
- Arabic RTL behavior is preserved where applicable
- Loading, error, and empty states are handled

---

## Design Principles

VitaMind follows a human-centered product philosophy.

### Human-Centered

Interfaces should feel supportive, understandable, and respectful.

### Calm

Visual design should avoid unnecessary visual noise and create a reassuring experience.

### Clear

Information hierarchy should make important information easy to understand.

### Accessible

Interfaces should remain usable across different devices, screen sizes, and interaction needs.

### Consistent

Components, spacing, typography, colors, interactions, and states should follow a coherent design system.

### Responsible AI

AI should support the user and healthcare professionals without presenting itself as a replacement for qualified clinical care.

---

## Development Guidelines

When contributing to the frontend:

- Prefer reusable components over duplicated UI
- Keep components focused on a single responsibility
- Extract repeated logic into custom hooks
- Keep API communication separated from presentation components
- Avoid placing sensitive business logic in the frontend
- Use TypeScript types consistently
- Validate user input
- Handle loading, error, and empty states
- Preserve accessibility
- Preserve English/Arabic support and RTL behavior
- Follow the existing design system before introducing new patterns

---

## Git Commit Convention

Use clear and consistent commit prefixes:

```text
feat:     New functionality
fix:      Bug fix
refactor: Code restructuring
style:    UI or formatting changes
docs:     Documentation
chore:    Maintenance
```

Examples:

```text
feat: add patient assessment interface
fix: resolve Arabic RTL layout issue
refactor: extract reusable assessment components
docs: update frontend architecture
```

---

## VitaMind Ecosystem

The frontend is part of a larger VitaMind ecosystem:

```text
                    VitaMind Ecosystem
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
   Patient Frontend   Professional UI   Administration
      Next.js            Next.js           Next.js
          │                │                │
          └────────────────┼────────────────┘
                           │
                           ▼
                    VitaMind Backend
                        NestJS
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
        AI Services    Data Layer    External APIs
```

---

## Project Status

**Status: Active Development**

The frontend architecture and product experience are continuously evolving as VitaMind's AI, clinical, and professional workflows are developed.

---

## Repository

**GitHub:** `VitaMind-Labs/vitamind_frontend`

VitaMind Labs — Building a more continuous, human-centered mental health experience.

---

## License

This project is maintained by **VitaMind Labs**.

All rights reserved.
