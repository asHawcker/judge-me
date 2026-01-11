import axios from "axios";

export const fetchChessData = async (username) => {
  if (!username) return null;

  try {
    const response = await axios.get(
      `https://api.chess.com/pub/player/${username}/stats`
    );
    const stats = response.data;

    return {
      username: username,
      rapid_rating: stats.chess_rapid?.last?.rating || "Unrated",
      blitz_rating: stats.chess_blitz?.last?.rating || "Unrated",
      bullet_rating: stats.chess_bullet?.last?.rating || "Unrated",
      puzzle_rating: stats.tactics?.highest?.rating || "Unrated",
    };
  } catch (error) {
    console.error(`Chess.com Error for ${username}:`, error.message);
    return { error: "User not found or API error" };
  }
};
