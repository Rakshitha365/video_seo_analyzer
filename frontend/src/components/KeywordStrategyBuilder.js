import React, { useState } from "react";

const KeywordStrategyBuilder = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [keywords, setKeywords] = useState(""); // Store seed keywords
  const [loading, setLoading] = useState(false);
  const [generatedKeywords, setGeneratedKeywords] = useState([]); // Store generated keywords
  const [keywordRanks, setKeywordRanks] = useState([]); // Store keyword ranks
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!videoFile) {
      setError("Please select a video file.");
      return;
    }

    if (!keywords.trim()) {
      setError("Please enter seed keywords.");
      return;
    }

    setLoading(true);
    setError("");
    setGeneratedKeywords([]);
    setKeywordRanks([]);

    const formData = new FormData();
    formData.append("file", videoFile);
    formData.append("seed_keywords", keywords);

    try {
      const response = await fetch(
        "http://localhost:8000/keywords-bart-seed-seo/",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        setGeneratedKeywords(result.keywords); // List of keywords
        setKeywordRanks(result.keyword_ranking || []); // List of keyword ranking objects
        alert("Keywords and ranks generated successfully!");
      } else {
        setError(result.error || "Failed to generate keywords and ranks.");
      }
    } catch (error) {
      console.error("Error during the request:", error);
      setError("An error occurred while processing the video.");
    }

    setLoading(false);
    setVideoFile(null);
    setKeywords("");
  };

  const handleLogout = () => {
    alert(
      "Logout functionality not implemented. Add token removal or navigation logic."
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md fixed w-full z-10 top-0">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between py-4 px-6">
          <div className="text-2xl font-bold text-blue-600">SEOgenie</div>
          <nav className="flex flex-wrap items-center space-x-4">
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-300"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-10">
        <section className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Plan Your Keyword Strategy
          </h2>
          <form
            onSubmit={handleSubmit}
            className="mt-6 bg-white shadow-lg rounded-lg p-8"
          >
            {/* Keyword input */}
            <div className="mb-4">
              <textarea
                className="w-full p-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter seed keywords separated by commas..."
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              ></textarea>
            </div>

            {/* File input */}
            <div className="mb-4">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-500 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Processing..." : "Submit Strategy"}
            </button>
          </form>

          {loading && (
            <p className="mt-4 text-yellow-600">
              Please wait while we process your video and keywords...
            </p>
          )}

          {error && <p className="mt-4 text-red-600">Error: {error}</p>}

          {/* Display generated keywords and ranks */}
          {keywordRanks.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Generated Keywords and Ranks:
              </h3>
              <ul className="mt-2 list-disc list-inside">
                {keywordRanks.map((item, index) => (
                  <li key={index} className="text-gray-700">
                    {item.keyword} - {item.normalized_score.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto text-center">
          <p>
            &copy; {new Date().getFullYear()} SEOgenie. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default KeywordStrategyBuilder;
