---
title: "Mission Control for Self-Hosted LangSmith on Kubernetes"
site: "LangChain Blog"
published: "2026-05-26T17:05:00.000Z"
source: "https://www.langchain.com/blog/mission-control-operating-self-hosted-langsmith-on-kubernetes"
domain: ""
language: "en"
word_count: 1162
---

# Mission Control for Self-Hosted LangSmith on Kubernetes

## Mission Control: Operating Self-Hosted LangSmith on Kubernetes

[

Go back to blog

](https://www.langchain.com/blog)[Create agents](https://www.langchain.com/blog/mission-control-operating-self-hosted-langsmith-on-kubernetes#)

Share

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a15d44fbcc56ddb5fa6ef30\_mission-control.png)

## Key Takeaways

- **Mission Control reduces the operational sprawl around self-hosted LangSmith.** Platform teams can manage configuration, preflight checks, health, release history, diagnostics, and support workflows from one in-cluster interface.
- **It fits Kubernetes environments with strict network boundaries.** Mission Control runs inside the cluster, is accessed locally, and doesn’t require ingress, an external control plane, or an additional database.
- **Operators can troubleshoot and validate changes with less manual correlation.** Preflight checks catch common deployment issues early, while health views, logs, alerts, global search, database checks, and diagnostic bundles help teams find the likely failure point faster.

Self-hosting LangSmith on Kubernetes gives platform teams control over infrastructure, network boundaries, security policies, and deployment topology. It also gives them more to operate.

As LangSmith deployments grow across clusters, environments, and teams, day-to-day operations usually spread across several tools:

- Helm deployments and `values.yaml`
- `kubectl logs`, `describe`, and event inspection
- Observability dashboards and monitoring stacks
- Internal scripts for diagnostics and support tasks

That model works because it stays close to Kubernetes, but it also creates context switching. Operators move between Helm, kubectl, dashboards, logs, scripts, and docs to answer basic questions about deployment state or troubleshoot an issue.

## Introducing Mission Control

Mission Control is a decoupled, in-cluster application for deploying, configuring, observing, and troubleshooting self-hosted LangSmith and related LangChain infrastructure. It runs inside Kubernetes and is accessed locally, with no ingress, no external control plane, and no additional database requirement.

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a15d5809d24cb0db55d2f77\_mission-control-main.png)

Mission Control uses Kubernetes primitives directly, then adds an operational layer that understands LangSmith deployments. Operators still work with Helm, pods, services, namespaces, logs, and events. Mission Control makes those resources easier to inspect and act on in the context of LangSmith. This enables an operator to work through a single interface for the most common LangSmith operations:

- Review cluster and workload health
- Inspect pending or failed deployments
- Check pod-level CPU and memory usage across namespaces
- Validate releases before promotion

Mission Control maintains a live operational view of the cluster, so teams spend less time manually correlating state across tools.

## Core operational surfaces

### 1\. Quick Start and Quick Features

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a15d5ab372089cc54e80ed8\_quickstart.png)

Most LangSmith deployments rely on a common set of operational features, including ingress, Gateway API support, deployments, insights, and agent tooling. Getting those features configured usually means translating setup requirements into Helm values, checking which options apply to the environment, and making sure the resulting YAML is valid before deployment.

Mission Control provides a guided onboarding flow that generates the minimum required `values.yaml` for a deployment.

Operators can enable features through validated configuration changes without hand-editing YAML for every setup step.

### 2\. Configuration Management

Managing Helm values can be error-prone. Operators need to edit environment-specific config, handle secrets safely, and understand what will change before applying an update. Mission Control includes a bidirectional Helm values editor built for Kubernetes operators.

It can:

- Pull upstream `values.yaml` directly from GitHub
- Support file uploads for air-gapped environments
- Support both Simple and Advanced modes
- Mask sensitive values such as Fernet keys, salts, and tokens

Before deployment, Mission Control shows a safe diff between the current and proposed configuration, including secret-aware comparisons.

### 3\. Preflight Checks

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a15d5c24da93abc7cdbfe56\_preflight-checks.png)

