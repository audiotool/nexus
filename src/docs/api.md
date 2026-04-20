---
title: API
---

Next to syncing audiotool documents, the package provides bindings to a subset of APIs from the audiotool platform. The APIs are auto generated from [our proto files](https://developer.audiotool.com/explore-protobufs), wrapped in our own client called {@link api.RetryingClient}.

The APIs are available directly on the client:

```ts
const client = await createAudiotoolClient({ ... })
const projects = await client.projects.listProjects({})
const users = await client.users.getWhoami({})
```

Since the types are auto-generated, they're a bit hard to read. The type:

```ts
createProject: {
  I: typeof CreateProjectRequest
  kind: Unary
  name: "CreateProject"
  O: typeof CreateProjectResponse
}
```

denotes a method taking {@link api.CreateProjectRequest} and returning {@link api.CreateProjectResponse}, simple objects. Your editor will help.

## Available Services

| Client Property | Service | Description |
|-----------------|---------|-------------|
| `client.projects` | {@link api.ProjectService} | List, create, update, delete projects |
| `client.projectRoles` | {@link api.ProjectRoleService} | Manage collaborators on projects |
| `client.users` | {@link api.UserService} | List, delete, update users |
| `client.samples` | {@link api.SampleService} | Upload, download, manage samples |
| `client.presets` | {@link api.PresetUtil} | Get and apply device presets |
| `client.audioGraph` | {@link api.AudiographService} | Get audio graphs (waveforms) |

## Cheat sheet

**`client.projects`** ({@link api.ProjectService}):

- list projects
- create, update and delete projects
- list "collab sessions" (i.e. DAW clients) connected to a project

**`client.samples`** ({@link api.SampleService}):

- create, update, delete sample objects (sample metadata)
- download a sample using the name in the {@link entities.Sample} entity
- upload new samples to the backend

**`client.projectRoles`** ({@link api.ProjectRoleService}):

- list, add, remove users to your project as collaborators

**`client.users`** ({@link api.UserService}):

- list, delete, update users
- upload user avatars

**`client.audioGraph`** ({@link api.AudiographService}):

- get audio graphs (vector graphics used in the sample browser)

**`client.presets`** ({@link api.PresetUtil}):

A wrapper around the preset's API. Presets are device configurations that can be applied to existing devices to create a specific sound/effect. You can copy preset ids in the preset browser in the DAW:

![Right Click To Get Preset Id](./images/copy-preset-id.png)
