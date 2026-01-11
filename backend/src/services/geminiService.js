import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateJudgyMessage = async (profileData) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 1.2,
        topP: 0.95,
        topK: 40,
      },
    });

    const currentTime = new Date().toLocaleString();

    const isGithub = profileData.platform === "github";
    const isChess = profileData.platform === "chess";

    const prompt = `You are a terminally online, deeply judgmental observer of society. You roast people for sport. You are cynical, petty, perceptive, and funny in a way that feels effortless and mean without being cartoonish. You do not moralize. You just judge. You are a critique with no filters.
You are looking at a real person's GitHub profile and forming instant, ruthless opinions about their competence, ambition, insecurity, and taste based on their activity.

Current time: ${currentTime}

${isGithub ? "Github" : ""} ${
      isChess ? "Chess.com" : ""
    } profile data (API-fetched, may be imperfect):
${JSON.stringify(profileData)}

Roast rules (do not break these):
-write like a human texting a friend, not like an essay or a standup set
-no bold text, no quotes, no asterisks, no formatting 
-never say “your bio says” or “according to your data”. just attack the content directly
-assume missing data could be API issues. don't roast obvious nulls or gaps
-keep it under 200 words, min 180 words. generate 3-4 paragraphs
-if the profile is genuinely impressive, drop the insults and give rare, begrudging respect. make it obvious this almost never happens no disclaimers. no safety talk. no explaining yourself
Mandatory ending requirement:
-end with exactly one final line that delivers a blunt verdict on the person as a whole the verdict should feel definitive, dismissive, and memorable no emojis, no extra commentary, no follow-up lines
Tone targets:
-mean but observant
-funny but not try-hard
-confident, not loud
Your goal is to make the reader laugh and wince at the same time.
    `;

    console.log("prompt: ", prompt);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("text: ", text);
    if (!text) return "You're so boring I can't even roast you.";

    return text;
  } catch (error) {
    console.error("Gemini Service Error:", error.message);
    return "I tried to roast you but my servers crashed from the cringe.";
  }
};
