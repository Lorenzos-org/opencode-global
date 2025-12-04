---
description: List all available AI models and providers
agent: general
subtask: true
---

# /models - List Available AI Models

This command displays all available AI models and providers configured in OpenCode.

## Available Models

### Zen Provider
- **zen/gpt-5-nano** - GPT-5 Nano - Free
- **zen/grok-code** - Grok Code Fast 1 - Free
- **zen/big-pickle** - Big Pickle - Free (Stealth)
- **opencode zen's big pickle** - Enhanced Big Pickle - Free (Primary)

### ZAI Coding Provider  
- **glm-4.6-coding-plan** - GLM-4.6 Coding Plan

## Usage

To use a specific model, reference it by provider/model-name:

```
Use zen/gpt-5-nano for this coding task
Use glm-4.6-coding-plan for planning
```

## Configuration

Models are configured in:
- Global: `~/.config/opencode/opencode.json`
- Project: `.opencode/config.json`

To add new models, update the provider configuration in these files.