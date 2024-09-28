import { Button } from "@/components/ui/button";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

const Features = () => {
  const features = [
    {
      title: "Seamless Note Management",
      description:
        "Organize your notes easily with folders, tags, and search features. Quickly find what you're looking for.",
      icon: CheckCircleIcon,
    },
    {
      title: "Real-time Collaboration",
      description:
        "Work with your team on the same notes in real time. Share your notes and collaborate effortlessly.",
      icon: CheckCircleIcon,
    },
    {
      title: "Customizable Themes",
      description:
        "Choose from a variety of themes to match your style. Create a personalized environment that inspires creativity.",
      icon: CheckCircleIcon,
    },
    {
      title: "Offline Access",
      description:
        "Access your notes even when you're offline. Sync automatically when you're back online.",
      icon: CheckCircleIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFC700] relative">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-blue-900">Features</h2>
          <p className="mt-4 text-lg text-black">
            Discover the amazing features that make your experience seamless and
            efficient.
          </p>
        </div>

        {/* Features grid */}
        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 text-center hover:bg-blue-50 transition duration-300"
            >
              <div className="flex justify-center">
                <feature.icon className="h-12 w-12 text-blue-700 mb-4" />
              </div>
              <h3 className="text-xl font-bold text-blue-900">
                {feature.title}
              </h3>
              <p className="mt-3 text-base text-black">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center my-12 md:my-0">
          <Link href='/login'>
            <Button className="bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-800">
              Get Started
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Features;
