import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
import leetcodeLogo from "../assets/leetcodeLogo.svg";
import githubLogo from "../assets/githubLogo.svg";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(location.state?.initialData || null);
  const [loading, setLoading] = useState(!data);

  useEffect(() => {
    if (!data) {
      const fetchData = async () => {
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get("token");

        if (token) {
          localStorage.setItem("token", token);
        }

        const storedToken = localStorage.getItem("token");

        if (!storedToken) {
          navigate("/");
          return;
        }

        try {
          const res = await axios.get(`${SERVER_URL}/api/github`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          setData(res.data);
        } catch (err) {
          console.error(err);
          navigate("/");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [data, navigate]);

  if (loading)
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-cyan-500 font-mono">
        JUDGING YOU...
      </div>
    );

  if (!data) return null;

  const isGithub = data.platform == "github";
  const isChess = data.platform == "chess";
  const isLeetCode = data.platform == "leetcode";

  const platformLogo = isGithub
    ? githubLogo
    : isChess
    ? "https://www.chess.com/bundles/web/images/user-image.svg"
    : isLeetCode
    ? leetcodeLogo
    : "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";

  const themeColor = isGithub
    ? "cyan"
    : isChess
    ? "green"
    : isLeetCode
    ? "yellow"
    : "gray";

  const borderColor =
    themeColor === "cyan"
      ? "border-cyan-500"
      : themeColor === "green"
      ? "border-green-500"
      : themeColor === "yellow"
      ? "border-yellow-500"
      : "border-zinc-700";

  const textColor =
    themeColor === "cyan"
      ? "text-cyan-400"
      : themeColor === "green"
      ? "text-green-400"
      : themeColor === "yellow"
      ? "text-yellow-500"
      : "text-zinc-400";

  const terminalCommand = isGithub
    ? `./roast_cv.sh --target="${data.username}"`
    : isChess
    ? `./analyze_blunders.py --player="${data.username}"`
    : `./lame_leetcode.js --user="${data.username}"`;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-mono p-4 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-12 border-b border-zinc-800 pb-4">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            JUDGE<span className={textColor}>ME</span>
          </h1>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
            className="text-xs uppercase tracking-widest hover:text-white transition-colors"
          >
            Escape
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Col: Profile Stats */}
          <div className="space-y-6">
            <div
              className={`border ${borderColor} bg-zinc-900/50 p-6 relative overflow-hidden group`}
            >
              <div
                className={`absolute -top-10 -right-10 w-32 h-32 bg-${themeColor}-500/10 blur-3xl rounded-full pointer-events-none`}
              ></div>

              <div className="relative z-10">
                {/* UPDATED IMAGE TAG TO USE PLATFORM LOGO */}
                <img
                  src={platformLogo}
                  alt="Platform Logo"
                  className={`w-24 h-24 rounded-lg object-contain bg-white p-2 border-2 ${borderColor} mb-4 grayscale group-hover:grayscale-0 transition-all duration-500`}
                />
                <h2 className="text-xl font-bold text-white mb-1">
                  {data.name || data.username}
                </h2>
                <p className={`text-sm ${textColor} mb-6`}>
                  @{data.username || "unknown_entity"}
                </p>

                {/* GITHUB STATS */}
                {isGithub && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-zinc-500 block text-xs uppercase">
                        Repos
                      </span>
                      <span className="text-white font-bold text-lg">
                        {data.public_repos}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-xs uppercase">
                        Followers
                      </span>
                      <span className="text-white font-bold text-lg">
                        {data.followers}
                      </span>
                    </div>
                  </div>
                )}

                {/* CHESS STATS */}
                {isChess && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-zinc-500 block text-xs uppercase">
                        Blitz
                      </span>
                      <span className="text-white font-bold text-lg">
                        {data.blitz_rating || "Unrated"}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-xs uppercase">
                        Rapid
                      </span>
                      <span className="text-white font-bold text-lg">
                        {data.rapid_rating || "Unrated"}
                      </span>
                    </div>
                  </div>
                )}

                {/* LEETCODE STATS */}
                {isLeetCode && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-zinc-800 pb-2">
                      <span className="text-zinc-500 text-xs uppercase">
                        Ranking
                      </span>
                      <span className="text-white font-bold text-lg">
                        #{data.ranking || "N/A"}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-emerald-500">Easy</span>
                        <span className="text-zinc-400">
                          {data.solved?.easy}
                        </span>
                      </div>
                      {/* Simple Bar for Easy */}
                      <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500"
                          style={{
                            width: `${
                              (data.solved?.easy / data.solved?.total) * 100
                            }%`,
                          }}
                        ></div>
                      </div>

                      <div className="flex justify-between text-xs pt-1">
                        <span className="text-yellow-500">Medium</span>
                        <span className="text-zinc-400">
                          {data.solved?.medium}
                        </span>
                      </div>
                      <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-500"
                          style={{
                            width: `${
                              (data.solved?.medium / data.solved?.total) * 100
                            }%`,
                          }}
                        ></div>
                      </div>

                      <div className="flex justify-between text-xs pt-1">
                        <span className="text-rose-500">Hard</span>
                        <span className="text-zinc-400">
                          {data.solved?.hard}
                        </span>
                      </div>
                      <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-rose-500"
                          style={{
                            width: `${
                              (data.solved?.hard / data.solved?.total) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-center pt-2">
                      <span className="text-xs text-zinc-500 uppercase">
                        Total Solved
                      </span>
                      <div className="text-2xl font-bold text-white">
                        {data.solved?.total}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Meta Info */}
            <div className="p-4 border border-zinc-800 bg-zinc-900/20 text-xs text-zinc-500">
              <div className="flex justify-between mb-2">
                <span>JUDGMENT ID</span>
                <span className="font-mono text-zinc-400">#8F3A22</span>
              </div>
              <div className="flex justify-between">
                <span>DETECTED EGO</span>
                <span className="font-mono text-zinc-400">CRITICAL</span>
              </div>
            </div>
          </div>

          {/* Right Col: The Roast */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="border border-zinc-800 bg-black flex-grow flex flex-col relative">
              {/* Terminal Header */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <div className="text-xs text-zinc-500 font-mono">
                  root@judgeme-ai:~
                </div>
              </div>

              {/* Terminal Content */}
              <div className="p-6 md:p-10 font-mono text-sm md:text-base leading-relaxed overflow-y-auto">
                <div className="mb-6 opacity-50">
                  <span className="text-green-500">➜</span>{" "}
                  <span className="text-blue-400">~</span>{" "}
                  <span className="text-zinc-300">{terminalCommand}</span>
                  <div className="text-zinc-500 mt-1">
                    Analyzing profile data... [====================] 100%
                  </div>
                  <div className="text-zinc-500">
                    Loading cynicism module... Done.
                  </div>
                </div>

                <div className="whitespace-pre-wrap text-zinc-300 animate-typewriter">
                  {/* We split by paragraphs for cleaner spacing if desired, or just raw text */}
                  {data.roast}
                </div>

                <div className="mt-8 animate-pulse">
                  <span className="text-green-500">➜</span>{" "}
                  <span className="text-blue-400">~</span>{" "}
                  <span className="inline-block w-2 h-4 bg-zinc-500 ml-2 align-middle"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
