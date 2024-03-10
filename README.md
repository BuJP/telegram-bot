# Telegram Referral Bot

## Description

A Telegram bot implemented in Node.js using the Telegraf framework, designed to manage a referral system and a premium channel. Users can generate unique referral links, invite others to join the channel, and unlock premium access by reaching a specified number of referred users. The bot is integrated with a Prisma database to store user information and referral relationships.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- [Yarn](https://yarnpkg.com/) installed
- [Prisma CLI](https://www.prisma.io/docs/getting-started/installation) installed globally

### Installation

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd telegram-bot
    ```

2. **Install dependencies using Yarn:**

    ```bash
    yarn install
    ```

3. **Set up your environment variables:**

    Create a `.env` file in the root of your project and add the following:

    ```env
    TELEGRAM_BOT_TOKEN=your-telegram-bot-token
    TELEGRAM_WEBHOOK_DOMAIN=your-webhook-domain
    REQUIRED_CHILDREN=3
    PREMIUM_CHAT_ID=-100...
    BASIC_CHAT_ID=-100...
    PORT=3000
    ```

    Replace `your-telegram-bot-token`, `your-webhook-domain`, `PREMIUM_CHAT_ID` and `BASIC_CHAT_ID` with your actual Telegram bot token, webhook domain....

4. **Run the Prisma migrations:**

    ```bash
    yarn prisma migrate deploy
    ```

### Usage

- **Build the TypeScript code:**

    ```bash
    yarn build
    ```

- **Start the bot:**

    ```bash
    yarn start
    ```

    OR

- **Start the bot in development mode with auto-reloading using Nodemon:**

    ```bash
    yarn dev
    ```

### Commands

- `/info`: Get information about your referral link, the number of users referred, and access to the premium channel.
