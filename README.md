# AudioScribe

AudioScribe is a modern web application built with Next.js for transcribing audio files. It provides an intuitive interface for uploading audio files, viewing and editing transcripts, and interacting with AI-powered features for analysis and insights.

## Features

- 🎵 **Audio Upload**: Drag-and-drop or click to upload audio files
- 📝 **Transcript Editor**: Edit transcript segments and speaker names
- 🎨 **Dark/Light Mode**: Theme switching support
- 🤖 **AI Features**: Summary, insights, and chat functionality
- 🎧 **Audio Player**: Built-in audio player with playback controls
- 💾 **Export**: Download transcripts as text files

## Prerequisites

Before setting up AudioScribe, ensure you have the following installed on your system:

- **Node.js**: Version 18.0 or higher ([Download Node.js](https://nodejs.org/))
- **pnpm**: Package manager (install via `npm install -g pnpm` or follow [pnpm installation guide](https://pnpm.io/installation))

## Setup Instructions

### 1. Clone the Repository

If you haven't already, clone or navigate to the project directory:

```bash
cd audioscribe
```

### 2. Install Dependencies

Install all project dependencies using pnpm:

```bash
pnpm install
```

This command will:
- Read the `package.json` file
- Install all dependencies listed in `dependencies` and `devDependencies`
- Create a `node_modules` directory with all required packages
- Generate/update the `pnpm-lock.yaml` file for consistent installs

### 3. Run the Development Server

Start the Next.js development server:

```bash
pnpm dev
```

The application will be available at:
- **Local**: http://localhost:3000
- **Network**: The terminal will display the network URL if accessible

### 4. Build for Production

To create an optimized production build:

```bash
pnpm build
```

### 5. Start Production Server

After building, start the production server:

```bash
pnpm start
```

### 6. Run Linting

To check code quality and catch potential issues:

```bash
pnpm lint
```

## Project Structure

```
audioscribe/
├── app/                    # Next.js app directory
│   ├── editor/            # Editor page for transcript editing
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home/upload page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── theme-provider.tsx
│   ├── theme-toggle.tsx
│   └── debug-toggle.tsx
├── lib/                   # Utility functions
│   └── utils.ts          # Helper functions (cn utility)
├── public/               # Static assets
└── package.json          # Project dependencies and scripts
```

## Package Dependencies

### Core Framework Packages

These are the essential packages that form the foundation of the application:

- **next** (`16.0.1`): React framework for production with server-side rendering, static site generation, and API routes
- **react** (`19.2.0`): JavaScript library for building user interfaces
- **react-dom** (`19.2.0`): React package for DOM manipulation and rendering

### UI Component Libraries

#### Radix UI Primitives
- **@radix-ui/react-dialog** (`^1.1.15`): Accessible dialog/modal component. Used for speaker rename dialogs and other modal interactions. Provides keyboard navigation, focus management, and ARIA attributes out of the box.

- **@radix-ui/react-slot** (`^1.2.4`): Composition utility that allows components to merge props and behavior. Essential for building flexible, composable UI components like buttons that can render as different HTML elements.

- **@radix-ui/react-tabs** (`^1.1.13`): Accessible tabs component. Used in the editor page for switching between Summary, Insights, and Chat views. Handles keyboard navigation and ARIA states automatically.

#### shadcn/ui Utilities
- **class-variance-authority** (`^0.7.1`): Utility for creating component variants with TypeScript support. Used to define button variants (default, outline, ghost, etc.) and other component style variations in a type-safe manner.

- **clsx** (`^2.1.1`): Lightweight utility for constructing className strings conditionally. Allows dynamic class name generation based on props and state.

- **tailwind-merge** (`^3.3.1`): Intelligently merges Tailwind CSS classes, resolving conflicts by keeping the last conflicting class. Used in the `cn()` utility function to combine and override Tailwind classes safely.

### Icon Library

- **lucide-react** (`^0.552.0`): Beautiful, consistent icon library for React. Provides all icons used throughout the application (UploadCloud, FileAudio, Play, Pause, Save, etc.) as React components with customizable size and color.

### Theme Management

- **next-themes** (`^0.4.6`): Theme provider for Next.js that enables dark/light mode switching. Handles system theme detection, theme persistence in localStorage, and prevents flash of incorrect theme on page load. Used in the ThemeProvider component.

### Development Dependencies

#### TypeScript
- **typescript** (`^5`): TypeScript compiler for type checking and compilation
- **@types/node** (`^20`): TypeScript type definitions for Node.js APIs
- **@types/react** (`^19`): TypeScript type definitions for React
- **@types/react-dom** (`^19`): TypeScript type definitions for React DOM

#### Styling
- **tailwindcss** (`^4`): Utility-first CSS framework for rapid UI development
- **@tailwindcss/postcss** (`^4`): PostCSS plugin for Tailwind CSS v4
- **tw-animate-css** (`^1.4.0`): Additional animation utilities for Tailwind CSS

#### Code Quality
- **eslint** (`^9`): JavaScript and TypeScript linter for identifying and fixing code issues
- **eslint-config-next** (`16.0.1`): ESLint configuration optimized for Next.js projects

## Key Utilities

### `cn()` Function

Located in `lib/utils.ts`, this utility combines `clsx` and `tailwind-merge` to safely merge Tailwind CSS classes:

```typescript
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Usage example:
```typescript
<Button className={cn("base-class", isActive && "active-class")} />
```

## Browser Support

AudioScribe works best on modern browsers that support:
- ES2017+ JavaScript features
- CSS Grid and Flexbox
- HTML5 Audio API
- Local Storage

Recommended browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, Next.js will automatically try the next available port. Alternatively, specify a different port:

```bash
pnpm dev -- -p 3001
```

### Dependency Installation Issues

If you encounter issues installing dependencies:

1. Clear pnpm cache:
   ```bash
   pnpm store prune
   ```

2. Delete `node_modules` and `pnpm-lock.yaml`:
   ```bash
   rm -rf node_modules pnpm-lock.yaml
   ```

3. Reinstall:
   ```bash
   pnpm install
   ```

### TypeScript Errors

If you see TypeScript errors after installation:

1. Restart your TypeScript server in your IDE
2. Ensure all dependencies are installed: `pnpm install`
3. Check that your Node.js version is 18.0 or higher

## Contributing

When contributing to this project, please ensure:

1. All dependencies are installed (`pnpm install`)
2. Code passes linting (`pnpm lint`)
3. TypeScript compiles without errors
4. Follow the existing code style and patterns

## License

[Add your license information here]

## Support

For issues, questions, or contributions, please [add your contact/support information here].

