import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


/* Main Landing Page Component */
const LandingPage = () => {
  return (
    <div className="bg-gray-100">
      {/* Header */}
      <Header />

      {/* Top Section */}
      <TopSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

const Header = () => {
  const scrollToSection = (id, duration = 1000) => {
    const target = document.getElementById(id);
    if (!target) return;

    const start = window.scrollY;
    const end = target.getBoundingClientRect().top + window.scrollY;
    const startTime = performance.now();

    const easeInOutQuad = (t) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const scroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeInOutQuad(progress);
      const scrollPos = start + (end - start) * ease;

      window.scrollTo(0, scrollPos);

      if (progress < 1) {
        requestAnimationFrame(scroll);
      }
    };

    requestAnimationFrame(scroll);
  };

  return (
    <header className="bg-white shadow-md fixed w-full z-10 top-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        <div className="text-2xl font-bold text-blue-600">SEOgenie</div>
        <nav className="flex space-x-4">
          <button
            onClick={() => scrollToSection("features")}
            className="text-gray-600 hover:text-blue-600"
          >
            Key Features
          </button>
          <button
            onClick={() => scrollToSection("how-it-works")}
            className="text-gray-600 hover:text-blue-600"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection("pricing")}
            className="text-gray-600 hover:text-blue-600"
          >
            Choose Your Plan
          </button>
        </nav>
      </div>
    </header>
  );
};




/* Top Section */
const TopSection = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      navigate("/keyword-strategy-builder");
    }
  };
  return (
  <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20 px-6 mt-16">
    <div className="max-w-7xl mx-auto text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
        Optimize Your Video SEO with AI-Powered Insights
      </h1>
      <p className="text-lg md:text-xl mb-8">
        Generate AI-driven SEO keywords, hashtags, and performance analytics for
        better video rankings.
      </p>
      <div>
        <button className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-300 transform hover:bg-gray-200 hover:shadow-lg hover:scale-110 mr-4"
        onClick={handleGetStarted}>
          Get Started for Free
        </button>
        <button className="bg-indigo-700 text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-300 transform hover:bg-indigo-800 hover:shadow-lg hover:scale-110">
          Explore Premium Plans
        </button>
      </div>
    </div>
  </section>
  )
};

/* Features Section */
const FeaturesSection = () => (
  <section id="features" className="py-20 px-6">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  </section>
);

/* Dynamic How It Works Section */
const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(null);

  return (
    <section id="how-it-works" className="bg-gray-200 py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {howItWorksSteps.map((step, index) => (
            <div
              key={index}
              onMouseEnter={() => setActiveStep(index)}
              onMouseLeave={() => setActiveStep(null)}
              className="relative bg-white shadow-lg rounded-lg p-6 text-center overflow-hidden transition-transform duration-300 hover:scale-105"
            >
              {/* Default Content */}
              <div className="flex flex-col items-center">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold mb-2">
                  {index + 1}. {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>

              {/* Hover Content */}
              {activeStep === index && (
                <div className="absolute inset-0 bg-white flex flex-col items-center justify-center rounded-lg transition-all duration-300">
                  <p className="text-gray-700 text-sm mb-4">
                    {step.hoverDetails}
                  </p>
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-32 h-32 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* Pricing Section */
const PricingSection = () => (
  <section id="pricing" className="py-20 px-6">
    <div className="max-w-7xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-12">Choose Your Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {pricingPlans.map((plan, index) => (
          <PlanCard key={index} plan={plan} />
        ))}
      </div>
    </div>
  </section>
);

/* Footer */
const Footer = () => (
  <footer className="bg-gray-800 text-white py-6">
    <div className="max-w-7xl mx-auto text-center">
      <p>&copy; {new Date().getFullYear()} SEOgenie. All rights reserved.</p>
    </div>
  </footer>
);

/* Reusable Components */
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 text-center">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const PlanCard = ({ plan }) => (
  <div className="relative bg-white shadow-lg rounded-lg p-6 text-center border-2 border-transparent hover:border-indigo-500 transform transition-transform duration-300 hover:scale-105">
    <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
    <p className="text-gray-600 mb-6">{plan.description}</p>
    <ul className="text-left pl-10 mb-6">
      {plan.features.map((feature, idx) => (
        <li key={idx} className="flex items-start mb-2">
          <span className="text-blue-600 mr-4">✔</span>
          <p>{feature}</p>
        </li>
      ))}
    </ul>
    <div className="text-4xl font-extrabold mb-6">
      {plan.price === 0 ? "Free" : `$${plan.price}/mo`}
    </div>
    <button className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-full transition-transform duration-300 hover:bg-blue-700 hover:shadow-lg transform hover:scale-110">
      {plan.buttonText}
    </button>
  </div>
);


/* Data */
const features = [
  {
    icon: "🔍",
    title: "AI-Driven Keywords",
    description: "Optimized suggestions.",
  },
  {
    icon: "📊",
    title: "Real-Time Insights",
    description: "Track performance.",
  },
  {
    icon: "⚙️",
    title: "Competitor Analysis",
    description: "Compare and grow.",
  },
];

const howItWorksSteps = [
  {
    title: "Video Upload",
    description: "Upload videos and start the SEO workflow.",
    hoverDetails: "Drag and drop videos or upload directly from your device.",
    image: "https://via.placeholder.com/150", // Replace with actual images
  },
  {
    title: "Audio Extraction",
    description: "Extract audio using MoviePy.",
    hoverDetails: "MoviePy seamlessly extracts audio for analysis.",
    image: "https://via.placeholder.com/150",
  },
  {
    title: "Speech to Text",
    description: "Convert audio to text with speech recognition.",
    hoverDetails: "Advanced recognition models convert speech into text.",
    image: "https://via.placeholder.com/150",
  },
  {
    title: "Keyword Generation",
    description: "Generate keywords using KeyBERT.",
    hoverDetails: "KeyBERT generates optimized keywords tailored to content.",
    image: "https://via.placeholder.com/150",
  },
  {
    title: "Text Summarization",
    description: "Summarize content using LLaMA or BART.",
    hoverDetails: "AI models provide concise and accurate summaries.",
    image: "https://via.placeholder.com/150",
  },
  {
    title: "SEO Ranking",
    description: "Rank keywords with YouTube API insights.",
    hoverDetails: "Track and rank keywords for SEO performance.",
    image: "https://via.placeholder.com/150",
  },
];

const pricingPlans = [
  {
    name: "Free",
    description: "Basic tools.",
    price: 0,
    buttonText: "Get Started",
    features: [
      "Limited features (e.g., limited uploads per day).",
      "Basic keyword suggestions tailored to general SEO needs.",
      "Ad-supported experience.",
    ],
  },
  {
    name: "Premium",
    description: "Advanced tools.",
    price: 3,
    buttonText: "Upgrade Now",
    features: [
      "Unlimited uploads with faster keyword generation.",
      "Advanced keyword suggestions, including long-tail keywords.",
      "Priority support and an ad-free experience.",
    ],
  },
];

export default LandingPage;
