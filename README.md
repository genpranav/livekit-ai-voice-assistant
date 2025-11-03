### STEPS TO RUN LOCALLY:

my local setup,
| Tool      | Version  |
|------------|-----------|
| OS         | Windows 11|
| Python     | 3.12.8    |
| Node.js    | 24.11.0   |
| npm        | 11.6.1    |


1. clone this repository using, 
```bash
git clone https://github.com/genpranav/livekit-ai-voice-assistant.git
```

2. Configuring Environment variables in 2 places,
- .env at root folder
```
LIVEKIT_URL=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
DEEPGRAM_API_KEY=
CARTESIA_API_KEY=
GOOGLE_API_KEY=
```
- ./agent-starter-react/.env.local
```
LIVEKIT_URL=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
```
easy access links to create these api keys,
[LIVEKIT](https://cloud.livekit.io/),
[DEEPGRAM](https://console.deepgram.com/),
[GOOGLE AI STUDIO](https://aistudio.google.com/app/api-keys),
[CARTESIA](https://play.cartesia.ai/keys)

before the next steps be sure to navigate into the cloned repo directory,
```powershell
cd .\livekit-ai-voice-assistant\
```

3. open a terminal (terminal 1), run the following commands,
```powershell
python -m venv venv
venv/Scripts/activate
pip install -r requirements.txt
python agent.py download-files
python agent.py start
```
>Note: Once you run this command you might need to wait to see it load. Sometimes you might encounter an initilzation error due to timeout either give it some time or stop the process using `ctrl+C` and rerun the command `python agent.py start`.
Once you see the Livekit agent worker initilized and waiting for job you can proceed to the next step.

4. open another terminal (terminal 2), navigate into the agent-starter-react folder using 
```powershell 
cd agent-starter-react
npm i
npm run build
npm run start
```

5. Paste this link in your browser
```powershell
http://localhost:3000
```

### ARCHITECTURE:

The implementation of this voice agent is straight forward,
It combines the agent hosting capabilites offered by [LiveKit](https://docs.livekit.io/agents/start/voice-ai/) along with their [Agent React Starter](https://github.com/livekit-examples/agent-starter-react/tree/main) front end that was customized to preference.

<picture>
<img src="./Architecture diagram.png">
</picture>

Backend using the python sdk we Deploy the LiveKit Agent with the voice pipeline configured. LiveKit handle worker health and assignment. When User initates the call via frontend, a room is created. LiveKit immediately recognizes the room and deploys the agent to the request. The audio track is opened and 2 way communication occurs with webRTC. When the User ends call, the room is destroyed and the agent is disconnected and goes back to ready state.

This can be tracked realtime with [LIVEKIT](https://cloud.livekit.io/), Agent and Session with ids.
### ASSUMPTIONS:

The existing frontend is based on a boilerplate, to simplify user room persistance post LiveKit token authentication

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
