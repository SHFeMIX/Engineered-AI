---
title: "How Inconvo is improving customer-facing analytics with conversational AI built on LangGraph"
site: "LangChain Blog"
published: 2025-03-19T18:41:17.000Z
source: "https://blog.langchain.com/customers-inconvo/"
domain: "blog.langchain.com"
language: "en"
word_count: 493
---

# How Inconvo is improving customer-facing analytics with conversational AI built on LangGraph

[Inconvo](https://inconvo.ai/?ref=blog.langchain.com) is a YC S23 startup that simplifies data analysis for non-technical users. This case study will focus on how Inconvo utilizes [LangGraph](https://langchain.com/langgraph?ref=blog.langchain.com) and [LangSmith](https://www.langchain.com/langsmith?ref=blog.langchain.com) to streamline their data querying process.

## Problem: Overcoming the barrier for data analysis

Inconvo addresses a common challenge faced by many non-technical users who struggle with traditional Business Intelligence (BI) workflows to extract simple insights from data. For example, a user of a SaaS application might find it cumbersome to navigate complex BI tools just to answer straightforward questions like "How much product have I sold over the last two weeks?" This inefficiency not only wastes time but also limits the ability of users to make data-driven decisions.

The need for a more intuitive solution became apparent as Inconvo sought to empower users to ask questions in natural language, thereby eliminating the need for technical expertise in data analysis. By providing a simple API, Inconvo aims to make it easy for developers to add conversational analytics to their applications.

## Agent UX: API for conversational data analysis

Inconvo's agent interface provides users with multiple ways to visualize and interact with their data. When users submit natural language queries, the API returns JSON results in the following forms:

- Bar charts for comparing categorical data
- Line graphs for time-series analysis
- Tables for detailed data examination
- Text for simple answers
![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXf5vDILU4HEjl98I5fLFpJwWK7Z5ARWsJggz46VjTb3iLEGyF-d2sDLFKLbg0bG9dBls42sHKdBLDif5GwT7ncdPFtcV3Gyb7SHYnWsZuRNsUsBWq0YHYjBTUNXOhV46iAHKZjFJA?key=5H3MBgV9aEkbOfFFUV9HpCPw)

The API allows users to refine their queries conversationally. For example, after seeing initial results, a user can ask for a different visualization or request to filter the data further. This interactive experience makes complex data analysis accessible to non-technical users without requiring them to learn SQL or specialized BI tools.

## Building a powerful query processing system with LangGraph

[LangGraph](https://langchain.com/langgraph?ref=blog.langchain.com) plays a key role in Inconvo's architecture and has enabled a multi-step workflow that efficiently processes user queries. When a user submits a question, LangGraph orchestrates the entire data retrieval process, starting with an introspection of the database to understand its schema. This allows Inconvo to configure which data is accessible and how it can be queried.

Inconvo’s architecture utilizes LangGraph to manage conditional workflows, where different operations can be executed based on the user's input. This includes selecting tables, executing SQL queries, and returning structured outputs in various formats. By integrating with LangGraph, Inconvo can handle complex queries with multiple steps, ensuring that users receive accurate and relevant results quickly.

The cognitive architecture follows a deliberate reasoning pattern:

1. Parse the user's natural language query
2. Map the query to relevant database tables and fields
3. Generate appropriate SQL queries

## Conclusion

Inconvo's use of LangGraph has transformed how non-technical users interact with their data, breaking down barriers to data analysis through natural language processing. By eliminating the need for specialized technical skills, Inconvo has democratized access to data insights, enabling users across various industries to make informed decisions quickly and efficiently. This case study demonstrates how innovative AI solutions can solve real-world problems and create more intuitive user experiences in the data analytics space.
