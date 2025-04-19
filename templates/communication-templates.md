# Customer Communication Templates

These templates are used by the Auto Shipping Coordinator to communicate with customers via Dialpad (SMS and calls). They can be customized in the Sim Studio workflow to match your brand voice.

## SMS Templates

### Order Confirmation

```
Hello {customer_name}, thank you for your order #{order_number}! We've received it and are preparing it for shipment. We'll notify you when it ships. For questions, reply to this message or call {company_phone}.
```

### Shipping Notification

```
Good news, {customer_name}! Your order #{order_number} has shipped via {carrier}. Track it with number: {tracking_number}. Expected delivery: {estimated_delivery}. Questions? Reply to this message.
```

### Delivery Confirmation

```
Hello {customer_name}, we see your order #{order_number} has been delivered! We hope you're happy with your purchase. If you have any questions or concerns, please let us know by replying to this message.
```

### Shipping Delay

```
Hi {customer_name}, we wanted to let you know that your order #{order_number} is experiencing a slight delay. New estimated ship date: {new_ship_date}. We apologize for any inconvenience and will update you when it ships.
```

### Order Status Update Request

```
Hello {customer_name}, we've received your inquiry about order #{order_number}. Current status: {order_status}. {additional_details}. Please reply if you need any other information.
```

## Call Scripts

### Shipping Issue Resolution

**Introduction:**
"Hello, this is {agent_name} from {company_name}. I'm calling about your recent order #{order_number}. Is now a good time to talk?"

**Issue Description:**
"I'm calling because we've noticed an issue with your shipment. {issue_description}"

**Resolution Options:**
"We have a few options to resolve this for you:
1. {option_1}
2. {option_2}
3. {option_3}
Which would you prefer?"

**Closing:**
"Thank you for your understanding. We'll {next_steps} right away. You'll receive a confirmation message shortly. Is there anything else you need help with today?"

### Delivery Exception Follow-up

**Introduction:**
"Hello, this is {agent_name} from {company_name}. I'm calling about your order #{order_number} that was scheduled for delivery today."

**Issue Description:**
"The carrier has reported a delivery exception: {exception_reason}. This means {explanation}."

**Resolution:**
"Here's what we can do to resolve this: {resolution_plan}. Would that work for you?"

**Closing:**
"Thank you for your patience. We'll update the delivery information and you'll receive a tracking update soon. Please let us know if you have any other questions."

## Automated Response Templates for Common Customer Inquiries

### Where is my order?

```
Hi {customer_name}, thanks for checking on order #{order_number}. Its current status is: {order_status}. {tracking_info}. Let me know if you need anything else!
```

### Can I change my shipping address?

```
Hello {customer_name}, regarding your request to change the shipping address for order #{order_number}: If your order hasn't shipped yet, we can update it. Please reply with the new address, and we'll make the change. If it has already shipped, we'll need to contact the carrier directly.
```

### Can I cancel my order?

```
Hi {customer_name}, thanks for your message about cancelling order #{order_number}. Current status: {order_status}. If the status is "Processing," we can still cancel it. Please confirm you'd like to proceed with cancellation by replying "Yes, cancel."
```

### When will my order ship?

```
Hello {customer_name}, your order #{order_number} is currently {order_status}. The estimated shipping date is {ship_date}. Once shipped, you'll receive a notification with tracking information. Let us know if you have other questions!
```

### Request for Expedited Shipping

```
Hi {customer_name}, we've received your request to expedite order #{order_number}. Current status: {order_status}. Expedite options: {expedite_options}. Additional cost: {expedite_cost}. Would you like to proceed? Please reply with your choice.
```

## Slack Notification Templates

### New Order Alert

```
:package: *New Order #${order_id}*
*Customer:* ${customer_name}
*Items:* ${item_count}
*Total:* ${order_total}
*Notes:* ${special_instructions}
```

### Shipping Issue Alert

```
:warning: *Shipping Issue - Order #${order_id}*
*Customer:* ${customer_name}
*Issue:* ${issue_description}
*Status:* ${current_status}
*Action needed:* ${required_action}
```

### Customer Query Alert

```
:speech_balloon: *Customer Query - Order #${order_id}*
*Customer:* ${customer_name}
*Query:* ${query_text}
*Order status:* ${order_status}
*Priority:* ${priority_level}
```

### Order Status Change

```
:arrows_counterclockwise: *Status Change - Order #${order_id}*
*Customer:* ${customer_name}
*Previous status:* ${previous_status}
*New status:* ${new_status}
*Updated by:* ${updated_by}
*Time:* ${timestamp}
```

## Instructions for Customizing Templates

1. Log in to your Sim Studio account
2. Open the Auto Shipping Coordinator workflow
3. Navigate to the "Process Shipping Update" node
4. Edit the system prompt to include your customized templates
5. Save your changes

These templates use variables that will be automatically populated with customer and order information from BatsCRM. You can customize the wording to match your brand voice and add additional templates as needed for your specific shipping scenarios.

## Best Practices for Customer Communication

1. **Keep messages concise** - SMS messages should be under 160 characters when possible
2. **Include order number** - Always reference the order number for easy tracking
3. **Provide next steps** - Let customers know what to expect next
4. **Include contact options** - Make it easy for customers to respond or get help
5. **Personalize when possible** - Use the customer's name and relevant order details
6. **Set clear expectations** - Be specific about timeframes and delivery estimates
7. **Be proactive** - Notify about delays or issues before customers reach out

## Managing Customer Responses

The Auto Shipping Coordinator is set up to handle common customer responses using natural language processing through the Sim Studio workflow. When customers reply to SMS messages, their responses will be processed through the "Process Customer Message" node, which will analyze the intent and determine appropriate follow-up actions.

This automated handling allows for:
- Quick responses to common questions
- Escalation to human agents when needed
- Consistent tracking of all communication in BatsCRM
- Integration with your existing support workflows

---

**Note:** These templates are starting points and should be regularly reviewed and updated based on customer feedback and changing business needs.
