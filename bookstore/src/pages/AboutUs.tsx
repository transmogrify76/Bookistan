import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import bgImage from '/src/assets/images/bgi/bgi.jpg';
import teamImage from '/src/assets/images/about/team.jpg';
import founderImage from '/src/assets/images/about/founder.jpg';

const AboutUs = () => {
  const [[currentPage, direction], setCurrentPage] = useState([0, 0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const teamMembers = [
    {
      id: 1,
      name: 'Chitradeep Ghosh',
      role: 'Co-Founder & CEO',
      bio: 'Book lover from Kolkata with 10+ years in publishing industry',
      location: 'Kolkata, West Bengal'
    },
    {
      id: 2,
      name: 'Sayan Sikder',
      role: 'CTO',
      bio: 'Tech expert passionate about building community platforms',
      location: 'Kolkata, West Bengal'
    },
    {
      id: 3,
      name: 'Manjima Mukherjee',
      role: 'Head of Community',
      bio: 'Connects book lovers and organizes literary events',
      location: 'Kolkata'
    }
  ];

  const pages = [
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
          BookSwap Chronicles
        </motion.h1>
        <p className="text-xl text-gray-600">Turning Pages, Building Community</p>
      </motion.div>
    </div>,

    <motion.div 
      key="mission"
      className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-2xl p-8 h-full"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="w-4 h-4 bg-indigo-500 rounded-full mr-3"></span>
        Our Mission
      </h2>
      <p className="text-lg text-gray-600 leading-relaxed">
        At BookSwap, we celebrate India's rich literary heritage. Our mission is to create 
        a national community where book lovers exchange reads in multiple languages, 
        making literature accessible while promoting sustainable reading habits across 
        India's diverse communities.
      </p>
      <div className="mt-8 flex justify-center">
        <motion.img 
          src={teamImage}
          alt="Team"
          className="rounded-lg shadow-md w-3/4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        />
      </div>
    </motion.div>,

    <motion.div 
      key="story"
      className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-2xl p-8 h-full"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="w-4 h-4 bg-indigo-500 rounded-full mr-3"></span>
        Our Story
      </h2>
      <div className="flex flex-col md:flex-row gap-8">
        <motion.div 
          className="md:w-1/3"
          initial={{ x: -50 }}
          animate={{ x: 0 }}
        >
          <img 
            src={founderImage} 
            alt="Founders" 
            className="rounded-lg shadow-md w-full"
          />
        </motion.div>
        <div className="md:w-2/3">
          <p className="text-lg text-gray-600 leading-relaxed mb-4">
            Born in 2018 from a small book exchange at Kolkata's iconic National Library, 
            BookSwap has grown into a national movement. Our founders noticed countless 
            books gathering dust and envisioned a platform to give them new life.
          </p>
          <motion.p 
            className="text-lg text-gray-600 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Starting with just 50 books in Kolkata, we've now facilitated over 1,00,000 
            swaps across 50+ Indian cities, from Delhi to Chennai, Mumbai to Bangalore!
          </motion.p>
        </div>
      </div>
    </motion.div>,

    <motion.div 
      key="team"
      className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-2xl p-8 h-full"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
        <span className="w-4 h-4 bg-indigo-500 rounded-full mr-3"></span>
        Our Team
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
          >
            <div className="w-20 h-20 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center text-indigo-600 text-2xl font-bold">
              {member.name.charAt(0)}
            </div>
            <h3 className="text-xl font-semibold text-center text-gray-800 mb-1">
              {member.name}
            </h3>
            <p className="text-indigo-600 text-center mb-1">{member.role}</p>
            <p className="text-gray-500 text-sm text-center mb-3">{member.location}</p>
            <p className="text-gray-600 text-center">{member.bio}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>,

    <motion.div 
      key="cta"
      className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-2xl p-8 h-full flex flex-col items-center justify-center"
    >
      <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Join Our Literary Journey
      </h2>
      <div className="flex flex-col sm:flex-row justify-center gap-6">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link
            to="/signup"
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-lg font-medium rounded-xl shadow-lg hover:from-indigo-700 hover:to-indigo-600 transition-all"
          >
            Start Swapping Books
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link
            to="/discover"
            className="px-8 py-4 bg-white text-indigo-600 text-lg font-medium rounded-xl shadow-lg border-2 border-indigo-600 hover:bg-indigo-50 transition-all"
          >
            Explore Community
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
      setCurrentPage([currentPage + newDirection, newDirection]);
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
            {pages[currentPage % pages.length]}
          </motion.div>
        </AnimatePresence>

        {currentPage > 0 && (
          <motion.button
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => paginate(-1)}
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
          >
            →
          </motion.button>
        )}

        <div className="absolute bottom-8 flex gap-2">
          {pages.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentPage % pages.length 
                  ? 'bg-indigo-600 scale-125' 
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;