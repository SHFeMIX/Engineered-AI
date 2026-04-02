---
title: "Role Based Access Control (RBAC) for LangSmith"
site: "LangChain Blog"
published: 2024-05-08T15:30:00.000Z
source: "https://blog.langchain.com/access-control-updates-for-langsmith/"
domain: "blog.langchain.com"
language: "en"
word_count: 506
---

# Role Based Access Control (RBAC) for LangSmith

Access management can be a pain for large engineering teams as they build LLM applications. To avoid playing a game of whodunit or over/under-provisioning permissions, you need to systematically determine who can access your resources and to what capacity.

LangSmith now has new Access Control features to help enterprises manage access to their resources. This includes **Role Based Access Control (RBAC)**, which lets you specify custom roles and can better support users with limited permissions via API Keys.

## Role Based Access Control (RBAC)

💡

RBAC is currently only accessible for teams on the Enterprise plan. For more plan details, check out our [pricing page](https://www.langchain.com/pricing?ref=blog.langchain.com).

With Role Based Access Control (RBAC), administrators can now assign roles to users within their workspace or organization. Each role represents a group of permissions. By default, there are three built-in system roles:

- `Admin` - has full access to all resources within the workspace or organization
- `Viewer` - has read-only access to all resources within the workspace or organization
- `Editor` - has full permissions except for workspace management (adding/removing users, changing roles, configuring service keys)

A [workspace](https://docs.smith.langchain.com/concepts/admin?ref=blog.langchain.com#workspaces) logically groups together users and resources in an organization and will be [coming soon](https://docs.smith.langchain.com/how_to_guides/setup/set_up_workspace?ref=blog.langchain.com) to LangSmith. This will add another layer of separation between the project and organization, helping isolate relevant resources to the right folks. For now, you can consider a workspace and organization to be equivalent concepts.

![](https://blog.langchain.com/content/images/2024/05/Screenshot-2024-05-07-at-4.57.30-PM.png)

Administrators can also create/edit custom roles with granular permissions on each set of LangSmith entities within a workspace or organization. This lessens the risk to vulnerabilities by reducing the surface area of what users can touch, such that users have just the permissions necessary to perform their job functions and critical tasks.

![](https://blog.langchain.com/content/images/2024/05/Screenshot-2024-05-08-at-2.07.59-PM.png)

Get started with Role Based Access Control by [following these docs.](https://docs.langchain.com/langsmith/user-management?ref=blog.langchain.com)

## API Key Updates

To better support access control, there are now two types of API Keys: **Personal Access Tokens** and **Service Keys**.

![](https://blog.langchain.com/content/images/2024/05/Screenshot-2024-05-07-at-4.56.08-PM.png)

All users can create personal access tokens. Personal Access Tokens are attached to the user who creates them. These keys will have the same permissions as the user. Note that if a user is deleted from an organization, their personal access tokens will also be deleted. These keys are meant to be used by users when talking to the LangSmith API. These PATs are especially useful for users who cannot configure service keys, ensuring that non-admins can still access LangSmith via the API.

Service Keys are keys that act as service principals. These keys are granted administrator privileges and are meant to to be used by services that want to talk to the LangSmith API. (Additional permission configuration will be coming soon). Since these keys are associated with a service, they will not be impacted by organizational changes like users leaving. Only workspace admins will be able to create service keys.

[Read the docs](https://docs.smith.langchain.com/how_to_guides/setup/create_account_api_key?ref=blog.langchain.com) to get started with our new API keys.

Old
```
ls__
```
API keys have been migrated to service keys. Note that we will be removing support for these
```
ls__
```
API keys on July 1st, 2024
