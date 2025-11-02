# Ollama Setup Guide for Privacy Guard

This guide will help you set up Ollama on your system to enable AI-powered privacy insights in the Privacy Guard extension.

## Table of Contents
- [What is Ollama?](#what-is-ollama)
- [Windows Setup](#windows-setup)
- [macOS Setup](#macos-setup)
- [Linux Setup](#linux-setup)
- [Installing and Using Models](#installing-and-using-models)
- [Configuring Privacy Guard](#configuring-privacy-guard)
- [Troubleshooting](#troubleshooting)

---

## What is Ollama?

Ollama is a local AI server that runs large language models on your computer. Privacy Guard uses Ollama to generate intelligent insights about tracking risks without sending your data to external services.

**Benefits:**
- ✅ Complete privacy - your data never leaves your computer
- ✅ No API costs or rate limits
- ✅ Works offline
- ✅ Fast responses with local processing

**System Requirements:**
- **RAM:** 8GB minimum (16GB recommended for larger models)
- **Storage:** 5-10GB free space per model
- **CPU/GPU:** Modern CPU recommended; GPU support available for faster inference

---

## Windows Setup

### Step 1: Download Ollama

1. Visit [https://ollama.com/download](https://ollama.com/download)
2. Click **Download for Windows**
3. Run the installer (`OllamaSetup.exe`)
4. Follow the installation wizard

### Step 2: Verify Installation

1. Open **Command Prompt** or **PowerShell**
2. Run:
   ```bash
   ollama --version
   ```
3. You should see the version number

### Step 3: Start Ollama Service

Ollama runs as a background service. To start it manually:

```bash
ollama serve
```

**Note:** Ollama typically starts automatically after installation.

### Step 4: Enable CORS (Required for Chrome Extension)

By default, Ollama blocks requests from browser extensions. To allow Privacy Guard to connect:

1. **Stop any running Ollama instance:**
   - Open Task Manager (Ctrl + Shift + Esc)
   - Find "ollama" processes and end them
   - Or run in Command Prompt:
     ```bash
     taskkill /F /IM ollama.exe
     ```

2. **Set environment variable and restart:**
   ```bash
   set OLLAMA_ORIGINS=*
   ollama serve
   ```

3. **To make this permanent:**
   - Right-click **This PC** → **Properties** → **Advanced system settings**
   - Click **Environment Variables**
   - Under **System variables**, click **New**
   - Variable name: `OLLAMA_ORIGINS`
   - Variable value: `*`
   - Click **OK** and restart Ollama

### Step 5: Install a Model

```bash
ollama pull llama2
```

This downloads the LLaMA 2 model (about 3.8GB). Wait for the download to complete.

### Step 6: Test the Setup

```bash
ollama run llama2 "Hello, can you help me?"
```

If you see a response, Ollama is working correctly!

---

## macOS Setup

### Step 1: Download Ollama

**Option A: Download Installer**
1. Visit [https://ollama.com/download](https://ollama.com/download)
2. Click **Download for macOS**
3. Open the downloaded `.dmg` file
4. Drag **Ollama** to your Applications folder

**Option B: Install via Homebrew**
```bash
brew install ollama
```

### Step 2: Start Ollama

1. Open **Terminal** (Applications → Utilities → Terminal)
2. Start the Ollama service:
   ```bash
   ollama serve
   ```

Alternatively, launch Ollama from Applications and it will run in the background.

### Step 3: Enable CORS (Required for Chrome Extension)

1. **Stop Ollama if running:**
   ```bash
   pkill ollama
   ```

2. **Set environment variable and restart:**
   ```bash
   export OLLAMA_ORIGINS="*"
   ollama serve
   ```

3. **To make this permanent, add to your shell profile:**

   For **zsh** (default on macOS):
   ```bash
   echo 'export OLLAMA_ORIGINS="*"' >> ~/.zshrc
   source ~/.zshrc
   ```

   For **bash**:
   ```bash
   echo 'export OLLAMA_ORIGINS="*"' >> ~/.bash_profile
   source ~/.bash_profile
   ```

### Step 4: Install a Model

```bash
ollama pull llama2
```

### Step 5: Test the Setup

```bash
ollama run llama2 "Hello, can you help me?"
```

---

## Linux Setup

### Step 1: Install Ollama

**Option A: Automatic Install Script (Recommended)**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**Option B: Manual Installation**

1. Download the binary:
   ```bash
   curl -L https://ollama.com/download/ollama-linux-amd64 -o ollama
   ```

2. Make it executable:
   ```bash
   chmod +x ollama
   ```

3. Move to system path:
   ```bash
   sudo mv ollama /usr/local/bin/
   ```

### Step 2: Start Ollama as a Service

**Using systemd (Ubuntu, Debian, Fedora, etc.):**

1. Create a systemd service file:
   ```bash
   sudo nano /etc/systemd/system/ollama.service
   ```

2. Add the following content:
   ```ini
   [Unit]
   Description=Ollama Service
   After=network.target

   [Service]
   Type=simple
   User=YOUR_USERNAME
   Environment="OLLAMA_ORIGINS=*"
   ExecStart=/usr/local/bin/ollama serve
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

   Replace `YOUR_USERNAME` with your actual username.

3. Enable and start the service:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable ollama
   sudo systemctl start ollama
   ```

4. Check status:
   ```bash
   sudo systemctl status ollama
   ```

**Manual Start (without systemd):**
```bash
export OLLAMA_ORIGINS="*"
ollama serve
```

**To make CORS setting permanent:**
```bash
echo 'export OLLAMA_ORIGINS="*"' >> ~/.bashrc
source ~/.bashrc
```

### Step 3: Install a Model

```bash
ollama pull llama2
```

### Step 4: Test the Setup

```bash
ollama run llama2 "Hello, can you help me?"
```

---

## Installing and Using Models

Privacy Guard is pre-configured to use **llama2** by default, but you can use other models.

### Available Models

| Model | Size | RAM Required | Best For |
|-------|------|--------------|----------|
| llama2 | 3.8GB | 8GB | Recommended - Good balance |
| llama2:13b | 7.4GB | 16GB | Better quality insights |
| mistral | 4.1GB | 8GB | Fast and accurate |
| phi3 | 2.3GB | 4GB | Lightweight, less powerful |
| llama3 | 4.7GB | 8GB | Latest, high quality |

### Installing a Model

```bash
# Default LLaMA 2 (7B parameters)
ollama pull llama2

# Larger LLaMA 2 (13B parameters) - better quality
ollama pull llama2:13b

# Mistral - fast alternative
ollama pull mistral

# LLaMA 3 - latest version
ollama pull llama3
```

### List Installed Models

```bash
ollama list
```

### Remove a Model

```bash
ollama rm llama2
```

---

## Configuring Privacy Guard

### Step 1: Open Extension Settings

1. Click the Privacy Guard extension icon in your browser
2. Navigate to the **Settings** page
3. Find the **AI Insights** section

### Step 2: Configure Ollama Connection

| Setting | Value | Description |
|---------|-------|-------------|
| **Enable AI** | ✓ Checked | Turn on AI-powered insights |
| **Ollama URL** | `http://localhost:11434` | Default Ollama server address |
| **Model** | `llama2` | The model to use (must be installed) |
| **Timeout** | `30000` | Request timeout in milliseconds (30 seconds) |

### Step 3: Test Connection

1. Click **Test Connection** button
2. If successful, you'll see: ✅ "Successfully connected to Ollama!"
3. If failed, see [Troubleshooting](#troubleshooting) section

### Step 4: View AI Insights

1. Navigate to the **Dashboard**
2. You should see an **"AI Powered"** badge on the insights card
3. AI-generated insights will include:
   - Privacy risk summary
   - Personalized recommendations
   - Privacy score (0-100)
   - Detailed risk analysis

---

## Troubleshooting

### Issue: "Ollama not available" or Connection Failed

**Solution 1: Check if Ollama is running**
```bash
# Check if port 11434 is listening
netstat -an | grep 11434   # Linux/Mac
netstat -an | findstr 11434  # Windows
```

If not running:
```bash
ollama serve
```

**Solution 2: Verify CORS is enabled**

Stop Ollama and restart with CORS:
```bash
# Windows
set OLLAMA_ORIGINS=*
ollama serve

# Mac/Linux
export OLLAMA_ORIGINS="*"
ollama serve
```

**Solution 3: Check firewall settings**

Ensure port 11434 is not blocked by your firewall.

### Issue: "Model not found" Error

**Solution:** Install the model first
```bash
ollama pull llama2
```

Verify installation:
```bash
ollama list
```

### Issue: Slow Response Times

**Solutions:**
- Use a smaller model (e.g., `phi3` instead of `llama2:13b`)
- Increase timeout in Privacy Guard settings (e.g., 60000ms)
- Close other applications to free up RAM
- Consider GPU acceleration if available

### Issue: High Memory Usage

**Solutions:**
- Use a smaller model:
  ```bash
  ollama pull phi3
  ```
- Close the model when not in use:
  ```bash
  ollama stop llama2
  ```

### Issue: "Address already in use" Error

**Solution:** Another instance of Ollama is running

**Windows:**
```bash
taskkill /F /IM ollama.exe
ollama serve
```

**Mac/Linux:**
```bash
pkill ollama
ollama serve
```

### Issue: Extension shows "Rule-Based (AI Unavailable)"

**Checklist:**
1. ✓ Ollama is running: `ollama serve`
2. ✓ Model is installed: `ollama list`
3. ✓ CORS is enabled: `OLLAMA_ORIGINS=*` is set
4. ✓ AI is enabled in Privacy Guard settings
5. ✓ Correct URL in settings: `http://localhost:11434`
6. ✓ Model name matches: `llama2` (or your installed model)

**Test with curl:**
```bash
curl http://localhost:11434/api/tags
```

Should return a list of installed models.

---

## Advanced Configuration

### Custom Ollama Port

If you need to run Ollama on a different port:

```bash
# Set custom port
export OLLAMA_HOST=0.0.0.0:11435
ollama serve
```

Update Privacy Guard settings:
- Ollama URL: `http://localhost:11435`

### Running Ollama as Background Service

**Windows:** Ollama runs as a Windows service automatically after installation.

**Mac:** Use launchd:
```bash
# Create service file
nano ~/Library/LaunchAgents/com.ollama.ollama.plist
```

Add:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.ollama.ollama</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/ollama</string>
        <string>serve</string>
    </array>
    <key>EnvironmentVariables</key>
    <dict>
        <key>OLLAMA_ORIGINS</key>
        <string>*</string>
    </dict>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
```

Load the service:
```bash
launchctl load ~/Library/LaunchAgents/com.ollama.ollama.plist
```

**Linux:** See [Linux Setup Step 2](#step-2-start-ollama-as-a-service)

### GPU Acceleration

Ollama automatically detects and uses available GPUs:

- **NVIDIA GPUs:** CUDA support (Linux/Windows)
- **Apple Silicon:** Metal support (Mac M1/M2/M3)
- **AMD GPUs:** ROCm support (Linux)

No additional configuration needed!

---

## Security Considerations

### CORS Setting (`OLLAMA_ORIGINS=*`)

**What it does:** Allows browser extensions to connect to Ollama.

**Security note:** Only affects local connections (localhost/127.0.0.1). Since Ollama runs locally, the security risk is minimal.

**Alternative (More Restrictive):**
```bash
# Only allow chrome extensions
export OLLAMA_ORIGINS="chrome-extension://*"
```

### Network Exposure

By default, Ollama listens on `127.0.0.1:11434` (localhost only). To prevent external access, **do not** set `OLLAMA_HOST=0.0.0.0` unless you specifically need network access.

---

## Resources

- **Ollama Official Website:** [https://ollama.com](https://ollama.com)
- **Ollama GitHub:** [https://github.com/ollama/ollama](https://github.com/ollama/ollama)
- **Model Library:** [https://ollama.com/library](https://ollama.com/library)
- **Privacy Guard Repository:** [Link to your repo]

---

## Getting Help

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. View Ollama logs:
   - **Windows:** Check Windows Event Viewer
   - **Mac:** `log show --predicate 'process == "ollama"' --last 5m`
   - **Linux:** `sudo journalctl -u ollama -f`
3. Check browser console (F12) for Privacy Guard errors
4. Open an issue on the Privacy Guard GitHub repository

---

## License

This guide is part of the Privacy Guard project. See LICENSE for details.
