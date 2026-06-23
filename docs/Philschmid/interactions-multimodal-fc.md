---
title: "Multimodal Function Calling with Gemini 3 and Interactions API"
site: "Philipp Schmid"
published: "2026-02-13"
source: "https://www.philschmid.de/interactions-multimodal-fc"
domain: ""
language: "en"
word_count: 845
---

# Multimodal Function Calling with Gemini 3 and Interactions API

Building AI agents that can truly "see" requires more than just passing images in prompts. Coding agents need to read screenshots of UIs they're building. Computer use agents need to capture and analyze browser screenshots. Research agents need to process charts and diagrams from documents.

Multimodal function calling allows tools to return images the model can process natively, similar to how you pass images in prompts. Instead of describing what's in a file, your tool returns the actual image and Gemini 3 processes it natively.

This guide shows you how Multimodal Function Calling works using the [Interactions API](https://ai.google.dev/gemini-api/docs/interactions). The Interactions API is a unified interface for interacting with Gemini models and agents. It simplifies state management and tool orchestration, making it easy to build multi-turn agentic workflows.

![chart](https://www.philschmid.de/static/blog/interactions-multimodal-fc/chart.png)

The key difference from standard function calling is in the `function\_result` returns the actual image data. Gemini 3 processes this content natively—describing images, analyzing documents, or using visual information to make decisions.

JSON

```json
{
  "type": "function\_result",
  "call\_id": "abc123",
  "name": "read\_image",
  "result": [
    {"type": "text", "text": "Additional context..."},
    {"type": "image", "data": "\<base64\>", "mime\_type": "image/png"}
  ]
}
```

## Example: Reading images from Fileystem

Let's build a tool that reads images from disk and returns them to the model for description. Get a [Gemini API key](https://aistudio.google.com/apikey) and install the Google GenAI SDK:

Bash

```bash
pip install google-genai
```

Set your API key:

Bash

```bash
export GEMINI\_API\_KEY="your-api-key"
```

### 1\. Define the tool

Python

```python
read\_image = {
    "type": "function",
    "name": "read\_image",
    "description": "Reads an image file from disk and returns its contents.",
    "parameters": {
        "type": "object",
        "properties": {
            "path": {
                "type": "string", 
                "description": "The path to the image file to read"
            }
        },
        "required": ["path"]
    }
}
```

### 2\. Implement the tool execution

Python

```python
import base64
from pathlib import Path
 
def execute\_read\_image(path: str) -\> list[dict]:
    """Read image from disk and return as function result content."""
    image\_path = Path(path)
    
    if not image\_path.exists():
        return [{"type": "text", "text": f"Error: Image not found at {path}"}]
    
    mime\_types = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
    }
    mime\_type = mime\_types.get(image\_path.suffix.lower(), "image/png")
    
    image\_data = base64.b64encode(image\_path.read\_bytes()).decode()
    return [{"type": "image", "data": image\_data, "mime\_type": mime\_type}]
```

### 3\. Create the agentic loop

Python

```python
from google import genai
 
client = genai.Client()
 
image\_path = "path/to/your/image.png"
prompt=f"Use the read\_image tool to read '{image\_path}' and describe what you see."
 
# Step 1: Send the initial request with our tool
interaction = client.interactions.create(
    model="gemini-3-flash-preview",
    input=prompt,
    tools=[read\_image],
)
 
# Step 2: Handle the function call
for output in interaction.outputs:
    if output.type == "function\_call" and output.name == "read\_image":
      
        image\_result = execute\_read\_image(output.arguments.get("path"))
        
        # Step 3: Send the image back to the model
        interaction = client.interactions.create(
            model="gemini-3-flash-preview",
            input=[{
                "type": "function\_result",
                "call\_id": output.id,
                "name": output.name,
                "result": image\_result,  # Contains the image!
            }],
            tools=[read\_image],
            previous\_interaction\_id=interaction.id,
        )
        
        # Step 4: Get the model's description
        for out in interaction.outputs:
            if out.type == "text":
                print(out.text)
```

## Concluding how it works

The interaction flow has four steps:

1. **User request** → You send a prompt asking the model to use the tool
2. **Function call** → Model responds with a `function\_call` specifying which tool to use and arguments
3. **Tool execution** → You execute the tool and return the result (including the image)
4. **Model response** → Model processes the image and generates a text description

Python

```python
# The function\_call output from the model looks like:
{
    "type": "function\_call",
    "id": "call\_abc123",
    "name": "read\_image",
    "arguments": {"path": "photo.jpg"}
}
 
# Your function\_result response looks like:
{
    "type": "function\_result",
    "call\_id": "call\_abc123",
    "name": "read\_image",
    "result": [
        {"type": "image", "data": "iVBORw0KGgo...", "mime\_type": "image/png"}
    ]
}
```

## Conclusion

Multimodal function calling unlocks multimodal agentic use cases. By returning images directly in your `function\_result`, you give Gemini 3 the ability to see what your tools see.

This pattern extends beyond file reading. You can build tools that capture screenshots, fetch images from APIs, render charts, or process scanned documents. Combined with the Interactions API's stateful sessions, you have everything you need to build sophisticated visual agents.

**Next steps:**

- Try the [Interactions API quickstart](https://ai.google.dev/gemini-api/docs/interactions) notebook
- Explore [Computer Use](https://ai.google.dev/gemini-api/docs/computer-use) for browser automation with visual feedback
- Build tools that return PDFs or multiple images for complex document workflows

---

**This API is in Beta, and we want your feedback!** We're actively listening to developers to shape the future of this API. What features would help your agent workflows? What pain points are you experiencing? Please let me know on [Twitter](https://twitter.com/\_philschmid) or [LinkedIn](https://www.linkedin.com/in/philipp-schmid-a6a2bb196/).
