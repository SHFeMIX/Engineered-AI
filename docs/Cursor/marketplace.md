---
title: "Extend Cursor with plugins · Cursor"
site: "Cursor"
published: 2026-02-17T00:00:00.000Z, 2026-02-17T00:00:00.000Z
source: "https://cursor.com/blog/marketplace"
domain: "cursor.com"
language: "en-US"
word_count: 468
---

# Extend Cursor with plugins · Cursor

Cursor now supports plugins, allowing agents to connect to external tools and learn new knowledge. Plugins bundle capabilities like MCP servers, skills, subagents, rules, and hooks that extend agents with custom functionality.

We’re starting with a highly curated set from partners such as Amplitude, AWS, Figma, Linear, and Stripe. These plugins span the product development lifecycle, allowing Cursor to deploy services, implement payments, run advanced testing, and more.

You can discover and install prebuilt plugins on the [Cursor Marketplace](https://cursor.com/marketplace) or create your own and [share them](https://cursor.com/marketplace/publish) with the community.

![Plugins spanning the full development lifecycle](https://cursor.com/marketing-static/_next/image?url=https%3A%2F%2Fptht05hbb1ssoooe.public.blob.vercel-storage.com%2Fassets%2Fblog%2Fmarketplace-20-logos-light-final.png&w=1920&q=70)

Plugins spanning the full development lifecycle

### Plugins for the full development lifecycle

Plugins allow Cursor to more effectively use the tools your team already relies on. This lets you orchestrate the entire product development lifecycle in the same place you generate code.

#### Plan and design

Access issues, projects, and documents with the [Linear plugin](https://cursor.com/en-US/marketplace/linear).

Translate designs into code with the [Figma plugin](https://cursor.com/en-US/marketplace/figma).

#### Subscriptions and payments

Build payment integrations with the [Stripe plugin](https://cursor.com/en-US/marketplace/stripe).

> The Stripe plugin lets Cursor understand how Stripe integrations should be built. It created the products, prices, and payment link using Stripe's APIs, then shipped a working app almost immediately. It's a much faster way to build and test Stripe integrations.

Gus Nguyen

Senior Software Engineer, Stripe

#### Services and infrastructure

Deploy and manage infrastructure in Cursor with the [AWS](https://cursor.com/en-US/marketplace/aws), [Cloudflare](https://cursor.com/en-US/marketplace/cloudflare), and [Vercel](https://cursor.com/en-US/marketplace/vercel) plugins.

> Cursor now knows our React best practices and can deploy to preview or production directly from the editor.

Elliot Dauber

Software Engineer, Vercel

#### Data and analytics

Query production data and surface insights with the [Databricks](https://cursor.com/en-US/marketplace/databricks), [Snowflake](https://cursor.com/en-US/marketplace/snowflake), [Amplitude](https://cursor.com/en-US/marketplace/amplitude), and [Hex](https://cursor.com/en-US/marketplace/hex) plugins.

> With the Amplitude plugin, Cursor can pull in rich behavioral context, analyze growth dashboards, synthesize customer feedback, and turn those insights into concrete recommendations. I can even have Cursor draft a PR immediately.

Frank Lee

Principal Product Manager, Amplitude

### Build and share your own plugins

You can also build your own plugins and share them on the Cursor Marketplace. A plugin combines one or more primitives that agents use to execute tasks:

- [Skills](https://cursor.com/docs/context/skills): domain-specific prompts and code that agents can discover and run
- [Subagents](https://cursor.com/docs/context/subagents): specialized agents that allow Cursor to complete tasks in parallel
- [MCP servers](https://cursor.com/docs/context/mcp): services that connect Cursor to external tools or data sources
- [Hooks](https://cursor.com/docs/agent/hooks): custom scripts that let you observe and control agent behavior
- [Rules](https://cursor.com/docs/context/rules): system-level instructions to uphold coding standards and preferences

We’re accepting [plugin submissions](https://cursor.com/marketplace/publish) and look forward to seeing what the community builds. We’ve also published some Cursor-built plugins. Check out the [Cursor Team Kit](https://cursor.com/marketplace/cursor/cursor-team-kit) to install our favorite internal workflows for CI, code review, and testing.

### Coming soon

We're working on private team marketplaces so organizations can share plugins internally with central governance and security controls.

Learn more about plugins in our [docs](https://cursor.com/docs/plugins).