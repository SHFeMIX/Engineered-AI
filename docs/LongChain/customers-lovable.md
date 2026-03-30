---
title: "How Lovable uses LangSmith to debug & monitor agents in production"
site: "LangChain Blog"
published: 2025-03-25T19:35:40.000Z
source: "https://blog.langchain.com/customers-lovable/"
domain: "blog.langchain.com"
language: "en"
word_count: 422
---

# How Lovable uses LangSmith to debug & monitor agents in production

[Lovable.dev](http://loveable.dev/?ref=blog.langchain.com) is an innovative AI-powered platform that lets users build and ship a high-quality v1 of their software without writing code. It offers seamless integration with tools like GitHub and Supabase, making it easy to create and deploy applications. Users can simply chat to rapidly build websites and web apps; for instance, they can build and deploy applications with features like authentication and data storage, achieving results 20x faster than conventional coding practices.

## Using LangSmith for agent observability

As Lovable experienced rapid growth and user adoption, the team needed to gain visibility into their agentic interactions. With an influx of users, understanding the intricacies of how various components of their agent interacted became crucial for the Lovable team to maintain efficiency and deliver a seamless user experience.

In order to solve their bottleneck of diagnosing agent issues and iterating on features quickly, Lovable turned to LangSmith to gain comprehensive insights into its agentic chain, which was essential. One of the key enhancements to their workflow was the addition of an admin-only button to "open prompt in LangSmith," which enabled team members to access detailed agent traces. This feature empowered developers to quickly identify bottlenecks and optimize workflows, significantly enhancing operational efficiency.

By combining multiple requests in LangSmith with its low-level API, Lovable could pinpoint any session in production and instantly review the sequence of actions taken during the application's development. Monitoring charts allowed Lovable to quickly see any spikes in metrics, and then double-click into any problematic traces to find the culprit. This not only improved debugging, but facilitated a deeper understanding of how each component interacted within the overall system, allowing the Lovable team to iterate and make continuous improvements to their agent.

## Impact & what’s next

The integration of LangSmith has led to remarkable outcomes for Lovable.

- **Enhanced debugging**: LangSmith enabled Lovable to introspect anything in the agentic chain, reducing spent diagnosing issues and speeding up resolution time.
- **Improved collaboration**: With code stored in GitHub, team members can collaborate seamlessly, fostering a culture of teamwork and shared ownership.

Looking ahead, Lovable aims to further refine its agent development process and will explore additional LangSmith features that will enhance user experience and operational efficiency.

## Conclusion

Lovable's strategic use of LangSmith has been instrumental in its rapid growth, enabling the company to achieve the milestone of $25M ARR in just four months. The integration of LangSmith has not only streamlined workflows but also set the stage for future advancements, showcasing the transformative potential of AI in the software development landscape.
