import axios from "axios";

export const fetchGitHubData = async (githubToken) => {
  const headers = { Authorization: `token ${githubToken}` };

  try {
    const [userRes, reposRes] = await Promise.all([
      axios.get("https://api.github.com/user", { headers }),
      axios.get("https://api.github.com/user/repos?sort=updated&per_page=50", {
        headers,
      }),
    ]);

    const user = userRes.data;
    const repos = reposRes.data;

    const languages = {};
    repos.forEach((repo) => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    return {
      username: user.login,
      name: user.name,
      bio: user.bio,
      location: user.location,
      followers: user.followers,
      following: user.following,
      public_repos: user.public_repos,
      created_at: user.created_at,
      top_languages: languages,
      recent_repos: repos.slice(0, 5).map((repo) => ({
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        updated_at: repo.updated_at,
      })),
    };
  } catch (error) {
    console.error("GitHub API Error:", error.response?.data || error.message);
    throw new Error("Failed to fetch GitHub data");
  }
};
