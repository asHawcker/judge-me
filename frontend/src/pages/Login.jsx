import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(null);
  const [chessUser, setChessUser] = useState("");
  const [leetcodeUser, setLeetcodeUser] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGithubLogin = () => {
    window.location.href = "http://localhost:5000/auth/github";
  };

  const handleChessJudge = async (e) => {
    e.preventDefault();
    if (!chessUser) return;

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/chess", {
        username: chessUser,
      });
      console.log("Navigating to dashboard with data:", res.data);
      navigate("/dashboard", {
        state: { initialData: res.data, type: "chess" },
      });
    } catch (err) {
      alert("User not found or Server Error");
      setLoading(false);
    }
  };

  const handleLeetCodeJudge = async (e) => {
    e.preventDefault();
    if (!leetcodeUser) return;

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/leetcode", {
        username: leetcodeUser,
      });
      navigate("/dashboard", {
        state: { initialData: res.data, type: "leetcode" },
      });
    } catch (err) {
      alert("User not found or Server Error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-gray-300 font-mono flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12 space-y-4">
        <h1
          className="text-5xl font-bold text-white tracking-tighter"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          JUDGE<span className="text-cyan-400">ME</span>
        </h1>
        <p className="text-zinc-500 tracking-widest uppercase text-sm">
          Select your battlefield
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
        <div
          onClick={() => setActiveTab("github")}
          className={`
            cursor-pointer p-8 border transition-all duration-300 relative overflow-hidden group
            ${
              activeTab === "github"
                ? "border-cyan-400 bg-cyan-400/5"
                : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"
            }
          `}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">GitHub</h2>
          <p className="text-zinc-500 text-sm mb-6">
            Judge my code quality, repo names, and lack of commits.
          </p>

          <button
            onClick={handleGithubLogin}
            className="w-full py-3 bg-zinc-800 hover:bg-white hover:text-black text-white font-bold uppercase tracking-widest transition-colors border border-zinc-700"
          >
            Login & Judge
          </button>
        </div>
        <div
          onClick={() => setActiveTab("chess")}
          className={`
            cursor-pointer p-8 border transition-all duration-300 relative overflow-hidden group
            ${
              activeTab === "chess"
                ? "border-green-500 bg-green-500/5"
                : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"
            }
          `}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-green-500">
            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 22H5a1 1 0 0 1 0-2h14a1 1 0 0 1 0 2zM12 2a4 4 0 0 1 4 4c0 2-1.5 3.5-3 4v2c2 0 5 1.5 5 5v1H6v-1c0-3.5 3-5 5-5v-2c-1.5-.5-3-2-3-4a4 4 0 0 1 4-4z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Chess.com</h2>
          <p className="text-zinc-500 text-sm mb-6">
            Judge my blitz rating, puzzle fails, and rapid blunders.
          </p>

          {activeTab === "chess" ? (
            <form
              onSubmit={handleChessJudge}
              className="flex gap-2 animate-fade-in"
            >
              <input
                autoFocus
                type="text"
                placeholder="Username (e.g. Hikaru)"
                className="bg-zinc-950 border border-green-500/30 text-white p-3 w-full focus:outline-none focus:border-green-500"
                value={chessUser}
                onChange={(e) => setChessUser(e.target.value)}
              />
              <button
                disabled={loading}
                className="bg-green-600 text-white px-6 font-bold hover:bg-green-500"
              >
                {loading ? "..." : "GO"}
              </button>
            </form>
          ) : (
            <div className="w-full py-3 text-center text-zinc-500 border border-zinc-800 uppercase tracking-widest text-sm">
              Select to Enter
            </div>
          )}
        </div>
        <div
          onClick={() => setActiveTab("leetcode")}
          className={`
            cursor-pointer p-8 border transition-all duration-300 relative overflow-hidden group
            ${
              activeTab === "leetcode"
                ? "border-yellow-500 bg-yellow-500/5"
                : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"
            }
          `}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-yellow-500">
            {/* Simple LeetCode-ish Icon */}
            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.055 5.055 0 0 0-2.445-1.337l2.467-2.503c.516-.514.498-1.366-.037-1.901-.535-.535-1.387-.552-1.902-.038l-10.1 10.101c-.981.982-1.494 2.337-1.494 3.835 0 1.498.513 2.895 1.494 3.875l4.347 4.361c.981.979 2.337 1.452 3.834 1.452s2.853-.512 3.835-1.494l2.609-2.637c.514-.514.496-1.365-.039-1.9s-1.386-.553-1.899-.039z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">LeetCode</h2>
          <p className="text-zinc-500 text-sm mb-6">
            Judge my acceptance rate and inability to center a div.
          </p>

          {activeTab === "leetcode" ? (
            <form
              onSubmit={handleLeetCodeJudge}
              className="flex gap-2 animate-fade-in"
            >
              <input
                autoFocus
                type="text"
                placeholder="Username"
                className="bg-zinc-950 border border-yellow-500/30 text-white p-3 w-full focus:outline-none focus:border-yellow-500"
                value={leetcodeUser}
                onChange={(e) => setLeetcodeUser(e.target.value)}
              />
              <button
                disabled={loading}
                className="bg-yellow-600 text-black px-6 font-bold hover:bg-yellow-500"
              >
                {loading ? "..." : "GO"}
              </button>
            </form>
          ) : (
            <div className="w-full py-3 text-center text-zinc-500 border border-zinc-800 uppercase tracking-widest text-sm">
              Select to Enter
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
