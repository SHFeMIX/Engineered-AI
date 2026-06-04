---
title: "Introducing organizations for Cursor Enterprise · Cursor"
site: "Cursor"
published: "2026-06-03T12:00:00.000Z, 2026-06-03T12:00:00.000Z"
source: "https://cursor.com/blog/organizations"
domain: ""
language: "en-US"
word_count: 718
---

# Introducing organizations for Cursor Enterprise · Cursor

Large enterprises are often made up of many business units, subsidiaries, and functions. We frequently hear from customers that each of these units needs its own budget, security, governance, and feature controls.

To support these requirements, we’re introducing organizations, a new structure that allows enterprises to manage multiple Cursor teams from one place. With it, admins can set separate budgets for different teams, enable different models for different cohorts of users, create sandbox environments to test new features, and view usage analytics across the whole company, all from one dashboard.

These capabilities are now generally available to all [Enterprise](https://cursor.com/enterprise) customers.

## How the structure works

An organization is the top-level container for your company’s identity, administration, and membership. This gives admins one place to view and manage their entire Cursor configuration.

Under organizations are teams, the operating unit for a department or subsidiary. Admins previously managed Cursor at this level. We’ve now taken this unit and moved it under the organization so you can run multiple teams, each with its own security, spend, and feature settings. For current customers, your existing team setup is preserved. Admins can create new teams with separate configurations at the organization level.

Groups are a lightweight collection of users that can sit across or within teams. They give cohorts of users separate model access, spend limits, and agent permissions without standing up a whole new team. When a user belongs to multiple teams or groups, the most permissive setting wins.

![Diagram of an organization containing multiple teams, with groups of users spanning across and within those teams](https://cursor.com/marketing-static/\_next/image?url=https%3A%2F%2Fptht05hbb1ssoooe.public.blob.vercel-storage.com%2Fassets%2Fblog%2Fent-org-arch-4-light.png&w=1920&q=70)

Diagram of an organization containing multiple teams, with groups of users spanning across and within those teams

At Cursor, we've created separate teams for different departments. Engineering and product teams have the most permissive network access and the ability to let agents run commands automatically. Sales, marketing, and finance have tighter security controls, especially when it comes to agents accessing production systems.

## Enterprise use cases

There are a few common patterns we've seen from customers using these new capabilities in beta.

**Sandboxing to test new features**

Many customers with strict security review requirements have set up a staging team that gets early access to new Cursor features. These users test features in a sandboxed environment before they are rolled out more broadly to the full company.

Because a user can belong to more than one team, engineers can work in their production team while retaining testing team capabilities without having to create a second Cursor account.

\> We have set up a separate staging team that tries out new Cursor features before they are released broadly to all our engineers. We have another team where agents can run commands on auto-run without manual approval. Keeping those environments distinct under one organization lets us move quickly and adopt new capabilities without sacrificing control.

Wendy Tang

Staff Software Engineer, AI Solutions Engineering, NVIDIA

**Segmenting model access, budgets, and agent permissions**

Some customers are segmenting model access and budgets across functions. Users in engineering, product, and design functions get access to every frontier model, including more expensive offerings with fast mode, and higher monthly budgets.

Users in non-product functions like marketing or finance have restricted model access, lower budgets, and tighter restrictions on whether agents can run commands without manual approval.

**See detailed usage analytics across every team**

The organization dashboard rolls up [spend and token usage](https://cursor.com/docs/account/teams/analytics) across every team in one view. Filter by team, user, service account, or cloud agent to see where usage comes from. Team admins keep a scoped view of their own team, which supports chargebacks by business unit or cost center.

### Manage identity and membership at scale

With this structure, customers set up their [identity provider](https://cursor.com/docs/account/teams/sso) and [SCIM directory source](https://cursor.com/docs/account/teams/scim) once at the organization level. They can then re-use the same cohorts from these tools to create teams and groups in Cursor, ensuring that membership always stays in sync.

Admins can move users between teams through the dashboard, [API](https://cursor.com/docs/account/organizations/organization-admin-api), or CSV. And when a new user joins a team, settings and permissions apply automatically.

## What's next

We’re continuing to add better policy controls, easier onboarding, SCIM-driven assignment, and simpler ways to manage subsets of users without forcing every workflow into separate teams.

Read more detail on how organizations, teams, and groups work in [our docs](https://cursor.com/docs/enterprise/organizations). Please [reach out to our team](https://cursor.com/contact-sales?source=organizations-blog) if you'd like to learn more or have questions.
