---
title: Login
---

This package allows you read and modify projects of other users. To do that, it has to be authorized to make API calls on that user's behalf. This user can be you, or other users that use your app.
On this page we explain how you can authorize your app, so you and others can use it on their own projects.

For apps running in the browser, app authorization typically looks like this:

1. User presses "Login" on your page
2. User is shown a page on audiotool.com asking "This app requests to do xyz for you, Allow?"
3. User presses "Allow" and comes back to your page, now logged in

![Login Visual](./images/login-visual.png)

> [!NOTE]
> The login flow described here is intended for browser-based apps. For server-side apps, you can use [PAT-based authentication](./login.md#pat-based-authentication).

## Registering your application

Register your application on developer.audiotool.com/applications. Press "Create Application" and fill in the following details:

- Name/Description/Project URL - as you want
- Redirect URI: enter `https://127.0.0.1:5173/` for now, later your project's deployed URL
- scopes: `project:write` for creating a synced document

## Running your server on `127.0.0.1:5173`

We just set "redirectURI" to `http://127.0.0.1:5173/`. This is the URL that accounts.audiotool.com forwards the user back to after
they press allow. If you deploy your app to `foo.com`, you will have to add `https://foo.com/` to that list.

For security reasons, this URL can't be `localhost`. Instead, we have to configure the local dev server to host our app
under the `http://127.0.0.1:5173/`. In vite, you can do this as follows: Open `vite.config.ts` (or create it if it doesn't exist yet) and add the following:

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  ...
  server: {
    host: '127.0.0.1',
    ...
    port: 5173,
  },
})
```

## Checking if the user is logged in

To start the login flow, call {@link index.getLoginStatus}, which reports whether a user is currently logged in or not. If there is,
you can use the return value to authorize the {@link index.AudiotoolClient}, and modify projects on that user's behalf. If there is _not_,
you can't create an {@link index.AudiotoolClient} yet. For this reason, you should call this function early
and decide what you wan to show to the user if they're logged out.

The very first time that {@link index.getLoginStatus} is called, it will always report that no user is logged in. In that case, the return value
has a `login()` method that will start the login flow shown above: The user is forwarded to accounts.audiotool.com, where they can
press "Allow", and then return to your app. Once they return, the same {@link index.getLoginStatus} is executed again, this time reporting that a user is
logged in. Once a user is logged in, they stay logged in for days/weeks, until the `logout()` function is called again.

{@link index.getLoginStatus} takes the authorization information we entered on developer.audiotool.com/applications:

```ts
import { getLoginStatus } from "@audiotool/nexus"

const status = await getLoginStatus({
  clientId: "<client-id of your app>",
  redirectUrl: "http://127.0.0.1:5173/",
  scope: "project:write",
})

if (status.loggedIn) {
  console.debug("Logged in!!")
} else {
  console.debug("Not logged in.")
}
```

The return value has two variants - logged in and logged out. If it's logged in, you have a method `logout()`; if it's logged out, you have a method `login()`.

You should wire up these methods to buttons so the user can choose to login:

```ts
const createButton = (text: string, onClick: () => void) => {
  const button = document.createElement("button")
  button.innerHTML = text
  button.addEventListener("click", onClick)
  document.body.appendChild(button)
}

if (status.loggedIn) {
  createButton("Logout", () => {
    // will refresh the tab with authentication information removed
    status.logout()
  })
  console.debug("Logged in as", await status.getUserName())
} else {
  createButton("Login", () => {
    // will forward the user to accounts.audiotool.com
    status.login()
  })
}
```

If (and only if) the status is `loggedIn`, you can forward it to the {@link index.AudiotoolClient} to create an authorized client:

```ts
const client = createAudiotoolClient({
  authorization: status,
})
```

## Full example

```ts
import { createAudiotoolClient } from "@audiotool/nexus"
import { getLoginStatus } from "@audiotool/nexus"

const createButton = (text: string, onClick: () => void) => {
  const button = document.createElement("button")
  button.innerHTML = text
  button.addEventListener("click", onClick)
  document.body.appendChild(button)
}

// get current login status
const status = await getLoginStatus({
  clientId: "bd496109-d9b4-4b6a-8519-8b6ce88b58c5",
  redirectUrl: "http://127.0.0.1:5173/",
  scope: "project:write",
})

//  Check if user if logged in, create login/logout buttons
if (status.loggedIn) {
  console.debug("Logged in as", await status.getUserName())
  createButton("Logout", () => status.logout())
  const client = createAudiotoolClient({authorization: status})
  ...
} else {
  console.debug("Logged out.")
  createButton("Login", () => status.login())
}
```

## Deploying your app

To deploy your app, you need to update the `redirectUrl` so that the user is redirected to your page's URL rather than `http://127.0.0.1:5173/`. To do this:

- add that (entire) URL as "redirectURI" on your app at developer.audiotool.com/applications
- when calling `getLoginStatus`, pass that URL as `redirectUrl`

## Troubleshooting

- make sure the `redirectURL` matches the `redirectURI` you specified on developer.audiotool.com/applications _exactly_ - pay attention in particular to the `/` character in the end.
- if you get `insufficient_permissions` error even if logged in, the "Scopes" you set in your app & pass to {@link index.getLoginStatus} are likely insufficient for the API calls you're trying to make.
  The `projects:write` scope we use in the example above grants access to create and modify projects, but for other API calls, other scopes are needed. We're working on documentation in that regard.

  If you need more scopes, update your app on developer.audiotool.com/applications, and then pass the scopes to {@link index.getLoginStatus}, separated by spaces. Already logged in users
  have to be logged out & in again for the new scopes to take effect. If your app is already deployed and users are already logged in, consider creating a new application on developer.audiotool.com/applications
  so all users are automatically logged out again. We'll make this process smoother at some point.

- for more issues and questions, join our discord: https://discord.gg/5Cde4Zvret

> [!NOTE]
> Client ID, scopes, and redirect URIs can safely be:
>
> - hard-coded into your app
> - checked into git
> - sent to your users' browsers
> - shared with friends and foes
>
> Only websites at the redirect URIs you specify for your app on developer.audiotool.com can use it to authorize their apps.

## Advanced

### PAT-based authentication

For server-side apps that you don't plan to ever share with other users, you can also use a [Personal Access Token](https://developer.audiotool.com/personal-access-tokens) and pass that into the audiotool client:

```ts
const client = createAudiotoolClient({
  authorization: "at_pat_238u098i23...",
})
```

> [!WARNING]
> The PAT grants full access to your **entire audiotool account**. Never share it with others or check it into git!!

### Rolling your own OAuth flow

You can implement the token exchange with accounts.audiotool.com yourself. The `authorization` argument of {@link index.createAudiotoolClient} is `string | { getToken(): Promise<string | Error>}`. You can use the second variant to pass in your token, potentially refreshing it before it's used.

We will publish the source code of {@link index.getLoginStatus} soon.

### Using credentials in your own network calls

If you'd like to make your own calls to our API and just use the {@link index.getLoginStatus} mechanism to authorize the user, you can configure your {@link fetch} call as follows:

```ts
fetch(apiUrl, {
  // must omit credentials, otherwise you get a CORS error
  credentials: "omit",
  headers: {
    // pass the token through the authorization header
    authorization: await status.getToken(),
  },
})
```
