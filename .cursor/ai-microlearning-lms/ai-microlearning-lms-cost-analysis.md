# AI Microlearning LMS - Cost Analysis & Optimization

**Detailed cost breakdown, pricing research, optimization strategies, and usage limits.**

## Table of Contents

1. [Cost Overview](#cost-overview)
2. [AI API Costs](#ai-api-costs)
3. [Voice API Costs](#voice-api-costs)
4. [Image Generation Costs](#image-generation-costs)
5. [Storage Costs](#storage-costs)
6. [Cost Estimation Scenarios](#cost-estimation-scenarios)
7. [Cost Optimization Strategies](#cost-optimization-strategies)
8. [Usage Limits & Alerts](#usage-limits--alerts)
9. [Cost Tracking Implementation](#cost-tracking-implementation)

## Cost Overview

### Pricing Summary (As of December 2025)

**OpenAI:**
- GPT-5.1 Mini: $0.25/1M input tokens, $2.00/1M output tokens
- GPT-5.1 Nano: $0.05/1M input tokens, $0.40/1M output tokens
- text-embedding-3-small: $0.02/1M tokens
- DALL-E 3: $0.040 per image (1024x1024)
- Whisper API: $0.006 per minute
- TTS Standard (tts-1): $0.015 per 1,000 characters
- TTS HD (tts-1-hd): $0.030 per 1,000 characters

**ElevenLabs:**
- Free: 10,000 credits/month (~10 minutes TTS)
- Starter: $5/month for 30,000 credits (~30 minutes)
- Creator: $22/month for 100,000 credits (~100 minutes)
- Pro: $99/month for 500,000 credits (~500 minutes)
- Scale: $330/month for 2,000,000 credits (~2,000 minutes)
- Business: $1,320/month for 11,000,000 credits (~11,000 minutes)

**Infrastructure:**
- Proxmox VM: $0 (self-hosted)
- PostgreSQL: $0 (self-hosted)
- Redis: $0 (self-hosted)
- Storage: $0 (local filesystem)

## AI API Costs

### GPT-5.1 Mini Usage

**Content Generation:**
- **Input:** ~2,000 tokens per nugget (source content)
- **Output:** ~1,500 tokens per nugget (generated content)
- **Cost per nugget:** (2,000/1M × $0.25) + (1,500/1M × $2.00) = $0.0005 + $0.003 = **$0.0035 per nugget**

**Narrative Planning:**
- **Input:** ~1,000 tokens (learner profile + nugget content)
- **Output:** ~500 tokens (narrative node with choices)
- **Cost per node:** (1,000/1M × $0.25) + (500/1M × $2.00) = $0.00025 + $0.001 = **$0.00125 per node**

**Tutoring (Per Message):**
- **Input:** ~2,000 tokens (conversation history + current message)
- **Output:** ~1,500 tokens (AI response)
- **Cost per message:** (2,000/1M × $0.25) + (1,500/1M × $2.00) = $0.0005 + $0.003 = **$0.0035 per message**

### GPT-5.1 Nano Usage

**Metadata Extraction:**
- **Input:** ~2,000 tokens per chunk
- **Output:** ~200 tokens (JSON metadata)
- **Cost per chunk:** (2,000/1M × $0.05) + (200/1M × $0.40) = $0.0001 + $0.00008 = **$0.00018 per chunk**

### Embeddings Cost

**text-embedding-3-small:**
- **Input:** ~2,000 tokens per chunk (for embedding)
- **Cost per chunk:** 2,000/1M × $0.02 = **$0.00004 per chunk**

### Image Generation Cost

**DALL-E 3:**
- **Cost per image:** **$0.040 per image**
- One image per nugget (main concept)

## Voice API Costs

### Text-to-Speech (TTS)

**OpenAI Standard (tts-1):**
- **Cost:** $0.015 per 1,000 characters
- **Average nugget:** ~1,000 characters
- **Cost per nugget:** $0.015
- **Cost per minute:** ~$0.45 (assuming 150 words/min = ~750 chars)

**OpenAI HD (tts-1-hd):**
- **Cost:** $0.030 per 1,000 characters
- **Average nugget:** ~1,000 characters
- **Cost per nugget:** $0.030
- **Cost per minute:** ~$0.90

**ElevenLabs:**
- **Cost per minute:** Varies by plan
  - Starter: ~$0.17/minute ($5/30 min)
  - Creator: ~$0.22/minute ($22/100 min)
  - Pro: ~$0.20/minute ($99/500 min)
  - Scale: ~$0.17/minute ($330/2000 min)

### Speech-to-Text (STT)

**OpenAI Whisper:**
- **Cost:** $0.006 per minute
- **Average session:** 30 minutes
- **Cost per session:** $0.18

**ElevenLabs STT:**
- Uses credits (same as TTS)
- **Cost per minute:** ~$0.10-0.20 (depending on plan)

## Image Generation Costs

**DALL-E 3:**
- **Cost:** $0.040 per image
- **One image per nugget** (main concept illustration)
- **Cost per 1,000 nuggets:** $40

## Storage Costs

**Local Filesystem:**
- **Cost:** $0 (self-hosted on Proxmox VM)
- **Storage needs:**
  - Raw content: ~1 GB per 1,000 files
  - Generated images: ~5 MB per image (PNG)
  - Generated audio: ~1 MB per minute (MP3)
  - **Estimated:** 10-20 GB for 1,000 nuggets

## Cost Estimation Scenarios

### Scenario 1: 100 Active Learners (Text-First)

**Assumptions:**
- 90% use text mode (90 learners)
- 10% use voice mode (10 learners)
- Average session: 30 minutes
- Sessions per learner: 10 per month
- Average 20 messages per session

**Text Mode Costs (90 learners):**

**Tutoring (GPT-5.1 Mini):**
- Messages: 90 learners × 10 sessions × 20 messages = 18,000 messages
- Input tokens: 18,000 × 2,000 = 36,000,000 tokens
- Output tokens: 18,000 × 1,500 = 27,000,000 tokens
- Input cost: 36M/1M × $0.25 = **$9.00**
- Output cost: 27M/1M × $2.00 = **$54.00**
- **Total tutoring: $63.00/month**

**Narrative Planning:**
- Nodes: 90 learners × 10 sessions × 5 nodes = 4,500 nodes
- Input tokens: 4,500 × 1,000 = 4,500,000 tokens
- Output tokens: 4,500 × 500 = 2,250,000 tokens
- Input cost: 4.5M/1M × $0.25 = **$1.13**
- Output cost: 2.25M/1M × $2.00 = **$4.50**
- **Total planning: $5.63/month**

**Content Generation (Batch):**
- New nuggets: ~1,000 nuggets/month
- Input tokens: 1,000 × 2,000 = 2,000,000 tokens
- Output tokens: 1,000 × 1,500 = 1,500,000 tokens
- Input cost: 2M/1M × $0.25 = **$0.50**
- Output cost: 1.5M/1M × $2.00 = **$3.00**
- **Total content: $3.50/month**

**Metadata Extraction (GPT-5.1 Nano):**
- Chunks: 1,000 nuggets × 1 chunk = 1,000 chunks
- Input tokens: 1,000 × 2,000 = 2,000,000 tokens
- Output tokens: 1,000 × 200 = 200,000 tokens
- Input cost: 2M/1M × $0.05 = **$0.10**
- Output cost: 0.2M/1M × $0.40 = **$0.08**
- **Total metadata: $0.18/month**

**Embeddings:**
- Embeddings: 1,000 nuggets × 2,000 tokens = 2,000,000 tokens
- Cost: 2M/1M × $0.02 = **$0.04/month**

**Image Generation:**
- Images: 1,000 nuggets × 1 image = 1,000 images
- Cost: 1,000 × $0.040 = **$40.00/month**

**Text Mode Total: $112.35/month**

**Voice Mode Costs (10 learners):**

**Tutoring (Same as text, but with voice I/O):**
- **Tutoring cost: $7.00/month** (10/90 of text cost)

**Voice Input (Whisper):**
- Audio minutes: 10 learners × 10 sessions × 30 min = 3,000 minutes
- Cost: 3,000 × $0.006 = **$18.00/month**

**Voice Output (TTS):**
- **Low tier (8 learners):** 8 × 10 × 30 × $0.45/min = **$1,080/month**
- **Mid tier (1 learner):** 1 × 10 × 30 × $0.90/min = **$270/month**
- **High tier (1 learner):** 1 × 10 × 30 × $0.20/min = **$60/month**
- **Total TTS: $1,410/month**

**Voice Mode Total: $1,435/month**

**Grand Total (100 learners): $1,547.35/month**
- **Cost per learner:** $15.47/month average
- **Text learner:** $1.25/month
- **Voice learner:** $143.50/month

### Scenario 2: 1,000 Active Learners (Text-First)

**Assumptions:**
- 90% text mode (900 learners)
- 10% voice mode (100 learners)
- Same usage patterns

**Text Mode (900 learners):**
- **Tutoring: $630/month** (10x Scenario 1)
- **Planning: $56.30/month**
- **Content: $3.50/month** (same, batch processing)
- **Metadata: $0.18/month**
- **Embeddings: $0.04/month**
- **Images: $40/month**
- **Total: $730.02/month**

**Voice Mode (100 learners):**
- **Tutoring: $70/month**
- **Voice Input: $180/month**
- **Voice Output: $14,100/month** (100 learners × $141)
- **Total: $14,350/month**

**Grand Total: $15,080.02/month**
- **Cost per learner:** $15.08/month average

## Cost Optimization Strategies

### 1. Model Selection

**Use GPT-5.1 Nano for Simple Tasks:**
- Metadata extraction: Saves ~$0.30 per 1,000 nuggets
- Simple content processing: Use Nano when quality allows

**Use GPT-5.1 Mini for Complex Tasks:**
- Content generation: Quality needed
- Narrative planning: Complex reasoning required
- Tutoring: Conversational quality important

### 2. Caching Strategy

**Cache Embeddings:**
- Don't regenerate embeddings for same content
- Cache frequently accessed nuggets
- **Savings:** ~$0.04 per cached embedding

**Cache Audio:**
- Cache generated audio files
- Reuse audio for same content
- **Savings:** $0.015-$0.20 per cached audio (depending on provider)

**Cache Images:**
- Cache generated images
- Reuse images for similar concepts
- **Savings:** $0.040 per cached image

### 3. Batch Processing

**Batch Content Generation:**
- Process multiple nuggets in single API call when possible
- Reduce API overhead
- **Savings:** 10-20% on API costs

**Batch Embedding Generation:**
- Generate embeddings in batches
- Use batch API endpoints when available
- **Savings:** 5-10% on embedding costs

### 4. Voice Optimization

**Default to Text Mode:**
- Encourage text usage (90% adoption target)
- Voice as premium feature
- **Savings:** $1,410/month for 10 learners (if all use text)

**Voice Tier Limits:**
- Set usage limits per tier
- Low tier: 10 min/session max
- Mid tier: 30 min/session max
- High tier: Unlimited
- **Savings:** 30-50% on voice costs

**Audio Caching:**
- Cache frequently used audio
- Reuse audio for same content
- **Savings:** 20-30% on TTS costs

### 5. Content Optimization

**Smart Chunking:**
- Optimize chunk size to reduce token usage
- Avoid unnecessary overlap
- Use semantic boundaries (not fixed-size chunks)
- **Savings:** 10-15% on processing costs

**Selective Image Generation:**
- Only generate images for major concepts
- Skip images for simple/straightforward content
- Reuse images for similar concepts
- **Savings:** 20-30% on image costs

**Content Deduplication:**
- Detect duplicate content before processing
- Reuse nuggets for identical content
- **Savings:** 100% on duplicate content processing

**Metadata Caching:**
- Cache extracted metadata
- Reuse metadata for similar content
- **Savings:** $0.00018 per cached metadata extraction

### 6. Usage Optimization

**Session Management:**
- Auto-pause inactive sessions (> 30 min)
- Session timeout to prevent resource waste
- **Savings:** Reduce unnecessary AI calls

**Message Optimization:**
- Limit conversation history (last 20 messages)
- Truncate long messages before sending to AI
- **Savings:** 20-30% reduction in token usage

**Narrative Path Optimization:**
- Cache frequently used narrative paths
- Reuse paths for similar learner profiles
- **Savings:** 10-15% reduction in narrative planning costs

### 6. Usage Limits

**Per-Organization Limits:**
- Set monthly AI API call limits
- Set voice minute limits
- Alert when approaching limits
- **Prevents:** Unexpected cost overruns

**Per-Learner Limits:**
- Optional per-learner limits
- Useful for cost control
- **Prevents:** Abuse or excessive usage

## Usage Limits & Alerts

### Limit Configuration

```typescript
// src/lib/usage-limits.ts
interface UsageLimits {
  organizationId: string;
  limits: {
    aiApiCalls: {
      monthly: number; // Total API calls per month
      daily: number; // Per day limit
    };
    voiceMinutes: {
      monthly: number; // Total voice minutes per month
      perLearner: number; // Per learner limit
    };
    storage: {
      gigabytes: number; // Storage limit in GB
    };
    cost: {
      monthly: number; // Monthly cost limit in USD
    };
  };
  alerts: {
    costThreshold: number; // Alert at X% of limit
    emailNotifications: boolean;
  };
}
```

### Alert Implementation

```typescript
// src/lib/usage-alerts.ts
export class UsageAlertService {
  async checkLimits(organizationId: string) {
    const limits = await this.getLimits(organizationId);
    const usage = await this.getUsage(organizationId);
    
    // Check cost limit
    if (usage.cost >= limits.cost.monthly * limits.alerts.costThreshold) {
      await this.sendAlert(organizationId, {
        type: 'cost_warning',
        message: `Cost is at ${(usage.cost / limits.cost.monthly * 100).toFixed(0)}% of monthly limit`,
        current: usage.cost,
        limit: limits.cost.monthly
      });
    }
    
    // Check API call limit
    if (usage.aiApiCalls >= limits.aiApiCalls.monthly * limits.alerts.costThreshold) {
      await this.sendAlert(organizationId, {
        type: 'api_limit_warning',
        message: `API calls at ${(usage.aiApiCalls / limits.aiApiCalls.monthly * 100).toFixed(0)}% of monthly limit`,
        current: usage.aiApiCalls,
        limit: limits.aiApiCalls.monthly
      });
    }
  }
}
```

## Cost Tracking Implementation

### Cost Tracking Service

```typescript
// src/lib/cost-tracking.ts
export class CostTracker {
  async trackAICall(
    provider: string,
    model: string,
    endpoint: string,
    inputTokens: number,
    outputTokens: number,
    organizationId: string
  ) {
    const costs = this.calculateCost(provider, model, inputTokens, outputTokens);
    
    // Store in analytics
    await prisma.analytics.create({
      data: {
        organizationId,
        eventType: 'ai_api_call',
        eventData: {
          provider,
          model,
          endpoint,
          inputTokens,
          outputTokens,
          inputCost: costs.input,
          outputCost: costs.output,
          totalCost: costs.total
        }
      }
    });
    
    // Update organization cost tracking
    await this.updateOrganizationCosts(organizationId, costs.total);
    
    // Check limits
    await this.checkLimits(organizationId);
  }
  
  async trackVoiceUsage(
    provider: string,
    type: 'tts' | 'stt',
    duration: number, // minutes or characters
    organizationId: string
  ) {
    const cost = this.calculateVoiceCost(provider, type, duration);
    
    await prisma.analytics.create({
      data: {
        organizationId,
        eventType: 'voice_api_call',
        eventData: {
          provider,
          type,
          duration,
          cost
        }
      }
    });
    
    await this.updateOrganizationCosts(organizationId, cost);
  }
  
  async trackImageGeneration(
    count: number,
    organizationId: string
  ) {
    const cost = count * 0.040; // $0.040 per image
    
    await prisma.analytics.create({
      data: {
        organizationId,
        eventType: 'image_generation',
        eventData: {
          count,
          cost
        }
      }
    });
    
    await this.updateOrganizationCosts(organizationId, cost);
  }
  
  private calculateCost(
    provider: string,
    model: string,
    inputTokens: number,
    outputTokens: number
  ): { input: number; output: number; total: number } {
    const pricing = this.getPricing(provider, model);
    
    const inputCost = (inputTokens / 1_000_000) * pricing.input;
    const outputCost = (outputTokens / 1_000_000) * pricing.output;
    
    return {
      input: inputCost,
      output: outputCost,
      total: inputCost + outputCost
    };
  }
  
  private getPricing(provider: string, model: string) {
    const pricing: Record<string, { input: number; output: number }> = {
      'openai-gpt-5.1-mini': { input: 0.25, output: 2.00 },
      'openai-gpt-5.1-nano': { input: 0.05, output: 0.40 },
      'openai-text-embedding-3-small': { input: 0.02, output: 0 },
    };
    
    const key = `${provider}-${model}`;
    return pricing[key] || { input: 0, output: 0 };
  }
  
  async getCostReport(
    organizationId: string,
    period: 'day' | 'week' | 'month'
  ) {
    const startDate = this.getPeriodStart(period);
    
    const costs = await prisma.$queryRaw<{
      total: number;
      byService: Record<string, number>;
      byModel: Record<string, number>;
    }>`
      SELECT 
        SUM((event_data->>'totalCost')::numeric) as total,
        jsonb_object_agg(
          event_data->>'provider',
          SUM((event_data->>'totalCost')::numeric)
        ) as by_service,
        jsonb_object_agg(
          event_data->>'model',
          SUM((event_data->>'totalCost')::numeric)
        ) as by_model
      FROM analytics
      WHERE organization_id = ${organizationId}
        AND event_type IN ('ai_api_call', 'voice_api_call', 'image_generation')
        AND timestamp >= ${startDate}
    `;
    
    return costs;
  }
}
```

### Cost Dashboard

**Admin Console Cost View:**
- Total cost (current month)
- Cost by service (AI, Voice, Images)
- Cost by model
- Cost per learner
- Usage trends (daily/weekly/monthly)
- Projected monthly cost
- Alerts and warnings

---

This cost analysis provides comprehensive pricing information and optimization strategies. Regular monitoring and optimization can reduce costs by 20-40% while maintaining quality.

