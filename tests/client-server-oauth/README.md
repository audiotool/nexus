# Client/Server OAuth Example

This example demonstrates:
1. Browser-side OAuth authentication using `audiotool()`
2. Exporting tokens to the server using `exportTokens()`
3. Server-side API calls using `createServerAuth()` and `createNodeTransport()`

## Setup

```bash
npm install
```

## Running

Start both client and server:

```bash
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Client (Vite)
npm run dev:client

# Terminal 2 - Server (Express)
npm run dev:server
```

## Usage

1. Open http://127.0.0.1:5173/ in your browser
2. Click "Login with Audiotool" to authenticate
3. After login, click "Create Project on Server"
4. The server will:
   - Create a project called "bar"
   - Add a Heisenberg synth to it
   - Delete the project (cleanup)

## How it works

1. **Client (browser)**: Uses `audiotool()` for OAuth2 PKCE flow
2. **Client**: Exports tokens with `at.exportTokens()` and sends to server
3. **Server**: Uses `createServerAuth()` with the tokens + `createNodeTransport()`
4. **Server**: Makes API calls on behalf of the authenticated user
