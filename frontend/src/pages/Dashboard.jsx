import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const hasFetched = useRef(false);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (hasFetched.current) return;

    if (location.state?.initialData) {
      console.log(location.state);
      setData(location.state.initialData);
      setLoading(false);
      hasFetched.current = true;
      return;
    }

    const urlToken = searchParams.get("token");
    let token = localStorage.getItem("judgeMeToken");

    if (urlToken) {
      localStorage.setItem("judgeMeToken", urlToken);
      token = urlToken;
      window.history.replaceState({}, document.title, "/dashboard");
    }

    if (!token) return navigate("/");

    hasFetched.current = true;

    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/github", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
      } catch (err) {
        setError("Connection severed.");
        if (err.response?.status === 401) {
          localStorage.removeItem("judgeMeToken");
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams, navigate, location.state]);
  console.log(data);
  const isChess = data?.platform === "chess";

  const avatarUrl = isChess
    ? "https://www.chess.com/bundles/web/images/user-image.svg"
    : data?.avatar_url || "https://github.com/github.png";

  const terminalCommand = isChess
    ? `./analyze_game.sh --player="${data?.username}"`
    : `./judge_user.sh --target="${data?.username}"`;

  if (loading)
    return (
      <div className="min-h-screen bg-zinc-950 text-cyan-400 font-mono flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-zinc-800 border-t-cyan-400 rounded-full animate-spin"></div>
          <p className="animate-pulse tracking-widest text-xs uppercase">
            Establishing Uplink...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-red-500 font-mono">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-950 text-gray-300 font-mono p-4 md:p-8 selection:bg-cyan-400 selection:text-black">
      <nav className="flex justify-between items-center mb-12 border-b border-zinc-800 pb-4">
        <div
          className="text-xl font-bold text-white tracking-tighter"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          JUDGE<span className="text-cyan-400">ME</span>
          <span className="text-xs text-zinc-600 ml-2 uppercase">
            [{isChess ? "CHESS" : "GITHUB"}_MODE]
          </span>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("judgeMeToken");
            navigate("/");
          }}
          className="text-xs text-zinc-500 hover:text-cyan-400 transition-colors uppercase tracking-widest"
        >
          [ Exit System ]
        </button>
      </nav>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 relative overflow-hidden group hover:border-cyan-400/50 transition-colors">
            <div className="flex items-center gap-4">
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-16 h-16 rounded grayscale group-hover:grayscale-0 transition-all duration-500 border border-zinc-700 bg-zinc-800"
              />
              <div>
                <h2 className="text-white text-lg font-bold">
                  {data.name || data.username}
                </h2>
                <p className="text-cyan-400 text-sm">@{data.username}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-zinc-800">
              {isChess ? (
                <>
                  <div>
                    <span className="text-xs text-zinc-500 uppercase block">
                      Blitz
                    </span>
                    <span className="text-xl text-white font-bold">
                      {data.blitz_rating || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-500 uppercase block">
                      Rapid
                    </span>
                    <span className="text-xl text-white font-bold">
                      {data.rapid_rating || "N/A"}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-xs text-zinc-500 uppercase block">
                      Followers
                    </span>
                    <span className="text-xl text-white font-bold">
                      {data.followers}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-500 uppercase block">
                      Repos
                    </span>
                    <span className="text-xl text-white font-bold">
                      {data.public_repos}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6">
            <h3 className="text-xs text-zinc-500 uppercase mb-4 tracking-widest">
              {isChess ? "Tactical Prowess" : "Tech Stack"}
            </h3>

            {isChess ? (
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-sm">Puzzle Rating</span>
                <span className="text-cyan-400 font-bold">
                  {data.puzzle_rating || "Unrated"}
                </span>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {Object.keys(data.top_languages || {}).map((lang) => (
                  <span
                    key={lang}
                    className="px-3 py-1 text-xs border border-zinc-700 text-zinc-400 hover:text-cyan-400 hover:border-cyan-400 transition-colors cursor-default"
                  >
                    {lang}
                  </span>
                ))}
                {Object.keys(data.top_languages || {}).length === 0 && (
                  <span className="text-xs text-zinc-600">No Code Found</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="h-full bg-black border border-zinc-800 p-1 shadow-[0_0_15px_rgba(34,211,238,0.1)] flex flex-col">
            <div className="bg-zinc-900 px-4 py-2 flex items-center gap-2 border-b border-zinc-800">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              <span className="ml-2 text-xs text-zinc-600 font-mono">
                gemini-1.5-flash — bash
              </span>
            </div>

            <div className="flex-1 p-6 font-mono text-sm md:text-base leading-relaxed overflow-y-auto">
              <span className="text-green-500">root@gemini</span>
              <span className="text-zinc-500">:</span>
              <span className="text-blue-500">~</span>
              <span className="text-zinc-500">$</span>
              <span className="text-zinc-300 ml-2">{terminalCommand}</span>

              <div className="mt-4 text-cyan-400/90 whitespace-pre-line">
                {">"}{" "}
                {data.roast ||
                  "AI is bored. Pay for my API cost bro. I can only do this much in free tier. Mail me I'll send you UPI details."}{" "}
                <span className="animate-pulse inline-block w-2 h-4 bg-cyan-400 align-middle ml-1"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
