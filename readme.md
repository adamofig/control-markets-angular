# Control Markets

> ⚠️ **Note**: This project is currently under development in alpha version and may contain bugs.

Control the market with persona-based agents. This project is now open source! I believe in the power of community-driven innovation.

## Why Open Source?

*   **Transparency**: Inspect the code, understand how your agents work, and ensure your data is handled securely.
*   **Customizability**: Adapt the platform to your specific needs. Build custom nodes, integrations, and agent behaviors.
*   **Community**: Join a growing community of developers and marketers building the future of AI automation.

## Powerful Capabilities

*   **AI Agent Tasks**: Automate content generation and workflows with powerful AI agents.
*   **Market Monitoring**: Analyze trends and social networks to dominate your industry.
*   **Viral Video Generation**: Automatically create engaging videos for TikTok and similar platforms.

## Persona Based Agents

More than just chatbots. Create agents with distinct personalities, psychological profiles, and communication patterns. They don't just execute tasks; they embody your brand.

*   **Unique Identity**: Define names, personalities, and unique voices with specific accents for each agent.
*   **Communication Style**: Establish distinct speaking patterns, including common phrases and filler words.
*   **Self-Awareness**: Agents know they are AI with a personality, maintaining transparency while delivering authentic interactions.

## Getting Started

### Prerequisites

*   Node.js and npm
*   Angular CLI
*   Firebase Account

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/adamofig/control-markets-angular.git
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the application:
    ```bash
    npm run start
    ```

## Configuration

### Firebase Setup

1.  Create a new Firebase project (or use an existing one).
2.  Copy your Firebase credentials to `src/environments/environment.ts`.
3.  Enable Authentication methods in the Firebase Console (Email/Password, Google, etc.).

## Development

Run the development server:

```bash
npm run start
```

## Deployment

### Manual Deploy

```bash
npm run build
firebase deploy --only hosting
```

### Automatic Deploy

CI/CD can be set up using Google Cloud Build.

## Backend

This project comes with a ready-to-use backend in Nest.js.

*   [Control Markets Backend](https://github.com/adamofig/control-markets-node)

## License

Not decided yet
