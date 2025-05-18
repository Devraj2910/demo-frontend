"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/modules/auth";
import { TRegisterData, UserRole } from "@/modules/auth";
import LoginForm from "@/modules/auth/presentation/components/LoginForm";
import RegisterForm from "@/modules/auth/presentation/components/RegisterForm";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function HomePage() {
  const { isAuthenticated, login, register: registerUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Handle theme mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect authenticated users to kudos wall
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/kudowall");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (data: { email: string; password: string }) => {
    setError("");
    setLoading(true);

    try {
      await login(data.email, data.password);
      router.push("/kudowall");
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
      toast.error(err.message || "Invalid email or password", {
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: {
    name: string;
    email: string;
    password: string;
    team: string;
    role: UserRole;
  }) => {
    setError("");
    setLoading(true);

    try {
      const userData: TRegisterData = {
        email: data.email,
        password: data.password,
        name: data.name,
        team: data.team,
        role: data.role,
      };

      await registerUser(userData);
      toast.success(
        "Registration successful! You can now log in with your credentials.",
        {
          duration: 5000,
          position: "top-center",
          style: {
            background: "#10B981",
            color: "#fff",
            padding: "16px",
            borderRadius: "10px",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#10B981",
          },
        }
      );
      setActiveTab("login");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
      toast.error(err.message || "Registration failed. Please try again.", {
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const switchToLogin = () => {
    setActiveTab("login");
    setError("");
  };

  const switchToRegister = () => {
    setActiveTab("register");
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-900 transition-colors duration-300 overflow-hidden relative">
      {/* Enhanced Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 opacity-40 dark:opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20"></div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            className="absolute inset-0"
          >
            <defs>
              <pattern
                id="smallGrid"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 80 0 L 0 0 0 80"
                  fill="none"
                  stroke="rgba(99, 102, 241, 0.05)"
                  strokeWidth="0.5"
                  className="dark:stroke-indigo-800/10"
                ></path>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#smallGrid)" />
          </svg>
        </div>

        {/* Animated floating shapes */}
        <motion.div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-200/30 to-blue-200/30 dark:from-purple-800/10 dark:to-blue-800/10 opacity-70 blur-2xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/4 -left-32 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-blue-200/30 to-indigo-200/30 dark:from-blue-800/10 dark:to-indigo-800/10 opacity-70 blur-xl"
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [0, -5, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute -bottom-32 left-1/3 w-[450px] h-[450px] rounded-full bg-gradient-to-bl from-indigo-200/30 to-purple-200/30 dark:from-indigo-800/10 dark:to-purple-800/10 opacity-70 blur-xl"
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Particles effect */}
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-indigo-400/30 dark:bg-indigo-300/20"
              initial={{
                scale: Math.random() * 0.5 + 0.5,
                opacity: Math.random() * 0.5 + 0.25,
              }}
              animate={{
                y: [0, Math.random() * -50, 0],
                x: [0, Math.random() * 50 - 25, 0],
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${
                  Math.random() > 0.8 ? 3 : Math.random() > 0.5 ? 2 : 1
                }px`,
                height: `${
                  Math.random() > 0.8 ? 3 : Math.random() > 0.5 ? 2 : 1
                }px`,
              }}
            />
          ))}
        </div>

        {/* Light beams for visual interest */}
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-gradient-to-br from-purple-300/10 via-transparent to-transparent dark:from-purple-500/5 dark:via-transparent dark:to-transparent rounded-full blur-3xl transform -rotate-12"></div>
        <div className="absolute -bottom-[40%] -right-[10%] w-[80%] h-[80%] bg-gradient-to-tl from-blue-300/10 via-transparent to-transparent dark:from-blue-500/5 dark:via-transparent dark:to-transparent rounded-full blur-3xl"></div>

        {/* Hero illustration - abstract shapes */}
        <svg
          className="absolute right-0 top-1/2 transform -translate-y-1/2 h-full opacity-10 dark:opacity-5 text-indigo-500 dark:text-indigo-400"
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.8">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M201.337 87.437C193.474 79.5738 180.725 79.5738 172.862 87.437L87.437 172.862C79.5739 180.725 79.5739 193.474 87.437 201.337L400.663 514.563C408.526 522.426 421.275 522.426 429.138 514.563L514.563 429.138C522.426 421.275 522.426 408.526 514.563 400.663L201.337 87.437ZM30.4869 115.912C-8.82897 155.228 -8.82897 218.972 30.4869 258.287L343.713 571.513C383.028 610.829 446.772 610.829 486.088 571.513L571.513 486.088C610.829 446.772 610.829 383.028 571.513 343.713L258.287 30.4869C218.972 -8.82896 155.228 -8.82896 115.912 30.4869L30.4869 115.912Z"
              fill="currentColor"
            />
            <path
              d="M514.563 201.337C522.426 193.474 522.426 180.725 514.563 172.862L429.138 87.437C421.275 79.5738 408.526 79.5739 400.663 87.437L358.098 130.002L301.148 73.0516L343.713 30.4869C383.028 -8.82896 446.772 -8.82896 486.088 30.4869L571.513 115.912C610.829 155.228 610.829 218.972 571.513 258.287L357.802 471.999L300.852 415.049L514.563 201.337Z"
              fill="currentColor"
            />
            <path
              d="M243.901 471.999L201.337 514.563C193.474 522.426 180.725 522.426 172.862 514.563L87.437 429.138C79.5739 421.275 79.5739 408.526 87.437 400.663L301.148 186.952L244.198 130.002L30.4869 343.713C-8.82897 383.028 -8.82897 446.772 30.4869 486.088L115.912 571.513C155.228 610.829 218.972 610.829 258.287 571.513L300.852 528.949L243.901 471.999Z"
              fill="currentColor"
            />
            <path
              d="M244.197 258.287L300.852 201.632L357.802 258.582L301.147 315.237L244.197 258.287Z"
              fill="currentColor"
            />
            <path
              d="M115.912 344.287L300.852 129.347L343.713 72.1012L357.802 58.0121L301.148 1.35791L244.198 58.3072L115.912 186.593L87.437 215.069L115.912 243.544L173.339 300.497L115.912 344.287Z"
              fill="currentColor"
            />
            <path
              d="M371.116 344.287L486.087 229.316L543.037 172.366L600.282 115.12L571.513 86.3511L528.94 43.7783L486.087 86.6311L371.116 201.602L357.802 214.916L300.852 271.866L371.116 344.287Z"
              fill="currentColor"
            />
            <path
              d="M243.901 471.999L186.951 415.049L115.912 344.287L173.339 300.497L244.197 371.355L300.852 427.735L357.802 370.785L300.852 313.835L244.197 258.287L300.852 201.632L357.802 258.582L371.116 271.896L428.641 214.371L486.087 157.201L543.037 214.151L428.641 328.546L371.116 386.072L314.166 443.022L243.901 471.999Z"
              fill="currentColor"
            />
          </g>
        </svg>
      </div>

      {/* Content */}
      <Toaster />

      {/* Floating theme switcher */}
      {mounted && (
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-6 right-6 z-50 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg text-gray-800 dark:text-white"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {theme === "dark" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </motion.button>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        {/* Header with animation */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Digital{" "}
            <motion.span
              className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Kudos Wall
            </motion.span>
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Celebrate achievements and foster a culture of appreciation by
            recognizing your colleagues' contributions
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Features list with staggered animation */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.h2
              className="text-3xl font-bold text-gray-900 dark:text-white mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Show appreciation for your teammates
            </motion.h2>
            <div className="space-y-5">
              {[
                "Give public recognition for great work",
                "Build a positive team culture",
                "Track recognition across teams",
                "Celebrate achievements together",
                "Boost morale and motivation",
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="flex items-start bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex-shrink-0 h-6 w-6 text-purple-600 dark:text-purple-400">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="ml-3 text-lg text-gray-700 dark:text-gray-300">
                    {item}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Auth Card with animations */}
          <motion.div
            className="min-h-[480px]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <motion.button
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors relative ${
                    activeTab === "login"
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                  onClick={switchToLogin}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign In
                  {activeTab === "login" && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-500"
                      layoutId="activeTab"
                    />
                  )}
                </motion.button>
                <motion.button
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors relative ${
                    activeTab === "register"
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                  onClick={switchToRegister}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Register
                  {activeTab === "register" && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-500"
                      layoutId="activeTab"
                    />
                  )}
                </motion.button>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeTab === "login" ? (
                      <LoginForm
                        loading={loading}
                        error={error}
                        onSubmit={handleLogin}
                        onSwitchToRegister={switchToRegister}
                      />
                    ) : (
                      <RegisterForm
                        loading={loading}
                        error={error}
                        onSubmit={handleRegister}
                        onSwitchToLogin={switchToLogin}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        {/* How It Works section with animations */}
        <motion.div
          className="mt-32 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2
            className="text-3xl font-bold text-gray-900 dark:text-white mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Choose a recipient",
                description:
                  "Select a teammate you want to recognize for their work or support",
                icon: (
                  <svg
                    className="h-8 w-8 text-purple-600 dark:text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                ),
              },
              {
                title: "Write your kudos",
                description:
                  "Share what they did and how it made a positive impact",
                icon: (
                  <svg
                    className="h-8 w-8 text-purple-600 dark:text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                ),
              },
              {
                title: "Share publicly",
                description:
                  "Your recognition will be displayed on the kudos wall for everyone to see",
                icon: (
                  <svg
                    className="h-8 w-8 text-purple-600 dark:text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{
                  y: -5,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <motion.div
                  className="flex items-center justify-center h-20 w-20 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-6"
                  whileHover={{ rotate: 5, scale: 1.05 }}
                >
                  {step.icon}
                </motion.div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials section */}
        <motion.div
          className="mt-32 mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              What Teams Are Saying
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See how Kudos Wall is transforming workplace culture
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Our team morale has significantly improved since implementing the Kudos Wall. It's now easier than ever to recognize great work.",
                name: "Sarah Johnson",
                title: "Engineering Manager",
              },
              {
                quote:
                  "The public recognition has motivated our team to go above and beyond. We've seen a 30% increase in collaboration.",
                name: "Michael Chen",
                title: "Product Lead",
              },
              {
                quote:
                  "Simple yet effective. The Kudos Wall has become an integral part of our company culture in just a few months.",
                name: "Alicia Rodriguez",
                title: "HR Director",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="mb-4 text-purple-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12 12a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1h-1.388c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 9 7.558V11a1 1 0 0 0 1 1h2Zm-6 0a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1H4.612c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 3 7.558V11a1 1 0 0 0 1 1h2Z" />
                  </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                  {testimonial.quote}
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.title}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA section */}
        <motion.div
          className="mt-24 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl p-8 md:p-12 shadow-xl text-center text-white"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to build a culture of appreciation?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of teams using Kudos Wall to boost morale and
            recognize achievements.
          </p>
          <motion.button
            className="bg-white text-purple-600 font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={switchToRegister}
          >
            Get Started Today
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
