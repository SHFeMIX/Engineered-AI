---
title: "LangChain Partners with CommandBar on their Copilot User Assistant"
site: "LangChain Blog"
published: 2024-02-08T21:10:49.000Z
source: "https://blog.langchain.com/langchain-partners-with-commandbar-on-their-copilot-user-assistant/"
domain: "blog.langchain.com"
language: "en"
word_count: 533
---

# LangChain Partners with CommandBar on their Copilot User Assistant

[CommandBar](https://commandbar.com/?ref=blog.langchain.com) is a user assistance platform that helps software companies make their products easy to use by capturing and predicting user intent, and then delivering personalized in-product help. CommandBar’s Copilot widget, which companies embed into their applications, goes beyond a typical chatbot. It can answer user questions, trigger personalized product tours, even fulfill a user’s intent directly by carrying out actions on their behalf.

CommandBar’s customers have slightly different needs from each other, and in order for the Copilot to be helpful across all of CommandBar’s customers, the team had to find common threads for user assistance that could be streamlined or automated with LLMs as well integrate with many different content providers (such as help desks and knowledge bases) for information retrieval.

CommandBar decided to use LangSmith to give them visibility over their Copilot’s performance and ultimately deliver better experiences for their customers. While the team did not use LangChain in production, getting up and running in LangSmith was fast. “I was surprised how straightforward it was to set up the traces just with the decorators in LangSmith. It was super easy to get started.” says Senior Software Engineer Jared Luxenberg.

LangSmith helped the CommandBar team is these four ways primarily:

- **Trace Visibility:** The team was able to see if an end user had a bad experience just by looking at a LangSmith trace and didn’t have to rely on receiving a screenshot or email. LangSmith visibility down to the conversation thread allowed CommandBar to be proactive about identifying how the customer could avoid a bad interaction in the future.
- **Debugging:** Building a good Copilot came down to building a good retrieval system, and LangSmith traces helped the team understand if the right documents were even retrieved in the first place, and if not, they had information to try different techniques to improve the system.
- **Increased testing coverage:** The team 5x’d the number of tests it could run on any new code change. Before LangSmith, CommbandBar relied solely on manual QA, but after adopting LangSmith, they could augment human evaluation with better auto-evaluation over grounded pairs of question: response that were known to be good.
- **Monitoring:** The CommandBar team relied on LangSmith to alert if their LLM provider was having an outage, and they could keep a view of the overall health of their application in LangSmith’s monitoring tab.

LangSmith mapped easily to the workflows they wanted to accomplish, aiding them throughout the entire application development lifecycle. CommandBar’s Copilot has been live since November 2023, and it makes life easier for thousands of support teams and millions of end users, and this translates into concrete results for customers – like a 44% decrease in support tickets from a recent case study “Every week we hear from one of customers enthusiastically sharing that the Copilot responses are so on point, and it’s become one of our product’s biggest competitive advantage and probably our flagship product at this point.” says Luxenberg.

![](https://lh7-us.googleusercontent.com/WHBbnrH_dPOtjz1nGI-jy8PjbDnN4zMOGSK3sMOZDcMkhdg80awBTxk46a_VYaNg-iQG536JhTliMJD4PJaG60TT8buPiZiJUPrYpbWkRKmON0Tr_nKgX0VsqKfyhKd-jZD8zz--J7ivaI_noYzrWtM)

CommandBar believes Copilot can become even more useful and proactive for users. Commandbar has a lot of cool improvements rolling out in the coming months, which are all powered by Langsmith. To read more about their launch, head to their blog [here](https://www.commandbar.com/blog/why-we-built-copilot/?ref=blog.langchain.com).
