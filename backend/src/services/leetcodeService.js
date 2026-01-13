import axios from "axios";

export const fetchLeetCodeData = async (username) => {
  try {
    const query = `
      query userPublicProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            realName
            ranking
            reputation
            countryName
          }
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
        }
      }
    `;

    const response = await axios.post("https://leetcode.com/graphql", {
      query,
      variables: { username },
    });

    const data = response.data.data.matchedUser;

    if (!data) {
      return { error: "User not found" };
    }

    return {
      username: data.username,
      realName: data.profile.realName,
      ranking: data.profile.ranking,
      reputation: data.profile.reputation,
      country: data.profile.countryName,
      solved: {
        easy:
          data.submitStats.acSubmissionNum.find((s) => s.difficulty === "Easy")
            ?.count || 0,
        medium:
          data.submitStats.acSubmissionNum.find(
            (s) => s.difficulty === "Medium"
          )?.count || 0,
        hard:
          data.submitStats.acSubmissionNum.find((s) => s.difficulty === "Hard")
            ?.count || 0,
        total:
          data.submitStats.acSubmissionNum.find((s) => s.difficulty === "All")
            ?.count || 0,
      },
      platform: "leetcode",
    };
  } catch (error) {
    console.error("LeetCode API Error:", error.message);
    throw new Error("Failed to fetch LeetCode data");
  }
};
