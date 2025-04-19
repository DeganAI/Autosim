// Auto Shipping Coordinator
// This system integrates Sim Studio with Dialpad, BatsCRM, and Slack
// to automate shipping coordination processes

// Required dependencies
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Initialize environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(bodyParser.json());

// API Keys and Authentication
const BATSCRM_API_KEY = process.env.BATSCRM_API_KEY;
const DIALPAD_API_KEY = process.env.DIALPAD_API_KEY;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

// Base URLs
const BATSCRM_BASE_URL = process.env.BATSCRM_BASE_URL || 'https://api.batscrm.com/v1';
const DIALPAD_BASE_URL = process.env.DIALPAD_BASE_URL || 'https://api.dialpad.com/v2';
const SLACK_API_URL = 'https://slack.com/api';

// Sim Studio Flow ID
const SIM_WORKFLOW_ID = process.env.SIM_WORKFLOW_ID;

// ======= BatsCRM Integration =======
const batscrm = {
  // Get customer information
  getCustomer: async (customerId) => {
    try {
      const response = await axios.get(`${BATSCRM_BASE_URL}/customers/${customerId}`, {
        headers: { 'Authorization': `Bearer ${BATSCRM_API_KEY}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching customer from BatsCRM:', error.message);
      throw error;
    }
  },

  // Get order information
  getOrder: async (orderId) => {
    try {
      const response = await axios.get(`${BATSCRM_BASE_URL}/orders/${orderId}`, {
        headers: { 'Authorization': `Bearer ${BATSCRM_API_KEY}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching order from BatsCRM:', error.message);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status, notes = '') => {
    try {
      const response = await axios.patch(
        `${BATSCRM_BASE_URL}/orders/${orderId}`,
        { status, notes },
        { headers: { 'Authorization': `Bearer ${BATSCRM_API_KEY}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating order status in BatsCRM:', error.message);
      throw error;
    }
  },

  // Create a new shipping record
  createShippingRecord: async (orderId, shipmentData) => {
    try {
      const response = await axios.post(
        `${BATSCRM_BASE_URL}/orders/${orderId}/shipments`,
        shipmentData,
        { headers: { 'Authorization': `Bearer ${BATSCRM_API_KEY}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating shipping record in BatsCRM:', error.message);
      throw error;
    }
  }
};

// ======= Dialpad Integration =======
const dialpad = {
  // Send SMS to customer
  sendSMS: async (phoneNumber, message) => {
    try {
      const response = await axios.post(
        `${DIALPAD_BASE_URL}/messages`,
        { to: phoneNumber, message },
        { headers: { 'Authorization': `Bearer ${DIALPAD_API_KEY}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending SMS via Dialpad:', error.message);
      throw error;
    }
  },

  // Initialize a call to customer
  initiateCall: async (phoneNumber, callerId, notes = '') => {
    try {
      const response = await axios.post(
        `${DIALPAD_BASE_URL}/calls`,
        { to: phoneNumber, from: callerId, notes },
        { headers: { 'Authorization': `Bearer ${DIALPAD_API_KEY}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error initiating call via Dialpad:', error.message);
      throw error;
    }
  },

  // Handle incoming messages
  handleIncomingMessage: async (message) => {
    // Extract customer info from the message
    const { from, body } = message;
    
    // Process the message using Sim workflow
    return processWithSimWorkflow({
      type: 'incoming_message',
      from,
      body,
      timestamp: new Date().toISOString()
    });
  }
};

// ======= Slack Integration =======
const slack = {
  // Send notification to a Slack channel
  sendNotification: async (channel, message, blocks = []) => {
    try {
      const response = await axios.post(
        `${SLACK_API_URL}/chat.postMessage`,
        { channel, text: message, blocks },
        { headers: { 'Authorization': `Bearer ${SLACK_BOT_TOKEN}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending Slack notification:', error.message);
      throw error;
    }
  },

  // Create a shipping update notification
  createShippingUpdateNotification: (order, shipment, customer) => {
    return [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `Shipping Update: Order #${order.id}`,
          emoji: true
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Customer:*\n${customer.name}`
          },
          {
            type: "mrkdwn",
            text: `*Status:*\n${shipment.status}`
          }
        ]
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Tracking #:*\n${shipment.trackingNumber || 'N/A'}`
          },
          {
            type: "mrkdwn",
            text: `*Carrier:*\n${shipment.carrier || 'N/A'}`
          }
        ]
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "View in BatsCRM",
              emoji: true
            },
            url: `${process.env.BATSCRM_URL}/orders/${order.id}`
          }
        ]
      }
    ];
  }
};

// ======= Sim Studio Integration =======
// Process events through Sim Studio workflow
async function processWithSimWorkflow(eventData) {
  try {
    // Here we would call the Sim Studio API to process the event through a predefined workflow
    // This is a placeholder for the actual integration
    const response = await axios.post(
      `${process.env.SIM_STUDIO_API_URL}/workflows/${SIM_WORKFLOW_ID}/run`,
      { input: eventData },
      { headers: { 'Authorization': `Bearer ${process.env.SIM_STUDIO_API_KEY}` } }
    );
    
    // Handle the response from Sim Studio
    const actions = response.data.output.actions || [];
    await executeActions(actions);
    
    return response.data;
  } catch (error) {
    console.error('Error processing with Sim Studio workflow:', error.message);
    throw error;
  }
}

// Execute actions returned from Sim Studio
async function executeActions(actions) {
  for (const action of actions) {
    switch (action.type) {
      case 'send_sms':
        await dialpad.sendSMS(action.phoneNumber, action.message);
        break;
      case 'make_call':
        await dialpad.initiateCall(action.phoneNumber, action.callerId, action.notes);
        break;
      case 'update_order_status':
        await batscrm.updateOrderStatus(action.orderId, action.status, action.notes);
        break;
      case 'create_shipping_record':
        await batscrm.createShippingRecord(action.orderId, action.shipmentData);
        break;
      case 'send_slack_notification':
        await slack.sendNotification(action.channel, action.message, action.blocks);
        break;
      default:
        console.log(`Unknown action type: ${action.type}`);
    }
  }
}

// ======= Express Routes =======
// Webhook endpoint for Dialpad events
app.post('/webhooks/dialpad', async (req, res) => {
  try {
    const { event_type, data } = req.body;
    
    if (event_type === 'message.received') {
      await dialpad.handleIncomingMessage(data);
    }
    
    res.status(200).send({ status: 'success' });
  } catch (error) {
    console.error('Error handling Dialpad webhook:', error);
    res.status(500).send({ status: 'error', message: error.message });
  }
});

// Webhook endpoint for BatsCRM events
app.post('/webhooks/batscrm', async (req, res) => {
  try {
    const { event, data } = req.body;
    
    // Process different BatsCRM events
    if (event === 'order.created' || event === 'order.updated') {
      // Get additional data if needed
      const order = await batscrm.getOrder(data.id);
      const customer = await batscrm.getCustomer(order.customerId);
      
      // Process with Sim workflow
      await processWithSimWorkflow({
        type: 'order_update',
        event,
        order,
        customer,
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(200).send({ status: 'success' });
  } catch (error) {
    console.error('Error handling BatsCRM webhook:', error);
    res.status(500).send({ status: 'error', message: error.message });
  }
});

// Endpoint to manually trigger shipping notifications
app.post('/shipping/notify', async (req, res) => {
  try {
    const { orderId, status, notes, trackingNumber, carrier } = req.body;
    
    // Update order status in BatsCRM
    await batscrm.updateOrderStatus(orderId, status, notes);
    
    // Create shipment record if tracking information is provided
    if (trackingNumber && carrier) {
      await batscrm.createShippingRecord(orderId, {
        trackingNumber,
        carrier,
        status,
        shippedAt: new Date().toISOString()
      });
    }
    
    // Get order and customer information
    const order = await batscrm.getOrder(orderId);
    const customer = await batscrm.getCustomer(order.customerId);
    
    // Process with Sim workflow to determine next actions
    await processWithSimWorkflow({
      type: 'manual_shipping_update',
      order,
      customer,
      status,
      notes,
      trackingNumber,
      carrier,
      timestamp: new Date().toISOString()
    });
    
    res.status(200).send({ status: 'success' });
  } catch (error) {
    console.error('Error processing shipping notification:', error);
    res.status(500).send({ status: 'error', message: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Auto Shipping Coordinator running on port ${PORT}`);
});

module.exports = app;
