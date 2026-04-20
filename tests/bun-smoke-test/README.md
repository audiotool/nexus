# Bun Smoke Test

A simple smoke test that verifies the `@audiotool/nexus` package works with Bun and PAT authentication.

## What it tests

1. Creating an Audiotool client with PAT authentication
2. Creating a project
3. Opening the project for real-time sync
4. Adding a tonematrix device
5. Querying entities
6. Stopping sync
7. Deleting the project (cleanup)

## Running

```bash
bun run index.ts
```

## Expected output

```
Creating Audiotool client with PAT...
Client created successfully!

Creating project 'foo'...
Project created: projects/...

Opening project for real-time sync...
Starting sync...
Sync started!

Creating tonematrix...
Tonematrix created with id: ...
Found 1 tonematrix(es) in project

Stopping sync...
Sync stopped!

Cleaning up: deleting project...
Project deleted!

✅ Smoke test passed!
```
