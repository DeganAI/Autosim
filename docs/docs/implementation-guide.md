# Sim Studio Implementation Guide for Auto Shipping Coordinator

This guide will walk you through creating the Sim Studio workflow for your Auto Shipping Coordinator system. By following these steps, you'll create a robust workflow that connects Dialpad, BatsCRM, and Slack to automate your shipping coordination processes.

## Getting Started with Sim Studio

### 1. Create a New Project

1. Log in to [Sim Studio](https://simstudio.ai)
2. Click "New Project"
3. Name it "Auto Shipping Coordinator"
4. Add a description: "Automated shipping coordination system using Dialpad, BatsCRM, and Slack"

### 2. Set Up the Basic Workflow Structure

The workflow will consist of:
- An event router to direct different types of events
- Processing nodes for each event type
- Action execution handlers

## Building the Workflow

### Step 1: Create the Event Router Node

The Event Router is responsible for directing different events to the appropriate processing nodes.

1. Add a new Router node
2. Name it "Event Router"
3. Configure the following routing conditions:
   - `input.type === 'order_update'` → "Process Order Update"
   - `input.type === 'incoming_message'` → "Process Customer Message"
   - `input.type === 'manual_shipping_update'` → "Process Shipping Update"
4. Set the default route to "Default Handler"

### Step 2: Create the Order Update Processor

This node will handle new orders and order status changes.

1. Add a new LLM node
2. Name it "Process Order Update"
3. Configure with the following:
   - Model: claude-3-sonnet-20240229
   - System prompt:
     ```
     You are a shipping coordinator assistant. Your job is to analyze order updates and determine what actions should be taken. You need to decide if the customer should be contacted and what messages should be sent based on the order status.
     ```
   - User prompt:
     ```
     An order has been {input.event === 'order.created' ? 'created' : 'updated'}. Please analyze the following order and customer information and determine what actions should be taken:

     Order: {JSON.stringify(input.order, null, 2)}
     Customer: {JSON.stringify(input.customer, null, 2)}

     Provide a JSON response with the following structure:
     {
       "actions": [
         // Actions to take (send_sms, make_call, update_order_status, send_slack_notification)
       ],
       "notes": "Reasoning behind these actions"
     }
     ```
4. Connect this node's output to "Execute Actions"

### Step 3: Create the Customer Message Processor

This node will handle incoming messages from customers.

1. Add a new LLM node
2. Name it "Process Customer Message"
3. Configure with the following:
   - Model: claude-3-sonnet-20240229
   - System prompt:
     ```
     You are a shipping coordinator assistant. Your job is to analyze incoming customer messages and determine how to respond. You need to understand customer inquiries related to shipping and provide appropriate responses.
     ```
   - User prompt:
     ```
     A customer has sent the following message:

     From: {input.from}
     Message: {input.body}

     Please analyze this message and determine appropriate actions to take. The message may be about order status, shipping inquiries, delivery issues, or other shipping-related questions.

     Provide a JSON response with the following structure:
     {
       "understood_intent": "Brief description of what the customer is asking",
       "actions": [
         // Actions to take (send_sms, make_call, update_order_status, send_slack_notification)
       ],
       "notes": "Reasoning behind these actions"
     }
     ```
4. Connect this node's output to "Execute Actions"

### Step 4: Create the Shipping Update Processor

This node will handle shipping updates and notifications.

1. Add a new LLM node
2. Name it "Process Shipping Update"
3. Configure with the following:
   - Model: claude-3-sonnet-20240229
   - System prompt:
     ```
     You are a shipping coordinator assistant. Your job is to analyze shipping updates and determine what notifications should be sent to customers and team members. You need to craft appropriate messages based on the shipping status.
     ```
   - User prompt:
     ```
     A shipping update has been made:

     Order: {JSON.stringify(input.order, null, 2)}
     Customer: {JSON.stringify(input.customer, null, 2)}
     Status: {input.status}
     Notes: {input.notes || 'N/A'}
     Tracking Number: {input.trackingNumber || 'N/A'}
     Carrier: {input.carrier || 'N/A'}

     Please determine what notifications should be sent to the customer and team members based on this update.

     Provide a JSON response with the following structure:
     {
       "customer_notification": {
         "send": true/false,
         "message": "Message to send to customer",
         "channel": "sms" or "call"
       },
       "team_notification": {
         "send": true/false,
         "channel": "shipping-updates",
         "message": "Brief notification message"
       },
       "actions": [
         // Additional actions to take
       ],
       "notes": "Reasoning behind these actions"
     }
     ```
4. Connect this node's output to "Process Notifications"

### Step 5: Create the Notifications Processor

This function node will transform notification requirements into concrete actions.

1. Add a new Function node
2. Name it "Process Notifications"
3. Add the following JavaScript function:
   ```javascript
   async (input, context) => {
     const result = context.prevResult;
     const actions = [];
     
     // Process customer notification
     if (result.customer_notification && result.customer_notification.send) {
       if (result.customer_notification.channel === 'sms') {
         actions.push({
           type: 'send_sms',
           phoneNumber: input.customer.phone,
           message: result.customer_notification.message
         });
       } else if (result.customer_notification.channel === 'call') {
         actions.push({
           type: 'make_call',
           phoneNumber: input.customer.phone,
           callerId: process.env.DIALPAD_CALLER_ID,
           notes: result.customer_notification.message
         });
       }
     }
     
     // Process team notification
     if (result.team_notification && result.team_notification.send) {
       // Create rich Slack notification
       const blocks = [
         {
           type: "header",
           text: {
             type: "plain_text",
             text: `Shipping Update: Order #${input.order.id}`,
             emoji: true
           }
         },
         {
           type: "section",
           fields: [
             {
               type: "mrkdwn",
               text: `*Customer:*\n${input.customer.name}`
             },
             {
               type: "mrkdwn",
               text: `*Status:*\n${input.status}`
             }
           ]
         },
         {
           type: "section",
           fields: [
             {
               type: "mrkdwn",
               text: `*Tracking #:*\n${input.trackingNumber || 'N/A'}`
             },
             {
               type: "mrkdwn",
               text: `*Carrier:*\n${input.carrier || 'N/A'}`
             }
           ]
         },
         {
           type: "section",
           text: {
             type: "mrkdwn",
             text: `*Notes:*\n${input.notes || 'N/A'}`
           }
         }
       ];
       
       actions.push({
         type: 'send_slack_notification',
         channel: result.team_notification.channel,
         message: result.team_notification.message,
         blocks: blocks
       });
     }
     
     // Add any additional actions
     if (Array.isArray(result.actions)) {
       actions.push(...result.actions);
     }
     
     return { actions, notes: result.notes };
   }
   ```
4. Connect this node's output to "Execute Actions"

### Step 6: Create the Actions Output Node

This node will format the final output of the workflow.

1. Add a new Output node
2. Name it "Return Actions"
3. Configure the output mapping:
   ```json
   {
     "actions": "context.prevResult.actions || []",
     "notes": "context.prevResult.notes || ''"
   }
   ```

### Step 7: Create the Default Handler

This node will handle any unrecognized event types.

1. Add a new Output node
2. Name it "Default Handler"
3. Configure the output mapping:
   ```json
   {
     "actions": "[]",
     "notes": "'Unrecognized event type'"
   }
   ```

### Step 8: Set the Starting Node

Configure the workflow to start with the Event Router node.

## Testing the Workflow

### 1. Create Test Inputs

Create sample inputs for each event type:

#### Order Update Event
```json
{
  "type": "order_update",
  "event": "order.created",
  "order": {
    "id": "ORD12345",
    "customerId": "CUST789",
    "status": "processing",
    "items": [
      {
        "id": "ITEM001",
        "name": "Product A",
        "quantity": 2
      }
    ],
    "shippingAddress": {
      "street": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zip": "12345"
    },
    "createdAt": "2025-04-17T10:00:00Z"
  },
  "customer": {
    "id": "CUST789",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+15551234567"
  },
  "timestamp": "2025-04-17T10:00:00Z"
}
```

#### Customer Message Event
```json
{
  "type": "incoming_message",
  "from": "+15551234567",
  "body": "What's the status of my order #ORD12345?",
  "timestamp": "2025-04-17T14:30:00Z"
}
```

#### Shipping Update Event
```json
{
  "type": "manual_shipping_update",
  "order": {
    "id": "ORD12345",
    "customerId": "CUST789",
    "status": "shipped",
    "items": [
      {
        "id": "ITEM001",
        "name": "Product A",
        "quantity": 2
      }
    ],
    "shippingAddress": {
      "street": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zip": "12345"
    },
    "createdAt": "2025-04-17T10:00:00Z"
  },
  "customer": {
    "id": "CUST789",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+15551234567"
  },
  "status": "shipped",
  "notes": "Package shipped ahead of schedule",
  "trackingNumber": "1Z999AA10123456784",
  "carrier": "UPS",
  "timestamp": "2025-04-17T15:45:00Z"
}
```

### 2. Run Tests

1. In Sim Studio, use the Testing tab to test your workflow
2. Paste each test input and run the workflow
3. Verify that the correct actions are generated for each event type

## Integrating with Your Backend

To integrate this workflow with your backend:

1. Get your workflow ID from Sim Studio
2. Add it to your `.env` file as `SIM_WORKFLOW_ID`
3. Ensure your backend is properly configured to call the workflow API

## Advanced Customization

### Customizing LLM Prompts

You can customize the LLM prompts to better fit your business rules and communication style:

1. Update the system prompts with specific instructions about your brand voice
2. Add example messages and responses to guide the LLM
3. Include specific business rules or shipping policies

### Adding Custom Actions

To add new action types:

1. Modify the LLM prompts to include the new action types
2. Update the "Process Notifications" function to handle these new action types
3. Add support for the new actions in your backend code

### Adding Memory and Context

To improve response quality over time:

1. Add a Context Store to your workflow
2. Modify the Processing nodes to read from and write to this context
3. Implement conversation history tracking

## Optimization

For optimal performance:

1. Use a fine-tuned version of Claude for faster and more consistent responses
2. Implement caching for frequently accessed data (customer profiles, order templates)
3. Set up monitoring to track workflow performance

## Security Considerations

Ensure your implementation adheres to security best practices:

1. Implement proper authentication for all API endpoints
2. Encrypt sensitive customer information
3. Implement rate limiting to prevent abuse
4. Store API keys securely
5. Log all actions for audit purposes

---

By following this guide, you'll have a functional Sim Studio workflow that powers your Auto Shipping Coordinator system, enabling seamless communication across Dialpad, BatsCRM, and Slack.
