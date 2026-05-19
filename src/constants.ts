export const PRESET_SCENARIOS = [
  {
    "id": "scenario_1",
    "name": "Customer Success Assistant",
    "project_brief": "Internal AI assistant for customer success teams to summarize account history, support tickets, and recent emails, and draft follow-up actions. The goal is to reduce account review time and increase consistency in customer engagement.",
    "code_or_workflow_description": "1. Retrieval from CRM (Salesforce/HubSpot) via REST API.\n2. Summarization of past 6 months of interaction history.\n3. Risk detection (sentiment analysis on tickets).\n4. Draft email generation based on recent open issues.\n5. Mandatory human-in-the-loop review before sending emails.",
    "usage_volume": "60 Customer Success Managers (CSMs). Approx. 20-40 account reviews per CSM per day per region (ANZ, EU, US). Total est. 1,200 - 2,400 daily requests.",
    "compliance_info": "Customer contact data (PII), support ticket history, sensitive commercial pricing info. Operations span NZ, AU, EU (GDPR), and US (CCPA). Data retention policy required."
  },
  {
    "id": "scenario_2",
    "name": "Employee Request Triage",
    "project_brief": "An AI intake and triage system for employee requests across HR, IT, and Operations. It classifies incoming queries, routes them to the correct department, summarizes the issue, and drafts initial responses for agents.",
    "code_or_workflow_description": "1. Natural language intake via Slack or Email.\n2. Intent detection and classification (Category: Payroll, Access, Facilities).\n3. Priority scoring (Low/Med/High/Critical).\n4. Automated routing to Zendesk/ServiceNow.\n5. Draft response generation for agent approval.\n6. Human confirmation required for all IT access changes.",
    "usage_volume": "5,000 employees globally. Baseline request volume of 300-800 requests per day. Peak volume during payroll cycles or IT outages could reach 1,500/day.",
    "compliance_info": "Employee personal data (names, IDs), leave/medical records (sensitive PII), employment-related grievance data. Potential offshore cloud processing (AWS/GCP US regions)."
  },
  {
    "id": "scenario_3",
    "name": "Website AI Support Assistant",
    "project_brief": "Customer-facing AI assistant on the company marketing site for product, pricing, and policy questions. The system aims to deflect low-complexity support queries while maintaining a path to human support for high-value or sensitive issues.",
    "code_or_workflow_description": "1. Chat interface on public website.\n2. Retrieval-Augmented Generation (RAG) using approved knowledge base docs.\n3. Answer generation with citations.\n4. Automatic escalation to live agent for pricing objections or legal coverage questions.\n5. Full conversation logging and daily performance review.",
    "usage_volume": "High external website traffic (100k+ monthly visitors). Exact AI usage unknown, but support deflection goal is 60% of baseline volume (est. 1,500 chats/day).",
    "compliance_info": "Public use, customer-identifying data (emails), real-time conversation logs. Cross-border processing across NZ, AU, EU, and UK jurisdictions. GDPR/Privacy Act 2020 alignment needed."
  }
];
