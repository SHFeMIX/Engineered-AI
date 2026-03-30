---
title: "Self-Reflective RAG with LangGraph"
site: "LangChain Blog"
published: 2024-02-07T16:47:25.000Z
source: "https://blog.langchain.com/agentic-rag-with-langgraph/"
domain: "blog.langchain.com"
language: "en"
word_count: 1303
---

# Self-Reflective RAG with LangGraph

### Key Links

### Motivation

Because most LLMs are only periodically trained on a large corpus of public data, they lack recent information and / or private data that is inaccessible for training. **R** etrieval **a** ugmented **g** eneration (RAG) is a central paradigm in LLM application development to address this by connecting LLMs to external data sources (see our [video series](https://www.youtube.com/watch?v=wd7TZ4w1mSw&feature=youtu.be&ref=blog.langchain.com) and [blog post](https://blog.langchain.com/deconstructing-rag/)). The basic RAG pipeline involves embedding a user query, **retrieving** relevant documents to the query, and passing the documents to an LLM for **generation** of an answer grounded in the retrieved context.

![](https://blog.langchain.com/content/images/2024/02/image-16.png)

Basic RAG flow

### Self-Reflective RAG

In practice, many have found that implementing RAG requires logical reasoning around these steps: for example, we can ask when to retrieve (based upon the question and composition of the index), when to re-write the question for better retrieval, or when to discard irrelevant retrieved documents and re-try retrieval? The term **self-reflective RAG** ([paper](https://arxiv.org/abs/2310.11511?ref=blog.langchain.com)) has been introduced, which captures the idea of using an LLM to self-correct poor quality retrieval and / or generations.

The basic RAG flow (shown above) simply uses a **chain**: the LLM determines what to generate based upon the retrieved documents. Some RAG flows use **routing**, where an LLM decides between, for example, different retrievers based on the question. But self-reflective RAG usually requires some kind of feedback, re-generating the question and / or re-retrieving documents. **State machines** are a third kind of [cognitive architecture](https://blog.langchain.com/openais-bet-on-a-cognitive-architecture/) that supports loops and it well suited for this: a state machine simply lets us define a set of steps (e.g., retrieval, grade documents, re-write query) and set the transitions options between them; e.g., if our retrieved docs are not relevant, then re-write the query and re-retrieve new documents.

![](https://blog.langchain.com/content/images/2024/02/image-14.png)

Cognitive architectures for RAG

### Self-Reflective RAG with LangGraph

We recently launched [LangGraph](https://python.langchain.com/docs/langgraph?ref=blog.langchain.com), which is an easy way to implement LLM state machines. This gives us a lot of flexibility in the layout of diverse [RAG flows](https://x.com/hwchase17/status/1748089843698290840?s=20&ref=blog.langchain.com) and supports the more general process of "flow engineering" for RAG with specific decision points (e.g., document grading) and loops (e.g., re-try retrieval).

![](https://blog.langchain.com/content/images/2024/02/image-15.png)

State machines let us design more complex RAG "flows"

To highlight the flexibility of LangGraph, we'll use it to implement ideas inspired from two interesting and recent self-reflective RAG papers, [CRAG](https://arxiv.org/pdf/2401.15884.pdf?ref=blog.langchain.com) and [Self-RAG](https://arxiv.org/pdf/2310.11511.pdf?ref=blog.langchain.com).

### Corrective RAG (CRAG)

Corrective RAG (CRAG) introduces a few interesting ideas ([paper](https://arxiv.org/pdf/2401.15884.pdf?ref=blog.langchain.com)):

- Employ a lightweight **retrieval evaluator** to assess the overall quality of retrieved documents for a query, returning a confidence score for each.
- Perform **web-based document retrieval to supplement context** if vectorstore retrieval is deemed ambiguous or irrelevant to the user query.
- Perform **knowledge refinement** of retrieved document by partitioning them into "knowledge strips", grading each strip, and filtering our irrelevant ones.
![Screenshot 2024-02-04 at 2.50.32 PM.png](https://blog.langchain.com/content/images/2024/02/data-src-image-cf1895bb-6a72-4775-a2a0-24a5aa0ffa05.png)

Diagram for CRAG

We can represent this as a graph, making a few simplifications and adjustment for illustrative purposes (of course, this can be customized and extended as desired):

- We will skip the knowledge refinement phase as a first pass. It represents an interesting and valuable form of post-processing, but is not essential for understanding how to lay out this workflow in LangGraph.
- If *any* document is irrelevant, we'll supplement retrieval with web search. We'll use [Tavily Search](https://python.langchain.com/docs/integrations/tools/tavily_search?ref=blog.langchain.com) API [for web search](https://tavily.com/?ref=blog.langchain.com), which is rapid and convenient.
- We'll use query re-writing to optimize the query for web search.
- For binary decisions, we use Pydantic to model the output and supply this function as an OpenAI tool that is [called every time the LLM is run](https://python.langchain.com/docs/modules/model_io/chat/function_calling?ref=blog.langchain.com#binding-functions). This lets us model the output of conditional edges where consistent binary logic is critical.
![Screenshot 2024-02-04 at 1.32.52 PM.png](https://blog.langchain.com/content/images/2024/02/data-src-image-811e0f40-3d76-4ab9-9d0d-a720ffdd380b.png)

LangGraph implementation for CRAG

We lay this out in an [example notebook](https://github.com/langchain-ai/langgraph/blob/main/examples/rag/langgraph_crag.ipynb?ref=blog.langchain.com) and index [three](https://lilianweng.github.io/posts/2023-06-23-agent/?ref=blog.langchain.com) [blog](https://lilianweng.github.io/posts/2023-03-15-prompt-engineering?ref=blog.langchain.com) [posts](https://lilianweng.github.io/posts/2023-03-15-prompt-engineering?ref=blog.langchain.com). We can see a trace [here](https://smith.langchain.com/public/af0a82ae-69e6-4314-9c63-03ca49e56864/r?ref=blog.langchain.com) highlighting the usage when asked about information found in the blog posts: the logical flow across our nodes is clearly enumerated.

![](https://blog.langchain.com/content/images/2024/02/image-3.png)

Four types of tokens used in Self-RAG

In contrast, we ask a question out of domain for the blog posts. The trace [here](https://smith.langchain.com/public/615c9263-7e0b-4307-93c1-aa9d7c3298b7/r?ref=blog.langchain.com) shows that we invokes on the lower path of our conditional edge and gather supplementary documents from [Tavily](https://python.langchain.com/docs/integrations/tools/tavily_search?ref=blog.langchain.com) web search used in final generation.

![](https://blog.langchain.com/content/images/2024/02/image-4.png)

Four types of tokens used in Self-RAG

### Self-RAG

Self-RAG is a related approach with several other interesting RAG ideas ([paper](https://arxiv.org/pdf/2310.11511.pdf?ref=blog.langchain.com)). The framework trains an LLM to generate self-reflection tokens that govern various stages in the RAG process. Here is a summary of the tokens:

- `Retrieve` token decides to retrieve `D` chunks with input `x (question)` OR `x (question)`, `y (generation)`. The output is `yes, no, continue`
- `ISREL` token decides whether passages `D` are relevant to `x` with input (`x (question)`, `d (chunk)`) for `d` in `D`. The output is `relevant, irrelevant`.
1. `ISSUP` token decides whether the LLM generation from each chunk in `D` is relevant to the chunk. The input is `x`, `d`, `y` for `d` in `D`. It confirm all of the verification-worthy statements in `y (generation)` are supported by `d`. Output is `fully supported, partially supported, no support`.
2. `ISUSE` token decides whether generation from each chunk in `D` is a useful response to `x`. The input is `x`, `y` for `d` in `D`. Output is `{5, 4, 3, 2, 1}.`

This table in the paper supplements the above information:

![](https://blog.langchain.com/content/images/2024/02/image-5.png)

Four types of tokens used in Self-RAG

We can outline this as simplified graph to understand the information flow:

![Screenshot 2024-02-02 at 1.36.44 PM.png](https://blog.langchain.com/content/images/2024/02/data-src-image-ebf55e8c-de51-49b8-9f32-94ccbf24741f.png)

Schematic graph of the flow used in Self-RAG

We can represent this in LangGraph, making a few simplifications / adjustments for illustrative purposes (this can be customized and extended as desired):

- As above, we grade each retrieved document. If *any* are relevant, we proceed to generation. If *all* are irrelevant, then we will transform the query to formulate an improved question and re-retrieve. Note: we could employ the idea above from CRAG (Web search) are a supplementary node in this path!
- The paper will perform a generation from *each* chunk and grade it twice. Instead, we perform a single generation from all relevant documents. The generation is then graded relative to the documents (e.g., to guard against hallucinations) and relative to the answer, as above. This reduces the number of LLM calls and improves latency, and allows for consolidation of more context into the generation. Of course, producing generations per chunk and grading them in isolation is an easy adaption if more control is required.
![](https://blog.langchain.com/content/images/2024/02/image-6.png)

LangGraph implementation for Self-RAG

[Here](https://smith.langchain.com/public/c4cc439e-2d1c-48cd-8c01-1d4a9dcf8dbf/r?ref=blog.langchain.com) is an example trace that highlights the ability of active RAG to self-correct. The question is `Explain how the different types of agent memory work?`. All four documents were deemed relevant, the generation versus documents check passes, but the generation was not deemed fully useful to the question.

We then see the loop re-initiate with a re-formulated query [here](https://smith.langchain.com/public/2dd33136-749b-4028-90cd-07cbcfb8aa53/r?ref=blog.langchain.com): `How do the various types of agent memory function?`. One of out of four documents is filtered because it is not relevant ([here](https://smith.langchain.com/public/532b6b7d-ff97-4f70-a731-664b3a47e458/r?ref=blog.langchain.com)). The generation then passes both checks:

`The various types of agent memory include sensory memory, short-term memory, and long-term memory. Sensory memory retains impressions of sensory information for a few seconds. Short-term memory is utilized for in-context learning and prompt engineering. Long-term memory allows the agent to retain and recall information over extended periods, often by leveraging an external vector store.`

The overall trace is fairly easy to audit, with the nodes clearly laid out:

![](https://blog.langchain.com/content/images/2024/02/image-7.png)

### Conclusion

Self-reflection can greatly enhance RAG, enabling correction of poor quality retrieval or generations. Several recent RAG papers focus on this theme, but implementing the ideas can be tricky. Here, we show that LangGraph can be easily used for "flow engineering" of self-reflective RAG. We provide cookbooks for implementing ideas from two interesting papers, [Self-RAG](https://arxiv.org/pdf/2310.11511.pdf?ref=blog.langchain.com) and [CRAG](https://arxiv.org/pdf/2401.15884.pdf?ref=blog.langchain.com).
