'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import Navigation from '../../components/Navigation';

const TestYourLLMPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    modelName: '',
    additionalInfo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Submit to HubSpot
      const response = await fetch('https://api.hsforms.com/submissions/v3/integration/submit/142247677/18a89213-f3ee-4252-a7cd-f252ab3caa98', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: [
            { name: 'firstname', value: formData.firstName },
            { name: 'lastname', value: formData.lastName },
            { name: 'email', value: formData.email },
            { name: 'model_name', value: formData.modelName },
            { name: 'additional_information', value: formData.additionalInfo }
          ],
          context: {
            pageUri: window.location.href,
            pageName: 'Test Your LLM'
          }
        })
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError('There was an error submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col bg-slate-50 min-h-screen">
      <Navigation />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Leaderboard
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Test Your Enterprise LLM</h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                Comprehensive assessment and benchmarking of your AI language models for safety, performance, and compliance in the Holistic AI Lab.</p>
              </div>

              {/* Why Test Your Enterprise LLM Section */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Test Your LLM?</h2>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-s">
                    Benchmark performance against industry standards for reasoning, mathematics, and coding
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-s">
                    Identify weaknesses and optimization opportunities</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-s">
                    Assess safety and risk exposure</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-s">
                    Check compliance with legal frameworks like the EU AI Act, NIST AI RMF, and more
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature Cards */}
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Safety First</h3>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Comprehensive safety evaluation and red teaming assessment
                  </p>
                </div>

                <div className="bg-purple-50 rounded-lg p-5 border border-purple-100">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Benchmark against industry standards for reasoning and capability
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Settings className="w-4 h-4 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Customized Tests</h3>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Tailored to your specific industry use cases and requirements
                  </p>
                </div>

                <div className="bg-yellow-50 rounded-lg p-5 border border-yellow-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-yellow-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Enterprise Ready</h3>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Focused on real-world business deployment scenarios
                  </p>
                </div>
              </div> */}
            </div>

            {/* Right Column - Custom Form */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Request for Red Teaming Audit</h2>
                <p className="text-gray-600 text-s">
                Use this form to request a red teaming assessment of your AI model.
                </p>
              </div>

              {/* Success Message */}
              {isSubmitted && (
                <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <h3 className="text-green-800 font-semibold">Thank you for your interest!</h3>
                      <p className="text-green-700 text-sm">We&apos;ll get back to you as soon as possible.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {submitError && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-sm">{submitError}</p>
                </div>
              )}

              {/* Custom Form */}
              {!isSubmitted && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* First Name and Last Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Enter your last name"
                    />
                  </div>
                </div>

                  {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                    onChange={handleInputChange}
                    required
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="your.email@company.com"
                  />
                </div>

                  {/* Model Name */}
                <div>
                    <label htmlFor="modelName" className="block text-sm font-medium text-gray-700 mb-2">
                      Model Name
                  </label>
                    <input
                      type="text"
                      id="modelName"
                      name="modelName"
                      value={formData.modelName}
                    onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="e.g., GPT-4, Claude-3, Custom Model"
                    />
                </div>

                  {/* Additional Information */}
                <div>
                    <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Information
                  </label>
                  <textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                    rows={4}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-vertical"
                      placeholder="Tell us about your specific testing requirements, use cases, or any other relevant information..."
                  />
                </div>

                  {/* Submit Button */}
                <button
                  type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg disabled:shadow-none transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-200 flex items-center justify-center space-x-2"
                >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                  <span>Submit Request</span>
                    )}
                </button>
                </form>
              )}

              <p className="text-xs text-gray-500 text-center mt-4 px-2">
                We&apos;d love to hear from you! Please fill out the form and we&apos;ll get back to you as soon as possible.
                </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestYourLLMPage; 