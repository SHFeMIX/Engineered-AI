---
title: "Using Feedback to Improve Your Application: Self Learning GPTs"
site: "LangChain Blog"
published: 2024-03-20T16:38:28.000Z
source: "https://blog.langchain.com/self-learning-gpts/"
domain: "blog.langchain.com"
language: "en"
word_count: 1133
---

# Using Feedback to Improve Your Application: Self Learning GPTs

We built and hosted a simple demo app to show how applications can learn and improve from feedback over time. The app is called "Self Learning GPTs" and it uses LangSmith to gather feedback and then automatically use that feedback to improve over time. It does this by creating few-shot examples from that feedback and incorporating those into the prompt.

Key Links:

- You can access a hosted version of this app [here](https://self-learning-gpts-vz4y4ooboq-uw.a.run.app/?ref=blog.langchain.com).
- You can see a deep dive on how this works in [this YouTube video](https://www.youtube.com/watch?v=OnQQeWEwzyw&ref=blog.langchain.com).
- We are doing a webinar around "Optimization of LLM Systems" with Omar Khattab from DSPy in a few weeks - sign up [here](https://us06web.zoom.us/webinar/register/WN_n4HUNqhFQFa4ax3kYrZW8g?ref=blog.langchain.com).
- If you want early access to "LangSmith Automations" which power this - sign up [here](https://forms.gle/TUiy6McfTArproBu7?ref=blog.langchain.com).

Learning from feedback has been a key part of building LLM systems almost from the beginning. ChatGPT - the application that took the world by storm - used [Reinforcement Learning from Human Feedback](https://huyenchip.com/2023/05/02/rlhf.html?ref=blog.langchain.com) (RLHF) to tame the model to a point where it could be used as a general purpose chatbot. Midjourney keeps on getting better and better - probably in large part due to the [feedback loop](https://x.com/DrJimFan/status/1643279641065713665?s=20&ref=blog.langchain.com) it has.

The intuition for learning from feedback is simple. If you can gather feedback (in some form) on how well model predictions do, you can then optimize the model to produce more results like that. If you could continually do this - then your model could [continually learn and improve](https://fullstackdeeplearning.com/course/2022/lecture-6-continual-learning/?ref=blog.langchain.com) over time. This fully automated continually learning is perhaps not here, but I think most practitioners would not debate the importance of gathering feedback.

Ever since we launched LangSmith, we placed an emphasis on making it easy to collect and track feedback. We make it easy to attach feedback to a run programmatically, allowing you to log things like thumbs up/down. We added a human annotation queue to allow reviewers to add feedback manually to runs. We adding filtering to allow you to filter to runs with particular feedback. We added monitoring to make it easy to track feedback in aggregated over time.

Still - so far we haven't provided much tooling or resources to make it easy for you to incorporate this feedback back into your application. We've been adding some features (still in beta for a few weeks) that power Self Learning GPTs and do exactly this.

## Self Learning GPTs

So how exactly does Self Learning GPTs work? It's relatively simple, and involves combining a bunch of different LangSmith features.

First, we trace all runs with LangSmith. This provides us with the full trace of a chatbot turn. Importantly - this is NOT just capturing the LLM call. This is capturing the full trace. We will go more into why this is so important later. As part of this, we log the UUID of the assistant that produced the run.

Second, we capture feedback in the form of thumbs up/down and log it to LangSmith. We attach it to the corresponding trace.

Third, we use a new LangSmith feature to automatically move relevant data from traces into a dataset specifically for that assistant. What this involves is:

- Creating a filter. Here, we want to grab all runs that have positive feedback (thumbs up).
- Selecting a dataset. We recorded the assistant UUID as part of the trace, so we can use this to move the data into a dataset specifically for that assistant. This is important so each assistant can build its own dataset (as we expect them to learn specific things).

Finally, we use the LangSmith SDK to pull down this dataset at run time and use the examples in the prompt as few-shot examples.

## LangSmith Automations

The key new thing which powers this is the automations which allow you to automatically move runs (according to some filter and sampling rate) into a dataset (or annotation queue). We will be rolling this out to everyone in a few weeks. In the meantime, if you are interested in early access please sign up [here](https://forms.gle/TUiy6McfTArproBu7?ref=blog.langchain.com).

## Importance

We are excited to showcase this for two reasons.

Mainly: this is a reliable way to automatically construct datasets of good examples. When talking with teams building LLM applications, they often don't have a dataset of good input/output pairs. They were often doing this process of collecting feedback and then moving to a dataset manually. This automates that and makes it easy for anyone to do.

Secondarily: incorporating them as few shot examples is a cheap and practical way to use this feedback to improve your application. Previously when collecting feedback, all we could use it for was helping to highlight datapoints you should look at. This is far more actionable.

Note that this is not the only way to use these datapoints. You could use them as test set to do regression testing against. You could use them to fine-tune a model. You could do dynamic selection of few shot examples. You could use these examples in a [DSPy](https://github.com/stanfordnlp/dspy?ref=blog.langchain.com) -like manner to optimize your LLM system.

## Optimization of LLM Systems

[DSPy](https://github.com/stanfordnlp/dspy?ref=blog.langchain.com) is a framework for algorithmically optimizing LLM prompts and weights. We have chatted in depth with [Omar](https://twitter.com/lateinteraction?ref=blog.langchain.com) about optimization of LLM systems and done an [initial integration](https://github.com/stanfordnlp/dspy/blob/main/examples/tweets/compiling_langchain.ipynb?ref=blog.langchain.com) with them. We build off of a lot of ideas in DSPy to create this example.

There are actually a lot of similarities between DSPy and LangChain. Mainly - they both deal with optimizations of LLM systems, not just of a single LLM call. A key component of this is *tracing*, a concept that both DSPy and LangChain place a lot of emphasis on. Tracing underpins a lot of the optimizations that DSPy does, and with LangSmith we've obviously placed a lot of emphasis on it as well.

Tracing the full system is particularly important because you will usually gather feedback at the system level, but there may be multiple distinct LLM calls inside the system that you want to optimize. Therefore, you need a way to associate the high level feedback with the lower-level LLM calls. This why it is necessary to have top-notch tracing - something that we've always emphasized in LangChain and LangSmith.

The current Self Optimizing GPTs doesn't go as far as DSPy. We just curate a few shot example dataset, we don't try to optimize which of the examples are best to select. That could easily be a next step. We've stopped short of that just because we believe that creating this dataset is already hugely helpful, and most companies are struggling to even do this.

We're very excited to explore more advanced ideas around optimization in the future. We'll be hosting a webinar with Omar on "Optimization of LLM Systems" in a few weeks - should be a fun one. [Register here](https://us06web.zoom.us/webinar/register/WN_n4HUNqhFQFa4ax3kYrZW8g?ref=blog.langchain.com).
