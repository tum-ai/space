# TUM.ai Space 🚀

## Overview

TUM.ai Space is an all-in-one platform that streamlines internal processes for member management, including:
- Development tracking
- Performance monitoring
- Project management
- Recruitment processes

### Problem Statement
Traditional systems face challenges with:
- Limited visibility into member achievements
- Fragmented tooling and systems
- Lack of scalability

### Solution
TUM.ai Space provides:
- Comprehensive oversight of stakeholder activities and projects
- Unified data management platform
- Extensible architecture for future growth

## Project Organization

Development is managed through [Linear](https://linear.app/tum-ai/project/tumai-space-5b8716e29acb). All tasks and issues are tracked here—please **do not use GitHub Issues for development tasks**.

### Linear Workflow

Follow these steps for ticket-based development:

1. Select and open your Linear ticket
2. Copy the branch name (branch icon in top left)
3. Create your local branch:
```bash
git switch -c <branch-name>
```

4. Set up remote tracking:
```bash
git push --set-upstream origin <branch-name>
```

## 🔧 Tech Stack

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![tRPC](https://img.shields.io/badge/tRPC-11.0-blue?style=flat-square)](https://trpc.io/)
[![Prisma](https://img.shields.io/badge/Prisma-5.20-blue?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-blue?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

### Repository Structure

```
space/
├── app/          # Next.js app router and pages
├── components/   # Reusable React components
├── lib/         # Utility functions and helpers
├── prisma/      # Database schema and migrations
├── providers/   # Context providers
├── public/      # Static assets
├── styles/      # Global styles
└── trpc/        # tRPC router and procedures
```


### Core Technology
- **Framework**: [Next.js](https://nextjs.org/) - React framework for production
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/) - Type-safe database access

### Frontend Architecture
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) - Simple, fast state management
- **Data Fetching**: [TanStack Query](https://tanstack.com/query) - Powerful async state management
- **UI Components**: 
  - [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
  - [Tremor](https://www.tremor.so/) - Advanced analytics components
  - [DND Kit](https://dndkit.com/) - Drag & drop functionality
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) - Type-safe form handling

### Backend Services
- **API Layer**: [tRPC](https://trpc.io/) - End-to-end typesafe APIs
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) - Flexible auth solutions
- **Communication**: [Resend](https://resend.com/) - Modern email infrastructure

## Development Guide

### Prerequisites

Required tools:

0. [Homebrew](https://brew.sh) (or other preferred package manager)
1. [Node + NPM](https://nodejs.org/en/download/package-manager)
2. [Docker + Docker Compose](https://docs.docker.com/get-docker/)
3. [Bun](https://bun.sh/docs/installation)

Recommended tools:
- [Micromamba](https://mamba.readthedocs.io/en/latest/micromamba-installation.html) or [Anaconda](https://docs.anaconda.com/free/anaconda/install/index.html)
- [Pyenv](https://github.com/pyenv/pyenv)
- [GPG for commit signing](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits)

### Initial Setup

0. Install [required tools](#Prerequisites)

1. Copy `.env` file to root directory

2. Install dependencies:
```bash
npm install
```
or 
```bash
bun install
```

### Database Setup

Setting up mock data for development:

1. Start local database:
```bash
docker-compose up
```

2. Setup authentication:
   - Launch the UI
   - Login via Slack
   - This creates initial user data

3. Initialize database schema:
```bash
npx prisma migrate dev
```

4. Generate mock data:
```bash
bun db:seed
```

### Additonal database commands:
```bash
bun prisma migrate reset    # Reset database
```

### Run Server

1. Start development server:
```bash
npm run dev:https  # Recommended for Slack authentication
```
or
```bash
npm run dev       # Standard HTTP server
```