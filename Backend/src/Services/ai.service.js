const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const dotenv = require("dotenv");
const puppeteer = require("puppeteer");

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 100 indicating how well the candidate's profile matches the job describe",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Technical questions that can be asked in the interview along with their intention and how to answer them",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances",
          ),
      }),
    )
    .describe(
      "List of skill gaps in the candidate's profile along with their severity",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number in the preparation plan, starting from 1"),
        focus: z
          .string()
          .describe(
            "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc.",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.",
          ),
      }),
    )
    .describe(
      "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
    ),
  title: z
    .string()
    .describe(
      "The title of the job for which the interview report is generated",
    ),
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {

  const prompt = `
You are a strict JSON API.

Return ONLY valid JSON. Do NOT add explanation, markdown, or any text outside the JSON object.

You MUST return a JSON object with EXACTLY these top-level keys, and NO other keys:
matchScore, technicalQuestions, behavioralQuestions, skillGaps, preparationPlan, title

Do NOT use any other key names (no "candidateProfile", no "jobTitle", no "matchingSkills",
no "missingSkills", no "overallEvaluation" — ONLY the 6 keys listed above).

Here is the EXACT shape you must follow (this is a structural example, write your own content):

{
  "matchScore": 78,
  "technicalQuestions": [
    { "question": "...", "intention": "...", "answer": "..." },
    { "question": "...", "intention": "...", "answer": "..." }
  ],
  "behavioralQuestions": [
    { "question": "...", "intention": "...", "answer": "..." },
    { "question": "...", "intention": "...", "answer": "..." }
  ],
  "skillGaps": [
    { "skill": "...", "severity": "low" },
    { "skill": "...", "severity": "high" }
  ],
  "preparationPlan": [
    { "day": 1, "focus": "...", "tasks": ["...", "..."] },
    { "day": 2, "focus": "...", "tasks": ["...", "..."] }
  ],
  "title": "..."
}

STRICT RULES:
1. technicalQuestions: at least 5 objects, each with question, intention, answer (all strings).
2. behavioralQuestions: at least 4 objects, each with question, intention, answer (all strings).
   This must NOT be empty. Generate real behavioral/HR questions relevant to this job
   (teamwork, conflict resolution, leadership, handling pressure, past challenges).
3. skillGaps: at least 2 objects, each with skill (string) and severity (must be exactly
   one of: "low", "medium", "high").
4. preparationPlan: at least 5 objects, one per day, day numbers 1,2,3,4,5... increasing by 1.
   Each must have day (number), focus (string), tasks (array of at least 2 strings).
   This must cover MULTIPLE days, not just 1.
5. Never return arrays of plain strings like ["question", "...", "intention", "..."].
   Always return arrays of objects with the exact key names shown above.
6. Do not omit any of the 6 top-level keys. Do not add extra top-level keys.

Now generate the full JSON response using this candidate's actual details:

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      // responseSchema: zodToJsonSchema(interviewReportSchema, { $refStrategy: "none" }),
      maxOutputTokens: 8192,
    },
  });

  let parsed;

  try {
    parsed = JSON.parse(response.text);
  } catch (err) {
    console.log("JSON parse error:", err);

    // fallback (no crash)
    return getFallbackData();
  }

  // Tries to parse a value if it's a JSON-encoded string, otherwise returns it as-is.
  function tryParseJsonString(val) {
    if (typeof val !== "string") return val;
    const trimmed = val.trim();
    if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return val;
    try {
      return JSON.parse(trimmed);
    } catch {
      return val;
    }
  }

  function fixQuestions(arr) {
    if (!Array.isArray(arr)) return [];
    if (arr.length === 0) return [];

    // Case 2: array of stringified JSON objects -> parse each element first
    const parsedElements = arr.map(tryParseJsonString);

    // Case 1 (after parsing): already proper objects with the right keys
    if (
      parsedElements[0] !== null &&
      typeof parsedElements[0] === "object" &&
      !Array.isArray(parsedElements[0])
    ) {
      return parsedElements
        .filter((item) => item && typeof item === "object")
        .map((item) => ({
          question: item.question || "",
          intention: item.intention || "",
          answer: item.answer || "",
        }));
    }

    // Case 3: flat key/value array, e.g. ["question", "...", "intention", "...", "answer", "..."]
    const fixed = [];
    for (let i = 0; i < parsedElements.length; i += 6) {
      const chunk = parsedElements.slice(i, i + 6);
      // chunk looks like ["question", val, "intention", val, "answer", val]
      const obj = { question: "", intention: "", answer: "" };
      for (let j = 0; j < chunk.length - 1; j += 2) {
        const key = chunk[j];
        const value = chunk[j + 1];
        if (key === "question" || key === "intention" || key === "answer") {
          obj[key] = value || "";
        }
      }
      if (obj.question || obj.intention || obj.answer) {
        fixed.push(obj);
      }
    }

    return fixed;
  }

  function fixSkillGaps(arr) {
    if (!Array.isArray(arr)) return [];
    if (arr.length === 0) return [];

    const parsedElements = arr.map(tryParseJsonString);
    const validSeverities = ["low", "medium", "high"];

    // Case 1: already proper objects
    if (
      parsedElements[0] !== null &&
      typeof parsedElements[0] === "object" &&
      !Array.isArray(parsedElements[0])
    ) {
      return parsedElements
        .filter((item) => item && typeof item === "object")
        .map((item) => ({
          skill: item.skill || "",
          severity: validSeverities.includes(item.severity) ? item.severity : "medium",
        }));
    }

    // Case 4: plain string array, e.g. ["React.js", "Node.js", "TypeScript"]
    // Each string IS the skill name; we don't know severity, default to "medium".
    if (typeof parsedElements[0] === "string") {
      return parsedElements
        .filter((item) => typeof item === "string" && item.trim() !== "")
        .map((skill) => ({ skill, severity: "medium" }));
    }

    // Case 3: flat key/value array, e.g. ["skill", "...", "severity", "..."]
    const fixed = [];
    for (let i = 0; i < parsedElements.length; i += 4) {
      const chunk = parsedElements.slice(i, i + 4);
      const obj = { skill: "", severity: "medium" };
      for (let j = 0; j < chunk.length - 1; j += 2) {
        const key = chunk[j];
        const value = chunk[j + 1];
        if (key === "skill") obj.skill = value || "";
        if (key === "severity") obj.severity = validSeverities.includes(value) ? value : "medium";
      }
      if (obj.skill) fixed.push(obj);
    }

    return fixed;
  }

  function fixPreparation(arr) {
    if (!Array.isArray(arr)) return [];
    if (arr.length === 0) return [];

    const parsedElements = arr.map(tryParseJsonString);

    // Case 1: already proper objects
    if (
      parsedElements[0] !== null &&
      typeof parsedElements[0] === "object" &&
      !Array.isArray(parsedElements[0])
    ) {
      return parsedElements
        .filter((item) => item && typeof item === "object")
        .map((item, idx) => ({
          day: typeof item.day === "number" ? item.day : idx + 1,
          focus: item.focus || "",
          tasks: Array.isArray(item.tasks) ? item.tasks : [],
        }));
    }

    // Case 3: flat key/value array, e.g. ["day", 1, "focus", "...", "tasks", [...]]
    const fixed = [];
    for (let i = 0; i < parsedElements.length; i += 6) {
      const chunk = parsedElements.slice(i, i + 6);
      const obj = { day: fixed.length + 1, focus: "", tasks: [] };
      for (let j = 0; j < chunk.length - 1; j += 2) {
        const key = chunk[j];
        const value = chunk[j + 1];
        if (key === "day" && typeof value === "number") obj.day = value;
        if (key === "focus") obj.focus = value || "";
        if (key === "tasks") obj.tasks = Array.isArray(value) ? value : [];
      }
      if (obj.focus || obj.tasks.length > 0) fixed.push(obj);
    }

    return fixed;
  }

  // 🔥 repair apply
  parsed.technicalQuestions = fixQuestions(parsed.technicalQuestions);
  parsed.behavioralQuestions = fixQuestions(parsed.behavioralQuestions);
  parsed.skillGaps = fixSkillGaps(parsed.skillGaps);
  parsed.preparationPlan = fixPreparation(parsed.preparationPlan);

  
  let normalizedScore = parsed.matchScore ?? 60;
  if (typeof normalizedScore === "number" && normalizedScore > 0 && normalizedScore <= 1) {
    normalizedScore = normalizedScore * 100;
  }
  normalizedScore = Math.max(0, Math.min(100, normalizedScore));
  parsed.matchScore = normalizedScore;

  parsed.title = parsed.title ?? "Generated Interview Report";
  parsed.behavioralQuestions = parsed.behavioralQuestions ?? [];
  parsed.skillGaps = parsed.skillGaps ?? [];
  parsed.preparationPlan = parsed.preparationPlan ?? [];

  const result = interviewReportSchema.safeParse(parsed);

  if (!result.success) {
    console.log("ZOD ERROR:", JSON.stringify(result.error.format(), null, 2));
    return getFallbackData();
  }

  return result.data;
}


// fallback function
function getFallbackData() {
  return {
    matchScore: 60,
    technicalQuestions: [
      {
        question: "Explain your main project",
        intention: "Check practical knowledge",
        answer: "Describe architecture, tools and challenges",
      },
    ],
    behavioralQuestions: [
      {
        question: "Tell me about yourself",
        intention: "Check communication",
        answer: "Give structured intro",
      },
    ],
    skillGaps: [
      {
        skill: "Advanced backend",
        severity: "medium",
      },
    ],
    preparationPlan: [
      {
        day: 1,
        focus: "Basics revision",
        tasks: ["Revise core concepts"],
      },
    ],
    title: "Fallback Interview Report",
  };
}



async function generatePdfForHtml({ htmlContent }) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm",
    },
  });
  await browser.close();
  return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const resumePdfSchema = z.object({
    html: z
      .string()
      .describe(
        "The HTML content of the resume which can be converted to PDF using a library like html-pdf or puppeteer",
      ),
  });

  const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
                        

                           the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      // 🔥 FIX: same $refStrategy fix here — without it Gemini may not honor
      // the schema correctly and jsonContent.html can come back missing.
      responseSchema: zodToJsonSchema(resumePdfSchema, { $refStrategy: "none" }),
    },
  });

  const jsonContent = JSON.parse(response.text);
  const pdfBuffer = await generatePdfForHtml({ htmlContent: jsonContent.html });
  return pdfBuffer;
}

module.exports = { generateInterviewReport, generateResumePdf };