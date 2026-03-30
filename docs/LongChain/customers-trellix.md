---
title: "How Trellix cut log parsing time from days to minutes with LangGraph Studio and LangSmith"
site: "LangChain Blog"
published: 2025-04-22T03:00:19.000Z
source: "https://blog.langchain.com/customers-trellix/"
domain: "blog.langchain.com"
language: "en"
word_count: 1031
---

# How Trellix cut log parsing time from days to minutes with LangGraph Studio and LangSmith

[Trellix](https://www.trellix.com/?ref=blog.langchain.com) is a leading cybersecurity firm with 40,000+ customers that prevents organizations from cybersecurity attacks and threats. To address challenges faced by customers, the Trellix Professional Services Team used LangSmith and LangGraph – including the visual LangGraph Studio – to develop Sidekick, their internal application that democratizes knowledge and automates tedious processes.

## Problem: Customer request backlog and log parsing

Trellix faced significant challenges with a growing backlog of requests for cybersecurity integrations and log parsing. Each request often required a developer to spend 2 to 3 days deciphering logs, coding integrations, and managing customer communications. This lengthy process frustrated customers and led to delays, as support tickets would bounce back and forth between customers and engineers.

To improve customer experience, Trellix decided to build Sidekick, an agentic platform to automate tasks for engineering teams at Trellix, including parsing and script writing. Specifically, they created a structured approach to intake and parse syslog data. Sidekick can automatically generate parsers for unknown log formats, **reducing the time required for manual parsing from days to minutes.** Additionally, they built agents that can speed up the development of plugins and integrations for their SaaS products. Traditionally, this required an engineer to read through 3rd-party API documentation and generate boilerplate code for each new plugin. Handing off this work to agents meant plugins, traditionally being written during the course of multiple days, could now be written during the better part of an afternoon. This quicker turn around time enabled engineers to make a dent in the integration backlog and increased customer satisfaction.

## LangGraph’s advantages as a library

[LangGraph](https://www.langchain.com/langgraph?ref=blog.langchain.com) provided the low-level tools and enhanced abstraction techniques needed for the Trellix AI engineering team to make the required customizations for their use cases. Specifically, map-reduce style graphs using the Send API and subgraph calling are used throughout the Sidekick Agents. These features encouraged modularity and abstraction. The Trellix team started by making several smaller subgraphs, many of which relied on the Send API and other lower-level LangGraph techniques to work efficiently and at scale. Once multiple subgraphs could perform their individual roles successfully, larger graphs were made to call the original graphs as modules.

The Trellix team noted the ease of use; it was not that LangGraph had fundamentally reimagined how to develop agents. Instead, LangGraph offered several out-of-the-box features that made their lives as developers easier. Rather than spending their time figuring out the best way to create agents in code, their time was spent tweaking, refining, and combining a small assembly of easily-built agents.

LangGraph’s human-in-the-loop capabilities also provided reassurance that engineers could step in to approve or rewind the agent’s actions as needed. Having the ability to pause execution during development testing or restart a certain step with slightly different input without waiting for a whole new run led to efficiency gains. This was a big deal to the engineering team who has stressed that waiting for model responses to test code can become quite tedious.

## Using Studio to visualize agent workflows for business stakeholders

Not only did the open source libraries offer advantages, but LangChain tools were particularly useful. [LangGraph Studio](http://ncepts/langgraph_studio/?ref=blog.langchain.com) played a crucial role in the development of Sidekick by providing a framework to visualize and optimize the workflows involved in log parsing and integration tasks. The engineering team used LangGraph Studio to map out the manual processes and transition them into an agentic workflow.

The benefits of LangGraph Studio did not stop with development. Agent visualization was especially helpful for presenting the **thought process and reasoning** behind AI models to both technical and non-technical stakeholders, such as executives and business leaders at Trellix. The engineering team behind Sidekick found that getting buy-in and inter-team understanding drastically improved once LangGraph Studio came into use. It became a great way to show that agents are not a “black box” but are instead carefully engineered programs.

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXc1emegRr01gg2VIuyPoTomYYy6J9BtuJ25NUNfDshgH1iB829YN4e07dX01grZX-YSFRfqn9UeHSIK_1k9zCk39FEe0mbMnhl4wZUkg8TjWMn0Af3OFvygzpDSjYILA-nLfsRt?key=BYmBXkaLujVrjWegkQdFOuMj)

Trellix's LangGraph Studio workflow

## Monitoring agent performance over time with LangSmith

To make data-driven decisions and to assess agent performance, Trellix used [LangSmith](https://www.langchain.com/langsmith?ref=blog.langchain.com) for experimentation and to action upon performance metrics. The team was able to first design different architectures of their agent with LangGraph, then test multiple architectures of their Sidekick agents in LangSmith in order to see what performed best.

Using datasets and experiments in LangSmith was especially powerful, as the Trellix team could quickly compare performance across app versions. In particular, they monitored key metrics such as recursion rate (i.e., how often the agent has to restart or go back to a previous step) and the “must include” rate (i.e., how often the agent retrieves helpful additional documents). Having this data and seeing improvements grounded in data helped Trellix build confidence before shipping to production.

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXcFwvtAeLGKcfAWOCvzf0ExNNlukGNrWrbI1YuPC7bM4mHdlUa0ngjK_0ieF3gB_eAimj3D2grOXOHCc8PPqHwTyEWZHgFJgh0H3lSBBZY-cCVhXhUwsGMy_eYVkMzKdqgjUbYb?key=BYmBXkaLujVrjWegkQdFOuMj)

Trellix's Experiments view in LangSmith

In addition to their use of experiments and datasets, the engineers at Trellix found the traces to be especially useful for debugging both when in production and during development. The intuitive structuring of trace data into inputs and outputs of each node made debugging significantly easier than drudging through AWS logs. This led to quicker development and bug fixes which increased satisfaction from internal users.

## Impact & what’s next

With Sidekick, Trellix has amplified time savings for both engineers on the team and customers. They have:

- **Reduced log parsing time from days to minutes**, drastically improving engineering efficiency.
- **Accelerated customer request resolution**, reducing backlog and improving time-to-value (TTV).
- **Improved AI agent performance** by testing multiple architectures and tracking key metrics in LangSmith.
- **Boosted stakeholder confidence** by providing clear, visual explanations of AI reasoning to non-technical leaders.

Looking ahead, Trellix plans to expand the capabilities of Sidekick to external partners, further democratizing access to AI-driven solutions in cybersecurity. The positive impact of LangSmith and LangGraph has set the stage for continued innovation in Trellix's service delivery, with goals to extend automated parsing and cloud connectors to all customers in the next quarter.

## Conclusion

Trellix has successfully implemented generative AI to address operational challenges in the cybersecurity realm, including servicing customer needs. By using LangSmith, LangGraph, and LangGraph Studio to develop Sidekick, Trellix has not only improved internal efficiencies but also enhanced customer satisfaction – paving the way for future advancements in AI-driven cybersecurity solutions.
