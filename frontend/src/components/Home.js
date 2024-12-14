// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">SEO Video Processing</h1>
          <p className="mt-2 text-gray-600">Automate your SEO with video, keyword extraction, and ranking strategies.</p>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-10">
        <section className="text-center mb-10">
          <h2 className="text-2xl font-semibold text-gray-800">Workflow Overview</h2>
          <p className="mt-4 text-gray-600">Leverage AI and automation tools to process video data, generate keywords, and optimize SEO rankings.</p>
        </section>

        {/* Add navigation buttons to other pages */}
        <div className="text-center">
          <Link to="/keyword-generation">
            <button className="mx-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-500">
              Keyword Generation
            </button>
          </Link>
          <Link to="/keyword-strategy-builder">
            <button className="mx-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-500">
              Keyword Strategy Builder
            </button>
          </Link>
        </div>
      </main>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10">
        {/* <section className="text-center mb-10">
          <h2 className="text-2xl font-semibold text-gray-800">Workflow Overview</h2>
          <p className="mt-4 text-gray-600">Leverage AI and automation tools to process video data, generate keywords, and optimize SEO rankings.</p>
        </section> */}

        {/* Steps Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-800">1. Video Upload</h3>
            <p className="mt-2 text-gray-600">Upload videos from your platform and start the SEO workflow.</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-800">2. Audio Extraction</h3>
            <p className="mt-2 text-gray-600">Extract audio from video using MoviePy for further transcription.</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-800">3. Speech to Text</h3>
            <p className="mt-2 text-gray-600">Convert audio into text using speech recognition technologies.</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-800">4. Keyword Generation</h3>
            <p className="mt-2 text-gray-600">Extract keywords using KeyBERT to power SEO optimization.</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-800">5. Text Summarization</h3>
            <p className="mt-2 text-gray-600">Summarize content using advanced LLMs like LLaMA or BART.</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-800">6. SEO Ranking</h3>
            <p className="mt-2 text-gray-600">Analyze and rank keywords using YouTube API data for better SEO.</p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center mt-16">
          <h2 className="text-2xl font-bold text-gray-800">Ready to optimize your SEO?</h2>
          <button className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-500">
            Get Started
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-6 mt-16">
        <div className="container mx-auto text-center text-gray-300">
          <p>&copy; 2024 SEO Video Processing. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

