import React, { useState } from 'react';

const KeywordGeneration = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState([]); // Store generated keywords
  const [keywordRanks, setKeywordRanks] = useState([]); // Store keyword ranks
  const [error, setError] = useState(''); // Handle error messages
  const [message, setMessage] = useState(''); // Success message

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!videoFile) {
      alert('Please select a video file.');
      return;
    }

    setLoading(true);
    setError('');
    setKeywords([]);
    setKeywordRanks([]);
    setMessage('');

    const formData = new FormData();
    formData.append('file', videoFile);

    try {
      const response = await fetch('http://localhost:8000/keywords-bart/', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setKeywords(result.keywords);
        setKeywordRanks(result.ranks || []); // Set keyword ranks if available
        setMessage(result.message);
        alert('Keywords and ranks generated successfully!');
      } else {
        setError(result.error || 'Failed to generate keywords and ranks.');
      }
    } catch (error) {
      console.error('Error during the request:', error);
      setError('An error occurred while processing the video.');
    }

    setLoading(false);
    setVideoFile(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Keyword Generation</h1>
          <p className="mt-2 text-gray-600">Generate SEO keywords and ranks using AI-driven tools like BART.</p>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-10">
        <section className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">Input your video to generate keywords and ranks</h2>
          <form onSubmit={handleSubmit} className="mt-6">
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
              {loading ? 'Processing...' : 'Generate Keywords and Ranks'}
            </button>
          </form>

          {loading && <p className="mt-4 text-yellow-600">Please wait while we process your video...</p>}

          {error && <p className="mt-4 text-red-600">Error: {error}</p>}

          {message && <p className="mt-4 text-green-600">{message}</p>}

          {keywords.length > 0 && (
            <div className="mt-6 text-left">
              <h3 className="text-lg font-bold text-gray-800">Generated Keywords with Ranks:</h3>
              <ul className="list-disc list-inside text-gray-600">
                {keywords.map((keyword, index) => (
                  <li key={index} className="text-gray-700">
                    {keyword} 
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

export default KeywordGeneration;
