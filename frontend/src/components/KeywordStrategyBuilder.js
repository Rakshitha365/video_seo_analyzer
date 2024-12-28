import React, { useState } from "react";

const KeywordStrategyBuilder = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [keywordRanks, setKeywordRanks] = useState([]);
  const [wikidataKeywords, setWikidataKeywords] = useState({});
  const [associatedScores, setAssociatedScores] = useState({});
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const calculateAssociatedScores = (keywordRanks, wikidataKeywords) => {
    const scores = {};
    keywordRanks.forEach(({ keyword, normalized_score }) => {
      if (wikidataKeywords[keyword]) {
        const associations = wikidataKeywords[keyword];
        const share = normalized_score / associations.length;
        associations.forEach((assoc) => {
          scores[assoc] = (scores[assoc] || 0) + share; // Accumulate scores
        });
      }
    });
    return scores;
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
    setAssociatedScores({});

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
        setKeywordRanks(result.keyword_ranking || []);
        setWikidataKeywords(result.wikidata_keywords || {});
        const scores = calculateAssociatedScores(
          result.keyword_ranking,
          result.wikidata_keywords
        );
        setAssociatedScores(scores);
        alert("Keywords, ranks, and associated scores generated successfully!");
      } else {
        setError(
          result.error || "Failed to generate keywords and associations."
        );
      }
    } catch (error) {
      console.error("Error during the request:", error);
      setError("An error occurred while processing the video.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow-md fixed w-full z-10 top-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
          <div className="text-2xl font-bold text-blue-600">SEOgenie</div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-10 pt-16">
        <section className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Keyword Strategy Builder
          </h2>
          <form
            onSubmit={handleSubmit}
            className="mt-6 bg-white shadow-lg rounded-lg p-8"
          >
            <div className="mb-4">
              <textarea
                className="w-full p-4 border rounded-md"
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
                className="w-full border p-2 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg"
              disabled={loading}
            >
              {loading ? "Processing..." : "Submit Strategy"}
            </button>
          </form>
          {error && <p className="mt-4 text-red-600">{error}</p>}
          {keywordRanks.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Keyword Rankings:
              </h3>
              <ul className="mt-2 list-disc list-inside">
                {keywordRanks.map((item, index) => (
                  <li key={index}>
                    {item.keyword} - {item.normalized_score.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {Object.keys(wikidataKeywords).length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Associated keywords with Scores:
              </h3>
              <ul className="mt-2 list-disc list-inside">
                {Object.entries(wikidataKeywords).map(
                  ([keyword, associations], index) => (
                    <li key={index} className="text-gray-700">
                      <strong>{keyword}</strong>
                      <ul>
                        {associations.map((association, idx) => (
                          <li key={idx} className="text-gray-600">
                            - {association}-
                            {associatedScores[association].toFixed(2) || "N/A"}
                          </li>
                        ))}
                      </ul>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}{" "}
        </section>
      </main>
    </div>
  );
};

export default KeywordStrategyBuilder;
