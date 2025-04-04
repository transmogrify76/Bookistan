import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import bgImage from '/src/assets/images/bgi/bgi.jpg';
import helpImage1 from '/src/assets/images/help/help1.jpg';
import helpImage2 from '/src/assets/images/help/help2.jpg';

const HelpPage = () => {
  const [[currentPage, direction], setCurrentPage] = useState([0, 0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const faqs = [
    {
      question: "How do I swap books?",
      answer: "Go to 'Browse Books', select a book you want, and request a swap. The owner will get notified and can approve your request."
    },
    {
      question: "What's the return policy?",
      answer: "Books should be returned within 30 days or when you've finished reading. Extensions can be requested."
    },
    {
      question: "How are books delivered?",
      answer: "You can meet locally in Kolkata or use our partner courier service for a small fee."
    }
  ];

  const pages = [
    // Page 0 - Cover
    <div key="cover" className="h-full w-full flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-2xl p-12 text-center"
      >
        <div className="flex items-center justify-center mb-8">
          <svg className="h-24 w-24 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-5xl font-bold text-gray-800 mb-4"
        >
          BookSwap Guide
        </motion.h1>
        <p className="text-xl text-gray-600">Your Complete Help Resource</p>
      </motion.div>
    </div>,

    // Page 1 - Getting Started
    <motion.div 
      key="getting-started"
      className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-2xl p-8 h-full overflow-y-auto"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="w-4 h-4 bg-indigo-500 rounded-full mr-3"></span>
        Getting Started
      </h2>
      
      <div className="space-y-6">
        <motion.div 
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="flex flex-col md:flex-row gap-6 items-center"
        >
          <div className="md:w-1/3">
            <img src={helpImage1} alt="Register" className="rounded-lg shadow-md" />
          </div>
          <div className="md:w-2/3">
            <h3 className="text-xl font-semibold text-indigo-600 mb-2">1. Create Your Account</h3>
            <p className="text-gray-600">
              Sign up with your email or phone number. Add your location in Kolkata to find nearby swappers.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ x: 20 }}
          animate={{ x: 0 }}
          className="flex flex-col md:flex-row gap-6 items-center"
        >
          <div className="md:w-1/3 order-2 md:order-1">
            <img src={helpImage2} alt="Add Books" className="rounded-lg shadow-md" />
          </div>
          <div className="md:w-2/3 order-1 md:order-2">
            <h3 className="text-xl font-semibold text-indigo-600 mb-2">2. Add Your Books</h3>
            <p className="text-gray-600">
              Scan ISBN barcodes or manually enter details. Set your preferences for swapping.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>,

    // Page 2 - FAQ
    <motion.div 
      key="faq"
      className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-2xl p-8 h-full overflow-y-auto"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="w-4 h-4 bg-indigo-500 rounded-full mr-3"></span>
        Frequently Asked Questions
      </h2>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-indigo-50 p-4 rounded-lg"
          >
            <h3 className="text-lg font-semibold text-indigo-700">{faq.question}</h3>
            <p className="text-gray-600 mt-2">{faq.answer}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>,

    // Page 3 - Contact
    <motion.div 
      key="contact"
      className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-2xl p-8 h-full flex flex-col"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="w-4 h-4 bg-indigo-500 rounded-full mr-3"></span>
        Contact Support
      </h2>
      
      <div className="flex-1 space-y-6">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-white p-6 rounded-lg shadow border border-gray-200"
        >
          <h3 className="text-xl font-semibold text-indigo-600 mb-2">Kolkata Office</h3>
          <p className="text-gray-600">123 Book Street, College Square</p>
          <p className="text-gray-600">Kolkata - 700073</p>
          <p className="text-gray-600 mt-2">☎ +91 98765 43210</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow border border-gray-200"
        >
          <h3 className="text-xl font-semibold text-indigo-600 mb-2">Email Support</h3>
          <p className="text-gray-600">help@bookswap.in</p>
          <p className="text-gray-600 mt-2">We respond within 24 hours</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-lg shadow border border-gray-200"
        >
          <h3 className="text-xl font-semibold text-indigo-600 mb-2">Community Forum</h3>
          <p className="text-gray-600">Get help from other BookSwap members</p>
          <Link 
            to="/community" 
            className="text-indigo-600 hover:text-indigo-800 inline-block mt-2"
          >
            Visit Forum →
          </Link>
        </motion.div>
      </div>
    </motion.div>
  ];

  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      rotateY: direction > 0 ? -20 : 20,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      x: 0,
      rotateY: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-50%' : '50%',
      rotateY: direction > 0 ? 20 : -20,
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    })
  };

  const paginate = (newDirection: number) => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentPage([Math.max(0, Math.min(currentPage + newDirection, pages.length - 1)), newDirection]);
      setTimeout(() => setIsAnimating(false), 800);
    }
  };

  return (
    <div className="fixed inset-0 bg-cover bg-center bg-no-repeat" 
         style={{ backgroundImage: `url(${bgImage})` }}>
      
      <div className="h-screen w-full flex items-center justify-center p-4">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute w-full max-w-4xl h-3/4 flex items-center justify-center"
          >
            {pages[currentPage]}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        {currentPage > 0 && (
          <motion.button
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => paginate(-1)}
            disabled={isAnimating}
          >
            ←
          </motion.button>
        )}

        {currentPage < pages.length - 1 && (
          <motion.button
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => paginate(1)}
            disabled={isAnimating}
          >
            →
          </motion.button>
        )}

        {/* Page Indicator */}
        <div className="absolute bottom-8 flex gap-2">
          {pages.map((_, index) => (
           <button
           key={index}
           onClick={() => {
             paginate(index - currentPage);
           }}
           className={`w-3 h-3 rounded-full transition-all ${
             index === currentPage 
               ? 'bg-indigo-600 scale-125' 
               : 'bg-gray-300 hover:bg-gray-400'
           }`}
           disabled={isAnimating}
         />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpPage;