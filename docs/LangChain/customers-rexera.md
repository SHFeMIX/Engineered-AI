---
title: "How Rexera’s AI agents drive quality control with LangGraph"
site: "LangChain Blog"
published: 2024-10-09T20:14:27.000Z
source: "https://blog.langchain.com/customers-rexera/"
domain: "blog.langchain.com"
language: "en"
word_count: 955
---

# How Rexera’s AI agents drive quality control with LangGraph

Rexera is revolutionizing the $50 billion real estate transaction industry by harnessing AI to automate manual workflows. By deploying intelligent AI agents, Rexera streamlines real estate operations, accelerates transactions, and significantly reduces both costs and errors.

Leveraging LangChain and LangGraph alongside their large language models (LLMs), Rexera has developed sophisticated AI agents. These AI agents perform complex cognitive tasks such as:

- Ordering payoff statements
- Extracting critical data from documents
- Performing quality control checks

Below, we explore how Rexera created a robust Quality Control (QC) application that reviews real estate workflows with the precision of a human operator while proactively identifying issues to prevent delays. We'll explore how their system evolved, from its initial single-prompt approach to a more controllable and accurate solution using LangGraph.

## Initial Approach: Single-Prompt LLM Checks and Their Limitations

Quality control is essential in real estate transactions. Rexera has developed a specialized QC application that reviews thousands of workflows daily. This application checks for errors across various stages of a real estate transaction, including data handling, client communication, and interactions with counterparties such as homeowner associations (HOAs), county offices, utility companies, and others.

To ensure quality in real estate transactions, Rexera initially implemented several single-prompt LLM checks. These checks were designed to verify:

- Document accuracy
- Client expectation fulfillment
- Workflow timeliness (SLA compliance)
- Cost control

However, this approach had limitations. Single-prompt LLMs struggled with the complexity of real estate workflows for several reasons, as they couldn’t grasp the full scope of a workflow, had limited context, and couldn’t navigate multi-dimensional scenarios properly.

Rexera evaluates LLM check effectiveness using three key metrics across thousands of workflow runs:

1. **Accuracy**: Correctness scores for issue identification
2. **Efficiency**: Execution speed per transaction
3. **Cost-effectiveness**: Associated LLM costs

This approach streamlined QC by flagging potential issues and reducing manual review needs. However, Rexera identified the need for a more advanced solution to tackle complex real estate workflows effectively.

## Evolving to AI Agents: Trying out CrewAI

Recognizing the limitations of single-prompt LLMs, Rexera then tried a multi-agent approach using CrewAI, where each AI agent oversaw a different part of the transaction process. For example an agent would be defined as:

- Role: "Senior Content Quality Check Analyst"
- Task: "Check if all HOA documents requested by the client have been ordered, and verify that corresponding ETA and cost information has been sent to the client"

This approach led to some improvements over single-prompt LLMs:

- **False positives** (incorrectly flagging non-issues) dropped from 35% to 8%.
- **False negatives** (failing to flag real issues) fell from 10% to 5%.

However, a key challenge emerged with the CrewAI approach. While the AI agents were capable, they sometimes took the wrong path in decision-making, like a GPS system choosing a longer route. This lack of precise control meant that in complex scenarios, agents might veer off course, leading to false positives or false negatives.

## Migrating to LangGraph for Precision and Control

To overcome the limitations of the CrewAI approach, Rexera shifted to LangGraph to custom-design decision paths for various scenarios, particularly benefiting complex cases. Built by the LangChain team, LangGraph is a controllable agent framework that brought additional advantages to Rexera, including the integration of human-in-the-loop workflows, state management, and more.

To illustrate the effectiveness of the new LangGraph-based approach, let's consider rush orders - a common complexity in real estate workflows where closings must happen faster than standard timelines.

Using LangGraph, Rexera created a tree-like structure for the Quality Control (QC) application that allows for cycles and branching. This structure enables the QC application to navigate different paths based on the rush requirements.

When the application identifies a rush order, it's directed down the "Rush Order" branch of the tree. For standard orders, the application follows a different branch, focusing on regular processing checks.

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXfMhONiuEYJlKQF0CtgAWz1UAOhBEybAqBk9swJBr8qBMWRLqqTAOgP4JJjWRgT_L0YBmh-B30fEiZriOFZH-C9K1klTiQQbmpopZoWKqV_mQAx-yxSTZf1P_fCvB8q1ck3Az1p6Sxt9Izm_vV8p1aywUs?key=1CJJatZIt3-HQdJi6_XeYA)

This tree-like structure, enabled by LangGraph, dramatically improved Rexera’s QC process accuracy and completeness by introducing more deterministic decision-making and reducing the randomness of agents going down the wrong path. This shift has led to greater consistency in results, ensuring workflows are completed accurately and efficiently.

This approach with LangGraph added to the improvements made over CrewAI, resulting in:

- False positives reduced from **8% to 2%**
- False negatives decreased from **5% to 2%**

Comparing these outputs for the same rush order scenario, the following example breaks down the QC findings with each new architecture:

**Single-Prompt LLM Output:**

- **Issue found:** "True"
- **Explanation:** "We did not explicitly acknowledge the rush request from the client in our communication."
- **Analysis:** **False positive** —While the rush request was actually acknowledged and executed, the LLM missed recognizing it due to its limited ability to handle complex, multi-step interactions, leading to an incorrect error being flagged.

**CrewAI Output:**

- **Issue found:** "False"
- **Explanation:** "The client requested a rush order, which was acknowledged and acted upon by our team."
- **Analysis:** **Partially accurate** —CrewAI identified the correct outcome of the rush order being executed but failed to notice a discrepancy in the order type, such as whether it was appropriately marked and handled as a rush order in the system.

**LangGraph Output:**

- **Issue found:** "True"
- **Explanation:** "Order details indicate 'Rush Order: False' despite the client requesting and us acknowledging and executing a rush order."
- **Analysis:** **Completely accurate** —LangGraph not only confirmed that the rush order was acknowledged and executed but also identified the inconsistency in how the order type was recorded. By following a custom decision path, it ensured both the acknowledgment of the rush and the proper handling of the order type were verified, preventing any potential delays or issues.

## Conclusion

By leveraging LangGraph's cycles and branching capabilities, Rexera created a more intelligent, adaptable QC application that ensured their AI agents would execute the right checks for each specific scenario, enhancing efficiency and accuracy in our real estate transactions.
