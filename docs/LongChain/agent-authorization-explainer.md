---
title: "Securing your agents with authentication and authorization"
site: "LangChain Blog"
published: 2025-10-13T21:12:15.000Z
source: "https://blog.langchain.com/agent-authorization-explainer/"
domain: "blog.langchain.com"
language: "en"
word_count: 1555
---

# Securing your agents with authentication and authorization

Lately, every company has been rushing to build agents. And unlike the AI applications of years before, agents aren’t limited to chat. Agents are notable because they can take action; they can fetch files, send messages, call tools and update records — which makes the stakes higher and warrants a more thoughtful approach to securing them.

### Access Control Primer

To access sensitive data and use tools, agents need to be authenticated and authorized. While often used interchangeably, the two terms have distinct meanings:

- Authentication (AuthN): verifies *who* you are. When accessing data, your agent needs to have a distinct identity from all the other users or applications that also want access.
- Authorization (AuthZ): determines *what you can do*. Your agent should have limits on what data it can access or what actions it can take.

Authentication and authorization (collectively referred to as “auth”) are relevant to all types of applications, not just agents. To that end, there are existing frameworks like OAuth 2.0 to facilitate AuthN/Z. Many identity providers today have built extensive services on top of OAuth 2.0 to allow developers to implement access control in their applications. However, compared to the applications served by existing solutions, agents have some unique attributes that make it useful to create additional constructs for access.

### What Makes Agents Different?

The biggest distinctions between agents and traditional applications are:

1. Compared to most applications, agents will need to access an extremely large number of services and tools.
2. Agents are dynamic, and have significantly more fluid access needs.
3. Agents are more complex to audit than traditional applications.

Each of these new attributes comes with new considerations for agent authentication and authorization. We break them down below.

**1\. Agents will need to access an extremely large number of services and tools:**

- Common constructs will be useful to standardize tool access from agents
- A standardized interface abstracting common OAuth 2.0 flows will simplify giving agents access to the data they need

**2\. Agents having significantly more fluid access needs:**

- Traditional applications have structured access needs, where the scope of the application’s behavior is well defined. This means access controls can afford to be simpler, mainly checking if a user is allowed to consent to whatever permissions the app is requesting.
- Agent behavior is nondeterministic, not well-defined. The correct level of access may be heavily context dependent, which can make it useful to set rules like “Agent A is never allowed to request consent for permission A” or “Agent B must request consent each time permission C is needed”

**3\. Agents are more complex to audit than traditional applications:**

- Due to the number of services agents can access, audit logs may be spread across many providers
- Each call to an agent may involve many services and actions, which makes individual access trajectories more difficult to interpret
- Agents benefit more from a centralized location to track audit events and analyze access patterns

Taken together, these considerations form the shape of a centralized framework to manage agent authentication and authorization. It should consolidate auditable events and allow flexible rule configurations to match the dynamic access needs of agents. In essence, an auth server for agents.

### An Agent Auth Server

What might such an auth server look like? We could draw inspiration from existing paradigms for human access, such as Role Based Access Control (RBAC) or Just in Time (JIT) access.

RBAC is an access control mechanism that grants humans access to resources based on their role. Instead of tying permissions to a particular user’s identity, the permission is tied to the role the user holds (i.e. administrator). Roles can be granted and removed from users to dynamically adjust their access based on changing conditions, which can help fulfill the fluid access needs of agents.

JIT access is a security principle where users are granted temporary, privileged access to systems or resources only when needed, for a limited time. For agents, JIT access could be an effective method to allow agents to do powerful things while minimizing potential security risks.

By consolidating agent auth through a single service, access to tools and resources can be centralized and standardized. The server could consolidate disparate audit events, and organize them for easier review.

While some of these components are still being built, that doesn’t mean you, as a developer, cannot build authentication and authorization into your agents today. The foundational frameworks of auth, like OAuth 2.0, can still be used to secure your individual agentic applications.

### Agent AuthN and AuthZ Today

Though agents bring new challenges, at a high level they share many similarities with traditional applications. At their core, they’re pieces of software that want access to resources. Most modern applications today use the OAuth 2.0 framework for authorization and the OIDC framework built on top of OAuth 2.0 for authentication. Agents can also effectively use these standards.

