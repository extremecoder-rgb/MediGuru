"use client";

import React, { useState } from "react";
import { Brain, Dna, Heart, Stethoscope, ChevronRight, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useClerk } from "@clerk/nextjs";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}

function Page() {
  const { redirectToSignIn } = useClerk();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleGetStarted = () => {
    redirectToSignIn({ redirectUrl: "/dashboard" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <>
    {/* Chatbot image at bottom right */}
    <div className="absolute top-0 left=0">
  <img
    src="/chatbot.png"
    alt="logo"
    className="w-36 h-26 md:w-82 md:h-82 cursor-pointer  drop-shadow-lg"
  />
</div>

    
      <div className="max-w-4xl mx-auto text-center">
        <h1 className=" text-5xl md:mt-20 md:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
          Your AI Medical Assistant
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
          Experience healthcare guidance powered by advanced AI. Get instant medical information,
          symptom analysis, and health recommendations at your fingertips.
        </p>
        <button
          onClick={handleGetStarted}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold flex items-center mx-auto space-x-2 transform hover:scale-105 transition-all"
        >
          <span>Get Started</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard
          icon={<Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
          title="AI-Powered Analysis"
          description="Advanced algorithms analyze symptoms and provide accurate medical insights"
        />
        <FeatureCard
          icon={<Heart className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
          title="Health Monitoring"
          description="Track your vital signs and health metrics with precision"
        />
        <FeatureCard
          icon={<Dna className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
          title="Personalized Care"
          description="Tailored health recommendations based on your unique profile"
        />
        <FeatureCard
          icon={<Stethoscope className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
          title="Expert Guidance"
          description="Access to comprehensive medical knowledge and guidelines"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mt-24 bg-gradient-to-r from-blue-600 to-teal-500 rounded-3xl p-8 md:p-12 text-white"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated with Medical Innovations</h2>
          <p className="text-lg mb-8 text-blue-50">
            Subscribe to our newsletter for the latest updates in AI-powered healthcare and medical breakthroughs.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button
              type="submit"
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
            >
              <span>Subscribe</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
          {status === 'success' && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-sm text-blue-50"
            >
              Thank you for subscribing! 🎉
            </motion.p>
          )}
        </div>
      </motion.div>
    </>
  );
}

export default Page;