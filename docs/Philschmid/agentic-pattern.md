---
title: "Zero to One: Learning Agentic Patterns"
site: "Philipp Schmid"
published: "2025-05-05"
source: "https://www.philschmid.de/agentic-pattern"
domain: ""
language: "en"
word_count: 3067
---

# Zero to One: Learning Agentic Patterns

May 5, 202516 minute read [View Code](https://github.com/philschmid/gemini-samples/blob/main/guides/agentic-pattern.ipynb)

AI agents. Agentic AI. Agentic architectures. Agentic workflows. Agentic patterns. Agents are everywhere. But what exactly *are* they, and how do we build robust and effective agentic systems? While the term "agent" is used broadly, a key characteristic is their ability to dynamically plan and execute tasks, often leveraging external tools and memory to achieve complex goals.

This post aims to explore common design patterns. Think of these patterns as blueprints or reusable templates for building AI applications. Understanding them provides a mental model for tackling complex problems and designing systems that are scalable, modular, and adaptable.

We'll dive into several common patterns, differentiating between more structured **workflows** and more dynamic **agentic patterns**. Workflows typically follow predefined paths, while agents have more autonomy in deciding their course of action.

**Why Do (Agentic) Patterns Matter?**

- Patterns provide a structured way to think and design systems.
- Patterns allow us to build and grow AI applications in complexity and adapt to changing requirements. Modular designs based on patterns are easier to modify and extend.
- Patterns help manage the complexity of coordinating multiple agents, tools, and workflows by offering proven, reusable templates. They promote best practices and shared understanding among developers.

**When (and When Not) to Use Agents?**

Before diving into patterns, it's crucial to consider *when* an agentic approach is truly necessary.

- Always seek the simplest solution first. If you know the exact steps required to solve a problem, a fixed workflow or even a simple script might be more efficient and reliable than a agent.
- Agentic systems often trade increased latency and computational cost for potentially better performance on complex, ambiguous, or dynamic tasks. Be sure the benefits outweigh these costs.
- Use **workflows** for predictability and consistency when dealing with well-defined tasks where the steps are known.
- Use **agents** when flexibility, adaptability, and model-driven decision-making are needed.
- Keep it Simple (Still): Even when building agentic systems, strive for the simplest effective design. Overly complex agent can become difficult to debug and manage.
- Agency introduces inherent unpredictability and potential errors. Agentic systems must incorporate robust error logging, exception handling, and retry mechanisms, allowing the system (or the underlying LLM) a chance to self-correct.

Below, we'll explore 3 common workflow patterns and 4 agentic patterns. We'll illustrate each using pure API calls, without relying on specific frameworks like LangChain, LangGraph, LlamaIndex, or CrewAI, to focus on the core concepts.

## Pattern Overview

We will cover the following patterns:

- [Pattern Overview](https://www.philschmid.de/agentic-pattern#pattern-overview)
- [Workflow: Prompt Chaining](https://www.philschmid.de/agentic-pattern#workflow-prompt-chaining)
- [Workflow: Routing or Handoff](https://www.philschmid.de/agentic-pattern#workflow-routing-or-handoff)
- [Workflow: Parallelization](https://www.philschmid.de/agentic-pattern#workflow-parallelization)
- [Reflection Pattern](https://www.philschmid.de/agentic-pattern#reflection-pattern)
- [Tool Use Pattern](https://www.philschmid.de/agentic-pattern#tool-use-pattern)
- [Planning Pattern (Orchestrator-Workers)](https://www.philschmid.de/agentic-pattern#planning-pattern-orchestrator-workers)
- [Multi-Agent Pattern](https://www.philschmid.de/agentic-pattern#multi-agent-pattern)

## Workflow: Prompt Chaining

![](https://www.philschmid.de/static/blog/agentic-pattern/prompt-chaining.png)

The output of one LLM call sequentially feeds into the input of the next LLM call. This pattern decomposes a task into a fixed sequence of steps. Each step is handled by an LLM call that processes the output from the preceding one. It's suitable for tasks that can be cleanly broken down into predictable, sequential subtasks.

Use Cases:

- Generating a structured document: LLM 1 creates an outline, LLM 2 validates the outline against criteria, LLM 3 writes the content based on the validated outline.
- Multi-step data processing: Extracting information, transforming it, and then summarizing it.
- Generating newsletters based on curated inputs.

```python
import os
from google import genai
 
# Configure the client (ensure GEMINI\_API\_KEY is set in your environment)
client = genai.Client(api\_key=os.environ["GEMINI\_API\_KEY"])
 
# --- Step 1: Summarize Text ---
original\_text = "Large language models are powerful AI systems trained on vast amounts of text data. They can generate human-like text, translate languages, write different kinds of creative content, and answer your questions in an informative way."
prompt1 = f"Summarize the following text in one sentence: {original\_text}"
 
# Use client.models.generate\_content
response1 = client.models.generate\_content(
    model='gemini-2.0-flash',
    contents=prompt1
)
summary = response1.text.strip()
print(f"Summary: {summary}")
 
# --- Step 2: Translate the Summary ---
prompt2 = f"Translate the following summary into French, only return the translation, no other text: {summary}"
 
# Use client.models.generate\_content
response2 = client.models.generate\_content(
    model='gemini-2.0-flash',
    contents=prompt2
)
translation = response2.text.strip()
print(f"Translation: {translation}")
```

## Workflow: Routing

![](https://www.philschmid.de/static/blog/agentic-pattern/routing-or-handoff.png)

An initial LLM acts as a router, classifying the user's input and directing it to the most appropriate specialized task or LLM. This pattern implements a separation of concerns and allows for optimizing individual downstream tasks (using specialized prompts, different models, or specific tools) in isolation. It improves efficiency and potentially reduces costs by using smaller models for simpler tasks. When a task is routed, the selected agent "takes over" responsibility for completion.

Use Cases:

- Customer support systems: Routing queries to agents specialized in billing, technical support, or product information.
- Tiered LLM usage: Routing simple queries to faster, cheaper models (like Llama 3.1 8B) and complex or unusual questions to more capable models (like Gemini 1.5 Pro).
- Content generation: Routing requests for blog posts, social media updates, or ad copy to different specialized prompts/models.

```python
import os
import json
from google import genai
from pydantic import BaseModel
import enum
 
# Configure the client (ensure GEMINI\_API\_KEY is set in your environment)
client = genai.Client(api\_key=os.environ["GEMINI\_API\_KEY"])
 
# Define Routing Schema
class Category(enum.Enum):
    WEATHER = "weather"
    SCIENCE = "science"
    UNKNOWN = "unknown"
 
class RoutingDecision(BaseModel):
    category: Category
    reasoning: str
 
# Step 1: Route the Query
user\_query = "What's the weather like in Paris?"
# user\_query = "Explain quantum physics simply."
# user\_query = "What is the capital of France?"
 
prompt\_router = f"""
Analyze the user query below and determine its category.
Categories:
- weather: For questions about weather conditions.
- science: For questions about science.
- unknown: If the category is unclear.
 
Query: {user\_query}
"""
 
# Use client.models.generate\_content with config for structured output
response\_router = client.models.generate\_content(
    model= 'gemini-2.0-flash-lite',
    contents=prompt\_router,
    config={
        'response\_mime\_type': 'application/json',
        'response\_schema': RoutingDecision,
    },
)
print(f"Routing Decision: Category={response\_router.parsed.category}, Reasoning={response\_router.parsed.reasoning}")
 
# Step 2: Handoff based on Routing
final\_response = ""
if response\_router.parsed.category == Category.WEATHER:
    weather\_prompt = f"Provide a brief weather forecast for the location mentioned in: '{user\_query}'"
    weather\_response = client.models.generate\_content(
        model='gemini-2.0-flash',
        contents=weather\_prompt
    )
    final\_response = weather\_response.text
elif response\_router.parsed.category == Category.SCIENCE:
    science\_response = client.models.generate\_content(
        model="gemini-2.5-flash-preview-04-17",
        contents=user\_query
    )
    final\_response = science\_response.text
else:
    unknown\_response = client.models.generate\_content(
        model="gemini-2.0-flash-lite",
        contents=f"The user query is: {prompt\_router}, but could not be answered. Here is the reasoning: {response\_router.parsed.reasoning}. Write a helpful response to the user for him to try again."
    )
    final\_response = unknown\_response.text
print(f"\nFinal Response: {final\_response}")
```

## Workflow: Parallelization

![](https://www.philschmid.de/static/blog/agentic-pattern/parallelization.png)

A task is broken down into independent subtasks that are processed simultaneously by multiple LLMs, with their outputs being aggregated. This pattern uses concurrency for tasks. The initial query (or parts of it) is sent to multiple LLMs in parallel with individual prompts/goals. Once all branches are complete, their individual results are collected and passed to a final aggregator LLM, which synthesizes them into the final response. This can improve latency if subtasks don't depend on each other, or enhance quality through techniques like majority voting or generating diverse options.

Use Cases:

- RAG with query decomposition: Breaking a complex query into sub-queries, running retrievals for each in parallel, and synthesizing the results.
- Analyzing large documents: Dividing the document into sections, summarizing each section in parallel, and then combining the summaries.
- Generating multiple perspectives: Asking multiple LLMs the same question with different persona prompts and aggregating their responses.
- Map-reduce style operations on data.

```python
import os
import asyncio
import time
from google import genai
 
# Configure the client (ensure GEMINI\_API\_KEY is set in your environment)
client = genai.Client(api\_key=os.environ["GEMINI\_API\_KEY"])
 
async def generate\_content(prompt: str) -\> str:
        response = await client.aio.models.generate\_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        return response.text.strip()
 
async def parallel\_tasks():
    # Define Parallel Tasks
    topic = "a friendly robot exploring a jungle"
    prompts = [
        f"Write a short, adventurous story idea about {topic}.",
        f"Write a short, funny story idea about {topic}.",
        f"Write a short, mysterious story idea about {topic}."
    ]
    # Run tasks concurrently and gather results
    start\_time = time.time()
    tasks = [generate\_content(prompt) for prompt in prompts]
    results = await asyncio.gather(*tasks)
    end\_time = time.time()
    print(f"Time taken: {end\_time - start\_time} seconds")
 
    print("\n--- Individual Results ---")
    for i, result in enumerate(results):
        print(f"Result {i+1}: {result}\n")
 
    # Aggregate results and generate final story
    story\_ideas = '\n'.join([f"Idea {i+1}: {result}" for i, result in enumerate(results)])
    aggregation\_prompt = f"Combine the following three story ideas into a single, cohesive summary paragraph:{story\_ideas}"
    aggregation\_response = await client.aio.models.generate\_content(
        model="gemini-2.5-flash-preview-04-17",
        contents=aggregation\_prompt
    )
    return aggregation\_response.text
    
 
result = await parallel\_tasks()
print(f"\n--- Aggregated Summary ---\n{result}")
```

## Reflection Pattern

![](https://www.philschmid.de/static/blog/agentic-pattern/reflection.png)

An agent evaluates its own output and uses that feedback to refine its response iteratively. This pattern is also known as Evaluator-Optimizer and uses a self-correction loop. An initial LLM generates a response or completes a task. A second LLM step (or even the same LLM with a different prompt) then acts as a reflector or evaluator, critiquing the initial output against the requirements or desired quality. This critique (feedback) is then fed back, prompting the LLM to produce a refined output. This cycle can repeat until the evaluator confirms the requirements are met or a satisfing output is achieved.

Use Cases:

- Code generation: Writing code, executing it, using error messages or test results as feedback to fix bugs.
- Writing and refinement: Generating a draft, reflecting on its clarity and tone, and then revising it.
- Complex problem solving: Generating a plan, evaluating its feasibility, and refining it based on the evaluation.
- Information retrieval: Searching for information and using an evaluator LLM to check if all required details were found before presenting the answer.

```python
import os
import json
from google import genai
from pydantic import BaseModel
import enum
 
# Configure the client (ensure GEMINI\_API\_KEY is set in your environment)
client = genai.Client(api\_key=os.environ["GEMINI\_API\_KEY"])
 
class EvaluationStatus(enum.Enum):
    PASS = "PASS"
    FAIL = "FAIL"
 
class Evaluation(BaseModel):
    evaluation: EvaluationStatus
    feedback: str
    reasoning: str
 
# --- Initial Generation Function ---
def generate\_poem(topic: str, feedback: str = None) -\> str:
    prompt = f"Write a short, four-line poem about {topic}."
    if feedback:
        prompt += f"\nIncorporate this feedback: {feedback}"
    
    response = client.models.generate\_content(
        model='gemini-2.0-flash',
        contents=prompt
    )
    poem = response.text.strip()
    print(f"Generated Poem:\n{poem}")
    return poem
 
# --- Evaluation Function ---
def evaluate(poem: str) -\> Evaluation:
    print("\n--- Evaluating Poem ---")
    prompt\_critique = f"""Critique the following poem. Does it rhyme well? Is it exactly four lines? 
Is it creative? Respond with PASS or FAIL and provide feedback.
 
Poem:
{poem}
"""
    response\_critique = client.models.generate\_content(
        model='gemini-2.0-flash',
        contents=prompt\_critique,
        config={
            'response\_mime\_type': 'application/json',
            'response\_schema': Evaluation,
        },
    )
    critique = response\_critique.parsed
    print(f"Evaluation Status: {critique.evaluation}")
    print(f"Evaluation Feedback: {critique.feedback}")
    return critique
 
# Reflection Loop   
max\_iterations = 3
current\_iteration = 0
topic = "a robot learning to paint"
 
# simulated poem which will not pass the evaluation
current\_poem = "With circuits humming, cold and bright,\nA metal hand now holds a brush"
 
while current\_iteration \< max\_iterations:
    current\_iteration += 1
    print(f"\n--- Iteration {current\_iteration} ---")
    evaluation\_result = evaluate(current\_poem)
 
    if evaluation\_result.evaluation == EvaluationStatus.PASS:
        print("\nFinal Poem:")
        print(current\_poem)
        break
    else:
        current\_poem = generate\_poem(topic, feedback=evaluation\_result.feedback)
        if current\_iteration == max\_iterations:
            print("\nMax iterations reached. Last attempt:")
            print(current\_poem)
```

## Tool Use Pattern

![](https://www.philschmid.de/static/blog/agentic-pattern/tool-use.png)

LLM has the ability to invoke external functions or APIs to interact with the outside world, retrieve information, or perform actions. This pattern often referred to as Function Calling and is the most widely recognized pattern. The LLM is provided with definitions (name, description, input schema) of available tools (functions, APIs, databases, etc.). Based on the user query, the LLM can decide to call one or more tools by generating a structured output (like JSON) matching the required schema. This output is used to execute the actual external tool/function, and the result is returned to the LLM. The LLM then uses this result to formulate its final response to the user. This vastly extends the LLM's capabilities beyond its training data.

Use Cases:

- Booking appointments using a calendar API.
- Retrieving real-time stock prices via a financial API.
- Searching a vector database for relevant documents (RAG).
- Controlling smart home devices.
- Executing code snippets.

```python
import os
from google import genai
from google.genai import types
 
# Configure the client (ensure GEMINI\_API\_KEY is set in your environment)
client = genai.Client(api\_key=os.environ["GEMINI\_API\_KEY"])
 
# Define the function declaration for the model
weather\_function = {
    "name": "get\_current\_temperature",
    "description": "Gets the current temperature for a given location.",
    "parameters": {
        "type": "object",
        "properties": {
            "location": {
                "type": "string",
                "description": "The city name, e.g. San Francisco",
            },
        },
        "required": ["location"],
    },
}
 
# Placeholder function to simulate API call
def get\_current\_temperature(location: str) -\> dict:
    return {"temperature": "15", "unit": "Celsius"}
 
# Create the config object as shown in the user's example
# Use client.models.generate\_content with model, contents, and config
tools = types.Tool(function\_declarations=[weather\_function])
contents = ["What's the temperature in London right now?"]
response = client.models.generate\_content(
    model='gemini-2.0-flash',
    contents=contents,
    config = types.GenerateContentConfig(tools=[tools])
)
 
# Process the Response (Check for Function Call)
response\_part = response.candidates[0].content.parts[0]
if response\_part.function\_call:
    function\_call = response\_part.function\_call
    print(f"Function to call: {function\_call.name}")
    print(f"Arguments: {dict(function\_call.args)}")
 
    # Execute the Function
    if function\_call.name == "get\_current\_temperature":        
        # Call the actual function
        api\_result = get\_current\_temperature(*function\_call.args)
        # Append function call and result of the function execution to contents
        follow\_up\_contents = [
            types.Part(function\_call=function\_call),
            types.Part.from\_function\_response(
                name="get\_current\_temperature",
                response=api\_result
            )
        ]
        # Generate final response
        response\_final = client.models.generate\_content(
            model="gemini-2.0-flash",
            contents=contents + follow\_up\_contents,
            config=types.GenerateContentConfig(tools=[tools])
        )
        print(response\_final.text)
    else:
        print(f"Error: Unknown function call requested: {function\_call.name}")
else:
    print("No function call found in the response.")
    print(response.text)
```

## Planning Pattern (Orchestrator-Workers)

![](https://www.philschmid.de/static/blog/agentic-pattern/planning.png)

A central planner LLM breaks down a complex task into a dynamic list of subtasks, which are then delegated to specialized worker agents (often using Tool Use) for execution. This pattern tries to solve complex problems requiring multi-step reasoning by creating an intial Plan. This plan is dynamically generated based on the user input. Subtasks are then assigned to "Worker" agents that execute them, potentially in parallel if dependencies allow. An "Orchestrator" or "Synthesizer" LLM collects the results from the workers, reflects on whether the overall goal has been achieved, and either synthesizes the final output or potentially initiates a re-planning step if necessary. This reduces the cognitive load on any single LLM call, improves reasoning quality, minimizes errors, and allows for dynamic adaptation of the workflow. The key difference from Routing is that the Planner generates a *multi-step plan* rather than selecting a single next step.

Use Cases:

- Complex software development tasks: Breaking down "build a feature" into planning, coding, testing, and documentation subtasks.
- Research and report generation: Planning steps like literature search, data extraction, analysis, and report writing.
- Multi-modal tasks: Planning steps involving image generation, text analysis, and data integration.
- Executing complex user requests like "Plan a 3-day trip to Paris, book flights and a hotel within my budget."

```python
import os
from google import genai
from pydantic import BaseModel, Field
from typing import List
 
# Configure the client (ensure GEMINI\_API\_KEY is set in your environment)
client = genai.Client(api\_key=os.environ["GEMINI\_API\_KEY"])
 
# Define the Plan Schema
class Task(BaseModel):
    task\_id: int
    description: str
    assigned\_to: str = Field(description="Which worker type should handle this? E.g., Researcher, Writer, Coder")
 
class Plan(BaseModel):
    goal: str
    steps: List[Task]
 
# Step 1: Generate the Plan (Planner LLM)
user\_goal = "Write a short blog post about the benefits of AI agents."
 
prompt\_planner = f"""
Create a step-by-step plan to achieve the following goal. 
Assign each step to a hypothetical worker type (Researcher, Writer).
 
Goal: {user\_goal}
"""
 
print(f"Goal: {user\_goal}")
print("Generating plan...")
 
# Use a model capable of planning and structured output
response\_plan = client.models.generate\_content(
    model='gemini-2.5-pro-preview-03-25',
    contents=prompt\_planner,
    config={
        'response\_mime\_type': 'application/json',
        'response\_schema': Plan,
    },
)
 
# Step 2: Execute the Plan (Orchestrator/Workers - Omitted for brevity) 
for step in response\_plan.parsed.steps:
    print(f"Step {step.task\_id}: {step.description} (Assignee: {step.assigned\_to})")
```

## Multi-Agent Pattern

![](https://www.philschmid.de/static/blog/agentic-pattern/multi-agent.png) *Coordinator, Manager approach* ![](https://www.philschmid.de/static/blog/agentic-pattern/multi-agent-2.png) *Swarm approach*

Multiple distinct agents each assigned a specific role, persona, or expertise collaborate to achieve a common goal. This pattern uses autonomous or semi-autonomous agents. Each agent might have a unique role (e.g., Project Manager, Coder, Tester, Critic), specialized knowledge, or access to specific tools. They interact and collaborate, often coordinated by a central "coordinator" or "manager" agent (like the PM in the diagram) or using handoff logic, where one agent passes the control to another agent.

Use Cases:

- Simulating debates or brainstorming sessions with different AI personas.
- Complex software creation involving agents for planning, coding, testing, and deployment.
- Running virtual experiments or simulations with agents representing different actors.
- Collaborative writing or content creation processes.

Note: The example below a simplified example on how to use the Multi-Agent pattern with handoff logic and structured output. I recommend to take a look at [LangGraph Multi-Agent Swarm](https://github.com/langchain-ai/langgraph-swarm-py) or [Crew AI](https://www.crewai.com/open-source)

```python
from google import genai
from pydantic import BaseModel, Field
 
# Configure the client (ensure GEMINI\_API\_KEY is set in your environment)
client = genai.Client(api\_key=os.environ["GEMINI\_API\_KEY"])
 
# Define Structured Output Schemas
class Response(BaseModel):
    handoff: str = Field(default="", description="The name/role of the agent to hand off to. Available agents: 'Restaurant Agent', 'Hotel Agent'")
    message: str = Field(description="The response message to the user or context for the next agent")
 
# Agent Function
def run\_agent(agent\_name: str, system\_prompt: str, prompt: str) -\> Response:
    response = client.models.generate\_content(
        model='gemini-2.0-flash',
        contents=prompt,
        config = {'system\_instruction': f'You are {agent\_name}. {system\_prompt}', 'response\_mime\_type': 'application/json', 'response\_schema': Response}
    )
    return response.parsed
 
 
# Define System Prompts for the agents
hotel\_system\_prompt = "You are a Hotel Booking Agent. You ONLY handle hotel bookings. If the user asks about restaurants, flights, or anything else, respond with a short handoff message containing the original request and set the 'handoff' field to 'Restaurant Agent'. Otherwise, handle the hotel request and leave 'handoff' empty."
restaurant\_system\_prompt = "You are a Restaurant Booking Agent. You handle restaurant recommendations and bookings based on the user's request provided in the prompt."
 
# Prompt to be about a restaurant
initial\_prompt = "Can you book me a table at an Italian restaurant for 2 people tonight?"
print(f"Initial User Request: {initial\_prompt}")
 
# Run the first agent (Hotel Agent) to force handoff logic
output = run\_agent("Hotel Agent", hotel\_system\_prompt, initial\_prompt)
 
# simulate a user interaction to change the prompt and handoff
if output.handoff == "Restaurant Agent":
    print("Handoff Triggered: Hotel to Restaurant")
    output = run\_agent("Restaurant Agent", restaurant\_system\_prompt, initial\_prompt)
elif output.handoff == "Hotel Agent":
    print("Handoff Triggered: Restaurant to Hotel")
    output = run\_agent("Hotel Agent", hotel\_system\_prompt, initial\_prompt)
 
print(output.message)
```

## Combining and Customizing These Patterns

It's important to remember that these patterns aren't fixed rules but flexible building blocks. Real-world agentic systems often combine elements from multiple patterns. A Planning agent might use Tool Use, and its workers could employ Reflection. A Multi-Agent system might use Routing internally for task assignment.

The key to success with any LLM application, especially complex agentic systems, is empirical evaluation. Define metrics, measure performance, identify bottlenecks or failure points, and iterate on your design. Resist to over-engineer.

## Acknowledgements

This overview was created with the help of deep and manual research, drawing inspiration and information from several excellent resources, including:

- [5 Agentic AI Design Patterns](https://blog.dailydoseofds.com/p/5-agentic-ai-design-patterns)
- [What are Agentic Workflows?](https://weaviate.io/blog/what-are-agentic-workflows)
- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [How Agents Can Improve LLM Performance](https://www.deeplearning.ai/the-batch/how-agents-can-improve-llm-performance)
- [Agentic Design Patterns](https://medium.com/@bijit211987/agentic-design-patterns-cbd0aae2962f)
- [Agent Recipes](https://www.agentrecipes.com/)
- [LangGraph Agentic Concepts](https://langchain-ai.github.io/langgraph/concepts/agentic\_concepts/)
- [OpenAI Agents Python Examples](https://github.com/openai/openai-agents-python/tree/main/examples/agent\_patterns)
- [Anthropic Cookbook](https://github.com/anthropics/anthropic-cookbook/blob/main/patterns/agents)

---

Thanks for reading! If you have any questions or feedback, please let me know on [Twitter](https://twitter.com/\_philschmid) or [LinkedIn](https://www.linkedin.com/in/philipp-schmid-a6a2bb196/).
