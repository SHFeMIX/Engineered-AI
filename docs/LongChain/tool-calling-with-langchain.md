---
title: "Tool Calling with LangChain"
site: "LangChain Blog"
published: 2024-04-11T16:46:57.000Z
source: "https://blog.langchain.com/tool-calling-with-langchain/"
domain: "blog.langchain.com"
language: "en"
word_count: 1511
---

# Tool Calling with LangChain

**TLDR: We are introducing a new `tool_calls` attribute on `AIMessage`. More and more LLM providers are exposing API’s for reliable tool calling. The goal with the new attribute is to provide a standard interface for interacting with tool invocations. This is fully backwards compatible and is supported on all models that have native tool-calling support. In order to access these latest features you will need to upgrade your `langchain_core` and partner package versions.**

[**YouTube Walkthrough**](https://youtu.be/zCwuAlpQKTM?ref=blog.langchain.com)

**Python:**

- [**List of chat models**](https://python.langchain.com/docs/integrations/chat/?ref=blog.langchain.com) **that shows status of tool calling capability**
- [**Tool calling**](https://python.langchain.com/docs/modules/model_io/chat/function_calling/?ref=blog.langchain.com) **explains the new tool calling interface**
- [**Tool calling agent**](https://python.langchain.com/docs/modules/agents/agent_types/tool_calling/?ref=blog.langchain.com) **shows how to create an agent that uses the standardized tool calling interface**
- [**LangGraph notebook**](https://github.com/langchain-ai/langchain/blob/master/cookbook/tool_call_messages.ipynb?ref=blog.langchain.com) **shows how to create a LangGraph agent that uses the standardized tool calling interface**

**JS:**

- [**List of chat models**](https://js.langchain.com/docs/integrations/chat/?ref=blog.langchain.com) **that shows status of tool calling capability**
- [**Tool calling**](https://js.langchain.com/docs/modules/model_io/chat/function_calling/?ref=blog.langchain.com) **explains the new tool calling interface**
- [**Tool calling agent**](https://js.langchain.com/docs/modules/agents/agent_types/tool_calling/?ref=blog.langchain.com) **shows how to create an agent that uses the standardized tool calling interface**

---

## Intro

Large Language Models (LLMs) can interact with external data sources via tool calling functionality. Tool calling is a powerful technique that allows developers to build sophisticated applications that can leverage LLMs to access, interact and manipulate external resources like databases, files and APIs.

Providers have been introducing native tool calling capability into their models. What this looks like in practice is that when the LLM provides an auto-completion to a prompt, it can return a list of tool invocations in addition to plain text. OpenAI was the first to release this roughly a year ago with “function calling”, which quickly evolved to “tool calling” in November. Since then, other model providers have followed: Gemini (in December), Mistral (in February), Fireworks (in March), Together (in March), Groq (in April), Cohere (in April) and Anthropic (in April).

All of these providers exposed slightly different interfaces (in particular: OpenAI, Anthropic, and Gemini, the three highest performing models are incompatible). We’ve heard a desire from the community for a standardized interface for tool calling to make it easy to switch between these providers, which we’re excited to release today.

The standard interface consists of:

- `ChatModel.bind_tools()`: a method for attaching tool definitions to model calls.
- `AIMessage.tool_calls`: an attribute on the `AIMessage` returned from the model for easily accessing the tool calls the model decided to make.
- `create_tool_calling_agent()`: an agent constructor that works with ANY model that implements `bind_tools` and returns `tool_calls`.

Let’s take a look at each of these components.

## ChatModel.bind\_tools(...)

To allow a model to use tools, we need to tell it which tools are available. We do this by specifying passing a list of of tool definitions to the model, including a schema for the tool arguments. The exact format of the tool definitions is model provider-dependent — OpenAI expects a dictionary with “name”, “description”, and “parameters” keys, while Anthropic expects “name”, “description”, and “input\_schema”.

`ChatModel.bind_tools` provides a standard interface implemented by all tool-calling models that lets you specify which tools are available to the model. You can pass in not just a raw tool definition (a dict), but also objects from which a tool definition can be derived: namely Pydantic classes, LangChain tools, and arbitrary functions. This makes it easy to create generic tool definitions that you can use with any tool-calling model:

```python
from langchain_anthropic import ChatAnthropic
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_core.tools import tool

# ✅ Pydantic class
class multiply(BaseModel):
    """Return product of 'x' and 'y'."""
    x: float = Field(..., description="First factor")
    y: float = Field(..., description="Second factor")
    
# ✅ LangChain tool
@tool
def exponentiate(x: float, y: float) -> float:
    """Raise 'x' to the 'y'."""
    return x**y
    
# ✅ Function

def subtract(x: float, y: float) -> float:
    """Subtract 'x' from 'y'."""
    return y-x
    
# ✅ OpenAI-format dict
# Could also pass in a JSON schema with "title" and "description" 
add = {
  "name": "add",
  "description": "Add 'x' and 'y'.",
  "parameters": {
    "type": "object",
    "properties": {
      "x": {"type": "number", "description": "First number to add"},
      "y": {"type": "number", "description": "Second number to add"}
    },
    "required": ["x", "y"]
  }
}

llm = ChatAnthropic(model="claude-3-sonnet-20240229", temperature=0)

# Whenever we invoke \`llm_with_tool\`, all three of these tool definitions
# are passed to the model.
llm_with_tools = llm.bind_tools([multiply, exponentiate, add, subtract])
```

If we wanted to use a different tool-calling model, our code would look very similar:

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4-turbo", temperature=0)
llm_with_tools = llm.bind_tools([multiply, exponentiate, add, subtract])
```

So what would calling `llm_with_tools` look like? That’s where `AIMessage.tool_calls` comes in.

## AIMessage.tool\_calls

Before when using a tool-calling model, any tool invocations returned by the model were found in either `AIMessage.additional_kwargs` or `AIMessage.content`, depending on the model provider’s API, and followed a provider-specific format. That is, you’d need custom logic to extract the tool invocations from the outputs of different models. Now, `AIMessage.tool_calls` provides a standardized interface for getting model tool invocations. So after calling a model with bound tools, you'll get an output of the form:

```python
llm_with_tools.invoke([
    ("system", "You're a helpful assistant"), 
    ("human", "what's 5 raised to the 2.743"),
])

# 👀 Notice the tool_calls attribute 👀

# -> AIMessage(
#       content=..., 
#       additional_kwargs={...},
#       tool_calls=[{'name': 'exponentiate', 'args': {'y': 2.743, 'x': 5.0}, 'id': '54c166b2-f81a-481a-9289-eea68fc84e4f'}]
#       response_metadata={...}, 
#       id='...'
#   )
```

where the `AIMessage` has a `tool_calls: List[ToolCall]` attribute that will be populated if there are any tool invocations and will follow a standard interface for the tool calls:

```python
class ToolCall(TypedDict):
  name: str
  args: Dict[str, Any]
    id: Optional[str]
```

That is, whether you’re calling Anthropic, OpenAI, Gemini, etc., whenever there’s a tool call it will be in `AIMessage.tool_calls` as a `ToolCall`.

There’s a few other attributes we’ve added for handling streamed tool call chunks and invalid tool calls. Read more about those in the tool-calling docs [here](https://python.langchain.com/docs/modules/model_io/chat/function_calling/?ref=blog.langchain.com).

## create\_tool\_calling\_agent()

One of the most powerful and obvious uses for LLM tool-calling abilities is to build agents. LangChain already has a `create_openai_tools_agent()` constructor that makes it easy to build an agent with tool-calling models that adhere to the OpenAI tool-calling API, but this won’t work for models like Anthropic and Gemini. Thanks to the new `bind_tools()` and `tool_calls` interfaces, we’ve added a `create_tool_calling_agent()` that works with any tool-calling model.

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import ConfigurableField
from langchain_core.tools import tool
from langchain.agents import create_tool_calling_agent, AgentExecutor

@tool
def multiply(x: float, y: float) -> float:
    """Multiply 'x' times 'y'."""
    return x * y

@tool
def exponentiate(x: float, y: float) -> float:
    """Raise 'x' to the 'y'."""
    return x**y

@tool
def add(x: float, y: float) -> float:
    """Add 'x' and 'y'."""
    return x + y

prompt = ChatPromptTemplate.from_messages([
    ("system", "you're a helpful assistant"), 
    ("human", "{input}"), 
    ("placeholder", "{agent_scratchpad}"),
])

tools = [multiply, exponentiate, add]

llm = ChatAnthropic(model="claude-3-sonnet-20240229", temperature=0)

agent = create_tool_calling_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

agent_executor.invoke({"input": "what's 3 plus 5 raised to the 2.743. also what's 17.24 - 918.1241", })
```

We could use VertexAI instead

```python
from langchain_google_vertexai import ChatVertexAI

llm = ChatVertexAI(
    model="gemini-pro", 
    temperature=0, 
    convert_system_message_to_human=True
)
agent = create_tool_calling_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

agent_executor.invoke({"input": "what's 3 plus 5 raised to the 2.743. also what's 17.24 - 918.1241", })
```

Or OpenAI

```python
llm = ChatOpenAI(model="gpt-3.5-turbo-0125", temperature=0)

agent = create_tool_calling_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

agent_executor.invoke({"input": "what's 3 plus 5 raised to the 2.743. also what's 17.24 - 918.1241", })
```

etc.

For full docs on the new agent see [here](https://python.langchain.com/docs/modules/agents/agent_types/tool_calling/?ref=blog.langchain.com).

## LangGraph

If you haven’t already checked out [LangGraph](https://python.langchain.com/docs/langgraph/?ref=blog.langchain.com), you absolutely should. It is an extension of LangChain that makes it easy to construct arbitrary agent and multi-agent flows. As you can imagine, using the new `tool_calls` interface also makes life simpler when constructing LangGraph agents or flows. Check out the [notebook here](https://github.com/langchain-ai/langchain/blob/master/cookbook/tool_call_messages.ipynb?ref=blog.langchain.com) for a detailed walkthrough of how to use `tool_calls` in a LangGraph agent.

## with\_structured\_output

We recently released the `ChatModel.with_structured_output()` interface for getting structured outputs from a model, which is very related. While the exact implementation varies by model provider, `with_structured_output` is built *on top* of tool-calling for most models that support it. Under the hood, `with_structured_output` uses `bind_tools` to pass the given structured output schema to the model.

So when should you use `with_structured_output` versus binding tools and reading tool calls directly?

`with_structured_output` always returns a structured output in the schema that you specified. This is useful when you want to force the LLM to output information that matches a specific schema. This is useful for information extraction tasks.

`bind_tools` is more general and can select a specific tool - or no tool, or multiple tools! This is useful when you want to allow the LLM to have more flexibility in how it should respond - for example, in agent applications where you need to choose which tools to invoke but also respond to the user.

## Conclusion

We expect that the trend to introduce native tool calling capabilities into LLMs will continue in the future. We hope that the standardized tool calling interface can help save LangChain users time and effort and allow them to switch between different LLM providers more easily.

Remember to update your `langchain_core` and partner package versions to leverage the new interfaces!

We’d love to [hear any feedback](https://github.com/langchain-ai/langchain/discussions/20343?ref=blog.langchain.com) from you!
