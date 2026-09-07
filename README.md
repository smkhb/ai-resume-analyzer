# Resmind — Self-Hosted AI Resume Analyzer

An elegant, lightning-fast, and fully self-hosted AI-powered resume analyzer built with **React, TypeScript, Hono, and Bun**. 

Resmind acts as an intelligent job search assistant. It extracts text from your PDF resumes, compares it against any target job description, and generates an instant Applicant Tracking System (ATS) compatibility score alongside highly detailed, structured feedback [1, 3].

Unlike cloud-dependent serverless projects, this application runs entirely locally. It utilizes **Bun's native SQLite driver** for history tracking and serves files locally, providing absolute privacy and zero infrastructure costs.

---

## 🚀 Key Features

* **AI-Powered ATS Matching:** Generates dynamic ATS matching scores based on Tone & Style, Content, Structure, and Key Skills.
* **Local SQLite History:** Tracks and stores all your past resume reviews using an embedded SQLite database powered by Bun’s native SQL driver.
* **Interactive Split-Screen Dashboard:** Renders original PDF resumes side-by-side with circular score metrics, colored category badges, and expandable shadcn/ui feedback accordions.
* **No Platform-as-a-Service Bloat:** Bypasses complex cloud databases, serverless sign-ins, or third-party storage managers. You own your data locally.
* **Modern Component-Driven UI:** Sleek, fully responsive user experience crafted using **shadcn/ui**, **Tailwind CSS**, and **Lucide React**.

---

## 🛠️ Tech Stack

* **Frontend:** React, React Router, Tailwind CSS, shadcn/ui.
* **Backend:** Bun (High-performance JS/TS runtime), Hono (Lightweight Web Standards Web Framework), Bun:SQLite (Native SQLite).
* **AI Engine:** Google Gemini SDK (`gemini-2.5-flash` by default).
* **Text Extraction:** `pdf-parse` for local, zero-dependency OCR parsing.

---

## 🤸 Quick Start

### Prerequisites
Make sure you have [Bun](https://bun.sh/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/resume-analyzer.git
   cd resume-analyzer
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

### ⚙️ Environment Variables Configuration (`.env`)

Before starting the application, you need to configure your environment variables to integrate with the Google Gemini API.

1. Create a `.env` file in your root server directory based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. Add your Gemini API Key:
   ```env
   PORT=3333
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### Running the Application

To launch your self-hosted backend and frontend development server simultaneously:

```bash
bun run dev
```

---

## 🤖 Recommended Gemini Models for Resmind

To ensure resume analysis delivers the perfect balance of **accuracy, latency, and cost-efficiency**, we recommend the following models from the **Google Gemini** family:

### 📊 Model Classification

| Model | Category | Latency | Cost | PDF / JSON Parsing Accuracy |
| :--- | :--- | :---: | :---: | :---: |
| **`gemini-2.5-flash`** | ⚡ Ultra Fast & Lightweight | 🟢 Very Low | 💲 Ultra Low | ⭐⭐⭐⭐☆ |
| **`gemini-2.5-pro`** | 🧠 Advanced Reasoning | 🟡 Medium | 💲💲 Moderate | ⭐⭐⭐⭐⭐ |
| **`gemini-2.0-flash`** | 🛠️ Stable Legacy | 🟢 Low | 💲 Ultra Low | ⭐⭐⭐⭐☆ |

### 🎯 Choice Guide

#### 1. ⚡ `gemini-2.5-flash` — *(Recommended Default)*
* **Best Use:** Standard local and production environments where response speed and low resource consumption are key.
* **Why use it:**
  * Native multimodal extraction capabilities for fast parsing of multi-page PDFs.
  * Extremely low error rate when generating complex, strictly structured JSON output schemas (*Structured Outputs*).
  * Ideal for rapid-fire feedback without hitting rate limits.

#### 2. 🧠 `gemini-2.5-pro` — *(Best for Deep Reviews)*
* **Best Use:** Advanced, granular resume feedback where an in-depth rewrite or deep structural critique is required.
* **Why use it:**
  * Superior cognitive capabilities to identify subtle inconsistencies in professional tone, formatting, and career timeline gaps.
  * Exceptional performance when performing highly detailed, direct cross-referencing between dense Job Descriptions and candidate resumes.

---

*This project is built from scratch as an independent Client-Server showcase of modern full-stack engineering.*
