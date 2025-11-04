### STEPS TO RUN LOCALLY:

my local setup,
| Tool      | Version  |
|------------|-----------|
| OS         | Windows 11|
| Python     | 3.12.8    |
| Node.js    | 24.11.0   |
| npm        | 11.6.1    |


1. Clone this repository: 
```bash
git clone https://github.com/genpranav/livekit-ai-voice-assistant.git
```

2. Configuring Environment variables in two places:
- at root folder (`.env`):
```
LIVEKIT_URL=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
DEEPGRAM_API_KEY=
CARTESIA_API_KEY=
GOOGLE_API_KEY=
```
- Inside `./agent-starter-react/.env.local`:
```
LIVEKIT_URL=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
```
Quick links to create API keys:
- [LIVEKIT](https://cloud.livekit.io/),
- [DEEPGRAM](https://console.deepgram.com/),
- [GOOGLE AI STUDIO](https://aistudio.google.com/app/api-keys),
- [CARTESIA](https://play.cartesia.ai/keys)

Before proceeding, navigate into the cloned repository directory:
```powershell
cd .\livekit-ai-voice-assistant\
```

3. Start the backend:

Open a terminal (Terminal 1) and run:
```powershell
python -m venv venv
venv/Scripts/activate
pip install -r requirements.txt
python agent.py download-files
python agent.py start
```
>Note: The initialization may take a few moments. If you encounter a timeout or initialization error, wait briefly or stop the process using `Ctrl + C` and rerun:
```powershell
python agent.py start
```
Once you see the message indicating that the LiveKit agent worker is initialized and waiting for jobs, proceed to the next step.

4. Start the frontend:

Open another terminal (Terminal 2) and navigate to the React frontend:
```powershell 
cd agent-starter-react
npm i
npm run build
npm run start
```

5. Access the application:

Open your browser and visit:
```powershell
http://localhost:3000
```

### ARCHITECTURE:

This voice agent integrates [LiveKit](https://docs.livekit.io/agents/start/voice-ai/)’s agent hosting capabilities with their [Agent React Starter](https://github.com/livekit-examples/agent-starter-react/tree/main) frontend, customized for this implementation.

<picture>
<img src="./Architecture diagram.png">
</picture>

The backend LiveKit Agent is deployed using the Python SDK, with the voice pipeline configured. LiveKit manages worker health, state, and room assignments based on job requests triggered by room occupancy.

When a user initiates a call from the browser, a room is created with the user as a participant. LiveKit automatically detects this event and assigns the agent to the session. The audio track is opened, establishing a two-way WebRTC communication channel.

When the user ends the call, the room is destroyed, the agent disconnects, and returns to the ready state.
For this use case, the video channel is disabled, these settings can be modified in `./agent-starter-react/app-config.ts`

You can monitor sessions and agents in real-time via the [LIVEKIT Dashboard](https://cloud.livekit.io/)

### ASSUMPTIONS:

The existing frontend is based on a boilerplate template to simplify user-room persistence following LiveKit token authentication.

### IMPROVEMENTS:

1. **Codebase Optimization:**
Several non-functional components and React-specific code smells from the starter template remain in the frontend. These should be refactored or removed to improve maintainability and performance.

2. **Project Structure and Security Enhancements:**
The current project structure can be reorganized for better scalability and clarity. Additionally, sensitive credentials are exposed through .env files. Implementing a secure secret management solution would significantly enhance security and compliance. 

3. **Agent-Room Assignment Management:**
The existing cloud-based context for agent-to-room assignment can be transitioned to a self-managed approach, giving greater flexibility and control over session handling.

4. **Automated Worker Deployment Retries:**
Deployment reliability can be improved by scripting automated retries for worker deployments, reducing manual intervention.

5. **Transcription window UI:**
When the conversation with the agent is long the transcribed text extends beyond some UI elements. This can be corrected to improve UX.

### VIDEO DEMO:
[🎬 LiveKit Voice Assistant](https://youtu.be/my0Rl38uq8I)
