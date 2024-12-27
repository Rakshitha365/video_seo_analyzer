import React, { useState } from "react";

const KeywordStrategyBuilder = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [keywords, setKeywords] = useState(""); // Seed keywords
  const [loading, setLoading] = useState(false);
  const [keywordRanks, setKeywordRanks] = useState([]); // Keyword ranks
  const [wikidataKeywords, setWikidataKeywords] = useState({}); // Wikidata keywords as an object
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const calculateAssociatedScores = (keywordRanks, wikidataKeywords) => {
    const associatedScores = {};
    keywordRanks.forEach(({ keyword, normalized_score }) => {
      if (wikidataKeywords[keyword]) {
        const associations = wikidataKeywords[keyword];
        const share = normalized_score / associations.length;
        associations.forEach((assoc) => {
          associatedScores[assoc] = share.toFixed(2); // Round to 2 decimals
        });
      }
    });
    return associatedScores;
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
    setKeywordRanks([]);
    setWikidataKeywords({});

    const formData = new FormData();
    formData.append("file", videoFile);
    formData.append("seed_keywords", keywords);

    try {
      const response = await fetch("http://localhost:8000/keywords-bart-seed-seo/", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setKeywordRanks(result.keyword_ranking || []);
        setWikidataKeywords(result.wikidata_keywords || {});
        alert("Keywords, ranks, and Wikidata associations generated successfully!");
      } else {
        setError(result.error || "Failed to generate keywords, ranks, and Wikidata associations.");
      }
    } catch (error) {
      console.error("Error during the request:", error);
      setError("An error occurred while processing the video.");
    }

    setLoading(false);
    setVideoFile(null);
    setKeywords("");
  };

  const associatedScores = calculateAssociatedScores(keywordRanks, wikidataKeywords);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Keyword Strategy Builder</h1>
          <p className="mt-2 text-gray-600">
            Build a strong SEO strategy by analyzing keyword performance with seed keywords.
          </p>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-10">
        <section className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">Plan Your Keyword Strategy</h2>
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="mb-4">
              <textarea
                className="w-full p-4 border border-gray-300 rounded-md mb-4"
                placeholder="Enter seed keywords separated by commas..."
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              ></textarea>
            </div>
            <div className="mb-4">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
            <button
              type="submit"
              className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-500"
              disabled={loading}
            >
              {loading ? "Processing..." : "Submit Strategy"}
            </button>
          </form>

          {loading && (
            <p className="mt-4 text-yellow-600">Please wait while we process your video and keywords...</p>
          )}

          {error && <p className="mt-4 text-red-600">Error: {error}</p>}

          {/* Keyword Ranks Display */}
          {keywordRanks.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800">Keyword Ranks:</h3>
              <ul className="mt-2 list-disc list-inside">
                {keywordRanks.map((item, index) => (
                  <li key={index} className="text-gray-700">
                    {item.keyword} - {item.normalized_score.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Wikidata Keywords Display with Associated Scores */}
          {Object.keys(wikidataKeywords).length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800">Associated keywords with Scores:</h3>
              <ul className="mt-2 list-disc list-inside">
                {Object.entries(wikidataKeywords).map(([keyword, associations], index) => (
                  <li key={index} className="text-gray-700">
                    <strong>{keyword}</strong>
                    <ul>
                      {associations.map((association, idx) => (
                        <li key={idx} className="text-gray-600">
                          - {association}-{associatedScores[association] || "N/A"}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </main>

      <footer className="bg-gray-800 py-6">
        <div className="container mx-auto text-center text-gray-300">
          <p>&copy; 2024 SEO Video Processing. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default KeywordStrategyBuilder;
