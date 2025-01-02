# Welcome to React Router App with Payload CMS Authentication

A modern, production-ready template for building full-stack React applications using React Router and Payload for the Backend connected to SQLite DB

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)
- [Authentication with Payload CMS] (https://payloadcms.com/)

## Getting Started

Setup payload server see more information in the associated Payload Project

## Payload Authentication & Session Management

This template implements authentication using Payload CMS as the backend service. The authentication flow includes:

- **Session Management**: Uses HTTP-only cookies with a `payload-token` for secure session handling
- **User Operations**:
  - Login (`/login`)
  - Registration (`/register`)
  - Logout
  - Session persistence

### Authentication Flow

The authentication is handled through the following utilities in [`app/utils/payload-helper.ts`](app/utils/payload-helper.ts):

````typescript
// Check if user is authenticated
const user = await checkUser(request);

// Login user
const loginResp = await loginUser(request, {
  email: "user@example.com",
  password: "password"
});

// Register new user
const registerResp = await createUser(
  email,
  username,
  password,
  firstName,
  lastName
);

// Logout user
const logoutResp = await logoutUser(request);

### Installation

Install the dependencies:

```bash
npm install
````

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
