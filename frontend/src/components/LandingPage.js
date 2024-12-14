import React from "react";

const LandingPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-blue-50 py-16 px-8">
        <div className="container mx-auto flex flex-col lg:flex-row items-center">
          <div className="text-center lg:text-left lg:w-1/2">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Increase your website traffic with us!
            </h1>
            <p className="text-gray-600 mb-6">
              Maximize your website traffic with our modern SEO strategies and
              innovative solutions to take your business to the next level.
            </p>
            <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg">
              Learn More
            </button>
          </div>
          <div className="lg:w-1/2 mt-8 lg:mt-0">
            <img
              src="https://via.placeholder.com/500x350"
              alt="Website Traffic"
              className="mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">
            We provide the best services
          </h2>
        </div>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
          {/* SEO Management */}
          <div className="p-6 bg-gray-50 shadow-lg rounded-lg text-center">
            <div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-chart-line text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              SEO Management
            </h3>
            <p className="text-gray-600">
              Maximize your website traffic with our top-notch SEO strategies.
            </p>
          </div>

          {/* Email Marketing */}
          <div className="p-6 bg-gray-50 shadow-lg rounded-lg text-center">
            <div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-envelope text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Email Marketing
            </h3>
            <p className="text-gray-600">
              Connect with your audience through effective email campaigns.
            </p>
          </div>

          {/* Social Media Promotion */}
          <div className="p-6 bg-gray-50 shadow-lg rounded-lg text-center">
            <div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-share-alt text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Social Media Promotion
            </h3>
            <p className="text-gray-600">
              Boost your brand visibility on social platforms effectively.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50 px-8">
        <div className="container mx-auto flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <img
              src="https://via.placeholder.com/500x350"
              alt="About Us"
              className="mx-auto"
            />
          </div>
          <div className="lg:w-1/2 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              We create success for your future
            </h2>
            <p className="text-gray-600 mb-6">
              Our team delivers innovative solutions to grow your online
              presence and help you achieve measurable results.
            </p>
            <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-blue-500 text-white text-center">
        <div className="container mx-auto grid grid-cols-3 gap-8 px-8">
          <div>
            <h3 className="text-4xl font-bold">11k</h3>
            <p className="text-lg">Happy Clients</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold">300+</h3>
            <p className="text-lg">Team Members</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold">60+</h3>
            <p className="text-lg">Countries</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
