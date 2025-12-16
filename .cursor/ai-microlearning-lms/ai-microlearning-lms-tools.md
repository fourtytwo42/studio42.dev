# AI Microlearning LMS - AI Tools Specification

**Complete specification of all AI tutor tools, parameters, permissions, and execution flow.**

## Table of Contents

1. [Tools Overview](#tools-overview)
2. [Tool Definitions](#tool-definitions)
3. [Tool Execution Flow](#tool-execution-flow)
4. [Tool Implementation](#tool-implementation)
5. [Error Handling](#error-handling)
6. [Tool Result Formatting](#tool-result-formatting)

## Tools Overview

The AI tutor has access to a set of tools that allow it to interact with the learning system, deliver content, assess understanding, and adapt the learning experience. All tools:

- Check permissions before execution
- Log actions to analytics
- Return structured JSON responses
- Can be called sequentially or in parallel by the AI
- Support async execution for long-running operations

### Tool Definition Format (OpenAI JSON Schema)

All tools must be defined in OpenAI's tool format using JSON Schema:

```typescript
{
  type: "function",
  function: {
    name: "tool_name", // Must match function name exactly
    description: "Clear description of what the tool does. The model uses this to decide when to call the tool.",
    parameters: {
      type: "object",
      properties: {
        paramName: {
          type: "string" | "number" | "boolean" | "object" | "array",
          description: "Parameter description - be specific, model uses this",
          // Optional constraints
          enum: [...], // For specific values
          default: value, // Default value
          // For nested objects
          properties: { ... },
          required: ["nestedParam"]
        }
      },
      required: ["paramName"] // Array of required parameter names
    }
  }
}
```

**Best Practices:**
- **Clear Descriptions:** Tool and parameter descriptions are critical - the model uses these to decide when and how to call tools
- **Specific Parameter Types:** Use appropriate types (string, number, boolean, object, array)
- **Required Fields:** Mark required parameters in the `required` array
- **Default Values:** Provide defaults for optional parameters when possible
- **Nested Objects:** Use nested `properties` for complex parameter structures

## Tool Definitions

### deliver_nugget

**Description:** Deliver a learning nugget to the learner. Use this when you want to present new content, explain a concept, or show educational material. The nugget can be delivered as text, audio, or multimedia (text + image + audio).

**Parameters:**
```json
{
  "type": "object",
  "properties": {
    "nuggetId": {
      "type": "string",
      "description": "ID of the nugget to deliver. Use semantic search to find relevant nuggets if you don't have a specific ID."
    },
    "format": {
      "type": "string",
      "enum": ["text", "audio", "multimedia"],
      "description": "How to deliver the nugget. 'text' = text only, 'audio' = audio narration, 'multimedia' = text + image + audio",
      "default": "multimedia"
    }
  },
  "required": ["nuggetId"]
}
```

**Permissions:**
- Available to all learners in their own sessions
- Can only access nuggets from learner's organization

**Returns:**
```json
{
  "success": true,
  "nugget": {
    "id": "uuid",
    "content": "Full nugget content...",
    "imageUrl": "/api/files/nugget-123/image.png",
    "audioUrl": "/api/files/nugget-123/audio.mp3",
    "metadata": {
      "topics": ["machine-learning"],
      "difficulty": 5,
      "estimatedTime": 10
    },
    "format": "multimedia"
  }
}
```

**Special Behavior:**
- If nugget not found, returns error (don't retry)
- If image/audio missing and format requires it, falls back to available format
- Tracks nugget delivery in analytics

### ask_question

**Description:** Ask learner an organic question to assess understanding. Use this naturally in conversation, not as a formal quiz. Questions should feel like part of the learning dialogue, not a test. The AI will evaluate the learner's response and update mastery accordingly.

**Parameters:**
```json
{
  "type": "object",
  "properties": {
    "question": {
      "type": "string",
      "description": "The question to ask the learner. Should be natural and conversational, not formal or test-like."
    },
    "context": {
      "type": "string",
      "description": "What concept or topic this question tests. Used for tracking and mastery updates."
    },
    "expectedAnswer": {
      "type": "string",
      "description": "Expected answer or key points for evaluation. Optional, but helps with assessment accuracy."
    }
  },
  "required": ["question", "context"]
}
```

**Permissions:**
- Available to all learners in their own sessions

**Returns:**
```json
{
  "success": true,
  "question": "What is the main difference between supervised and unsupervised learning?",
  "context": "machine-learning-types",
  "expectedAnswer": "Supervised learning uses labeled data, unsupervised uses unlabeled data"
}
```

**Special Behavior:**
- Question is displayed to learner in conversation
- AI evaluates response in next message (not automatic)
- Tracks question asked in analytics
- Used for organic assessment, not formal testing

### update_mastery

**Description:** Update learner mastery level for a concept based on their responses, demonstrated understanding, or performance. Use this when the learner shows understanding (increase mastery) or struggles (decrease or identify gaps). Mastery levels range from 0-100.

**Parameters:**
```json
{
  "type": "object",
  "properties": {
    "conceptId": {
      "type": "string",
      "description": "Concept identifier (e.g., 'machine-learning-basics', 'neural-networks'). Use consistent identifiers."
    },
    "masteryLevel": {
      "type": "number",
      "minimum": 0,
      "maximum": 100,
      "description": "New mastery level (0-100). 0 = no knowledge, 50 = partial understanding, 100 = complete mastery."
    },
    "evidence": {
      "type": "string",
      "description": "Why this assessment (e.g., 'Correctly explained supervised learning', 'Struggled with neural network concepts'). Required for audit trail."
    }
  },
  "required": ["conceptId", "masteryLevel", "evidence"]
}
```

**Permissions:**
- Available to AI tutor in learner sessions
- Can only update mastery for the current learner

**Returns:**
```json
{
  "success": true,
  "concept": "machine-learning-basics",
  "masteryLevel": 65,
  "previousLevel": 50,
  "change": 15
}
```

**Special Behavior:**
- Creates progress record if concept doesn't exist
- Updates existing progress record
- Updates learner's masteryMap
- Tracks mastery update in analytics
- Can trigger knowledge gap updates if mastery decreases significantly

### adapt_narrative

**Description:** Change narrative path based on learner needs. Use this when the learner needs different content, difficulty level, or learning approach. The system will find relevant nuggets and create a new narrative path.

**Parameters:**
```json
{
  "type": "object",
  "properties": {
    "reason": {
      "type": "string",
      "description": "Why the path needs to change (e.g., 'Learner struggling with current difficulty', 'Learner wants to explore different topic', 'Knowledge gap identified')."
    },
    "newPath": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Array of nugget IDs for new path. Can be empty array to let system auto-generate path based on reason."
    }
  },
  "required": ["reason"]
}
```

**Permissions:**
- Available to AI tutor in learner sessions
- Can only adapt narrative for current session

**Returns:**
```json
{
  "success": true,
  "reason": "Learner struggling with current difficulty",
  "newPath": ["nugget-1", "nugget-2", "nugget-3"],
  "nextNode": {
    "id": "uuid",
    "nugget": {...},
    "choices": [...]
  }
}
```

**Special Behavior:**
- If newPath is empty, system generates path based on reason and learner state
- Updates session pathHistory
- Creates new narrative nodes if needed
- Tracks narrative adaptation in analytics

### show_media

**Description:** Display image or video widget in the learner interface. Use this to show illustrations, diagrams, or video content that enhances learning. Media is displayed inline in the conversation.

**Parameters:**
```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": ["image", "video"],
      "description": "Type of media to display"
    },
    "url": {
      "type": "string",
      "description": "URL or path to media file. Can be nugget image/audio URL or external URL."
    },
    "caption": {
      "type": "string",
      "description": "Caption or description for the media. Helps with accessibility and context."
    }
  },
  "required": ["type", "url"]
}
```

**Permissions:**
- Available to all learners in their own sessions
- Can only access media from learner's organization

**Returns:**
```json
{
  "success": true,
  "type": "image",
  "url": "/api/files/nugget-123/image.png",
  "caption": "Machine learning illustration"
}
```

**Special Behavior:**
- Media widget displayed inline in conversation
- Tracks media display in analytics
- Validates URL accessibility before returning
- Supports both internal and external URLs

## Tool Execution Flow

### OpenAI Tool Calling Flow

**How OpenAI Tool Calling Works:**

1. **Define Tools:** Tools are defined as JSON Schema objects with name, description, and parameters
2. **Model Decision:** OpenAI model decides when to call tools based on user input and tool descriptions
3. **Tool Call Response:** Model returns `tool_calls` array with function name and arguments (JSON string)
4. **Execute Tools:** Application executes tools (in parallel if multiple calls)
5. **Return Results:** Tool results returned as messages with `role: "tool"` (content must be JSON string)
6. **Model Processing:** Model processes tool results and generates final text response
7. **Repeat if Needed:** Model may make additional tool calls until final answer is ready

### Flow Diagram

```
User Message → AI Processes → Tool Call Decision
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
            Text Response              Tool Call(s) in tool_calls[]
                    │                               │
                    │                       ┌───────┴───────┐
                    │                       │               │
                    │              Parallel Execution       │
                    │                       │               │
                    │              Check Permissions        │
                    │                       │               │
                    │              Execute Tools            │
                    │                       │               │
                    │              Log to Analytics         │
                    │                       │               │
                    │              Return Results (JSON)    │
                    │                       │               │
                    │              Add to Messages          │
                    │                       │               │
                    └───────────────────────┼───────────────┘
                                            │
                                    Continue Conversation
                                            │
                                    Final Text Response
```

### Message Format in Conversation

**Conversation Flow Example:**

```typescript
// Initial request
messages = [
  { role: "system", content: "You are an AI tutor..." },
  { role: "user", content: "I want to learn about machine learning" }
]

// Model responds with tool calls
messages.push({
  role: "assistant",
  content: null, // No text response yet
  tool_calls: [
    {
      id: "call_abc123",
      type: "function",
      function: {
        name: "deliver_nugget",
        arguments: "{\"nuggetId\": \"uuid\", \"format\": \"multimedia\"}"
      }
    }
  ]
})

// Tool execution results
messages.push({
  role: "tool",
  tool_call_id: "call_abc123",
  content: "{\"success\": true, \"nugget\": {...}}"
})

// Final response from model
messages.push({
  role: "assistant",
  content: "Great! Let's start with machine learning basics...",
  tool_calls: null // No more tool calls
})
```

## Tool Implementation

### Tool Executor

```typescript
// src/services/learning-delivery/tool-executor.ts
import { OpenAI } from 'openai';

export class ToolExecutor {
  async executeTool(
    toolName: string,
    arguments: any,
    context: {
      sessionId: string;
      learnerId: string;
      organizationId: string;
    }
  ): Promise<ToolResult> {
    // 1. Validate tool exists
    const tool = TOOLS[toolName];
    if (!tool) {
      throw new Error(`Unknown tool: ${toolName}`);
    }

    // 2. Check permissions
    const hasPermission = await this.checkToolPermission(
      toolName,
      context
    );
    if (!hasPermission) {
      throw new Error(`Permission denied for tool: ${toolName}`);
    }

    // 3. Execute tool
    try {
      const result = await tool.execute(arguments, context);
      
      // 4. Log to analytics
      await this.logToolExecution(toolName, arguments, result, context);
      
      // 5. Return result (will be serialized to JSON string for OpenAI)
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      // Log error
      await this.logToolError(toolName, arguments, error, context);
      
      // Return error result (not throw - OpenAI expects JSON response)
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }
  
  private async checkToolPermission(
    toolName: string,
    context: ToolContext
  ): Promise<boolean> {
    // All tools available to learners in their own sessions
    // Additional checks for specific tools if needed
    return true;
  }
  
  private async logToolExecution(
    toolName: string,
    arguments: any,
    result: any,
    context: ToolContext
  ) {
    await prisma.analytics.create({
      data: {
        learnerId: context.learnerId,
        organizationId: context.organizationId,
        eventType: 'tool_execution',
        eventData: {
          tool: toolName,
          arguments,
          result: this.sanitizeResult(result),
          sessionId: context.sessionId
        }
      }
    });
  }
}
```

### Individual Tool Implementations

#### deliver_nugget Implementation

```typescript
// src/services/learning-delivery/tools/deliver-nugget.ts
export async function deliverNugget(
  args: { nuggetId: string; format?: string },
  context: ToolContext
): Promise<any> {
  // Get nugget
  const nugget = await prisma.nugget.findUnique({
    where: { id: args.nuggetId },
    include: { organization: true }
  });
  
  if (!nugget) {
    throw new Error(`Nugget not found: ${args.nuggetId}`);
  }
  
  // Check organization access
  if (nugget.organizationId !== context.organizationId) {
    throw new Error('Nugget not accessible');
  }
  
  // Check nugget status
  if (nugget.status !== 'ready') {
    throw new Error(`Nugget not ready: ${nugget.status}`);
  }
  
  // Determine format
  const format = args.format || 'multimedia';
  
  // Build response based on format
  const response: any = {
    id: nugget.id,
    content: nugget.content,
    metadata: nugget.metadata
  };
  
  if (format === 'multimedia' || format === 'audio') {
    if (nugget.audioUrl) {
      response.audioUrl = nugget.audioUrl;
    }
  }
  
  if (format === 'multimedia' || format === 'image') {
    if (nugget.imageUrl) {
      response.imageUrl = nugget.imageUrl;
    }
  }
  
  // Track delivery
  await prisma.analytics.create({
    data: {
      learnerId: context.learnerId,
      organizationId: context.organizationId,
      eventType: 'nugget_delivered',
      eventData: {
        nuggetId: nugget.id,
        format,
        sessionId: context.sessionId
      }
    }
  });
  
  return response;
}
```

#### ask_question Implementation

```typescript
// src/services/learning-delivery/tools/ask-question.ts
export async function askQuestion(
  args: { question: string; context: string; expectedAnswer?: string },
  context: ToolContext
): Promise<any> {
  // Track question asked
  await prisma.analytics.create({
    data: {
      learnerId: context.learnerId,
      organizationId: context.organizationId,
      eventType: 'question_asked',
      eventData: {
        question: args.question,
        context: args.context,
        expectedAnswer: args.expectedAnswer,
        sessionId: context.sessionId
      }
    }
  });
  
  return {
    question: args.question,
    context: args.context,
    expectedAnswer: args.expectedAnswer
  };
}
```

#### update_mastery Implementation

```typescript
// src/services/learning-delivery/tools/update-mastery.ts
export async function updateMastery(
  args: { conceptId: string; masteryLevel: number; evidence: string },
  context: ToolContext
): Promise<any> {
  // Get learner
  const learner = await prisma.learner.findUnique({
    where: { id: context.learnerId }
  });
  
  if (!learner) {
    throw new Error('Learner not found');
  }
  
  // Get current mastery
  const currentProgress = await prisma.progress.findUnique({
    where: {
      learnerId_concept: {
        learnerId: context.learnerId,
        concept: args.conceptId
      }
    }
  });
  
  const previousLevel = currentProgress?.masteryLevel || 0;
  
  // Update or create progress record
  await prisma.progress.upsert({
    where: {
      learnerId_concept: {
        learnerId: context.learnerId,
        concept: args.conceptId
      }
    },
    create: {
      learnerId: context.learnerId,
      concept: args.conceptId,
      masteryLevel: args.masteryLevel,
      evidence: args.evidence
    },
    update: {
      masteryLevel: args.masteryLevel,
      evidence: args.evidence
    }
  });
  
  // Update learner mastery map
  const masteryMap = learner.masteryMap as Record<string, number>;
  masteryMap[args.conceptId] = args.masteryLevel;
  
  await prisma.learner.update({
    where: { id: context.learnerId },
    data: { masteryMap }
  });
  
  // Check for knowledge gap updates
  if (args.masteryLevel < 30 && previousLevel >= 30) {
    // Mastery dropped significantly, add to knowledge gaps
    const gaps = learner.knowledgeGaps || [];
    if (!gaps.includes(args.conceptId)) {
      await prisma.learner.update({
        where: { id: context.learnerId },
        data: {
          knowledgeGaps: [...gaps, args.conceptId]
        }
      });
    }
  } else if (args.masteryLevel >= 70 && previousLevel < 70) {
    // Mastery improved significantly, remove from knowledge gaps
    const gaps = learner.knowledgeGaps || [];
    const updatedGaps = gaps.filter(g => g !== args.conceptId);
    if (updatedGaps.length !== gaps.length) {
      await prisma.learner.update({
        where: { id: context.learnerId },
        data: {
          knowledgeGaps: updatedGaps
        }
      });
    }
  }
  
  // Track mastery update
  await prisma.analytics.create({
    data: {
      learnerId: context.learnerId,
      organizationId: context.organizationId,
      eventType: 'mastery_updated',
      eventData: {
        concept: args.conceptId,
        masteryLevel: args.masteryLevel,
        previousLevel,
        change: args.masteryLevel - previousLevel,
        evidence: args.evidence,
        sessionId: context.sessionId
      }
    }
  });
  
  return {
    concept: args.conceptId,
    masteryLevel: args.masteryLevel,
    previousLevel,
    change: args.masteryLevel - previousLevel
  };
}
```

#### adapt_narrative Implementation

```typescript
// src/services/learning-delivery/tools/adapt-narrative.ts
export async function adaptNarrative(
  args: { reason: string; newPath?: string[] },
  context: ToolContext
): Promise<any> {
  const session = await prisma.session.findUnique({
    where: { id: context.sessionId },
    include: { learner: true }
  });
  
  if (!session) {
    throw new Error('Session not found');
  }
  
  // Generate new path if not provided
  let newPath = args.newPath || [];
  
  if (newPath.length === 0) {
    // Auto-generate path based on reason and learner state
    const planner = new NarrativePlanner();
    const learner = session.learner;
    
    // Find relevant nuggets
    const relevantNuggets = await planner.findRelevantNuggets(
      learner.knowledgeGaps || [],
      learner.masteryMap as Record<string, number> || {},
      context.organizationId
    );
    
    newPath = relevantNuggets.slice(0, 5).map(n => n.id);
  }
  
  // Update session path history
  const pathHistory = session.pathHistory as string[];
  pathHistory.push(...newPath);
  
  await prisma.session.update({
    where: { id: context.sessionId },
    data: { pathHistory }
  });
  
  // Get first node in new path
  let nextNode = null;
  if (newPath.length > 0) {
    // Find or create narrative node for first nugget
    const firstNugget = await prisma.nugget.findUnique({
      where: { id: newPath[0] }
    });
    
    if (firstNugget) {
      nextNode = await planner.planNextNode(
        context.learnerId,
        null,
        null
      );
      
      // Update session current node
      await prisma.session.update({
        where: { id: context.sessionId },
        data: { currentNodeId: nextNode.id }
      });
    }
  }
  
  // Track narrative adaptation
  await prisma.analytics.create({
    data: {
      learnerId: context.learnerId,
      organizationId: context.organizationId,
      eventType: 'narrative_adapted',
      eventData: {
        reason: args.reason,
        newPath,
        sessionId: context.sessionId
      }
    }
  });
  
  return {
    reason: args.reason,
    newPath,
    nextNode: nextNode ? {
      id: nextNode.id,
      nugget: await prisma.nugget.findUnique({ where: { id: nextNode.nuggetId } }),
      choices: nextNode.choices
    } : null
  };
}
```

#### show_media Implementation

```typescript
// src/services/learning-delivery/tools/show-media.ts
export async function showMedia(
  args: { type: string; url: string; caption?: string },
  context: ToolContext
): Promise<any> {
  // Validate URL accessibility (if internal)
  if (args.url.startsWith('/api/files/')) {
    // Check if file exists and is accessible
    const filePath = args.url.replace('/api/files/', '');
    // Validation logic here
  }
  
  // Track media display
  await prisma.analytics.create({
    data: {
      learnerId: context.learnerId,
      organizationId: context.organizationId,
      eventType: 'media_shown',
      eventData: {
        type: args.type,
        url: args.url,
        caption: args.caption,
        sessionId: context.sessionId
      }
    }
  });
  
  return {
    type: args.type,
    url: args.url,
    caption: args.caption
  };
}
```

## Error Handling

### Error Types

1. **Permission Errors:** User doesn't have permission
2. **Validation Errors:** Invalid parameters
3. **Resource Errors:** Resource not found or inaccessible
4. **External API Errors:** Third-party service failures
5. **System Errors:** Internal system failures

### Error Response Format

```json
{
  "success": false,
  "error": {
    "errorType": "permission_denied" | "validation_error" | "resource_not_found" | "external_api_error" | "system_error",
    "message": "Human-readable error message",
    "code": "ERROR_CODE"
  }
}
```

### Error Handling in Tools

```typescript
export async function toolExecute(
  toolName: string,
  arguments: any,
  context: ToolContext
) {
  try {
    // Validate arguments
    const validatedArgs = validateToolArguments(toolName, arguments);
    
    // Execute tool
    const result = await executeToolLogic(toolName, validatedArgs, context);
    
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof PermissionError) {
      return {
        success: false,
        error: {
          errorType: 'permission_denied',
          message: 'You do not have permission to perform this action',
        },
      };
    }
    
    if (error instanceof ValidationError) {
      return {
        success: false,
        error: {
          errorType: 'validation_error',
          message: error.message,
        },
      };
    }
    
    // Log unexpected errors
    logger.error('Tool execution error', {
      toolName,
      arguments,
      error: error.message,
      stack: error.stack,
      context
    });
    
    return {
      success: false,
      error: {
        errorType: 'system_error',
        message: 'An error occurred while executing the tool',
        code: 'TOOL_EXECUTION_ERROR',
        retryable: this.isRetryableError(error)
      },
    };
  }
  
  private isRetryableError(error: Error): boolean {
    // Network errors, timeouts, and 5xx errors are retryable
    const retryablePatterns = [
      /timeout/i,
      /network/i,
      /connection/i,
      /ECONNREFUSED/i,
      /ETIMEDOUT/i,
      /503/i,
      /504/i
    ];
    
    return retryablePatterns.some(pattern => 
      pattern.test(error.message) || pattern.test(error.stack || '')
    );
  }
}
```

### Retry Logic for Tools

**Automatic Retry for Retryable Errors:**
```typescript
export async function executeToolWithRetry(
  toolName: string,
  arguments: any,
  context: ToolContext,
  maxRetries: number = 3
): Promise<ToolResult> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await toolExecute(toolName, arguments, context);
      
      if (result.success) {
        return result;
      }
      
      // Check if error is retryable
      if (result.error?.retryable && attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      return result;
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries && this.isRetryableError(error as Error)) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError || new Error('Tool execution failed after retries');
}
```

### Error Recovery Strategies

**Tool-Specific Error Handling:**

1. **deliver_nugget:**
   - Nugget not found → Return error, don't retry
   - Nugget not ready → Return error with status
   - Access denied → Return permission error
   - Network error → Retry up to 3 times

2. **update_mastery:**
   - Database error → Retry with exponential backoff
   - Validation error → Return error, don't retry
   - Concurrent update → Retry with conflict resolution

3. **adapt_narrative:**
   - No relevant nuggets → Return empty path, let system generate
   - Planning error → Retry once, then return error
   - Network error → Retry up to 3 times

4. **show_media:**
   - File not found → Return error, don't retry
   - Access denied → Return permission error
   - Network error → Retry up to 2 times
```

## Tool Result Formatting

### Format Tool Response for OpenAI

```typescript
/**
 * Convert tool result to OpenAI message format
 * Result must be JSON string, not object
 */
export function formatToolResponse(
  toolCallId: string,
  toolName: string,
  result: any
): OpenAI.Chat.Completions.ChatCompletionToolMessageParam {
  return {
    role: 'tool',
    tool_call_id: toolCallId,
    content: JSON.stringify(result), // Must be JSON string!
  };
}
```

**Key Points:**
- Tool results **must** be JSON strings (use `JSON.stringify()`)
- Use `role: "tool"` for tool response messages
- Include `tool_call_id` matching the original tool call ID
- Handle errors gracefully - return error in result, don't throw
- Execute multiple tools in parallel when model calls them simultaneously

---

This tools specification provides complete details for all AI tutor tools, their implementation, and execution flow. All tools are designed to work seamlessly with OpenAI's function calling API.

