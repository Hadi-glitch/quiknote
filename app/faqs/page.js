"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button"; // shadcn button
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid"; // Heroicons
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const faqsData = [
  {
    question: "What is QuikNote?",
    answer:
      "QuikNote is a fast and efficient note-taking app designed for simplicity and ease of use.",
  },
  {
    question: "Is QuikNote free to use?",
    answer:
      "Yes! QuikNote is completely free with the option to upgrade to premium for advanced features.",
  },
  {
    question: "How do I create a new note?",
    answer:
      "Simply click on the '+ New Note' button in your dashboard to create a new note.",
  },
  {
    question: "Can I share notes with others?",
    answer:
      "Currently, sharing notes is not available. Stay tuned for future updates!",
  },
  // Add more FAQs as needed
];

const Faqs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <>
      <div className="min-h-screen bg-[#FFC700] text-black">
      <Navbar />
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <h1 className="text-4xl font-extrabold text-center mb-10">
            Frequently Asked Questions
          </h1>

          <div className="space-y-4">
            {faqsData.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-5 border"
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="text-lg font-bold">{faq.question}</h3>
                  {activeIndex === index ? (
                    <ChevronUpIcon className="h-6 w-6 text-blue-500" />
                  ) : (
                    <ChevronDownIcon className="h-6 w-6 text-blue-500" />
                  )}
                </div>

                {activeIndex === index && (
                  <div className="mt-3 text-gray-700">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Faqs;
