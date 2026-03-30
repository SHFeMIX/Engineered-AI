---
title: "Integrating LangChain with Azure Container Apps dynamic sessions"
site: "LangChain Blog"
published: 2024-05-16T17:57:28.000Z
source: "https://blog.langchain.com/integrating-langchain-with-azure-container-apps-dynamic-sessions/"
domain: "blog.langchain.com"
language: "en"
word_count: 687
---

# Integrating LangChain with Azure Container Apps dynamic sessions

Azure Container Apps dynamic sessions provide a secure, low-latency, reliable Python REPL API. With the new dynamic sessions LangChain integration, you can safely give your LangChain chains and agents the ability to write and execute Python code.

## The value of code execution

LLMs excel at solving complex problems but, just like human brains, struggle with certain computational tasks. While these current state-of-the-art models can explain intricate concepts like statistical mechanics, they may not be able to perform tasks like correctly computing the average of 10 floats. However, these models can proficiently write Python code to compute the average of a list of floats.

Just as computers ushered in a new era of human productivity by handling raw computations so that we could focus on defining algorithms and programmatic logic, code execution tools will also enhance LLM agents’ capabilities, leading to higher productivity and performance.

## Azure Container Apps dynamic sessions

Dynamic sessions is a new feature in Azure Container Apps that allows you to run LLM-generated code securely in a sandbox. You can augment the limitations of LLMs with mathematical computations by running their generated Python code securely in dynamic sessions without any containers’ knowledge needed.

Sessions have the following attributes:

- **Strong isolation**: Sessions are isolated from each other and from the host environment. Each session runs in its own Hyper-V sandbox, providing enterprise-grade security and isolation. Optionally, you can enable network isolation to further enhance security.
- **Fully managed**: The platform fully manages a session's lifecycle. Sessions are automatically cleaned up when no longer in use.
- **Fast startup**: A new session is allocated in about 100ms. Rapid start-ups are achieved by automatically maintaining a pool of ready but unallocated sessions.
- **Scalable**: Sessions can run at a high scale. You can run hundreds or thousands of sessions concurrently.
- **Data access**: You can upload files to a Session so that your code can interact with your data.
- **Private**: Files are written in the session's file system inside the Hyper-V isolation boundary. They are not accessible directly by default. They can be downloaded using an API.
- **Preinstalled packages**: Sessions comes with many of the most popular packages preinstalled, like NumPy, pandas, and scikit-learn. You can also run `!pip install ...` like in a notebook cell to add more (if egress is enabled).

For full documentation of the sessions API head to the [Azure Container Apps docs](https://learn.microsoft.com/en-us/azure/container-apps/sessions-code-interpreter?tabs=azure-cli&ref=blog.langchain.com).

## Using the LangChain integration

Getting started with the LangChain integration is simple. You can do the following:

1. Set up your Azure Container Apps service by following the instructions [here](https://learn.microsoft.com/en-us/azure/container-apps/sessions-code-interpreter?tabs=azure-cli&ref=blog.langchain.com#create-a-session-pool-with-azure-cli). Make sure to get your Sessions pool management endpoint as shown [here](https://learn.microsoft.com/en-us/azure/container-apps/sessions-code-interpreter?tabs=azure-cli&ref=blog.langchain.com#get-the-pool-management-api-endpoint-with-azure-cli).
2. Install the required dependencies

`!pip install langchain-azure-dynamic-sessions`

1. Import and run
```python
from langchain_azure_dynamic_sessions import SessionsPythonREPLTool

tool = SessionsPythonREPLTool(
    pool_management_endpoing="<<Enter Pool Management Endpoint>>",
)

code = """
import numpy as np

print("sampling 3 datapoints from standard normal distribution")

np.random.normal(size=3).tolist()
"""

# To get string output:
print(tool.invoke(code)))
```

This will generate a JSON string like:

```python
"""{
  "result": [
    0.34904792009397784,
    -2.237593977256981,
    1.2965825537776963,
  ],
  "stdout": "sampling 3 datapoints from standard normal distribution",
  "stderr": ""
}"""
```

If we want the raw outputs, not at as a string, we can use tool.execute()

```python
# To get dict output:
tool.execute(code)
```

This would return a dictionary with a list of floats for the "result":

```python
{
  "result": [
    0.34904792009397784,
    -2.237593977256981,
    1.2965825537776963,
  ],
  "stdout": "sampling 3 datapoints from standard normal distribution",
  "stderr": ""
}
```

Head to the [LangChain docs](https://python.langchain.com/v0.2/docs/integrations/tools/azure_dynamic_sessions/?ref=blog.langchain.com) to see how to upload files to a session, pass model-generated code to the tool, use the tool in an agent, and more.

## Data analyst agent with LangGraph

One of the most exciting use cases for Sessions is building agents that can analyze large datasets using code. In the below walkthrough we show how to build a data analyst agent using LangGraph and dynamic sessions:

![](https://www.youtube.com/watch?v=NsVnUz7sp_Y)

Here's the link to the agent [code](https://github.com/langchain-ai/langchain/blob/master/cookbook/azure_container_apps_dynamic_sessions_data_analyst.ipynb?ref=blog.langchain.com).

## Conclusion

Code executing tools are indispensable for data analysis and software engineering LLM application. With the new LangChain and Azure Container Apps dynamic sessions integration, you can write and execute Python code safely and with low latency.

Head to the [LangChain docs](https://python.langchain.com/v0.2/docs/integrations/tools/azure_dynamic_sessions/?ref=blog.langchain.com) to get started!
