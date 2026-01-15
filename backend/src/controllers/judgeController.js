import { fetchGitHubData } from "../services/githubService.js";
import { fetchChessData } from "../services/chessComService.js";
import { generateJudgyMessage } from "../services/geminiService.js";
import { fetchLeetCodeData } from "../services/leetcodeService.js";

export const judgeGithub = async (req, res) => {
  try {
    const { githubToken } = req.user;

    const profileData = await fetchGitHubData(githubToken);

    const roast = await generateJudgyMessage({
      ...profileData,
      platform: "github",
    });

    res.json({ ...profileData, roast, platform: "github" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const judgeChess = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: "Username required" });

    const chessData = await fetchChessData(username);

    if (chessData.error)
      return res.status(404).json({ error: "User not found" });

    const roast = await generateJudgyMessage({
      ...chessData,
      platform: "chess",
    });

    res.json({ ...chessData, roast, platform: "chess" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const judgeLeetCode = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: "Username required" });

    const leetData = await fetchLeetCodeData(username);

    if (leetData.error)
      return res.status(404).json({ error: "User not found" });

    const roast = await generateJudgyMessage({
      ...leetData,
      platform: "leetcode",
    });

    res.json({ ...leetData, roast });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
