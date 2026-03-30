---
title: "Announcing the General Availability of LangSmith and Our Series A Led By Sequoia Capital"
site: "LangChain Blog"
published: 2024-02-15T16:00:38.000Z
source: "https://blog.langchain.com/langsmith-ga/"
domain: "blog.langchain.com"
language: "en"
word_count: 1404
---

# Announcing the General Availability of LangSmith and Our Series A Led By Sequoia Capital

Today, we’re thrilled to announce the **general availability of LangSmith** — our solution for LLM application development, monitoring, and testing. We initially launched LangSmith in closed beta in July 2023. Since then, we’ve received invaluable feedback from our early users and customers, and made significant improvements to the platform based on their input. We’ve also made heavy investments in our infrastructure to ensure that the platform is able to seamlessly scale to accommodate our rapidly growing user base. If you want to see LangSmith for yourself, [sign up](https://smith.langchain.com/?ref=blog.langchain.com) today. We’ve removed the waitlist, so you can get building immediately. We hope you love it.

Alongside the GA launch of LangSmith, we’re announcing our **$25M Series A fundraise led by Sequoia Capital**. We’re extremely excited to be working with Sonya Huang and the rest of the Sequoia team to build the future we envision. We're also hiring; if you think you could make a difference on our team, [**see our open roles**](https://langchain.com/careers?ref=blog.langchain.com) and get in touch.

Since launching LangSmith, we’ve seen:

- Over 80K signups
- Over 5K monthly active teams
- Over 40 million traces logged in January alone

LangSmith is now trusted by the best teams building with LLMs, at companies such as Rakuten, Elastic, Moody’s, Retool, and more.

James Spiteri, Director of Product Management at Elastic, shares, *“The impact LangChain and LangSmith had on our application was significant. We couldn’t have shipped the product experience in the first place without LangChain, and we couldn’t have done it at the pace we had without LangSmith.”*

## LangSmith supports development from prototyping to production

We learned from our users about the pain points that are common to building with LLMs, and we’re solving those whether you’re building with LangChain or not. In the rest of this post, we’ll highlight the breadth of workflows LangSmith supports and how they fit into each stage of the application development lifecycle. We hope this will inform users how to best utilize our platform or give you something to consider if you are just starting your journey.

![](https://blog.langchain.com/content/images/2024/02/LangSmith-Diagram---GA---final.png)

The workflows LangSmith supports at each stage of the LLM application lifecycle

### Prototyping

Prototyping LLM applications often involves quick experimentation between prompts, model types, retrieval strategy and other parameters. The ability to rapidly understand how the model is performing — and debug where it is failing — is incredibly important for this phase.

**Debugging**

When developing new LLM applications, we suggest having LangSmith tracing enabled by default. Oftentimes, it isn’t necessary to look at every single trace. However, when things go wrong (an unexpected end result, infinite agent loop, slower than expected execution, higher than expected token usage), it’s extremely helpful to debug by looking through the application traces. LangSmith gives clear visibility and debugging information at each step of an LLM sequence, making it much easier to identify and root-cause issues. We provide native rendering of chat messages, functions, and retrieve documents.

<video src="https://storage.ghost.io/c/97/88/97889716-a759-46f4-b63f-4f5c46a13333/content/media/2024/02/Export-1707866980082-1.mp4" width="1640" height="1080"></video>

Inspecting a trace from an LLM application run

**Initial Test Set**

While many developers still ship an initial version of their application based on “vibe checks”, we’ve seen an increasing number of engineering teams start to adopt a more test driven approach. LangSmith allows developers to create datasets, which are collections of inputs and reference outputs, and use these to run tests on their LLM applications. These test cases can be uploaded in bulk, created on the fly, or exported from application traces. LangSmith also makes it easy to run custom evaluations (both LLM and heuristic based) to score test results.

<video src="https://storage.ghost.io/c/97/88/97889716-a759-46f4-b63f-4f5c46a13333/content/media/2024/02/running_tests.mp4" width="970" height="720"></video>

Inspecting test cases and test runs

**Comparison View**

When prototyping different versions of your applications and making changes, it’s important to see whether or not you’ve regressed with respect to your initial test cases. Oftentimes, changes in the prompt, retrieval strategy, or model choice can have huge implications in responses produced by your application. In order to get a sense for which variant is performing better, it’s useful to be able to view results for different configurations on the same datapoints side-by-side. We’ve invested heavily in a user-friendly comparison view for test runs to track and diagnose regressions in test scores across multiple revisions of your application.

<video src="https://storage.ghost.io/c/97/88/97889716-a759-46f4-b63f-4f5c46a13333/content/media/2024/02/Export-1707912385540.mp4" width="1640" height="1080"></video>

Viewing test runs side by side

**Playground**

LangSmith provides a playground environment for rapid iteration and experimentation. This allows you to quickly test out different prompts and models. You can open the playground from any prompt or model run in your trace. Every playground run is logged in the system and can be used to create test cases or compare with other runs.

<video src="https://storage.ghost.io/c/97/88/97889716-a759-46f4-b63f-4f5c46a13333/content/media/2024/02/Export-1707913496808.mp4" width="1640" height="1080"></video>

Opening up a run in the Playground

### Beta Testing

Beta testing allows developers to collect more data on how their LLM applications are performing in real-world scenarios. In this phase, it’s important to develop an understanding for the types of inputs the app is performing well or poorly on and how exactly it’s breaking down in those cases. Both feedback collection and run annotation are critical for this workflow. This will help in curation of test cases that can help track regressions/improvements and development of automatic evaluations.

**Collecting Feedback**

When launching your application to an initial set of users, it’s important to gather human feedback on the responses it’s producing. This helps draw attention to the most interesting runs and highlight edge cases that are causing problematic responses. LangSmith allows you to attach feedback scores to logged traces (oftentimes, this is hooked up to a feedback button in your app), then filter on traces that have a specific feedback tag and score. A common workflow is to filter on traces that receive a poor user feedback score, then drill down into problematic points using the detailed trace view.

<video src="https://storage.ghost.io/c/97/88/97889716-a759-46f4-b63f-4f5c46a13333/content/media/2024/02/feedback_filtering.mp4" width="970" height="720"></video>

Logging a trace and feedback score from ChatLangChain, viewing the results in LangSmith

**Annotating Traces**

LangSmith also supports sending runs to annotation queues, which allow annotators to closely inspect interesting traces and annotate them with respect to different criteria. Annotators can be PMs, engineers, or even subject matter experts. This allows users to catch regressions across important evaluation criteria.

<video src="https://storage.ghost.io/c/97/88/97889716-a759-46f4-b63f-4f5c46a13333/content/media/2024/02/annotating_traces.mp4" width="970" height="720"></video>

Sending a trace to an Annotation Queue

**Adding Runs to a Dataset**

As your application progresses through the beta testing phase, it's essential to continue collecting data to refine and improve its performance. LangSmith enables you to add runs as examples to datasets (from both the project page and within an annotation queue), expanding your test coverage on real-world scenarios. This is a key benefit in having your logging system and your evaluation/testing system in the same platform.

<video src="https://storage.ghost.io/c/97/88/97889716-a759-46f4-b63f-4f5c46a13333/content/media/2024/02/Export-1707866909552.mp4" width="1592" height="1080"></video>

Adding the inputs/outputs of a run as an example to a dataset

### Production

Closely inspecting key data points, growing benchmarking datasets, annotating traces, and drilling down into important data in trace view are workflows you’ll also want to do once your app hits production. However, especially at the production stage, it’s crucial to get a high-level overview of application performance with respect to latency, cost, and feedback scores. This ensures that it's delivering desirable results at scale.

**Monitoring and A/B Testing**

LangSmith provides monitoring charts that allow you to track key metrics over time. You can expand to view metrics for a given period and drill down into a specific data point to get a trace table for that time period — this is especially handy for debugging production issues.

The platform also allows for tag and metadata grouping, which allows users to mark different versions of their applications with different identifiers and view how they are performing side-by-side within each chart. This is helpful for A/B testing changes in prompt, model, or retrieval strategy.

<video src="https://storage.ghost.io/c/97/88/97889716-a759-46f4-b63f-4f5c46a13333/content/media/2024/02/monitoring-1.mp4" width="970" height="720"></video>

Viewing monitoring charts and grouping by LLM type

## The Road Ahead

LangSmith can help with every important workflow at each stage of the LLM application development cycle. As we continue to improve and expand the platform, our future directions include:

- Support for regression testing
- Ability to run online evaluators on a sample of production data
- Better filtering and conversation support
- Easy deployment of applications with hosted LangServe
- Enterprise features to support the administration and security needs for our largest customers.

To learn more about pricing, or reach out to sales, check out our [website](https://www.langchain.com/pricing?ref=blog.langchain.com) for information.

We believe we are in a super early, very fast-moving industry, and our users trust us to be their guide and partner. With LangSmith, and all our products, we strive to stay ahead of the curve and innovate for the needs of our users today. Thank you for going on this journey with us. Onwards!

![](https://blog.langchain.com/content/images/2024/02/Trace-on-lilac-bg.png)
