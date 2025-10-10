# Training Engagement Bot

## Information
Name: Onyinyechi Samuel Lekweuwa
Github: theglobalada
X-username: theglobalada
LinkedIn: Onyinyechi Lekweuwa

## Overview

The Training Engagement Bot is a custom bot designed to enhance learner engagement through reminders, motivational quotes, assignments, and daily prompts. It automatically posts check-in questions to keep learners accountable and motivated throughout their learning journey.

## Features

- **Reminders**: Schedule and send task/event reminders
- **Motivational Quotes**: Deliver inspirational content to users
- **Assignment Management**: Track assignments and progress
- **Daily Prompts**: Send check-in questions and collect responses
- **Response Storage**: Record and store user interactions

### Technology Stack

- **Node.js**: JavaScript runtime
- **Telegraf**: Telegram bot framework
- **dotenv**: Environment variable management

## Project Structure

```
training-engagement-bot
├── api
│   └── webhook.js          # Vercel serverless function
├── scripts
│   └── setup-webhook.js    # Webhook configuration script
├── src
│   ├── bot.js              # Local development entry point
│   ├── services
│   │   ├── assignments.js
│   │   ├── prompts.js
│   │   ├── quotes.js
│   │   └── reminders.js
│   └── storage
│       └── responses.js
├── .env.example            # Environment variables template
├── package.json
├── vercel.json             # Vercel deployment config
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (version 14 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/training-engagement-bot.git
   ```
2. Navigate to the project directory:
   ```bash
   cd training-engagement-bot
   ```
3. Install the dependencies:
   ```bash
   pnpm install
   ```

### Configuration

1. Create a `.env` file in the root directory
2. Add your Telegram bot token:
   ```
   BOT_TOKEN=your_actual_bot_token_here
   ```
3. To get a bot token:
   - Message [@BotFather](https://t.me/botfather) on Telegram
   - Create a new bot with `/newbot`
   - Copy the provided token to your `.env` file

### Running the Bot

To start the bot, run:

```bash
pnpm start
```

## Deployment on Vercel

### Prerequisites for Vercel Deployment
- Vercel account
- Telegram bot token from [@BotFather](https://t.me/botfather)

### Deploy to Vercel

1. **Fork/Clone this repository**

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Configure environment variables

3. **Set Environment Variables in Vercel:**
   - Go to your project settings in Vercel
   - Add environment variable:
     - `BOT_TOKEN`: Your Telegram bot token

4. **Deploy:**
   - Vercel will automatically deploy your bot
   - Note your deployment URL (e.g., `https://your-app.vercel.app`)

5. **Set up Webhook:**
   After deployment, run this command locally to configure the webhook:
   ```bash
   BOT_TOKEN=your_bot_token WEBHOOK_URL=https://your-app.vercel.app/api/webhook node scripts/setup-webhook.js
   ```

### Local Development vs Production

- **Local Development**: Uses polling (run `pnpm start`)
- **Production (Vercel)**: Uses webhooks for serverless deployment

### Vercel Configuration

The project includes:
- `vercel.json`: Vercel deployment configuration
- `api/webhook.js`: Serverless function for handling Telegram updates
- `scripts/setup-webhook.js`: Script to configure webhook URL

## User Guide

### Getting Started with the Bot

1. Find the bot on Telegram using the bot username
2. Start a conversation by clicking "Start" or sending `/start`
3. The bot will welcome you and explain its purpose

### Available Commands

#### `/start`

Initializes the bot and displays a welcome message.

```
/start
```

#### `/quote`

Get a random motivational quote to inspire your learning journey.

```
/quote
```

**Example Response:**

> "The only way to do great work is to love what you do. - Steve Jobs"

#### `/assign <assignment_description>`

Add a new assignment or task to your list.

```
/assign Complete Chapter 3 exercises
/assign Review JavaScript fundamentals
/assign Submit project proposal by Friday
```

#### `/list_assignments`

View all your current assignments.

```
/list_assignments
```

**Example Response:**

```
Complete Chapter 3 exercises
Review JavaScript fundamentals
Submit project proposal by Friday
```

#### `/remind <time> <message>`

Schedule a reminder for a specific time with a custom message.

```
/remind 2pm Review notes for tomorrow's exam
/remind 9am Start working on the final project
/remind tomorrow Call study group meeting
```

#### `/daily_prompt`

Receive a daily reflection question to help track your learning progress.

```
/daily_prompt
```

**Example Prompts:**

- "What did you learn today?"
- "What challenges did you face?"
- "What are you grateful for today?"
- "What is your goal for tomorrow?"

### Interactive Features

#### Responding to Prompts

When you receive a daily prompt or any question from the bot, simply type your response as a regular message (no command needed). The bot will automatically record your response.

**Example:**

```
Bot: What did you learn today?
You: I learned about async/await in JavaScript and how it makes code more readable than promises.
Bot: Response recorded. Thank you!
```

### Usage Tips

#### Daily Routine

1. **Morning**: Use `/daily_prompt` to set your learning intentions
2. **During Study**: Use `/remind` to set break reminders or deadline alerts
3. **Evening**: Respond to daily prompts to reflect on your progress
4. **Weekly**: Use `/list_assignments` to review and plan your tasks

#### Best Practices

- **Be Specific**: When adding assignments, include deadlines and details
- **Regular Check-ins**: Respond to daily prompts consistently for better tracking
- **Use Reminders**: Set reminders for important deadlines and study sessions
- **Stay Motivated**: Use `/quote` whenever you need inspiration

#### Assignment Management

- Add assignments as soon as you receive them
- Include due dates in the assignment description
- Use `/list_assignments` regularly to stay on top of your workload
- Break large projects into smaller, manageable tasks

#### Reminder System

- Use natural language for times (e.g., "2pm", "tomorrow", "next Monday")
- Set multiple reminders for important deadlines
- Include context in your reminder messages for clarity

### Example Learning Session

Here's how you might use the bot during a typical study session:

```
You: /start
Bot: Welcome to the Training Engagement Bot! I will help you stay engaged and accountable.

You: /quote
Bot: "Success is not the key to happiness. Happiness is the key to success. - Albert Schweitzer"

You: /assign Complete data structures homework by Thursday
Bot: Assignment added: Complete data structures homework by Thursday

You: /remind 6pm Take a 15-minute break
Bot: Reminder set for 6pm: Take a 15-minute break

You: /daily_prompt
Bot: What challenges did you face today?

You: I struggled with understanding binary trees, but I found some good examples online that helped clarify the concept.
Bot: Response recorded. Thank you!

You: /list_assignments
Bot: Complete data structures homework by Thursday
```

## Troubleshooting

### Bot Not Responding

- Check if the bot is online
- Try sending `/start` to reinitialize
- Contact your administrator if issues persist

### Commands Not Working

- Ensure you're using the correct command format
- Commands must start with `/`
- Check for typos in command names

### Missing Responses

- The bot records all text messages as responses to prompts
- Use commands (starting with `/`) for specific actions
- Regular text is treated as responses to daily prompts
