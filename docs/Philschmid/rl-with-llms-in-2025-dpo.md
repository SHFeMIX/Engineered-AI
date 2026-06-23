---
title: "How to align open LLMs in 2025 with DPO & and synthetic data"
site: "Philipp Schmid"
published: "2025-01-23"
source: "https://www.philschmid.de/rl-with-llms-in-2025-dpo"
domain: ""
language: "en"
word_count: 2973
---

# How to align open LLMs in 2025 with DPO & and synthetic data

Large Language Models (LLMs) continued their important role in 2024, with several major developments completely outperforming previous models. The focus continued to more smaller, more powerful models from companies like Meta, Qwen, or Google. These models not only became more powerful, but also more efficient.

Part of the reason is the continued scaling of post-training methods and datasets. Post-training methods like [Direct Preference Optimization (DPO)](https://huggingface.co/papers/2305.18290), [Proximal Policy Optimization (PPO)](https://huggingface.co/papers/2203.02155), and [Group Preference Optimization (GRPO)](https://huggingface.co/papers/2310.11523) have been used to align models with human preferences and improve performance.

Continuing from [How to fine-tune open LLMs in 2025 with Hugging Face](https://www.philschmid.de/fine-tune-llms-in-2025), this guide focuses on aligning models using Direct Preference Optimization (DPO). We'll build upon our previously fine-tuned model from the [Fine-Tune LLMs in 2025](https://www.philschmid.de/fine-tune-llms-in-2025) guide and improve it further through preference learning.

Before we start, let's take a look at the [Direct Preference Optimization (DPO)](https://huggingface.co/papers/2305.18290) paper and understand how it works.

**What is Direct Preference Optimization (DPO)?**

[Direct Preference Optimization (DPO)](https://huggingface.co/papers/2305.18290) is a simplified approach to align language models with human preferences. Unlike traditional RLHF methods that require training a separate reward model and using complex PPO optimization, DPO treats the alignment problem as a classification task on preference data. This makes it more stable, efficient, and computationally lightweight compared to alternatives.

- **Simplicity**: DPO eliminates the need for a separate reward model and complex RL optimization, making it easier to implement and debug
- **Stability**: By avoiding the instabilities of PPO training, DPO provides more reliable convergence
- **Efficiency**: The direct optimization approach requires less compute and fewer hyperparameters than traditional RLHF
- **Performance**: Despite its simplicity, DPO achieves comparable results

**Overview**

In this guide, we'll use offline DPO with on-Policy data. Offline DPO is the more compute-efficient, meaning we don't need a Reward model during training in memory. However, we will be staying on-policy. We'll first generate samples from the Supervised Fine-Tuned (SFT) model we trained in the previous guide and score them with a rule-based reward model that checks answer correctness. These scores will then be used to create preference pairs (a "preferred" and a "rejected" response) for DPO training.

If you are going to adjust the example to your own use case, which cannot be verified with a rule-based reward model, you can use a generic reward model like [nicolinho/QRM-Llama3.1-8B-v2](https://huggingface.co/nicolinho/QRM-Llama3.1-8B-v2), which ranks in the top 10 on reward bench or LLM as judge based on your own criteria.

You will learn how to:

1. [Setup the development environment](https://www.philschmid.de/rl-with-llms-in-2025-dpo#1-setup-development-environment)
2. [Create on-policy preference dataset from model outputs](https://www.philschmid.de/rl-with-llms-in-2025-dpo#2-create-on-policy-preference-dataset-from-model-outputs)
3. [Align the model using DPO and the Hugging Face `DPOTrainer`](https://www.philschmid.de/rl-with-llms-in-2025-dpo#3-align-the-model-using-dpo-and-the-hugging-face-dpotrainer)
4. [Test and evaluate the aligned model](https://www.philschmid.de/rl-with-llms-in-2025-dpo#4-test-and-evaluate-the-aligned-model)

*Note: This guide is designed for consumer GPUs (24GB+) like the NVIDIA RTX 4090/5090 or A10G, but can be adapted for larger systems.*

## 1\. Setup development environment

Our first step is to install Hugging Face Libraries and Pytorch, vllm, and trl, transformers and datasets. If you haven't heard of trl yet, don't worry. It is a new library on top of transformers and datasets, which makes it easier to fine-tune, rlhf, align open LLMs.

Python

```python
# Install Pytorch & other libraries, make sure to match your GPU driver version
%pip install "torch==2.5.1" vllm tensorboard  "setuptools\<71.0.0" openai "lm-eval[api]==0.4.5"  --index-url https://download.pytorch.org/whl/cu121
 
# Install flash-attn
%pip install flash-attn 
 
# Install Hugging Face libraries
%pip install  --upgrade \
  "transformers==4.48.1" \
  "datasets==3.1.0" \
  "accelerate==1.3.0" \
  "bitsandbytes==0.45.0" \
  "peft==0.14.0" \
  "hf-transfer==0.1.9" \
  "trl==0.13.0"
```

*Note: you may need to restart the kernel to use updated packages.*

We will use the [Hugging Face Hub](https://huggingface.co/models) as a remote model versioning service. This means we will automatically push our model, logs and information to the Hub during training. You must register on the [Hugging Face](https://huggingface.co/join) for this. After you have an account, we will use the `login` util from the `huggingface\_hub` package to log into our account and store our token (access key) on the disk.

Python

```python
from huggingface\_hub import login
 
login(token="", add\_to\_git\_credential=True) # ADD YOUR TOKEN HERE
```

## 2\. Create on-policy preference dataset from model outputs

We are going to generate a preference dataset from our SFT model rather than using a different model and off-policy data. On-policy data is generated from the model being trained, which means the preference pairs directly reflect the model's current capabilities and output distribution. This makes the training more relevant and effective.

Studies have shown that leveraging on-policy preference data leads to better performance compared to off-policy approaches. [REF 1](https://arxiv.org/abs/2404.14367), [REF 2](https://arxiv.org/abs/2403.10160).

As we are building on our previous fine-tuned model we want to furhter improve the performance on MATH related tasks. We will use the prompts from [philschmid/DMath](https://huggingface.co/datasets/philschmid/DMath). DMath (Diverse Math Word Problems) is a collection of 10K high-quality grade school-level math word problems for the paper ["It Ain't Over: A Multi-aspect Diverse Math Word Problem Dataset"](https://aclanthology.org/2023.emnlp-main.927.pdf). Each solution will be scored by a rule-based reward model that checks answer correctness using a regex. (Thats a very simple and naive approach, better would to additionally use specific format extraction, e.g. "The Answer is: \[ANSWER\]" or additional LLM Judge). If the solution is correct, it will be labeled as preferred, otherwise as rejected. Based on the score we will create difference preference pairs.

I prepared [create\_preference\_dataset.py](https://github.com/philschmid/deep-learning-pytorch-huggingface/blob/main/training/scripts/dpo/create\_preference\_dataset.py) script to generate the dataset. The dataset will be saved to the Hugging Face Hub. We are going to generate 4 solutions for each input hoping to have at least one correct solution and one incorrect solution. If we don't have a pair we will skip the input.

Python

```python
python scripts/dpo/create\_preference\_dataset.py --dataset\_id philschmid/DMath --sample\_size 5000 --generation\_model\_name\_or\_path philschmid/llama-3-1-8b-math-orca-spectrum-10k-ep1 --num\_solutions 4 --batch\_size 16
```

*Note: You can skip this step and used the generated preference dataset from me [philschmid/philschmid-llama-3-1-8b-math-orca-spectr-philschmid-DMath-candidates](https://huggingface.co/philschmid/philschmid-llama-3-1-8b-math-orca-spectr-philschmid-DMath-candidates). It includes 1.9k prefence pairs.*

## 3\. Align the model using DPO and the Hugging Face DPOTrainer

TRL supports the DPO through a dedicated [DPOTrainer](https://huggingface.co/docs/trl/dpo\_trainer) for aligning LLMs from preference data, as described in [Direct Preference Optimization: Your Language Model is Secretly a Reward Model](https://huggingface.co/papers/2305.18290). The `DPOTrainer` is a subclass of the `Trainer` from the `transformers` library and supports all the same features, including logging, checkpointing, distributed training, and parameter efficient fine-tuning (PEFT). [Direct Preference Optimization (DPO)](https://huggingface.co/papers/2305.18290) aligns LLMs with human preferences using 'prompt', 'chosen', and 'rejected' columns, where each 'prompt' is paired with a 'chosen' response that aligns with human preferences and a 'rejected' response that does not.

We prepared a [run\_dpo.py](https://github.com/philschmid/deep-learning-pytorch-huggingface/blob/main/training/scripts/dpo/run\_dpo.py) scripts, which supports providing a yaml configuration file. This allows you to easily change the model, dataset, hyperparameters, and other settings. This is done by using the `TrlParser`, which parses the yaml file and converts it into the `TrainingArguments` arguments.

Based on the [Alignment Handbook](https://github.com/huggingface/alignment-handbook) we know that we need to use a ~10-100x smaller learning rate for DPO compared to SFT. In our example we reduce the learning rate from 2e-4 (SFT) to 5e-6 (DPO). Another important parameter is the `beta` parameter, which is used to control the strength of the alignment, typically something in the range of 0.1 to 0.5. A higher beta means less divergence from the initial reference model or the text generations are very similar in terms of their probability distributions.

The script is kept very simple and is easy to understand. This should help you understand, customize and extend the script for your own use case. We define `dataclasses` for our arguments. Every argument can then be provided either via the command line or by providing a yaml configuration file. That way we have better type safety and intellisense support.

Python

```python
# ....
 
@dataclass
class ScriptArguments:
    dataset\_id\_or\_path: str
    ...
# ....
```

The training script is separated by `#######` blocks for the different parts of the script. The main training function:

1. Logs all hyperperparameters
2. Loads the dataset and Tokenizer from Hugging Face Hub or local disk
3. Prepares the DPO dataset correctly using the `prompt`, `chosen` and `rejected` column
4. Loads the policy model and/or reference model
5. Instantiate DPO trainer and starts the training loop (optionally continue training from a checkpoint)
6. Saves the model and optionally pushes it to the Hugging Face Hub

Below is an example recipe of how we train [Llama 8B model with DPO and Q-LoRA](https://github.com/philschmid/deep-learning-pytorch-huggingface/blob/main/training/receipes/dpo-llama-3-1-8b-qlora.yaml).

YAML

```yaml
# Model arguments
model\_name\_or\_path: philschmid/llama-3-1-8b-math-orca-spectrum-10k-ep1
tokenizer\_name\_or\_path: philschmid/llama-3-1-8b-math-orca-spectrum-10k-ep1
model\_revision: main
torch\_dtype: bfloat16
attn\_implementation: flash\_attention\_2
use\_liger: false
bf16: true
tf32: true
output\_dir: runs/dpo-llama-3-1-8b-math-ep3
 
# Dataset arguments
dataset\_id\_or\_path: philschmid/philschmid-llama-3-1-8b-math-orca-spectr-philschmid-DMath-candidates
 
# LoRA arguments
use\_peft: true
load\_in\_4bit: true
lora\_target\_modules: "all-linear"
# important as we need to train the special tokens for the chat template of llama 
lora\_modules\_to\_save: ["lm\_head", "embed\_tokens"] # you might need to change this for qwen or other models
lora\_r: 16
lora\_alpha: 16
 
# Training arguments
beta: 0.1
max\_length: 1536
max\_prompt\_length: 768
loss\_type: sigmoid # default loss, alternatives: https://huggingface.co/docs/trl/dpo\_trainer#loss-functions
num\_train\_epochs: 3
per\_device\_train\_batch\_size: 1 
gradient\_accumulation\_steps: 8
gradient\_checkpointing: true
gradient\_checkpointing\_kwargs:
  use\_reentrant: false
learning\_rate: 5.0e-6 
lr\_scheduler\_type: constant
warmup\_ratio: 0.03
 
# Logging arguments
logging\_strategy: steps
logging\_steps: 5
report\_to:
- tensorboard
save\_strategy: "epoch"
seed: 42
 
# Hugging Face Hub 
push\_to\_hub: true
  # hub\_model\_id: llama-3-1-8b-math-orca-qlora-10k-ep1 # if not defined same as output\_dir
hub\_strategy: every\_save
```

This config can be used for single-GPU training (~24GB GPU Memory), if you have more memory available you can increase the `per\_device\_train\_batch\_size` and for multi-GPU training with DeepSpeed (see Appendix for full

\_Note: I ran the script on 1x H100 with a batch size of 8 and 8 gradient accumulation steps. This took ~1 hours to complete.\_command).

Python

```python
!python scripts/dpo/run\_dpo.py --config receipes/dpo-llama-3-1-8b-qlora.yaml
```

*Note: During the training we want to minimize loss and grow reward/margins metrics. Keep an eye on the reward/margins metrics, if they are not growing you might need to increase the beta parameter or adjust the learning\_rate.*

Using Q-LoRA only saves the trained adapter weights. If you want to use the model as standalone model, e.g. for inference you might want to merge the adapter and base model. This can be done using the following command:

Python

```python
!python scripts/merge\_adapter\_weights.py --peft\_model\_id runs/dpo-llama-3-1-8b-math-ep3 --push\_to\_hub True --repository\_id dpo-llama-3-1-8b-math-ep3-merged
```

## 4\. Test and evaluate the aligned model

After the training is done we want to evaluate and test our model. Similar to our SFT model, we will evaluate the model on [GSM8K](https://huggingface.co/datasets/openai/gsm8k) dataset to see if it improved performance. GSM8K (Grade School Math 8K) is a dataset of 8.5K high quality linguistically diverse grade school math word problems. The dataset was created to support the task of question answering on basic mathematical problems that require multi-step reasoning.

Evaluating Generative AI models is not a trivial task since 1 input can have multiple correct outputs. If you want to learn more about evaluating generative models, check out:

- [Evaluate LLMs and RAG a practical example using Langchain and Hugging Face](https://www.philschmid.de/evaluate-llm).
- [Evaluate LLMs using Evaluation Harness and Hugging Face TGI/vLLM](https://www.philschmid.de/evaluate-llms-with-lm-eval-and-tgi-vllm)
- [LLM Evaluation doesn't need to be complicated](https://www.philschmid.de/llm-evaluation)
- [Evaluating Open LLMs with MixEval: The Closest Benchmark to LMSYS Chatbot Arena](https://www.philschmid.de/evaluate-llm-mixeval)

We are going to use [Evaluation Harness](https://github.com/EleutherAI/lm-evaluation-harness) an open-source framework to evaluate language models on a wide range of tasks and benchmarks. The frameworks support evaluating models behind OpenAI compatible API endpoints, those can be locally or remotely. This super helpful as we can evaluate our model in the same environment we will use for production.

We are going to use [Text Generation Inference (TGI)](https://github.com/huggingface/text-generation-inference) for testing and deploying our model. TGI is a purpose-built solution for deploying and serving Large Language Models (LLMs). TGI enables high-performance text generation using Tensor Parallelism and continous batching. If you are or want to use vLLM you can check the Appendix on how to start the inference server.

*Note: Make sure that you have enough GPU memory to run the container. Restart kernel to remove all allocated GPU memory from the notebook.*

We will start the on 1 GPU detached. Meaning we can can continue to use the notebook while the container is running. If you have more GPUs you can change the `--gpus` and `--num-shard` flags to the number of GPUs.

Bash

```bash
%%bash
 
num\_gpus=1
model\_id=philschmid/dpo-llama-3-1-8b-math-ep3-merged # replace with your model id
 
docker run --name tgi --gpus ${num\_gpus} -d -ti -p 8080:80 --shm-size=2GB \
  -e HF\_TOKEN=$(cat ~/.cache/huggingface/token) \
  ghcr.io/huggingface/text-generation-inference:3.0.1 \
  --model-id ${model\_id} \
  --num-shard ${num\_gpus}
```

Our container will now start in the background and download the model from Hugging Face Hub. We can check the logs to see the progress with `docker logs -f tgi`.

Once our container is running we can send requests using the `openai` or `huggingface\_hub` sdk. Here we ll use the `openai` sdk to send a request to our inference server. If you don't have the `openai` sdk installed you can install it using `pip install openai`.

Python

```python
from openai import OpenAI
 
# create client 
client = OpenAI(base\_url="http://localhost:8080/v1",api\_key="-")
 
system\_message = """Solve the given high school math problem by providing a clear explanation of each step leading to the final solution.
 
Provide a detailed breakdown of your calculations, beginning with an explanation of the problem and describing how you derive each formula, value, or conclusion. Use logical steps that build upon one another, to arrive at the final answer in a systematic manner.
 
# Steps
 
1. **Understand the Problem**: Restate the given math problem and clearly identify the main question and any important given values.
2. **Set Up**: Identify the key formulas or concepts that could help solve the problem (e.g., algebraic manipulation, geometry formulas, trigonometric identities).
3. **Solve Step-by-Step**: Iteratively progress through each step of the math problem, justifying why each consecutive operation brings you closer to the solution.
4. **Double Check**: If applicable, double check the work for accuracy and sense, and mention potential alternative approaches if any.
5. **Final Answer**: Provide the numerical or algebraic solution clearly, accompanied by appropriate units if relevant.
 
# Notes
 
- Always clearly define any variable or term used.
- Wherever applicable, include unit conversions or context to explain why each formula or step has been chosen.
- Assume the level of mathematics is suitable for high school, and avoid overly advanced math techniques unless they are common at that level.
- Return the final in an extra line. Staring with "The Answer is: [ANSWER]"
 
# Examples
"""
 
messages = [
    {"role": "system", "content": system\_message},
    # {"role": "user", "content": "If you converted $140 to 158760 Korean Won, how much is $1 in Korean Won?"},
    {"role": "user", "content": "Q: Henry and 3 of his friends order 7 pizzas for lunch. Each pizza is cut into 8 slices. If Henry and his friends want to share the pizzas equally, how many slices can each of them have?\nA:"},
    # {"role": "user", "content": "The rectangular-shaped cell phone is 9 centimeters (cm) wide and 46 centimeters (cm) in circumference. Find the vertical length of the cell phone?"},
]
expected\_answer = "14"
 
 
# Take a random sample from the dataset and remove the last message and send it to the model
 
response = client.chat.completions.create(
    model="philschmid/dpo-llama-3-1-8b-math-ep3-merged",
    messages=messages,
    stream=False, # no streaming
    max\_tokens=1024,
    temperature=1.0)
response = response.choices[0].message.content
 
# Print results
print(f"Query:\n{messages[1]['content']}")
print(f"Original Answer:\n{expected\_answer}")
print(f"Generated Answer:\n{response}")
```

Awesome that looks great! Now we can evaluate our model with the [Evaluation Harness](https://github.com/EleutherAI/lm-evaluation-harness).

*Note: Make sure to change the model id to your fine-tuned model.*

Python

```python
!lm\_eval --model local-chat-completions \
  --tasks gsm8k\_cot \
  --model\_args model=philschmid/dpo-llama-3-1-8b-math-ep3-merged,base\_url=http://localhost:8080/v1/chat/completions,num\_concurrent=8,max\_retries=10,tokenized\_requests=False,timeout=180,max\_length=4096 \
  --apply\_chat\_template \
  --fewshot\_as\_multiturn
```

Wow, 59% accuracy, thats a 5% improvement from our SFT model, using only ~2k preference pairs for 3 epochs. That shows that our script and config is working correctly.

*Note: You might be able to achieve better results with more data, more epochs or tuning the hyperparameters (beta, learning rate, batch size, etc.). I ran some ablations on multi-gpu training and full training with DeepSpeed (see Appendix for full command) and the best results was 62% accuracy.*

Python

```python
!docker stop tgi
!docker rm tgi
```

## Conclusion

In this guide, we successfully aligned a Llama 3.1 8B model using Direct Preference Optimization (DPO) and achieved a 5% improvement on GSM8K compared to our SFT baseline. Instead of using off-policy preference data (like existing human preference datasets), we generated our own preference pairs using the SFT model we wanted to align. This approach has several advantages:

- The preference pairs directly reflect the model's current capabilities and output distribution
- We could automatically evaluate responses using a rule-based reward model for math problems
- The training becomes more focused and effective since we're optimizing for the specific behaviors we want to improve

We also learned that even with a relatively small dataset (~2k preference pairs) and just 3 epochs of training, DPO can produce meaningful improvements in model performance. **The** combination of on-policy data generation and DPO provides a practical and efficient approach to aligning language models with specific objectives. This method could be adapted for various domains beyond math problems by using different reward models or evaluation criteria to generate preference pairs.

## Appendix

*Note: Make sure to install deepspeed and accelerate before running the commands. `pip install deepspeed==0.15.4`*

### Distributed Training

Bash

```bash
ACCELERATE\_LOG\_LEVEL=info accelerate launch --num\_processes 4 --config\_file configs/accelerate\_configs/deepspeed\_zero3.yaml scripts/dpo/run\_dpo.py --config receipes/dpo-llama-3-1-8b.yaml
```
