---
title: "LangChain Integrates NVIDIA NIM for GPU-optimized LLM Inference in RAG"
site: "LangChain Blog"
published: 2024-03-18T22:00:45.000Z
source: "https://blog.langchain.com/nvidia-nim/"
domain: "blog.langchain.com"
language: "en"
word_count: 868
---

# LangChain Integrates NVIDIA NIM for GPU-optimized LLM Inference in RAG

Roughly a year and a half ago, OpenAI launched ChatGPT and the generative AI era really kicked off. Since then we’ve seen rapid growth and widespread adoption by all types of industries and all types of enterprises. As enterprises turn their attention from prototyping LLM applications to productionizing them, they often want to turn from third-party model services to self-hosted solutions. We’ve seen many folks struggle with this, and that’s why LangChain is so excited to integrate the new [NVIDIA NIM](https://nvidianews.nvidia.com/news/generative-ai-microservices-for-developers?ref=blog.langchain.com) inference microservices.

## What is NVIDIA NIM?

[NVIDIA NIM](https://developer.nvidia.com/blog/nvidia-nim-offers-optimized-inference-microservices-for-deploying-ai-models-at-scale/?ref=blog.langchain.com) is a set of easy-to-use microservices designed to accelerate the deployment of generative AI across enterprises. This versatile runtime supports a broad spectrum of AI models—from open-source community models to NVIDIA AI foundation models, as well as custom AI models. Leveraging industry-standard APIs, developers can quickly build enterprise-grade AI applications with just a few lines of code. Built on robust foundations including inference engines like [NVIDIA Triton Inference Server](https://www.nvidia.com/en-us/ai-data-science/products/triton-inference-server/?ref=blog.langchain.com), NVIDIA TensorRT, [NVIDIA TensorRT-LLM](https://developer.nvidia.com/blog/optimizing-inference-on-llms-with-tensorrt-llm-now-publicly-available/?ref=blog.langchain.com), and PyTorch, NIM is engineered to facilitate seamless AI inferencing at scale, ensuring that you can deploy AI applications anywhere with confidence. Whether working on premises or in the cloud, NIM is the fastest way to achieve accelerated generative AI inference at scale.

## Why are we excited about NVIDIA NIM?

There are a few reasons we are excited about NIM.

First, the big one: It’s all self-hosted. This means any data you send to NVIDIA-based models will never leave your premises. This is particularly exciting for RAG-based applications where you are often passing in sensitive data.

Second: It comes with several prebuilt containers out of the box. This makes it so that you can choose from the latest generative AI models without having to do much work.

Third: It’s scalable. It’s one thing to run models locally on your laptop. It’s another to host them as a service with the same reliability and uptime as you get from a managed service provider. Luckily, NIM is taking on this challenge for you.

## How can I get access to NVIDIA NIM?

Getting started with NIM is straightforward. Within the NVIDIA API catalog, developers can access a wide range of AI models to build and deploy generative AI applications. NIM is available as part of [NVIDIA AI Enterprise](https://www.nvidia.com/en-us/data-center/products/ai-enterprise/?ref=blog.langchain.com), an end-to-end, cloud-native software platform that streamlines the development and deployment of production-grade AI applications. Check out [this blog](https://developer.nvidia.com/blog/nvidia-nim-offers-optimized-inference-microservices-for-deploying-ai-models-at-scale/?ref=blog.langchain.com) for a step-by-step guide on how to get started.

## How can I use NVIDIA NIM with LangChain?

Finally, for the fun stuff. We’ve added a new integration package that supports NIM. To get started with the integration, you will need to install our dedicated integration package:

```python
pip install langchain_nvidia_ai_endpoints
```

After that, you can import models like:

```python
from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings, ChatNVIDIA
```

## Integration Example

For the rest of this document we will focus on building an example application. If you are more of a visual learner, you can find a video walkthrough [here](https://www.loom.com/share/d92b3cb9d86c4787ada2adb148e9a96b?ref=blog.langchain.com).

We will build a RAG application over part of the LangSmith documentation. To make it a little more interesting we will use an advanced retrieval method: hypothetical document embeddings (HyDE). The motivation for HyDE is that a search query may not be in a similar embedding space as the documents we are retrieving over. In order to fix this, we can use an LLM to generate a hypothetical document and then retrieve documents similar to that hypothetical document.

To get started, we will need to install some other packages.

```python
pip install langchain-community langchain-text-splitters faiss-cpu
```

We will then load some data we want to do RAG over - the LangSmith docs!

```python
from langchain_community.document_loaders import WebBaseLoader
loader = WebBaseLoader("https://docs.smith.langchain.com/user_guide")

docs = loader.load()
```

Before indexing the documents, we can then initialize our embedding model.

```python
from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings
embeddings = NVIDIAEmbeddings()
```

We can now perform the indexing step, using the FAISS vectorstore.

```python
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
documents = text_splitter.split_documents(docs)
vector = FAISS.from_documents(documents, embeddings)
retriever = vector.as_retriever()
```

We can then initialize our LLM:

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_nvidia_ai_endpoints import ChatNVIDIA
from langchain_core.output_parsers import StrOutputParser

model = ChatNVIDIA(model="mistral_7b")
```

Now, we will create our hypothetical document generator. This chain consists of a prompt, LLM, and a simple output parser.

```python
hyde_template = """Even if you do not know the full answer, generate a one-paragraph hypothetical answer to the below question:

{question}"""
hyde_prompt = ChatPromptTemplate.from_template(hyde_template)
hyde_query_transformer = hyde_prompt | model | StrOutputParser()
```

We can then wrap this chain and the original retriever into a new chain:

```python
from langchain_core.runnables import chain

@chain
def hyde_retriever(question):
    hypothetical_document = hyde_query_transformer.invoke({"question": question})
    return retriever.invoke(hypothetical_document)
```

We can then create the chain that will take the retrieved documents and the question to produce a final answer:

```python
template = """Answer the question based only on the following context:
{context}

Question: {question}
"""
prompt = ChatPromptTemplate.from_template(template)
answer_chain = prompt | model | StrOutputParser()
```

Finally, we can combine this with the hypothetical document retriever to create a final chain:

```python
@chain
def final_chain(question):
    documents = hyde_retriever.invoke(question)
    for s in answer_chain.stream({"question": question, "context": documents}):
        yield s
```

Notice that we yield back tokens so that we can stream this final chain! Let’s give it a go:

```python
for s in final_chain.stream("how can langsmith help with testing"):
    print(s, end="")
```
