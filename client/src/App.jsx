import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import React, { useState } from 'react';
import ProfileHeader from './components/ProfileHeader';
import PrivateInfo from './components/PrivateInfo';
import SalaryInfo from './components/SalaryInfo';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default function App() {
  const [activeSubTab, setActiveSubTab] = useState('private');

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 font-sans antialiased">
      {/* Wireframe Top Header Nav */}
      <header className="bg-[#1e1e1e] border-b border-gray-800 sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <span className="text-blue-500 font-black tracking-wider text-xl uppercase">Logo</span>
          <nav className="hidden md:flex space-x-6 text-sm font-semibold text-gray-400">
            <span className="text-blue-400 cursor-pointer">Employees</span>
            <span className="hover:text-gray-200 cursor-pointer">Attendance</span>
            <span className="hover:text-gray-200 cursor-pointer">Time Off</span>
          </nav>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-red-400"></div>
          <div className="w-8 h-8 rounded bg-slate-700"></div>
        </div>
      </header>

      {/* Primary Application Layout Panel */}
      <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        <h1 className="text-xl font-bold tracking-tight text-gray-400 uppercase border-b border-gray-800 pb-2">My Profile</h1>
        
        {/* Top Profile Summary Infrastructure Component */}
        <ProfileHeader />

        {/* Inner Sub-Navigation Wireframe Tabs */}
        <div className="flex border-b border-gray-800 bg-[#1a1a1a] p-1 rounded-t-lg">
          {['resume', 'private', 'salary', 'security'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-150 rounded ${
                activeSubTab === tab 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#252525]'
              }`}
            >
              {tab === 'private' ? 'Private Info' : tab === 'salary' ? 'Salary Info' : tab}
            </button>
          ))}
        </div>

        {/* Bottom Content Area Router Switch */}
        <div className="bg-[#1e1e1e] p-6 rounded-b-lg border border-t-0 border-gray-800 min-h-[300px]">
          {activeSubTab === 'resume' && (
            <div className="text-sm text-gray-400 italic">Resume documentation storage structure view module.</div>
          )}
          
          {activeSubTab === 'private' && <PrivateInfo />}
          
          {activeSubTab === 'salary' && <SalaryInfo />}

          {activeSubTab === 'security' && (
            <div className="text-sm text-gray-400 italic">Security controls & configuration interfaces view module.</div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App
