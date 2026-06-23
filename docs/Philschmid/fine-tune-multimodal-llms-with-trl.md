---
title: "How to Fine-Tune Multimodal Models or VLMs with Hugging Face TRL"
site: "Philipp Schmid"
published: "2024-09-30"
source: "https://www.philschmid.de/fine-tune-multimodal-llms-with-trl"
domain: ""
language: "en"
word_count: 3097
---

# How to Fine-Tune Multimodal Models or VLMs with Hugging Face TRL

Multimodal LLMs are making tremendous progress recently. We now have a diverse ecosystem of powerful open Multimodal models, mostly Vision-Language Models (VLM), including Meta AI's [Llama-3.2-11B-Vision](https://huggingface.co/meta-llama/Llama-3.2-11B-Vision-Instruct), Mistral AI's [Pixtral-12B](https://huggingface.co/mistralai/Pixtral-12B-2409), Qwen's [Qwen2-VL-7B](https://huggingface.co/Qwen/Qwen2-VL-7B), and Allen AI's [Molmo-7B-D-0924](https://huggingface.co/allenai/Molmo-7B-D-0924).

These VLMs can handle a variety of multimodal tasks, including image captioning, visual question answering, and image-text matching without additional training. However, to customize a model for your specific application, you may need to fine-tune it on your data to achieve higher quality results or to create a more efficient model for your use case.

This blog post walks you through how to fine-tune open VLMs using Hugging Face [TRL](https://huggingface.co/docs/trl/index), [Transformers](https://huggingface.co/docs/transformers/index) & [datasets](https://huggingface.co/docs/datasets/index) in 2024. We'll cover:

1. [Define our multimodal use case](https://www.philschmid.de/fine-tune-multimodal-llms-with-trl#1-define-our-multimodal-use-case)
2. [Setup development environment](https://www.philschmid.de/fine-tune-multimodal-llms-with-trl#2-setup-development-environment)
3. [Create and prepare the multimodal dataset](https://www.philschmid.de/fine-tune-multimodal-llms-with-trl#3-create-and-prepare-the-multimodal-dataset)
4. [Fine-tune VLM using `trl` and the `SFTTrainer`](https://www.philschmid.de/fine-tune-multimodal-llms-with-trl#4-fine-tune-vlm-using-trl-and-the-sfstrainer)
5. [Test and evaluate the VLM](https://www.philschmid.de/fine-tune-multimodal-llms-with-trl#5-test-and-evaluate-the-vlm)

*Note: This blog was created to run on consumer size GPUs (24GB), e.g. NVIDIA A10G or RTX 4090/3090, but can be easily adapted to run on bigger GPUs.*

## 1\. Define our multimodal use case

When fine-tuning VLMs, it's crucial to clearly define your use case and the multimodal task you want to solve. This will guide your choice of base model and help you create an appropriate dataset for fine-tuning. If you haven't defined your use case yet, you might want to revisit your requirements.

It's worth noting that for most use cases fine-tuning might not be the first option. We recommend evaluating pre-trained models or API-based solutions before committing to fine-tuning your own model.

As an example, we'll use the following multimodal use case:

\> We want to fine-tune a model that can generate detailed product descriptions based on product images and basic metadata. This model will be integrated into our e-commerce platform to help sellers create more compelling listings. The goal is to reduce the time it takes to create product descriptions and improve their quality and consistency.

Existing models might already be very good for this use case, but you might want to tweak/tune it to your specific needs. This image-to-text generation task is well-suited for fine-tuning VLMs, as it requires understanding visual features and combining them with textual information to produce coherent and relevant descriptions. I created a test dataset for this use case using Gemini 1.5 [philschmid/amazon-product-descriptions-vlm](https://huggingface.co/datasets/philschmid/amazon-product-descriptions-vlm).

## 2\. Setup development environment

Our first step is to install Hugging Face Libraries and Pyroch, including trl, transformers and datasets. If you haven't heard of trl yet, don't worry. It is a library on top of transformers and datasets, which makes it easier to fine-tune, rlhf, align open LLMs.

Python

```python
# Install Pytorch & other libraries
%pip install "torch==2.4.0" tensorboard pillow
 
# Install Hugging Face libraries
%pip install  --upgrade \
  "transformers==4.45.1" \
  "datasets==3.0.1" \
  "accelerate==0.34.2" \
  "evaluate==0.4.3" \
  "bitsandbytes==0.44.0" \
  "trl==0.11.1" \
  "peft==0.13.0" \
  "qwen-vl-utils"
```

We will use the [Hugging Face Hub](https://huggingface.co/models) as a remote model versioning service. This means we will automatically push our model, logs and information to the Hub during training. You must register on the [Hugging Face](https://huggingface.co/join) for this. After you have an account, we will use the `login` util from the `huggingface\_hub` package to log into our account and store our token (access key) on the disk.

Python

```python
from huggingface\_hub import login
 
login(
  token="", # ADD YOUR TOKEN HERE
  add\_to\_git\_credential=True
)
```

## 3\. Create and prepare the dataset

Once you have determined that fine-tuning is the right solution we need to create a dataset to fine-tune our model. We have to prepare the dataset in a format that the model can understand.

In our example we will use [philschmid/amazon-product-descriptions-vlm](https://huggingface.co/datasets/philschmid/amazon-product-descriptions-vlm), which contains 1,350 amazon products with title, images and descriptions and metadata. We want to fine-tune our model to generate product descriptions based on the images, title and metadata. Therefore we need to create a prompt including the title, metadata and image and the completion is the description.

TRL supports popular instruction and conversation dataset formats. This means we only need to convert our dataset to one of the supported formats and `trl` will take care of the rest.

JSON

```json
"messages": [
  {"role": "system", "content": [{"type":"text", "text": "You are a helpful...."}]},
  {"role": "user", "content": [{
    "type": "text", "text":  "How many dogs are in the image?", 
    "type": "image", "text": \<PIL.Image\> 
    }]},
  {"role": "assistant", "content": [{"type":"text", "text": "There are 3 dogs in the image."}]}
],
```

In our example we are going to load our dataset using the Datasets library and apply our frompt and convert it into the the conversational format.

Lets start with defining our instruction prompt.

Python

```python
# note the image is not provided in the prompt its included as part of the "processor"
prompt= """Create a Short Product description based on the provided ##PRODUCT NAME## and ##CATEGORY## and image. 
Only return description. The description should be SEO optimized and for a better mobile search experience.
 
##PRODUCT NAME##: {product\_name}
##CATEGORY##: {category}"""
 
system\_message = "You are an expert product description writer for Amazon."
```

Now, we can format our dataset.

Python

```python
from datasets import load\_dataset
 
# Convert dataset to OAI messages       
def format\_data(sample):
    return {"messages": [
                {
                    "role": "system",
                    "content": [{"type": "text", "text": system\_message}],
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt.format(product\_name=sample["Product Name"], category=sample["Category"]),
                        },{
                            "type": "image",
                            "image": sample["image"],
                        }
                    ],
                },
                {
                    "role": "assistant",
                    "content": [{"type": "text", "text": sample["description"]}],
                },
            ],
        }
 
# Load dataset from the hub
dataset\_id = "philschmid/amazon-product-descriptions-vlm"
dataset = load\_dataset("philschmid/amazon-product-descriptions-vlm", split="train")
 
# Convert dataset to OAI messages
# need to use list comprehension to keep Pil.Image type, .mape convert image to bytes
dataset = [format\_data(sample) for sample in dataset]
 
print(dataset[345]["messages"])
```

## 4\. Fine-tune VLM using `trl` and the `SFTTrainer`

We are now ready to fine-tune our model. We will use the [SFTTrainer](https://huggingface.co/docs/trl/sft\_trainer) from `trl` to fine-tune our model. The `SFTTrainer` makes it straightfoward to supervise fine-tune open LLMs and VLMs. The `SFTTrainer` is a subclass of the `Trainer` from the `transformers` library and supports all the same features, including logging, evaluation, and checkpointing, but adds additiional quality of life features.

We will use the PEFT features in our example. As peft method we will use [QLoRA](https://arxiv.org/abs/2305.14314) a technique to reduce the memory footprint of large language models during finetuning, without sacrificing performance by using quantization. If you want to learn more about QLoRA and how it works, check out [Making LLMs even more accessible with bitsandbytes, 4-bit quantization and QLoRA](https://huggingface.co/blog/4bit-transformers-bitsandbytes) blog post.

*Note: We cannot use Flash Attention as we need to pad our multimodal inputs.*

We are going to use Qwen 2 VL 7B model, but we can easily swap out the model for another model, including Meta AI's [Llama-3.2-11B-Vision](https://huggingface.co/meta-llama/Llama-3.2-11B-Vision-Instruct), Mistral AI's [Pixtral-12B](https://huggingface.co/mistralai/Pixtral-12B-2409) or any other LLMs by changing our `model\_id` variable. We will use bitsandbytes to quantize our model to 4-bit.

*Note: Be aware the bigger the model the more memory it will require. In our example we will use the 7B version, which can be tuned on 24GB GPUs.*

Correctly, preparing the LLM, Tokenizer and Processor for training VLMs is crucial. The Processor is responsible for including the special tokens and image features in the input.

Python

```python
import torch
from transformers import AutoModelForVision2Seq, AutoProcessor, BitsAndBytesConfig
 
# Hugging Face model id
model\_id = "Qwen/Qwen2-VL-7B-Instruct" 
 
# BitsAndBytesConfig int-4 config
bnb\_config = BitsAndBytesConfig(
    load\_in\_4bit=True, bnb\_4bit\_use\_double\_quant=True, bnb\_4bit\_quant\_type="nf4", bnb\_4bit\_compute\_dtype=torch.bfloat16
)
 
# Load model and tokenizer
model = AutoModelForVision2Seq.from\_pretrained(
    model\_id,
    device\_map="auto",
    # attn\_implementation="flash\_attention\_2", # not supported for training
    torch\_dtype=torch.bfloat16,
    quantization\_config=bnb\_config
)
processor = AutoProcessor.from\_pretrained(model\_id)
```

Python

```python
# Preparation for inference
text = processor.apply\_chat\_template(
    dataset[2]["messages"], tokenize=False, add\_generation\_prompt=False
)
print(text)
```

The `SFTTrainer` supports a native integration with `peft`, which makes it super easy to efficiently tune LLMs using, e.g. QLoRA. We only need to create our `LoraConfig` and provide it to the trainer. Our `LoraConfig` parameters are defined based on the [qlora paper](https://arxiv.org/pdf/2305.14314.pdf) and sebastian's [blog post](https://magazine.sebastianraschka.com/p/practical-tips-for-finetuning-llms).

Python

```python
from peft import LoraConfig
 
# LoRA config based on QLoRA paper & Sebastian Raschka experiment
peft\_config = LoraConfig(
        lora\_alpha=16,
        lora\_dropout=0.05,
        r=8,
        bias="none",
        target\_modules=["q\_proj", "v\_proj"],
        task\_type="CAUSAL\_LM", 
)
```

Before we can start our training we need to define the hyperparameters (`SFTConfig`) we want to use and make sure our inputs are correcty provided to the model. Different to text-only supervised fine-tuning we need to provide the image to the model as well. Therefore we create a custom `DataCollator` which formates the inputs correctly and include the image features. We use the [process\_vision\_info](https://github.com/QwenLM/Qwen2-VL/blob/main/qwen-vl-utils/src/qwen\_vl\_utils/vision\_process.py#L321) method from a utility package the Qwen2 team provides. If you are using another model, e.g. Llama 3.2 Vision you might have to check if that creates the same processsed image information.

Python

```python
from trl import SFTConfig
from transformers import Qwen2VLProcessor
from qwen\_vl\_utils import process\_vision\_info
 
args = SFTConfig(
    output\_dir="qwen2-7b-instruct-amazon-description", # directory to save and repository id
    num\_train\_epochs=3,                     # number of training epochs
    per\_device\_train\_batch\_size=4,          # batch size per device during training
    gradient\_accumulation\_steps=8,          # number of steps before performing a backward/update pass
    gradient\_checkpointing=True,            # use gradient checkpointing to save memory
    optim="adamw\_torch\_fused",              # use fused adamw optimizer
    logging\_steps=5,                       # log every 10 steps
    save\_strategy="epoch",                  # save checkpoint every epoch
    learning\_rate=2e-4,                     # learning rate, based on QLoRA paper
    bf16=True,                              # use bfloat16 precision
    tf32=True,                              # use tf32 precision
    max\_grad\_norm=0.3,                      # max gradient norm based on QLoRA paper
    warmup\_ratio=0.03,                      # warmup ratio based on QLoRA paper
    lr\_scheduler\_type="constant",           # use constant learning rate scheduler
    push\_to\_hub=True,                       # push model to hub
    report\_to="tensorboard",                # report metrics to tensorboard
    gradient\_checkpointing\_kwargs = {"use\_reentrant": False}, # use reentrant checkpointing
    dataset\_text\_field="", # need a dummy field for collator
    dataset\_kwargs = {"skip\_prepare\_dataset": True} # important for collator
)
args.remove\_unused\_columns=False
 
# Create a data collator to encode text and image pairs
def collate\_fn(examples):
    # Get the texts and images, and apply the chat template
    texts = [processor.apply\_chat\_template(example["messages"], tokenize=False) for example in examples]
    image\_inputs = [process\_vision\_info(example["messages"])[0] for example in examples]
 
    # Tokenize the texts and process the images
    batch = processor(text=texts, images=image\_inputs, return\_tensors="pt", padding=True)
 
    # The labels are the input\_ids, and we mask the padding tokens in the loss computation
    labels = batch["input\_ids"].clone()
    labels[labels == processor.tokenizer.pad\_token\_id] = -100  #
    # Ignore the image token index in the loss computation (model specific)
    if isinstance(processor, Qwen2VLProcessor):
        image\_tokens = [151652,151653,151655]
    else: 
        image\_tokens = [processor.tokenizer.convert\_tokens\_to\_ids(processor.image\_token)]
    for image\_token\_id in image\_tokens:
        labels[labels == image\_token\_id] = -100
    batch["labels"] = labels
 
    return batch
```

We now have every building block we need to create our `SFTTrainer` to start then training our model.

Python

```python
from trl import SFTTrainer
 
trainer = SFTTrainer(
    model=model,
    args=args,
    train\_dataset=dataset,
    data\_collator=collate\_fn,
    dataset\_text\_field="", # needs dummy value
    peft\_config=peft\_config,
    tokenizer=processor.tokenizer,
)
```

Start training our model by calling the `train()` method on our `Trainer` instance. This will start the training loop and train our model for 3 epochs. Since we are using a PEFT method, we will only save the adapted model weights and not the full model.

Python

```python
# start training, the model will be automatically saved to the hub and the output directory
trainer.train()
 
# save model 
trainer.save\_model(args.output\_dir)
```

Training for 3 epochs with a dataset of ~1k samples took 01:31:58 on a `g6.2xlarge`. The instance costs `0.9776$/h` which brings us to a total cost of only `1.4$`.

Python

```python
# free the memory again
del model
del trainer
torch.cuda.empty\_cache()
```

## 5\. Test Model and run Inference

After the training is done we want to evaluate and test our model. First we will load the base model and let it generate a description for a random Amazon product. Then we will load our Q-LoRA adapted model and let it generate a description for the same product.

Finally we can merge the adapter into the base model to make it more efficient and run inference on the same product again.

Python

```python
import torch
from transformers import AutoProcessor, AutoModelForVision2Seq
 
adapter\_path = "./qwen2-7b-instruct-amazon-description"
 
# Load Model base model
model = AutoModelForVision2Seq.from\_pretrained(
  model\_id,
  device\_map="auto",
  torch\_dtype=torch.float16
)
processor = AutoProcessor.from\_pretrained(model\_id)
```

I selected a random product from Amazon and prepared a `generate\_description` function to generate a description for the product.

Python

```python
from qwen\_vl\_utils import process\_vision\_info
 
# sample from amazon.com
sample = {
  "product\_name": "Hasbro Marvel Avengers-Serie Marvel Assemble Titan-Held, Iron Man, 30,5 cm Actionfigur",
  "catergory": "Toys & Games | Toy Figures & Playsets | Action Figures",
  "image": "https://m.media-amazon.com/images/I/81+7Up7IWyL.\_AC\_SY300\_SX300\_.jpg"
}
 
# prepare message
messages = [{
        "role": "user",
        "content": [
            {
                "type": "image",
                "image": sample["image"],
            },
            {"type": "text", "text": prompt.format(product\_name=sample["product\_name"], category=sample["catergory"])},
        ],
    }
]
 
def generate\_description(sample, model, processor):
    messages = [
        {"role": "system", "content": [{"type": "text", "text": system\_message}]},
        {"role": "user", "content": [
            {"type": "image","image": sample["image"]},
            {"type": "text", "text": prompt.format(product\_name=sample["product\_name"], category=sample["catergory"])},
        ]},
    ]
    # Preparation for inference
    text = processor.apply\_chat\_template(
        messages, tokenize=False, add\_generation\_prompt=True
    )
    image\_inputs, video\_inputs = process\_vision\_info(messages)
    inputs = processor(
        text=[text],
        images=image\_inputs,
        videos=video\_inputs,
        padding=True,
        return\_tensors="pt",
    )
    inputs = inputs.to(model.device)
    # Inference: Generation of the output
    generated\_ids = model.generate(**inputs, max\_new\_tokens=256, top\_p=1.0, do\_sample=True, temperature=0.8)
    generated\_ids\_trimmed = [out\_ids[len(in\_ids) :] for in\_ids, out\_ids in zip(inputs.input\_ids, generated\_ids)]
    output\_text = processor.batch\_decode(
        generated\_ids\_trimmed, skip\_special\_tokens=True, clean\_up\_tokenization\_spaces=False
    )
    return output\_text[0]
 
# let's generate the description
base\_description = generate\_description(sample, model, processor)
print(base\_description)
# you can disable the active adapter if you want to rerun it with
# model.disable\_adapters()
```

Awesome it is working! Lets load our adapter and compare if with the base model.

Python

```python
model.load\_adapter(adapter\_path) # load the adapter and activate
 
ft\_description = generate\_description(sample, model, processor)
print(ft\_description)
```

Lets compare them side by side using a markdown table.

Python

```python
import pandas as pd
from IPython.display import display, HTML
 
def compare\_generations(base\_gen, ft\_gen):
    # Create a DataFrame
    df = pd.DataFrame({
        'Base Generation': [base\_gen],
        'Fine-tuned Generation': [ft\_gen]
    })
    # Style the DataFrame
    styled\_df = df.style.set\_properties(**{
        'text-align': 'left',
        'white-space': 'pre-wrap',
        'border': '1px solid black',
        'padding': '10px',
        'width': '250px',  # Set width to 150px
        'overflow-wrap': 'break-word'  # Allow words to break and wrap as needed
    })
    
    # Display the styled DataFrame
    display(HTML(styled\_df.to\_html()))
  
compare\_generations(base\_description, ft\_description)
```

\> | Base Generation | Fine-tuned Generation |
\> | --- | --- |
\> | Introducing the Hasbro Marvel Avengers Series Marvel Assemble Titan-Held Iron Man Action Figure, a 30.5 cm tall action figure that is sure to bring the excitement of the Marvel Universe to life! This highly detailed Iron Man figure is perfect for fans of all ages and makes a great addition to any toy collection. With its sleek red and gold armor, this Iron Man figure is ready to take on any challenge. The Titan-Held feature allows for a more realistic and dynamic pose, making it a must-have for any Marvel fan. Whether you're a collector or just looking for a fun toy to play with, this Iron Man action figure is the perfect choice. | Unleash the power of Iron Man with this 30.5 cm Hasbro Marvel Avengers Titan Hero Action Figure! This highly detailed Iron Man figure is perfect for collectors and kids alike. Features a realistic design and articulated joints for dynamic poses. A must-have for any Marvel fan's collection! |

Nice! Even though we just had ~1k samples we can see that the fine-tuning improve the product description generation. The description is way shorter and more concise, which fits our training data.

### Optional: Merge LoRA adapter in to the original model

When using QLoRA, we only train adapters and not the full model. This means when saving the model during training we only save the adapter weights and not the full model. If you want to save the full model, which makes it easier to use with Text Generation Inference you can merge the adapter weights into the model weights using the `merge\_and\_unload` method and then save the model with the `save\_pretrained` method. This will save a default model, which can be used for inference.

*Note: This requires \> 30GB CPU Memory.*

Python

```python
from peft import PeftModel
from transformers import AutoProcessor, AutoModelForVision2Seq
 
adapter\_path = "./qwen2-7b-instruct-amazon-description"
base\_model\_id = "Qwen/Qwen2-VL-7B-Instruct"
merged\_path = "merged"
 
# Load Model base model
model = AutoModelForVision2Seq.from\_pretrained(model\_id, low\_cpu\_mem\_usage=True)
 
# Path to save the merged model
 
# Merge LoRA and base model and save
peft\_model = PeftModel.from\_pretrained(model, adapter\_path)
merged\_model = peft\_model.merge\_and\_unload()
merged\_model.save\_pretrained(merged\_path,safe\_serialization=True, max\_shard\_size="2GB")
 
processor = AutoProcessor.from\_pretrained(base\_model\_id)
processor.save\_pretrained(merged\_path)
```

## Bonus: Use TRL example script

TRL provides a simple example script to fine-tune multimodal models. You can find the script [here](https://github.com/huggingface/trl/blob/main/examples/scripts/sft\_vlm.py). The script can be directly run from the command line and supports all the features of the `SFTTrainer`.

Bash

```bash
# Tested on 8x H100 GPUs
accelerate launch
    --config\_file=examples/accelerate\_configs/deepspeed\_zero3.yaml \
    examples/scripts/sft\_vlm.py \
    --dataset\_name HuggingFaceH4/llava-instruct-mix-vsft \
    --model\_name\_or\_path llava-hf/llava-1.5-7b-hf \
    --per\_device\_train\_batch\_size 8 \
    --gradient\_accumulation\_steps 8 \
    --output\_dir sft-llava-1.5-7b-hf \
    --bf16 \
    --torch\_dtype bfloat16 \
    --gradient\_checkpointing
```
