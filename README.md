# PrivacyGuard

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.22048255.svg)](https://doi.org/10.5281/zenodo.22048255)

PrivacyGuard is a local-first Chrome extension that makes web tracking and
browser fingerprinting **visible**. It detects trackers, audits which browser
properties page scripts read, and can optionally randomize the browser's
fingerprint — while keeping every byte of collected data on the user's device.

## Features

- **Tracker detection** — observes outgoing requests via `chrome.webRequest`
  and matches them against the [Disconnect tracking-protection list](https://github.com/disconnectme/disconnect-tracking-protection),
  with first-/third-party attribution and category labels.
- **Property-access auditor** — intercepts reads of privacy-sensitive browser
  properties (`document.cookie`, canvas/WebGL APIs, `navigator.*`, screen
  metrics, timezone, and more) and logs which party accessed what, when.
- **Fingerprint randomization** — five realistic device profiles (stratified
  conditional random sampling) that spoof navigator/screen properties, apply
  session-seeded canvas and audio noise, and set a matching User-Agent via
  `declarativeNetRequest`.
- **Popup & dashboard** — per-site view of accessed properties and trackers,
  a cross-session history dashboard with risk insights, and local JSON/CSV
  export.
- **Local-first** — no telemetry, no external services; all data lives in
  `chrome.storage.local`. An optional explanation layer can use a locally
  hosted LLM (see `OLLAMA_SETUP.md`).

## Install (development build)

```bash
npm install
npm run build
```

Then open `chrome://extensions`, enable Developer mode, choose
**Load unpacked**, and select the `dist/` folder.

## Development

```bash
npm run serve     # hot-reload build
npm run lint      # lint & fix
```

## Experiment modes

For evaluation, the extension exposes three modes in Settings:
**Off** (baseline; monitoring hooks only), **Monitor-only** (detection and
logging, no mitigation), and **Mitigation-on** (full protection: profile
injection and UA override). The active mode and profile are stamped into
every logged event, and the Settings page exports the full event log as
JSON or CSV.

## Research

PrivacyGuard is the artifact of an academic study of tracking visibility and
fingerprint mitigation. The website-benchmark dataset and the analysis script
that reproduces the paper's statistics are distributed as a separate
reproducibility package alongside the paper.

## Citation and archives

- Software archive (this repository, release v1.0.0): https://doi.org/10.5281/zenodo.22048255
- Benchmark dataset and analysis script (Experiment A): https://doi.org/10.5281/zenodo.22050278
- Exact code that ran the benchmark: tag `benchmark-2026-08-18`
