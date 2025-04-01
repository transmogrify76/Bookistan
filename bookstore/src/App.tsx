import React from 'react'
// import Header from './components/Header'
// import Footer from './components/Footer'
import Home from './pages/Home'

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}
      <main className="flex-grow">
        <Home />
      </main>
      {/* <Footer /> */}
    </div>
  )
}

export default App
