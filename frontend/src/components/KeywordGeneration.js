import React, { useState } from "react";

const KeywordGeneration = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState([]); // Store generated keywords
  const [keywordRanks, setKeywordRanks] = useState([]); // Store keyword ranks
  const [error, setError] = useState(""); // Handle error messages
  const [message, setMessage] = useState(""); // Success message

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!videoFile) {
      alert("Please select a video file.");
      return;
    }

    setLoading(true);
    setError("");
    setKeywords([]);
    setKeywordRanks([]);
    setMessage("");

    const formData = new FormData();
    formData.append("file", videoFile);

    try {
      const response = await fetch("http://localhost:8000/keywords-bart/", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setKeywords(result.keywords);
        setKeywordRanks(result.ranks || []); // Set keyword ranks if available
        setMessage(result.message);
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
  };

  const handleLogout = () => {
    alert(
      "Logout functionality not implemented. Add token removal or navigation logic."
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
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

      {/* Main Section */}
      <main className="flex-grow container mx-auto px-4 py-20">
        <section className="text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Input Your Video
          </h2>
          <p className="text-gray-600 mb-8">
            Upload a video to generate keywords and ranks for optimized SEO.
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-lg rounded-lg p-8 max-w-2xl mx-auto transition duration-300 hover:shadow-xl"
          >
            <div className="mb-6">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className={`mt-4 px-6 py-3 font-semibold rounded-lg shadow-md transition-all duration-300 transform 
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105"
                }`}
              disabled={loading}
            >
              {loading ? "Processing..." : "Generate Keywords and Ranks"}
            </button>
          </form>

          {/* Loading Message */}
          {loading && (
            <p className="mt-4 text-yellow-600 animate-pulse">
              Please wait while we process your video...
            </p>
          )}

          {/* Error Message */}
          {error && (
            <p className="mt-4 text-red-600 font-semibold">Error: {error}</p>
          )}

          {/* Success Message */}
          {message && (
            <p className="mt-4 text-green-600 font-semibold">{message}</p>
          )}

          {/* Display Keywords */}
          {keywords.length > 0 && (
            <div className="mt-10 text-left bg-gray-50 rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Generated Keywords with Ranks:
              </h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                {keywords.map((keyword, index) => (
                  <li
                    key={index}
                    className="hover:text-blue-600 transition duration-200"
                  >
                    {keyword}{" "}
                    {keywordRanks[index]
                      ? `(Rank: ${keywordRanks[index]})`
                      : ""}
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

export default KeywordGeneration;