However, OAuth 2.0 covers a lot of ground, and not all flows will be relevant for the agents you build. Access patterns can be broadly broken into two categories: Delegated Access and Direct Access

|  | Delegated Access | Direct Access |
| --- | --- | --- |
| Definition | The agent needs to access a resource on behalf of a user | The agent needs to access a resource without user involvement |
| Agent Types | Useful for agents dedicated to fulfilling human requests OR agents reliant on human oversight | Useful for ambient agents, which can trigger off events, or agents conducting autonomous processes |
| Benefits | Delegated access allows you to limit your agent’s permissions to what the human is allowed to do. It also lets you associate agent actions with human approvers | Direct Access access allows your agents to operate independently of humans, and identify when agents are conducting fully autonomous flows |
| Examples | An email assistant needing access to your emails would need you to delegate access to read your emails | A security agent triaging large amounts of incidents might need access to system logs independent of a human |

In practice, most agents will have some tasks where they need delegated access, and some where they want direct access. Most of these access scenarios can be covered by a few particular OAuth flows, which we’ll break down in this next section.

Let’s list some common requirements for tasks in which agents need delegated access.

1. The agent needs to fulfill human requests, and is available to users as a service
2. Users should not be able to view the requests of other users without explicit permission. This means you need to…
	1. Identify who the user accessing your agent is — meaning you need to authenticate users
		2. Control whether users have access to view a particular request to your agent — meaning you need to authorize your users
3. The Agent needs to access data across several platforms (Microsoft, Slack, Jira, Google, Datadog, etc.) to do useful work. This means…
	1. Your agent needs to obtain access to other services — meaning your agent needs authorization from these other services
		2. While handling user requests, your agent should be limited to what the user is allowed to do. If the user can’t view a top secret Microsoft document, the agent shouldn’t use that document when answering their question.

The most common OAuth 2.0 flow used to fulfill Requirement 2 is [**Auth Code Flow**](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow?ref=blog.langchain.com)**.**

The OAuth 2.0 flow used to fulfill Requirement 3 is the [**OBO (On-Behalf-Of) Token Flow.**](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-on-behalf-of-flow?ref=blog.langchain.com)

**In most delegated access scenarios, Auth Code Flow and OBO Token Flow are all you need for your agent.**

### Direct Access

We can take the same approach for Direct access, and list some requirements:

1. Your agent needs to access one or more services without human involvement. This means…
	1. Other services need to be able to identify your agent and distinguish it from other applications — meaning your agent needs to be authenticated to these services
		2. Your agent needs access to other services — these services need to authorize your agent to control what it has access to

**The OAuth flow used to accomplish the Direct Access scenario above is the** [**Client Credentials Flow**](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-credentials-flow?ref=blog.langchain.com)

- Client Credentials flow requires that your agent is running in a private environment where its source code is not exposed to third parties - so no mobile apps or Single Page Apps (SPAs)
- In production, it’s good practice to use a credential management mechanism to avoid long-lived credentials (which are vulnerable to compromise).

To recap, if you’re looking to set up access for your agent, there’s likely 3 flows you’ll need:

| Type of Access | OAuth 2.0 Flows |
| --- | --- |
| Delegated Access | 1\. Auth Code Flow 2. OBO Token Flow |
| Direct Access | 3\. Client Credentials Flow |

### Conclusion

As agents become more capable, more autonomous, and more useful, the need for a good authentication and authorization story increases.

Part of that story is a continuation of what’s already been built: the existing standards of OAuth 2.0 and OIDC. If you need to implement auth for your agent, you’ll likely find yourself implementing Auth Code Flow, OBO Token Flow, or Client Credentials Flow.

However, agents *do* bring new challenges to the table. Agents will routinely span dozens of services, request access in fluid ways, and trigger chains of actions that are harder to audit. We believe there’ll be a need for new tooling to centralize control and standardize agent access.

We’ve written about [agent access control](https://blog.arcade.dev/agent-authorization-langgraph-guide?ref=blog.langchain.com) before with our friends at [Arcade](https://www.arcade.dev/?ref=blog.langchain.com), in case you’re interested in diving deeper.
