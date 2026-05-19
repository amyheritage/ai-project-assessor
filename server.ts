import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Route for Assessment
  app.post("/api/assess", async (req, res) => {
    try {
      const { 
        projectBrief, 
        codeSnippet, 
        workflowDescription, 
        volumeExpectations, 
        complianceInfo, 
        hitlExpectations, 
        stakeholders, 
        assumptions 
      } = req.body;

      const prompt = `
You are an **AI Project Assessor**, a multi-hat review engine designed to help enterprises evaluate AI projects before investment.
Your role is to act as a **centralized, pre-build review layer** that assesses feasibility, risk, cost, architecture, user-value, and compliance.

### USER INPUTS RECEIVED:
- **Project Brief**: ${projectBrief || "Not provided"}
- **Code/Pseudo-code**: ${codeSnippet || "Not provided"}
- **Workflow Description**: ${workflowDescription || "Not provided"}
- **Usage/Volume**: ${volumeExpectations || "Not provided"}
- **Data/Compliance**: ${complianceInfo || "Not provided"}
- **Human-in-the-loop**: ${hitlExpectations || "Not provided"}
- **Stakeholders**: ${stakeholders || "Not provided"}
- **Assumptions**: ${assumptions || "Not provided"}

### CORE RULES & MANDATORY BEHAVIOR:
1. **Mandatory Estimation**: Do not block if token usage, volume, or cost are missing. YOU MUST ESTIMATE them based on the brief and context.
2. **Three Scenarios**: In the Finance section, provide Conservative, Likely, and Aggressive scenarios for monthly cost and token volume.
3. **Professional Lenses**: CEO, AI Solution Architect, Product Manager, Accountant/Finance-Ops, and Privacy Officer.
4. **Strategically Critical**: AI is not always the answer. Recommend rules-based or human-only if better.
5. **Cross-Border Transfers**: Be explicit about jurisdictions (origin vs destination) and required safeguards.
6. **Prompt Engineer Final Pass**: Ensure the final output is tight, professional, and free of contradictions.
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              executiveDecision: {
                type: Type.OBJECT,
                properties: {
                  verdict: { type: Type.STRING },
                  justification: { type: Type.STRING },
                  riskValuePos: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  signOffRoles: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["verdict", "justification", "riskValuePos", "score", "signOffRoles"]
              },
              contextSummary: {
                type: Type.OBJECT,
                properties: {
                  problem: { type: Type.STRING },
                  users: { type: Type.STRING },
                  outcome: { type: Type.STRING },
                  gaps: { type: Type.STRING },
                  assumptionsUsed: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["problem", "users", "outcome", "gaps", "assumptionsUsed"]
              },
              architectReview: {
                type: Type.OBJECT,
                properties: {
                  feasibility: { type: Type.NUMBER },
                  architecture: { type: Type.STRING },
                  tokenDrivers: { type: Type.STRING },
                  reductionTactics: { type: Type.ARRAY, items: { type: Type.STRING } },
                  failureModes: { type: Type.STRING },
                  governanceGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
                  stopThresholds: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["feasibility", "architecture", "tokenDrivers", "reductionTactics", "failureModes", "governanceGaps", "stopThresholds"]
              },
              productReview: {
                type: Type.OBJECT,
                properties: {
                  userStatement: { type: Type.STRING },
                  valueProp: { type: Type.STRING },
                  kpis: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        threshold: { type: Type.STRING }
                      },
                      required: ["name", "threshold"]
                    }
                  },
                  alternatives: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        pros: { type: Type.STRING },
                        cons: { type: Type.STRING },
                        speed: { type: Type.STRING },
                        risk: { type: Type.STRING }
                      },
                      required: ["name", "pros", "cons", "speed", "risk"]
                    }
                  },
                  humanInTheLoop: { type: Type.STRING }
                },
                required: ["userStatement", "valueProp", "kpis", "alternatives", "humanInTheLoop"]
              },
              financeReview: {
                type: Type.OBJECT,
                properties: {
                  scenarios: {
                    type: Type.OBJECT,
                    properties: {
                      conservative: {
                        type: Type.OBJECT,
                        properties: {
                          volume: { type: Type.STRING },
                          cost: { type: Type.STRING },
                          notes: { type: Type.STRING }
                        },
                        required: ["volume", "cost", "notes"]
                      },
                      likely: {
                        type: Type.OBJECT,
                        properties: {
                          volume: { type: Type.STRING },
                          cost: { type: Type.STRING },
                          notes: { type: Type.STRING }
                        },
                        required: ["volume", "cost", "notes"]
                      },
                      aggressive: {
                        type: Type.OBJECT,
                        properties: {
                          volume: { type: Type.STRING },
                          cost: { type: Type.STRING },
                          notes: { type: Type.STRING }
                        },
                        required: ["volume", "cost", "notes"]
                      }
                    },
                    required: ["conservative", "likely", "aggressive"]
                  },
                  fteComparison: { type: Type.STRING },
                  tiers: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        range: { type: Type.STRING },
                        risk: { type: Type.STRING },
                        governance: { type: Type.STRING }
                      },
                      required: ["name", "range", "risk", "governance"]
                    }
                  },
                  sensitivity: { type: Type.STRING }
                },
                required: ["scenarios", "fteComparison", "tiers", "sensitivity"]
              },
              privacyReview: {
                type: Type.OBJECT,
                properties: {
                  risk: { type: Type.NUMBER },
                  gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
                  minControls: { type: Type.ARRAY, items: { type: Type.STRING } },
                  verdict: { type: Type.STRING }
                },
                required: ["risk", "gaps", "minControls", "verdict"]
              },
              crossBorder: {
                type: Type.OBJECT,
                properties: {
                  involved: { type: Type.STRING },
                  mapping: {
                    type: Type.OBJECT,
                    properties: {
                      origin: { type: Type.STRING },
                      destination: { type: Type.STRING }
                    },
                    required: ["origin", "destination"]
                  },
                  adequacy: { type: Type.STRING },
                  mechanisms: { type: Type.ARRAY, items: { type: Type.STRING } },
                  tiaRequired: { type: Type.BOOLEAN },
                  safeguards: { type: Type.ARRAY, items: { type: Type.STRING } },
                  riskLevel: { type: Type.STRING }
                },
                required: ["involved", "mapping", "adequacy", "mechanisms", "tiaRequired", "safeguards", "riskLevel"]
              },
              finalSummary: { type: Type.STRING }
            },
            required: [
              "executiveDecision", "contextSummary", "architectReview", 
              "productReview", "financeReview", "privacyReview", 
              "crossBorder", "finalSummary"
            ]
          }
        }
      });
      
      const jsonStr = response.text.trim();
      res.json(JSON.parse(jsonStr));
    } catch (error: any) {
      console.error("Assessment Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate assessment" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
