---
title: FAQ
---

## What is Nexus?

One way to think of the Audiotool DAW is as an editor of audiotool project files: You're interacting with visual elements such as knobs, devices, mixer strips and regions, but all these elements could be considered an "intuitive representation" of the underlying data that makes up an audiotool project file, which is made up of numbers instead of knobs, pointers instead of cables, data points instead of notes.

The goal of anyone working on Audiotool is to make a song. The audio coming out of audiotool is produced by the audio engine, a separate piece of software from the visual editor. The audio engine consumes the very same project data that is modified with the editor, and based on that data, generates the sound.

So in a way, the DAW could be considered an editor for a datastructure that is sent to the audio engine to turn into audio.

Since audiotool is collaborative, we need to sync these project states in real time between clients. Hence, we had to invent a communication protocol that allows the DAW to communicate the changes that the user makes efficiently to our server, which can then forward it to other clients so they can update their project state in turn. We were able to use this very same protocol for the frontend to update the audio engine.

"Nexus" describes the broad system that makes all of this possible. It includes the schema definition of audiotool project files; the communication protocol needed to inform the server and the audio engine of changes; and the server implementation that lets multiple DAW clients talk to each other.

To build a nexus app means to create a new client just like the DAW that talks to our server, communicating changes on the audiotool project datastructure. You can build apps that participate in a collaborative audiotool session in just the same way our DAW does, and create, modify or delete arbitrary parts of an audiotool project.

Instead of waiting for us to build your new:

- instrument, note track, automation generator
- new UI to interact with audiotool
- integration into 3rd party (AI?) services

You can build that all by yourself - write an app, join a collab session, and use the result to continue working in our DAW!

## What is this JS package?

The Nexus API definition is written in [protocol buffer](https://protobuf.dev/), a DSL allowing expression of
language-independent messages, which can then be turned to bindings in your language of choice using,
for example, [buf build plugins](https://buf.build/plugins/protobuf).

Building a fully-fledged client that syncs in real time takes a bit of effort. The JS package thus wraps the API definition files in easy-to-use abstractions and implements the syncing mechanism so users don't have to implement it themselves.

It's copied out from our DAW codebase.

## Where can the JS package run? What kind of apps can I build with this?

The JS package is built to run in a multitude of environments. We haven't gotten around to making integration tests for all popular platforms, so things might not always work, but it's worth trying, and we definitely target to support:

- Chrome and Firefox
- [Node.js](https://nodejs.org/en), [bun](https://bun.com/) and [deno](https://deno.com/)

The first two allow you to build websites that anyone with a browser can use.

The second two should give you a path to use the package on your server or as part of your native application or app.
You could build your UI with a different language or provide a simple CLI.

## Do I need programming experience to create Nexus apps?

You do not!! We've had people who've never written a line of code in their life have great success coding using LLMs.

One way to get started is to download the [cursor editor](https://cursor.com/), open the chat window, and enter the promps:

```
I'd like to build a nexus app using https://developer.audiotool.com/js-package-documentation. The app should do .... Build it for me.
```

## How can I share my app with other users?

Currently, the easiest way is to:

- build a website with it
- connect it to the [OIDCFlow](./login.md), so others can use it
- publish it on the web, e.g. using [Github Pages](https://docs.github.com/en/pages)
