<template>
  <div class="about-container">
    <!-- Modern Header -->
    <div class="about-header">
      <div class="header-icon">🔍</div>
      <div>
        <h1>About Browser Fingerprinting</h1>
        <p class="header-subtitle">Understanding Digital Privacy Threats</p>
      </div>
    </div>

    <!-- Content Section -->
    <div class="about-content">
      <!-- What is Section -->
      <div class="info-card">
        <div class="card-header">
          <span class="card-icon">💡</span>
          <h2>What is Browser Fingerprinting?</h2>
        </div>
        <div class="card-body">
          <p>
            Browser fingerprinting is a way websites can find out a lot of information about your computer or phone just by
            you visiting them. This info includes things like what kind of device you're using, what browser you have, and
            other settings. Even though each piece of information might seem small and unimportant, when you put it all
            together, it can create a unique "fingerprint" for you. This means that websites can recognize you and track
            what you do online, even if you don't tell them who you are.
          </p>
        </div>
      </div>

      <!-- Methods Section -->
      <div class="info-card">
        <div class="card-header">
          <span class="card-icon">🔧</span>
          <h2>Browser Fingerprinting Methods</h2>
        </div>
        <div class="card-body">
          <p class="intro-text">
            Browser fingerprinting involves several techniques to collect information about a user's device and browser.
            Here are some of the common methods used:
          </p>

          <div class="methods-list">
            <div class="method-item">
              <div class="method-header">
                <span class="method-icon">🌐</span>
                <h3>User Agent String</h3>
              </div>
              <p>
                The user agent string is a text that the browser sends to websites, identifying
                the browser type, version, and the operating system. This string can provide a starting point for
                creating a fingerprint.
              </p>
            </div>

            <div class="method-item">
              <div class="method-header">
                <span class="method-icon">📡</span>
                <h3>HTTP Headers</h3>
              </div>
              <p>
                Beyond the user agent, HTTP headers include additional details like the
                accepted languages, encoding types, and sometimes device's screen resolution. These headers vary slightly
                from one browser to another and can contribute to the uniqueness of a fingerprint.
              </p>
            </div>

            <div class="method-item">
              <div class="method-header">
                <span class="method-icon">⚡</span>
                <h3>JavaScript APIs</h3>
              </div>
              <p>
                Websites can use JavaScript to access more detailed information about your
                device. This includes data points like your screen resolution, timezone, whether you have a
                touchscreen, and even the battery level of your device. JavaScript can also detect installed
                fonts and plugins, which can be quite distinctive.
              </p>
            </div>

            <div class="method-item">
              <div class="method-header">
                <span class="method-icon">🎨</span>
                <h3>Canvas Fingerprinting</h3>
              </div>
              <p>
                This technique uses the HTML canvas element to draw graphics or text. Since
                different devices and browsers can render the canvas in slightly different ways, this can be
                used to identify and track users.
              </p>
            </div>

            <div class="method-item">
              <div class="method-header">
                <span class="method-icon">📹</span>
                <h3>WebRTC</h3>
              </div>
              <p>
                Web Real-Time Communication (WebRTC) can reveal your real IP address, even
                if you're using a VPN. This information can add another layer to your digital fingerprint.
              </p>
            </div>

            <div class="method-item">
              <div class="method-header">
                <span class="method-icon">🔊</span>
                <h3>Audio and Video Fingerprinting</h3>
              </div>
              <p>
                Similar to canvas fingerprinting, browsers may process audio and video
                content differently. By analyzing how your browser renders audio or video, websites can gather more
                clues about your device.
              </p>
            </div>

            <div class="method-item">
              <div class="method-header">
                <span class="method-icon">✍️</span>
                <h3>Font Detection</h3>
              </div>
              <p>
                By checking which fonts you have installed, websites can infer about your
                operating system and the software you use. Since users often have unique sets of fonts, this can
                significantly add to the fingerprint's uniqueness.
              </p>
            </div>

            <div class="method-item">
              <div class="method-header">
                <span class="method-icon">🎮</span>
                <h3>Hardware Interaction</h3>
              </div>
              <p>
                Information about how your device interacts with hardware, like gamepads or
                virtual reality equipment, can also be collected.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Privacy Warning -->
      <div class="warning-card">
        <div class="warning-icon">⚠️</div>
        <div class="warning-content">
          <h3>Privacy Concerns</h3>
          <p>
            These methods, individually or combined, enable websites to compile a detailed profile of your browsing
            device. While each piece of information might seem minor, together they form a unique identifier that can be used
            for tracking online activities, often without explicit consent from the user. This raises privacy concerns, as
            it's difficult for users to block or control this type of data collection effectively.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* About Container */
.about-container {
  min-height: 100vh;
  background: #f5f7fa;
}

/* Modern Header */
.about-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 48px 40px;
  color: white;
  display: flex;
  align-items: center;
  gap: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.header-icon {
  font-size: 64px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.about-header h1 {
  margin: 0;
  font-size: 36px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-subtitle {
  margin: 8px 0 0 0;
  font-size: 16px;
  opacity: 0.95;
  font-weight: 500;
}

/* Content */
.about-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
}

/* Info Cards */
.info-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.info-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f5f7fa;
}

.card-icon {
  font-size: 32px;
}

.card-header h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #2d3436;
}

.card-body {
  color: #636e72;
  line-height: 1.8;
}

.card-body p {
  margin: 0;
  font-size: 16px;
}

.intro-text {
  margin-bottom: 24px;
  font-weight: 500;
}

/* Methods List */
.methods-list {
  display: grid;
  gap: 16px;
  margin-top: 24px;
}

.method-item {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px 24px;
  border-left: 4px solid #667eea;
  transition: all 0.3s ease;
}

.method-item:hover {
  background: #f0f2f5;
  border-left-color: #764ba2;
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
}

.method-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.method-icon {
  font-size: 24px;
}

.method-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #667eea;
}

.method-item p {
  margin: 0;
  color: #636e72;
  font-size: 15px;
  line-height: 1.6;
}

/* Warning Card */
.warning-card {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border-radius: 16px;
  padding: 32px;
  display: flex;
  gap: 24px;
  border: 2px solid #ffb74d;
  box-shadow: 0 2px 8px rgba(255, 152, 0, 0.15);
}

.warning-icon {
  font-size: 48px;
  flex-shrink: 0;
}

.warning-content h3 {
  margin: 0 0 16px 0;
  font-size: 24px;
  font-weight: 700;
  color: #e65100;
}

.warning-content p {
  margin: 0;
  color: #bf360c;
  font-size: 15px;
  line-height: 1.7;
}

/* Responsive */
@media (max-width: 768px) {
  .about-header {
    padding: 32px 24px;
    flex-direction: column;
    text-align: center;
  }

  .about-header h1 {
    font-size: 28px;
  }

  .about-content {
    padding: 24px 16px;
  }

  .info-card {
    padding: 24px 20px;
  }

  .card-header {
    flex-direction: column;
    text-align: center;
  }

  .card-header h2 {
    font-size: 24px;
  }

  .warning-card {
    flex-direction: column;
    text-align: center;
    padding: 24px;
  }
}
</style>