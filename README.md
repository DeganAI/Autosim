# AutoSim

<p align="center">
  <img src="sim/public/static/sim.png" alt="Sim Studio Logo" width="500"/>
</p>

<p align="center">
  <a href="https://www.apache.org/licenses/LICENSE-2.0"><img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License: Apache-2.0"></a>
  <a href="https://discord.gg/Hr4UWYEcTT"><img src="https://img.shields.io/badge/Discord-Join%20Server-7289DA?logo=discord&logoColor=white" alt="Discord"></a>
  <a href="https://github.com/YOUR_USERNAME/auto-shipping-coordinator/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome"></a>
  <a href="https://github.com/YOUR_USERNAME/auto-shipping-coordinator/issues"><img src="https://img.shields.io/badge/support-contact%20author-purple.svg" alt="support"></a>
</p>

<p align="center">
  <strong>AutoSim</strong> is a powerful integration solution built on Sim Studio that connects Dialpad, BatsCRM, and Slack to automate shipping coordination workflows.
</p>

## Features

- **Automated Customer Communications**: Send personalized SMS and make calls through Dialpad based on order status changes
- **Intelligent Response Handling**: Process incoming customer messages with AI-powered intent recognition
- **Real-time Team Updates**: Automated Slack notifications for shipping events and customer inquiries
- **BatsCRM Integration**: Seamlessly update order statuses and shipping information
- **Customizable Workflows**: Tailor the system to match your specific shipping processes

## How It Works

This system leverages Sim Studio's workflow capabilities to:

1. **Monitor Events**: Capture order updates, shipping events, and customer messages
2. **Process with AI**: Analyze event data and determine appropriate actions
3. **Automate Communication**: Generate personalized customer messages and team notifications
4. **Execute Actions**: Update CRM records, send notifications, and track shipping status

## Getting Started

### Prerequisites

- [Sim Studio](https://simstudio.ai) account
- Dialpad Business/Enterprise account with API access
- BatsCRM account with API access
- Slack workspace with app creation privileges

### Installation Options

#### Option 1: Docker Installation (Recommended)

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/auto-shipping-coordinator.git
cd auto-shipping-coordinator

# Create environment file
cp .env.example .env

# Edit the .env file with your API credentials
# Start the system
docker compose up -d --build
```

#### Option 2: Manual Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/auto-shipping-coordinator.git
cd auto-shipping-coordinator

# Install dependencies
npm install

# Create and configure environment file
cp .env.example .env

# Start the server
npm start
```

### Configuration

1. **Set up Sim Studio Workflow**:
   - Import the workflow configuration from `config/sim-workflow.json`
   - Update environment variables with your Sim Studio workflow ID

2. **Configure Webhooks**:
   - Set up Dialpad webhook: `https://your-server.com/webhooks/dialpad`
   - Set up BatsCRM webhook: `https://your-server.com/webhooks/batscrm`

3. **Customize Templates**:
   - Edit communication templates in `templates/communication-templates.md`
   - Configure notification formats in the Sim Studio workflow

## Documentation

Detailed documentation is available in the `docs` directory:

- **Implementation Guide**: Step-by-step instructions for building the Sim Studio workflow
- **Setup Guide**: Deployment and configuration instructions
- **API Reference**: Details on available endpoints and integration options
- **Customization Guide**: How to tailor the system to your specific needs

## Tech Stack

- **Core Integration**: [Sim Studio](https://simstudio.ai)
- **Communication**: [Dialpad API](https://developers.dialpad.com)
- **CRM Integration**: BatsCRM API
- **Team Collaboration**: [Slack API](https://api.slack.com)
- **Backend**: Node.js with Express
- **Containerization**: Docker

## Contributing

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for details.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built on the powerful [Sim Studio](https://simstudio.ai) platform
- Special thanks to the Sim Studio team for their excellent workflow engine

##

<p align="center">Made with ❤️ by YOUR_NAME</p>
