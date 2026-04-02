---
title: "Rakuten Group builds with LangChain and LangSmith to deliver premium products for its business clients and employees"
site: "LangChain Blog"
published: 2024-02-14T20:20:31.000Z
source: "https://blog.langchain.com/customers-rakuten/"
domain: "blog.langchain.com"
language: "en"
word_count: 766
---

# Rakuten Group builds with LangChain and LangSmith to deliver premium products for its business clients and employees

Rakuten Group is well known for operating one of the largest online shopping malls in Japan. The company has 70+ businesses in fields such as e-commerce, travel, digital content, fintech, communications and more.

Adopting new technologies to push the frontiers of what’s possible is in the DNA of the company, and Rakuten Group has invested in delivering AI applications to better service their end users, clients and employees with a unified product suite.

Rakuten AI for Business is a comprehensive AI platform that supports business clients in essential business operations, including market analysis and customer support. This platform also empowers clients to enhance productivity across various activities, such as sales, marketing, and IT support.

LangChain and LangSmith are critical technologies that the team leverages to build these solutions with greater speed and reliability.

### Rakuten AI: Empowering Businesses

Rakuten invests heavily to make their ecosystem experience great for members and business clients. When clients onboard their businesses, they receive support from a dedicated onboarding consultant, and once live, continue to get help from them. The AI Team at Rakuten believes in using AI for empowerment, and they saw an opportunity to augment the assistance they give to their clients with new LLM-powered products built with LangChain and LangSmith. Specifically, their clients can benefit from:

- **Rakuten AI Analyst** which acts as a research assistant, providing valuable market intelligence. This helps clients get business insights backed by relevant data and charts.
- **Rakuten AI Agent** which supports clients in getting faster, self-serve customer support for their questions related to listing and transacting on the marketplace.
- **Rakuten AI Librarian** which summarizes all of the client’s documentation to answer questions from the client’s end customers and prospects in real time.

### Rakuten AI: Empowering Rakutenians

Rakuten recently leveraged LangChain’s OpenGPTs [package](https://github.com/langchain-ai/opengpts?ref=blog.langchain.com) to deliver an employee empowerment experience, in which teams could build their own chatbots over internal documentation to help with knowledge management and employee enablement. It only took three engineers one week to get the initial platform up and running.

The team at Rakuten was excited about LangChain OpenGPTs because it gave them maximal flexibility and control on designing the cognitive architecture and user experience. Additionally, they didn’t want to gate the experience to only a subset of employees and intend to roll the product to 32k employees, and at this scale, the Data Science & ML team must keep a variety of options open and be able to control the cost / performance tradeoffs. LangChain’s framework makes the ability to customize and abstract away vendor lock-in possible.

### Why LangChain and LangSmith

Rakuten was an early adopter of LangChain, and they first started building with the framework in January of 2023. LangChain was helpful in providing common, successful interaction patterns for building with LLMs, and many of the off-the-shelf chain and agent architectures allowed Rakuten to iterate quickly.

As the team got serious about scaling up their LangChain usage and allowing more users to interact with the applications, they looked to LangSmith to harden their work and provide visibility into what’s happening and *why.*  
  
General Manager of AI for Business at Rakuten, Yusuke Kaji says, “LangSmith allows us to get things done scientifically. At a large company, usually multiple teams develop their ideas independently. Some teams find good approaches, while others don’t. By using LangSmith Hub, we could distribute the best prompts and promote collaboration across teams. By using LangSmith Testing and Eval with our custom evaluation metrics, we can run experiments on multiple approaches (models, cognitive architecture, etc.) and *measure* the results. By combining the benefits of LangSmith and standing on the shoulders of a gigantic open-source community, we’re able to identify the right approaches for using LLMs in an enterprise-setting faster.”

LangSmith also provides Rakuten with the enterprise assurances that they need. Data stays within Rakuten’s environment, and with LangSmith, Rakuten can separate access for development workflows from production ones, maintaining the high bar that Rakuten requires when dealing with user data.

### The Road Ahead

Rakuten started with two ambitious projects, impacting both their e-commerce marketplace and their employee base, but that’s par for the course at Rakuten whose mission is to empower people and society through innovation and entrepreneurship. Rakuten plans to distribute **Rakuten AI for Business** across its customer base, focusing particularly on merchants, hotels, retail stores, and local economies, with the aim to improve productivity by 20%. The team will continue to design and build technical architectures for large-scale AI applications across its suite of 70 businesses, and LangChain and LangSmith will enable them to achieve their goals faster and more safely than they could have otherwise.
