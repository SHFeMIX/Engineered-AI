---
title: "Fine-tune classifier with ModernBERT in 2025"
site: "Philipp Schmid"
published: "2024-12-25"
source: "https://www.philschmid.de/fine-tune-modern-bert-in-2025"
domain: ""
language: "en"
word_count: 1672
---

# Fine-tune classifier with ModernBERT in 2025

Large Language Models (LLMs) have become ubiquitous in 2024. However, smaller, specialized models - particularly for classification tasks - remain critical for building efficient and cost-effective AI systems. One key use case is routing user prompts to the most appropriate LLM or selecting optimal few-shot examples, where fast, accurate classification is essential.

This blog post demonstrates how to fine-tune ModernBERT, a new state-of-the-art encoder model, for classifying user prompts to implement an intelligent LLM router. ModernBERT is a refreshed version of BERT models, with 8192 token context length, significantly better downstream performance, and much faster processing speeds.

You will learn how to:

1. [Setup environment and install libraries](https://www.philschmid.de/fine-tune-modern-bert-in-2025#1-setup-environment-and-install-libraries)
2. [Load and prepare the classification dataset](https://www.philschmid.de/fine-tune-modern-bert-in-2025#2-load-and-prepare-the-classification-dataset)
3. [Fine-tune & evaluate ModernBERT with the Hugging Face `Trainer`](https://www.philschmid.de/fine-tune-modern-bert-in-2025#3-fine-tune--evaluate-modernbert-with-the-hugging-face-trainer)
4. [Run inference & test model](https://www.philschmid.de/fine-tune-modern-bert-in-2025#4-run-inference--test-model)

## Quick intro: ModernBERT

ModernBERT is a modernization of BERT maintaining full backward compatibility while delivering dramatic improvements through architectural innovations like rotary positional embeddings (RoPE), alternating attention patterns, and hardware-optimized design. The model comes in two sizes:

- ModernBERT Base (139M parameters)
- ModernBERT Large (395M parameters)

ModernBERT achieves state-of-the-art performance across classification, retrieval and code understanding tasks while being 2-4x faster than previous encoder models. This makes it ideal for high-throughput production applications like LLM routing, where both accuracy and latency are critical.

ModernBERT was trained on 2 trillion tokens of diverse data including web documents, code, and scientific articles - making it much more robust than traditional BERT models trained primarily on Wikipedia. This broader knowledge helps it better understand the nuances of user prompts across different domains.

If you want to learn more about ModernBERT's architecture and training process, check out the official [blog](https://huggingface.co/blog/modernbert).

---

Now let's get started building our LLM router with ModernBERT! 🚀

*Note: This tutorial was created and tested on an NVIDIA L4 GPU with 24GB of VRAM.*

## 1\. Setup environment and install libraries

Our first step is to install Hugging Face Libraries and Pyroch, including transformers and datasets.

Python

```python
# Install Pytorch & other libraries
%pip install "torch==2.4.1" tensorboard 
%pip install flash-attn "setuptools\<71.0.0" scikit-learn 
 
# Install Hugging Face libraries
%pip install  --upgrade \
  "datasets==3.1.0" \
  "accelerate==1.2.1" \
  "hf-transfer==0.1.8"
  #"transformers==4.47.1" \
 
# ModernBERT is not yet available in an official release, so we need to install it from github
%pip install "git+https://github.com/huggingface/transformers.git@6e0515e99c39444caae39472ee1b2fd76ece32f1" --upgrade
```

We will use the [Hugging Face Hub](https://huggingface.co/models) as a remote model versioning service. This means we will automatically push our model, logs and information to the Hub during training. You must register on the [Hugging Face](https://huggingface.co/join) for this. After you have an account, we will use the `login` util from the `huggingface\_hub` package to log into our account and store our token (access key) on the disk.

Python

```python
from huggingface\_hub import login
 
login(token="", add\_to\_git\_credential=True) # ADD YOUR TOKEN HERE
```

## 2\. Load and prepare the classification dataset

In our example we want to fine-tune ModernBERT to act as a router for user prompts. Therefore we need a classification dataset consisting of user prompts and their "difficulty" score. We are going to use the `DevQuasar/llm\_router\_dataset-synth` dataset, which is a synthetic dataset of ~15,000 user prompts with a difficulty score of "large\_llm" (`1`) or "small\_llm" (`0`).

We will use the `load\_dataset()` method from the [🤗 Datasets](https://huggingface.co/docs/datasets/index) library to load the `DevQuasar/llm\_router\_dataset-synth` dataset.

Python

```python
from datasets import load\_dataset
 
# Dataset id from huggingface.co/dataset
# dataset\_id = "DevQuasar/llm\_router\_dataset-synth"
dataset\_id = "legacy-datasets/banking77"
 
# Load raw dataset
raw\_dataset = load\_dataset(dataset\_id)
 
print(f"Train dataset size: {len(raw\_dataset['train'])}")
print(f"Test dataset size: {len(raw\_dataset['test'])}")
```

Train dataset size: 10003 Test dataset size: 3080

Let’s check out an example of the dataset.

Python

```python
from random import randrange
 
random\_id = randrange(len(raw\_dataset['train']))
raw\_dataset['train'][random\_id]
# {'id': '6225a9cd-5cba-4840-8e21-1f9cf2ded7e6',
# 'prompt': 'How many legs does a spider have?',
# 'label': 0}
```

To train our model, we need to convert our text prompts to token IDs. This is done by a Tokenizer, which tokenizes the inputs (including converting the tokens to their corresponding IDs in the pre-trained vocabulary) if you want to learn more about this, out **[chapter 6](https://huggingface.co/course/chapter6/1?fw=pt)** of the [Hugging Face Course](https://huggingface.co/course/chapter1/1).

Python

```python
from transformers import AutoTokenizer
 
# Model id to load the tokenizer
# model\_id = "answerdotai/ModernBERT-base"
model\_id = "google-bert/bert-base-uncased"
# Load Tokenizer
tokenizer = AutoTokenizer.from\_pretrained(model\_id)
tokenizer.model\_max\_length = 512 # set model\_max\_length to 512 as prompts are not longer than 1024 tokens
 
# Tokenize helper function
def tokenize(batch):
    return tokenizer(batch['text'], padding='max\_length', truncation=True, return\_tensors="pt")
 
# Tokenize dataset
raw\_dataset =  raw\_dataset.rename\_column("label", "labels") # to match Trainer
tokenized\_dataset = raw\_dataset.map(tokenize, batched=True,remove\_columns=["text"])
 
print(tokenized\_dataset["train"].features.keys())
# dict\_keys(['input\_ids', 'token\_type\_ids', 'attention\_mask','lable'])
```

## 3\. Fine-tune & evaluate ModernBERT with the Hugging Face Trainer

After we have processed our dataset, we can start training our model. We will use the [answerdotai/ModernBERT-base](https://huggingface.co/answerdotai/ModernBERT-base) model. The first step is to load our model with `AutoModelForSequenceClassification` class from the [Hugging Face Hub](https://huggingface.co/answerdotai/ModernBERT-base). This will initialize the pre-trained ModernBERT weights with a classification head on top. Here we pass the number of classes (2) from our dataset and the label names to have readable outputs for inference.

Python

```python
from transformers import AutoModelForSequenceClassification
 
# Model id to load the tokenizer
# model\_id = "answerdotai/ModernBERT-base"
model\_id = "google-bert/bert-base-uncased"
 
# Prepare model labels - useful for inference
labels = tokenized\_dataset["train"].features["labels"].names
num\_labels = len(labels)
label2id, id2label = dict(), dict()
for i, label in enumerate(labels):
    label2id[label] = str(i)
    id2label[str(i)] = label
 
# Download the model from huggingface.co/models
model = AutoModelForSequenceClassification.from\_pretrained(
    model\_id, num\_labels=num\_labels, label2id=label2id, id2label=id2label,
)
```

We evaluate our model during training. The `Trainer` supports evaluation during training by providing a `compute\_metrics` method. We use the `evaluate` library to calculate the [f1 metric](https://huggingface.co/spaces/evaluate-metric/f1) during training on our test split.

Python

```python
import numpy as np
from sklearn.metrics import f1\_score
 
# Metric helper method
def compute\_metrics(eval\_pred):
    predictions, labels = eval\_pred
    predictions = np.argmax(predictions, axis=1)
    score = f1\_score(
            labels, predictions, labels=labels, pos\_label=1, average="weighted"
        )
    return {"f1": float(score) if score == 1 else score}
```

The last step is to define the hyperparameters (`TrainingArguments`) we use for our training. Here we are adding optimizations introduced features for fast training times using `torch\_compile` option in the `TrainingArguments`.

We also leverage the [Hugging Face Hub](https://huggingface.co/models) integration of the `Trainer` to push our checkpoints, logs, and metrics during training into a repository.

Python

```python
from huggingface\_hub import HfFolder
from transformers import Trainer, TrainingArguments
 
# Define training args
training\_args = TrainingArguments(
    output\_dir= "modernbert-llm-router",
    per\_device\_train\_batch\_size=32,
    per\_device\_eval\_batch\_size=16,
    learning\_rate=5e-5,
		num\_train\_epochs=5,
    bf16=True, # bfloat16 training 
    optim="adamw\_torch\_fused", # improved optimizer 
    # logging & evaluation strategies
    logging\_strategy="steps",
    logging\_steps=100,
    eval\_strategy="epoch",
    save\_strategy="epoch",
    save\_total\_limit=2,
    load\_best\_model\_at\_end=True,
    metric\_for\_best\_model="f1",
    # push to hub parameters
    report\_to="tensorboard",
    push\_to\_hub=True,
    hub\_strategy="every\_save",
    hub\_token=HfFolder.get\_token(),
 
)
 
# Create a Trainer instance
trainer = Trainer(
    model=model,
    args=training\_args,
    train\_dataset=tokenized\_dataset["train"],
    eval\_dataset=tokenized\_dataset["test"],
    compute\_metrics=compute\_metrics,
)
```

We can start our training by using the **`train`** method of the `Trainer`.

Python

```python
# Start training
trainer.train()
```

Fine-tuning `answerdotai/ModernBERT-base` on ~15,000 synthetic prompts for 5 epochs took `321` seconds and our best model achieved a `f1` score of `0.993`. 🚀 I also ran the training with `bert-base-uncased` to compare the training time and performance. The original BERT achieved a `f1` score of `0.99` and took `1048` seconds to train.

*Note: ModernBERT and BERT both almost achieve the same performance. This indicates that the dataset is not challenging and probably could be solved using a logistic regression classifier. I ran the same code on the [banking77](https://huggingface.co/datasets/legacy-datasets/banking77) dataset. A dataset of ~13,000 customer service queries with 77 classes. There the ModernBERT outperformed the original BERT by 3% (f1 score of 0.93 vs 0.90)*

Lets save our final best model and tokenizer to the Hugging Face Hub and create a model card.

Python

```python
# Save processor and create model card
tokenizer.save\_pretrained("modernbert-llm-router")
trainer.create\_model\_card()
trainer.push\_to\_hub()
```

## 4\. Run Inference & test model

To wrap up this tutorial, we will run inference on a few examples and test our model. We will use the `pipeline` method from the `transformers` library to run inference on our model.

Python

```python
from transformers import pipeline
 
# load model from huggingface.co/models using our repository id
classifier = pipeline("sentiment-analysis", model="modernbert-llm-router", device=0)
 
sample = "How does the structure and function of plasmodesmata affect cell-to-cell communication and signaling in plant tissues, particularly in response to environmental stresses?"
 
 
pred = classifier(sample)
print(pred)
# [{'label': 'large\_llm', 'score': 1.0}]
```

## Conclusion

In this tutorial, we learned how to fine-tune ModernBERT for an LLM routing classification task. We demonstrated how to leverage the Hugging Face ecosystem to efficiently train and deploy a specialized classifier that can intelligently route user prompts to the most appropriate LLM model.

Using modern training optimizations like flash attention, fused optimizers and mixed precision, we were able to train our model efficiently. Comparing ModernBERT with the original BERT we reduced training time by approximately 3x (1048s vs 321s) on our dataset and outperformed the original BERT by 3% on a more challenging dataset. But more importantly, ModernBERT was trained on 2 trillion tokens, which are more diverse and up to date than the Wikipedia-based training data of the original BERT.

This example showcases how smaller, specialized models remain valuable in the age of large language models - particularly for high-throughput, latency-sensitive tasks like LLM routing. By using ModernBERT's improved architecture and broader training data, we can build more robust and efficient classification systems.
