# Auto Shipping Coordinator Setup Guide

This guide will walk you through setting up the Auto Shipping Coordinator system that integrates Sim Studio with Dialpad, BatsCRM, and Slack to automate your shipping coordination workflows.

## Prerequisites

Before you begin, make sure you have:

1. **Sim Studio Account**: Set up at [simstudio.ai](https://simstudio.ai)
2. **Dialpad API Access**: Business or Enterprise account with API access
3. **BatsCRM API Access**: API key with appropriate permissions
4. **Slack Workspace**: With permission to create a Slack app

## Step 1: Set Up API Credentials

Gather all required API credentials:

### BatsCRM
1. Log in to your BatsCRM admin account
2. Navigate to Settings > API Integration
3. Create a new API key with permissions for:
   - View customers
   - View orders
   - Update orders
   - Create shipments

### Dialpad
1. Log in to your Dialpad admin account
2. Go to Settings > Developer Resources
3. Create a new API application
4. Request the following permissions:
   - Send SMS
   - Make calls
   - Receive webhooks for incoming messages

### Slack
1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Create a new app for your workspace
3. Under "OAuth & Permissions," add the following scopes:
   - `chat:write`
   - `chat:write.public`
4. Install the app to your workspace

## Step 2: Deploy the Auto Shipping Coordinator

### Option 1: Deploy to Existing Server

1. Clone the repository and navigate to the project directory
2. Create a `.env` file with your API credentials:

```
# API Keys
BATSCRM_API_KEY=your_batscrm_api_key
DIALPAD_API_KEY=your_dialpad_api_key
SLACK_BOT_TOKEN=your_slack_bot_token

# Base URLs
BATSCRM_BASE_URL=https://api.batscrm.com/v1
BATSCRM_URL=https://app.batscrm.com
DIALPAD_BASE_URL=https://api.dialpad.com/v2
DIALPAD_CALLER_ID=your_company_phone_number

# Sim Studio
SIM_STUDIO_API_URL=https://api.simstudio.ai/v1
SIM_STUDIO_API_KEY=your_sim_studio_api_key
SIM_WORKFLOW_ID=your_workflow_id

# Server
PORT=3000
```

3. Install dependencies: `npm install`
4. Start the server: `npm start`

### Option 2: Deploy with Docker

1. Create a `.env` file as described above
2. Build and run the Docker container:

```bash
docker build -t auto-shipping-coordinator .
docker run -p 3000:3000 --env-file .env auto-shipping-coordinator
```

## Step 3: Set Up Sim Studio Workflow

1. Log in to [simstudio.ai](https://simstudio.ai)
2. Create a new project called "Auto Shipping Coordinator"
3. Create a new workflow using the configuration from the "Sim Studio Workflow Configuration" artifact
4. Update the SIM_WORKFLOW_ID in your `.env` file with the ID of the newly created workflow

## Step 4: Configure Webhooks

### Dialpad Webhook
1. In your Dialpad admin settings, go to Developer Resources > Your API Application
2. Add a webhook for SMS events with the URL:
   - `https://your-server.com/webhooks/dialpad`

### BatsCRM Webhook
1. In your BatsCRM admin settings, go to Settings > Webhooks
2. Add a new webhook with the URL:
   - `https://your-server.com/webhooks/batscrm`
3. Subscribe to the following events:
   - order.created
   - order.updated

## Step 5: Create a Slack Channel

1. Create a new Slack channel called `#shipping-updates`
2. Add your Slack app to this channel

## Step 6: Test the Integration

1. Create a test order in BatsCRM
2. Update the order status to "Shipped"
3. Check for:
   - SMS notification sent to the customer
   - Notification posted to the `#shipping-updates` Slack channel

## Customizing the System

### Customizing Notifications

To customize the messages sent to customers or team members, modify the LLM prompts in the Sim Studio workflow:

1. Open your workflow in Sim Studio
2. Navigate to the "Process Shipping Update" node
3. Edit the system prompt to change the tone and style of notifications

### Setting Up Automated Schedules

To set up automated follow-ups or scheduled notifications:

1. Create a new node in your Sim workflow for scheduled tasks
2. Use cron jobs or a scheduling service to trigger API calls to your endpoint:
   - `POST /shipping/notify`

### Adding Additional Integrations

The system can be extended to support other tools by:

1. Creating new API client modules in the main server code
2. Adding new processing nodes in the Sim Studio workflow
3. Updating the action executor to handle new action types

## Troubleshooting

### Common Issues

1. **Webhook Not Receiving Events**
   - Check webhook URL configuration
   - Verify server is publicly accessible
   - Check firewall settings

2. **API Authorization Errors**
   - Verify API keys are correctly set in .env file
   - Check API key permissions

3. **Notification Not Sending**
   - Check API rate limits
   - Verify phone number formats

For additional help, refer to the documentation for each service:

- [Sim Studio Documentation](https://simstudio.ai/docs)
- [Dialpad API Documentation](https://developers.dialpad.com)
- [BatsCRM API Documentation](https://docs.batscrm.com)
- [Slack API Documentation](https://api.slack.com/docs)

## Support

If you encounter any issues or need assistance, please contact support at support@your-company.com or open an issue on the GitHub repository.

---

Happy shipping!
