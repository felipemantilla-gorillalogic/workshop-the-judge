# The Judge - AI Challenge 2025

A distributed AI challenge platform where teams connect servers to a central system, solve AI-powered text processing challenges, and compete for points based on solution quality.

## Workshop Slides & Resources

- [AI Workshop Session 1](https://ai-workshop-sesion-1.surge.sh/) - Introduction to The Judge platform and challenge details
- [AI Workshop Session 2](https://ai-workshop-sesion-2.surge.sh/) - Automation and workflows with n8n and Flowise
- [Session 2 Projects](https://ai-workshop-sesion-2.surge.sh/projects.html) - Reference implementations for AI agents and workflows

## Project Structure

```
/the-judge
├── /sesion_1                # Main competition components
│   ├── /judge               # Central server (The Judge)
│   ├── /judge-ui            # 3D visualization interface
│   ├── /team                # Team server template
│   └── /slides              # Documentation/slides
├── /sesion_2                # Additional resources and projects
│   ├── /resources           # Flowise and n8n configurations
│   │   ├── /flowise         # AI agent configurations
│   │   └── /n8n             # Workflow orchestrator configurations
│   └── /slides              # Documentation for Session 2
└── /examples                # Example implementations and code
    ├── /curiosidades        # AI curiosities and information
    ├── /feedback            # Feedback collection interface
    └── /workshop            # Workshop example code
```

## Components

### The Judge (Central Server)

The central server that manages the game, proposes challenges, evaluates responses, and tracks team progress.

**Key Features:**
- Team registration and authentication
- Challenge generation and distribution
- Response evaluation and scoring
- Real-time status tracking

**Tech Stack:**
- Node.js + Express
- JSON file storage for game state
- OpenAI integration for challenge evaluation

### Judge UI (Visualization)

A 3D immersive interface for monitoring the real-time status of participating teams and their challenges with a futuristic aesthetic.

**Features:**
- 3D visualization of teams and connections
- Real-time updates of team status
- Visual differentiation of node states
- Administration controls

**Tech Stack:**
- React
- React Three Fiber (R3F)
- GSAP for animations
- Modern CSS

### Team Server

Template for teams to create servers that connect to the central system, request challenges, use AI to solve them, and submit solutions.

**Features:**
- Team registration with The Judge
- Challenge request and resolution
- OpenAI integration for solutions
- Score tracking and status monitoring

**Tech Stack:**
- Node.js + Express
- OpenAI API for challenge solving
- Axios for HTTP requests
- Optional web interface

## Session 2: AI Automation Tools

The second session focuses on building intelligent automation workflows:

**Key Components:**
- **n8n**: Workflow orchestration and automation
- **Flowise**: Visual builder for AI agents and chains
- **Prompt Engineering**: Techniques for effective LLM instructions

**Example Projects:**
1. Basic categorization workflow with n8n
2. AI categorization agent with Flowise
3. Integrated system connecting n8n and Flowise agents

## Setup Instructions

### Judge Server

1. Navigate to the judge server directory:
   ```bash
   cd sesion_1/judge
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

The server will run on http://localhost:3000 by default.

### Judge UI

1. Navigate to the UI directory:
   ```bash
   cd sesion_1/judge-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment (optional):
   Create a `.env` file with:
   ```
   REACT_APP_API_URL=http://your-backend-url
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The UI will be available at http://localhost:3001.

### Team Server

1. Navigate to the team server directory:
   ```bash
   cd sesion_1/team
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your team information in `src/config.js`

4. Start the server:
   ```bash
   npm start
   ```

Your team server will run on http://localhost:3002 by default.

## Competition Flow

1. **Registration**: Teams register with The Judge providing their callback URL
2. **Credentials**: The Judge returns authentication and OpenAI tokens
3. **Challenge Request**: Teams request challenges from The Judge
4. **Resolution**: Teams use OpenAI to solve the challenges
5. **Submission**: Teams submit solutions to The Judge for evaluation
6. **Scoring**: The Judge evaluates solutions and awards points

## API Specifications

### Registration

```
POST /register (to The Judge)
Body: { "callbackURL": "URL of your team-info endpoint" }
Response: { "authToken": "auth-token", "openAiToken": "openai-token" }
```

### Challenge Request

```
GET /challenge (from The Judge)
Headers: Authorization: Bearer {authToken}
Response: {
  "challengeId": "unique-challenge-id",
  "challenge": "Challenge instructions",
  "input": "Text to process"
}
```

### Solution Submission

```
POST /submit (to The Judge)
Headers: Authorization: Bearer {authToken}
Body: { "challengeId": "challenge-id", "response": "Your solution" }
Response: {
  "score": 85,
  "passed": true,
  "feedback": "Analysis of your response"
}
```

## Session 2: Automation Example

Basic workflow using n8n and Flowise:

1. Webhook receives an incoming request with customer query
2. n8n processes the request and sends it to Flowise agent
3. Flowise agent categorizes the query using AI
4. The query is routed to the appropriate team based on the category
5. Each specialist team has its own AI agent for handling specific queries

## Development Guidelines

1. **Security**:
   - Store tokens securely
   - Validate all inputs
   - Use HTTPS for production connections

2. **Robustness**:
   - Implement retry mechanisms for network errors
   - Validate API responses
   - Include proper exception handling

3. **Performance**:
   - Optimize prompts to reduce token usage
   - Consider caching for similar responses
   - Monitor API rate limits

## License

This project is licensed under the MIT License.