---
title: "Character Prefix Conditioning · Cursor"
site: "Cursor"
published: 2025-01-06T21:08:00.000Z, 2025-01-06T21:08:00.000Z
source: "https://cursor.com/blog/cpc"
domain: "cursor.com"
language: "en-US"
word_count: 245
---

# Character Prefix Conditioning · Cursor

The first in a series of problems that give a glimpse into the work we do at Cursor.

## Setup

When using a language model for code completion, we typically want the model to produce a completion that begins with what the user has typed.

However, modern language models operate on sequences of tokens, not characters, so naively tokenizing the user's input and sending it to the model produces wrong results if the user's cursor doesn't happen to lie on a token boundary.

Instead, we need an algorithm that samples a sequence of tokens conditional on a prefix of **characters**, rather than the more typical case of sampling conditional on a prefix of tokens.

We call this **character prefix conditioning**, an algorithm for sampling a sequence of tokens conditioned on a character prefix.

We want to sample a sequence of tokens from a distribution specified by an autoregressive model given by

subject to the constraint that starts with a character prefix , i.e. is a prefix of , where means string concatenation and maps a token to the characters it represents.

We define . It's sufficient to find a way to sample autoregressively from , that is, to sample from for each .

## Problem

Can you construct an efficient algorithm for sampling from , that minimizes calls to the original language model? A description of the algorithm is great. An actual implementation is excellent.

Feel free to email me your solutions at [problems@cursor.com](mailto:problems@cursor.com).