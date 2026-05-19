# AI Project Assessor: Enterprise Review Engine

## The Problem

Enterprises are struggling to evaluate AI projects consistently before committing funding. Without a centralised, multi-disciplinary review process, organisations risk green-lighting projects that lack strategic alignment, fail to meet compliance and privacy standards (like cross-border data transfer rules), or hide architectural flaws and escalating token costs. 

We need a pre-build review layer that standardises AI project assessments across business, technical, financial, and legal dimensions.

## Governance and Risk Framework

The AI Project Assessor enforces a structured review process by analysing proposed AI use cases through five distinct professional lenses. This multi-hat approach ensures a holistic evaluation of feasibility, risk, cost, and compliance—forcing stakeholders to confront potential pitfalls before any code is written or data is processed.

## Key Governance Pillars

To ensure rigorous oversight and seamless delivery, every project is evaluated against:

1. **CEO Lens (Strategic & Business Value):** Evaluates risk-vs-value, strategic alignment, and designates required executive sign-offs.
2. **AI Solution Architect Lens (Technical Feasibility):** Assesses technical viability, token efficiency, architecture patterns, and critical drift risk or failure modes.
3. **Product Manager Lens (User Value & Measurement):** Ensures user-centricity, defines exact KPIs with thresholds, and evaluates human-in-the-loop requirements.
4. **Accountant / Finance-Ops Lens (Cost & ROI):** Provides conservative, likely, and aggressive token-usage and cost scenarios, combined with FTE ROI comparisons.
5. **Data Privacy Officer Lens (Compliance & Privacy):** Flags PII risks, identifies control gaps, and specifically mandates cross-border data transfer review mechanisms (e.g., TIAs, SCCs).

## Architecture

The application is built on a modern, full-stack React and Express architecture, optimised for rapid assessment generation. 

* **Client-Side:** A responsive React interface using Tailwind CSS, structured for capturing nuanced project briefs, usage expectations, and compliance constraints. It includes pre-configured presets for common enterprise scenarios.
* **Server-Side:** An Express.js backend that securely proxies requests to Google's Generative AI models.
* **API Integration:** Validates inputs and translates them into a highly structured prompt, utilising JSON Schema output constraints to guarantee a consistent, predictable assessment object.

## Agent Orchestration

Currently, the system utilises a highly constrained large language model (`gemini-2.5-pro`) prompted to adopt a multi-persona "mixture of experts" strategy internally. 

The agent orchestration follows a strict sequence:
1. Ingest unstructured or semi-structured user requirements.
2. Estimate missing data (e.g., token volume, costs) using explicitly stated assumptions.
3. Execute evaluations across the five governance pillars.
4. Perform a final "Prompt Engineer-style" synthesis to eliminate contradictions and ensure an executive-grade tone.
5. Return guaranteed JSON matching a strict TypeScript interface for UI rendering.

## Tech Stack

* **Frontend:** React 19, Vite, Tailwind CSS (v4), Motion (for animations), Lucide React (icons).
* **Backend:** Node.js, Express.js, TypeScript.
* **AI Engine:** Google Gen AI SDK (`@google/genai`), using the Gemini model.
* **Build/Deploy:** `esbuild` for compiling the backend, bundled for containerised Cloud Run deployments.

## Outcomes and Trust Mechanisms

* **Standardised Output:** Generates a uniform "Assessment Pack" that judges all AI projects on the same scorecard.
* **Risk Surfacing:** Highlights technical dependencies, compliance red flags, and "when to stop" thresholds early.
* **Actionable Next Steps:** Delivers a clear "Go / No-Go / Pilot / Options" verdict with explicit justifications.
* **No Hallucinated Infrastructure:** Forces the model to operate strictly within the provided bounds, explicitly listing assumptions when estimating missing data.

## Future Roadmap

* **Multi-Agent Orchestration:** Transition from a single-prompt MoE to a true multi-agent system where dedicated functional agents (e.g., a Legal Agent, a Cloud FinOps Agent) negotiate the final assessment.
* **Integration with Enterprise Architecture Tools:** Export assessments directly to Jira, Confluence, or ServiceNow.
* **Historical Accuracy Tracking:** Allow users to update projected vs. actual costs/latency to continuously train and calibrate the estimator's baseline assumptions.
* **Expanded Regulatory Frameworks:** Implement specific knowledge bases for the EU AI Act, HIPAA, SOC 2, and specialised regional privacy laws tailored to specific industry verticals (including Australian Privacy Principles - APPs).

