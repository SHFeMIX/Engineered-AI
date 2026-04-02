---
title: "How C.H. Robinson is transforming the logistics industry with LangChain"
site: "LangChain Blog"
published: 2025-03-10T21:55:16.000Z
source: "https://blog.langchain.com/customers-chrobinson/"
domain: "blog.langchain.com"
language: "en"
word_count: 579
---

# How C.H. Robinson is transforming the logistics industry with LangChain

[C.H. Robinson](https://www.chrobinson.com/en-us/?ref=blog.langchain.com) is one of the world’s largest global logistics providers, managing 37 million shipments a year by ocean, air, rail and truck. It’s known for solving logistics challenges from the simple to the most complex. With the advent of GenAI, the company has created proprietary tech that represents an efficiency breakthrough for its industry and for supply chains around the world.

## Problem they’re solving

Customers using C.H. Robinson’s digital tools have been able to get instant service for years. But thousands of its 83,000 customers still prefer to conduct many routine transactions by email, requiring people to read the emails and do time-consuming manual data entry.

To address these challenges, C.H. Robinson set out to automate email transactions across the lifecycle of a shipment: from giving a price quote, creating an order and setting appointments for pickup and delivery to checking on the load while it’s in transit. They aimed to cut costs, increase speed-to-market, and free up time for employees to focus on higher-value, strategic work for their customers.

For example, C.H. Robinson gets **15,000** **emails a day** containing requests for shipping. These often contain inconsistent formatting, including handwritten notes on PDFs, and may be missing essential data. As a result, it would take as much as four hours for a person to get to a shipping request in an email queue, and employees spent around seven minutes processing each email into an order. C.H. Robinson’s new proprietary AI tech reads the email, connects information in different parts of the email, detects and fetches any missing information, and creates an order.

## LangChain for interoperability, LangGraph for debugging AI agents

As part of the development process, C.H. Robinson’s GenAI engineering team started by building their AI agents using `langchain` (the open-source framework) for maximum interoperability. `langchain` allowed them to easily switch between models and combine user instructions (often hard to parse) with the actual order context.

When their team began to delve into more complex classification for less-than-truckload vs. full truckload shipments, they turned to LangGraph. LangGraph provided the most flexibility for the C.H. Robinson team to understand state to track and update information for their orders as needed. The visual LangGraph Studio also helped their engineers prototype and debug complex agent interactions, saving them development time.

With approximately 5,500 orders a day now automated, C.H. Robinson is **saving over 600 hours per day** on this task alone.

## Real-time observability with LangSmith

With lean development teams, it was important for C.H. Robinson to catch any errors in their application before deploying and to understand when their system went wrong. LangSmith was their first line of defense in the testing process, as SMEs (subject matter experts) could catch issues and send them to developers, keeping their project focused and high-quality.

With LangSmith, the team was able to stitch together traces through the order entry process to quantify errors and gain a real-time view of their application running. They also have been rapidly experimenting to bridge the gap between the input and the eventual state via prompt management. Meta-prompting in particular allows the user to learn how to input better instructions to generate more relevant answers.

C.H. Robinson’s generative AI efforts are redefining logistics, setting new benchmarks for efficiency, scalability, and customer satisfaction. By integrating LangGraph and LangSmith into their AI development, C.H. Robinson has empowered their workforce to further cut down inefficiencies. Looking ahead, the company is expanding its agentic AI capabilities to offer enhanced personalization and deeper automation.