Deployment failures are often caused by cluster conditions that could have been checked earlier. Before deploying changes, Mission Control runs cluster-aware validation checks for common failure points:

- Node capacity and scheduling constraints
- Kubernetes version compatibility
- DNS resolution
- Storage class availability
- Namespace quotas and resource limits

These checks catch issues before deployment, reducing rollback and debugging cycles.

### 4\. Health and Observability

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a15d5d3e1e09d55a3a7f71f\_health.png)

When something goes wrong, operators need to quickly narrow down whether the issue is with a workload, service, namespace, network path, or storage layer. The Health view gives operators a unified snapshot of LangSmith workloads.

Operators can inspect:

- Pod CPU and memory usage
- Service readiness and status
- Live workload logs
- Network topology across services
- PVC capacity and storage pressure

The goal is to answer a practical operational question quickly: Is LangSmith healthy right now, and if not, where is the failure?

### 5\. Release management

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a15d5e675689f91540b2f60\_release-management.png)

Upgrades are easier to manage when operators can see what is currently deployed, what changed between versions, and what happened during previous deployment attempts. Mission Control provides version-aware deployment management for LangSmith Helm releases.

Operators can see:

- Available chart versions with changelog context
- Current deployed version
- Release history
- Downloadable logs for deployment attempts

This gives teams a clearer view of upgrades, drift, failed deployments, and rollback paths.

### 6\. LangSmith-aware operator assistant

Some operational questions are specific to LangSmith, not just Kubernetes. Operators may need to understand how a setting works, whether an issue is documented, or what guidance applies to their current deployment. Mission Control includes an in-cluster chat assistant for LangSmith operators.

The assistant can:

- Use Chat LangChain to answer LangSmith questions
- Keep answers aligned with current LangSmith documentation and known issues
- Scrub outbound secrets before data leaves the cluster
- Scope conversation history to each Mission Control instance

This gives operators a faster path from cluster state to relevant guidance, without jumping between docs, support tickets, and troubleshooting notes.

### 7\. Alerts and operational signals

![](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a15d612f964c74eee1f26b4\_alerts-signals.png)

When cluster conditions change, operators need a clear record of what happened and when. Mission Control includes rule-based alerting for operational events such as:

- Workload degradation
- Node pressure
- HPA scaling constraints
- Resource exhaustion

Alerts create a persistent audit trail inside Mission Control, giving teams a shared record of operational history.

### 8\. Additional features

#### Global search

Operational issues often show up across multiple resources. A failure might appear in logs, events, ConfigMaps, release history, alerts, or support scripts.

Mission Control provides unified search across:

- Pod logs and descriptions
- Kubernetes events
- Releases
- Alert history

#### Database tools

LangSmith deployments commonly depend on Redis, PostgreSQL, and ClickHouse. Mission Control provides controlled tooling for inspecting and validating those integrations without giving operators unrestricted database access.

Capabilities include:

- Auto-discovery of configured external databases
- Connectivity preflight checks
- Curated support scripts for common operational queries
- Downloadable CSV exports for support workflows

This gives teams auditable workflows for common database checks, including managed database environments where direct pod access is limited or discouraged.

#### Diagnostics and incident response

When a failure occurs, Mission Control can generate a diagnostic bundle with:

- Pod logs across namespaces
- Cluster metadata snapshots
- `kubectl describe` output
- Deployment and event timelines

The bundle is packaged into a single downloadable artifact, which reduces manual collection work during incidents and support escalations.

## Closing thoughts

Mission Control gives platform teams a way to manage self-hosted LangSmith deployments that fits the Kubernetes operating model they already use. Configuration, validation, health, release history, diagnostics, database tooling, and support workflows all stay inside the cluster, within existing security boundaries.

For teams running LangSmith in private, regulated, or air-gapped environments, that means fewer ad hoc scripts, fewer context switches, and a clearer path from deployment to day-to-day operations.

## Feedback, feature requests, or suggestions?

We’re continuing to improve Mission Control based on customer feedback. If there’s something you’d like to see, let us know through [LangChain Support](https://support.langchain.com/).
