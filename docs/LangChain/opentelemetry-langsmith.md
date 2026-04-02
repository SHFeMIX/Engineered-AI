---
title: "Introducing OpenTelemetry support for LangSmith"
site: "LangChain Blog"
published: 2024-12-09T16:44:18.000Z
source: "https://blog.langchain.com/opentelemetry-langsmith/"
domain: "blog.langchain.com"
language: "en"
word_count: 790
---

# Introducing OpenTelemetry support for LangSmith

LangSmith now supports ingesting traces in OpenTelemetry format, an open standard for distributed tracing and observability. [OpenTelemetry](https://opentelemetry.io/docs/what-is-opentelemetry/?ref=blog.langchain.com) allows developers to instrument and export telemetry data across a wide range of programming languages, frameworks, and monitoring tools for broad interoperability.

With this update, LangSmith’s API layer can now accept OpenTelemetry traces directly. You can point any supported OpenTelemetry exporter to the LangSmith OTEL endpoint, and your traces will be ingested and fully accessible within LangSmith — giving a complete view of your application’s performance with unified LLM monitoring and system telemetry.

## OpenTelemetry semantic conventions

OpenTelemetry defines [semantic conventions](https://opentelemetry.io/docs/concepts/semantic-conventions/?ref=blog.langchain.com) for attribute names and data across various use cases. For example, there are semantic conventions for databases, messaging systems, and protocols such as HTTP or gRPC. For LangSmith, we specifically care about semantic conventions for generative AI. As this area is new, there are a few existing conventions, but new official standards are still being developed.

We now support traces in the [OpenLLMetry](https://github.com/traceloop/openllmetry?ref=blog.langchain.com) format, a semantic convention and implementation that enables out-of-the-box instrumentation for a range of LLM models, vector databases, and common LLM frameworks. Data must be sent with the OpenLLMetry semantic convention; you can then configure an OpenTelemetry-compatible SDK to point to LangSmith’s OTEL endpoint to ingest traces into LangSmith.

We plan to support accepting traces via other semantic conventions such as the [OpenTelemetry Gen AI semantic convention](https://opentelemetry.io/docs/specs/semconv/gen-ai/?ref=blog.langchain.com) as they evolve.

Below, we’ll walk through a few different ways to get started.

## Getting started with an OpenTelemetry based client

This example covers using the off the shelf OpenTelemetry Python client. Note that this approach would work with any OpenTelemetry compatible SDK in the language of your choice.

First, install Python dependencies:

```python
pip install openai
pip install opentelemetry-sdk
pip install opentelemetry-exporter-otlp
```

Next, configure your environment variables for OpenTelemetry:

```python
OTEL_EXPORTER_OTLP_ENDPOINT=https://api.smith.langchain.com/otel
OTEL_EXPORTER_OTLP_HEADERS="x-api-key=<your langsmith api key>,LANGSMITH_PROJECT=<project name>"
```

Then run the following code which calls `openai` and wraps that with a span along with the required attributes:

```python
from openai import OpenAI
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import (
    BatchSpanProcessor,
)
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter

client = OpenAI()
otlp_exporter = OTLPSpanExporter()
trace.set_tracer_provider(TracerProvider())
trace.get_tracer_provider().add_span_processor(
    BatchSpanProcessor(otlp_exporter)
)
tracer = trace.get_tracer(__name__)

def call_openai():
    model = "gpt-4o-mini"
    with tracer.start_as_current_span("call_open_ai") as span:
        span.set_attribute("langsmith.span.kind", "LLM")
        span.set_attribute("langsmith.metadata.user_id", "user_123")
        span.set_attribute("gen_ai.system", "OpenAI")
        span.set_attribute("gen_ai.request.model", model)
        span.set_attribute("llm.request.type", "chat")

        messages = [
            {"role": "system", "content": "You are a helpful assistant."},
            {
                "role": "user",
                "content": "Write a haiku about recursion in programming."
            }
        ]

        for i, message in enumerate(messages):
            span.set_attribute(f"gen_ai.prompt.{i}.content", str(message["content"]))
            span.set_attribute(f"gen_ai.prompt.{i}.role", str(message["role"]))

        completion = client.chat.completions.create(
            model=model,
            messages=messages
        )

        span.set_attribute("gen_ai.response.model", completion.model)
        span.set_attribute("gen_ai.completion.0.content", str(completion.choices[0].message.content))
        span.set_attribute("gen_ai.completion.0.role", "assistant")
        span.set_attribute("gen_ai.usage.prompt_tokens", completion.usage.prompt_tokens)
        span.set_attribute("gen_ai.usage.completion_tokens", completion.usage.completion_tokens)
        span.set_attribute("gen_ai.usage.total_tokens", completion.usage.total_tokens)

        return completion.choices[0].message

if __name__ == "__main__":
    call_openai()
```

You should see a trace in your LangSmith dashboard like [this one](https://smith.langchain.com/public/4f2890b1-f105-44aa-a6cf-c777dcc27a37/r?ref=blog.langchain.com).

For more information, see the [documentation](https://docs.smith.langchain.com/observability/how_to_guides/tracing/trace_with_opentelemetry?ref=blog.langchain.com).

## Getting started with Traceloop SDK

This example covers sending tracing using the OpenLLMetry SDK from Traceloop, which supports a wide range of integrations of models, vector databases, and frameworks out of the box.

To get started, follow these steps. First, install the OpenLLMetry Traceloop SDK:

```python
pip install traceloop-sdk
```

Set up your environment variables:

```python
TRACELOOP_BASE_URL=https://api.smith.langchain.com/otel
TRACELOOP_HEADERS=x-api-key=<your_api_key>
```

Then initialize the SDK:

```python
from traceloop.sdk import Traceloop
Traceloop.init()
```

Here is a complete example using an OpenAI chat completion:

```python
import os
from openai import OpenAI
from traceloop.sdk import Traceloop

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
Traceloop.init()

completion = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {
            "role": "user",
            "content": "Write a haiku about recursion in programming."
        }
    ]
)

print(completion.choices[0].message)
```

You should see a trace in your LangSmith dashboard like [this one](https://smith.langchain.com/public/106f5bed-edca-4357-91a5-80089252c9ed/r?ref=blog.langchain.com).

For more information, see the [documentation](https://docs.smith.langchain.com/observability/how_to_guides/tracing/trace_with_opentelemetry?ref=blog.langchain.com#logging-traces-with-the-traceloop-sdk).

## Getting started with Vercel AI SDK

We support the Vercel AI SDK integration using a client side trace exporter that is defined by the LangSmith library. To use this integration: first, install the AI SDK package:

```python
npm install ai @ai-sdk/openai zod
```

Next, configure your environment:

```python
export LANGCHAIN_TRACING_V2=true
export LANGCHAIN_API_KEY=<your-api-key>
# The below examples use the OpenAI API, though it's not necessary in general
export OPENAI_API_KEY=<your-openai-api-key>
```

First, create an *instrumentation.js* file in your project root. Learn more about how to setup OpenTelemetry instrumentation within your Next.js app [here](https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation?ref=blog.langchain.com).

```python
import { registerOTel } from "@vercel/otel";
import { AISDKExporter } from "langsmith/vercel";
export function register() {
  registerOTel({
    serviceName: "langsmith-vercel-ai-sdk-example",
    traceExporter: new AISDKExporter(),
  });
}
```

Afterwards, add the experimental\_telemetry argument to your AI SDK calls that you want to trace. For convenience, we've included the AISDKExporter.getSettings() method which appends additional metadata for LangSmith.

```python
import { AISDKExporter } from "langsmith/vercel";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
await streamText({
  model: openai("gpt-4o-mini"),
  prompt: "Write a vegetarian lasagna recipe for 4 people.",
  experimental_telemetry: AISDKExporter.getSettings(),
});
```

You should see a trace in your LangSmith dashboard [like this one](https://smith.langchain.com/public/a9d9521a-4f97-4843-b1e2-b87c3a125503/r?ref=blog.langchain.com).

For more information, see the LangSmith documentation for the [Vercel AI SDK integration](https://docs.smith.langchain.com/observability/how_to_guides/tracing/trace_with_vercel_ai_sdk?ref=blog.langchain.com).
