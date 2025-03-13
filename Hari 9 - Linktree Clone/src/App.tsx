import React, { useState, useCallback } from 'react';
import { Sun, Moon, Github, Instagram, Youtube, ExternalLink, Mail, Globe, Linkedin } from 'lucide-react';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Container, Engine } from "tsparticles-engine";

interface LinkItem {
  title: string;
  url: string;
  icon: React.ReactNode;
  description?: string;
}

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    console.log(container);
  }, []);

  const links: LinkItem[] = [
    {
      title: 'GitHub',
      url: 'https://github.com',
      icon: <Github className="w-5 h-5" />,
      description: 'Check out my open source projects'
    },
    {
      title: 'Instagram',
      url: 'https://instagram.com',
      icon: <Instagram className="w-5 h-5" />,
      description: 'Behind the scenes content'
    },
    {
      title: 'YouTube',
      url: 'https://youtube.com',
      icon: <Youtube className="w-5 h-5" />,
      description: 'Tutorial videos and vlogs'
    },
    {
      title: 'Portfolio',
      url: 'https://example.com',
      icon: <Globe className="w-5 h-5" />,
      description: 'My professional portfolio'
    },
    {
      title: 'LinkedIn',
      url: 'https://linkedin.com',
      icon: <Linkedin className="w-5 h-5" />,
      description: 'Professional network'
    },
    {
      title: 'Contact Me',
      url: 'mailto:example@email.com',
      icon: <Mail className="w-5 h-5" />,
      description: 'Get in touch'
    },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 relative ${darkMode ? 'bg-[#0A192F]' : 'bg-gray-50'}`}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          fpsLimit: 120,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              repulse: {
                distance: 100,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: darkMode ? "#64ffda" : "#0A192F",
            },
            links: {
              color: darkMode ? "#64ffda" : "#0A192F",
              distance: 150,
              enable: true,
              opacity: 0.2,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 2,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.2,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
          detectRetina: true,
        }}
        className="absolute inset-0"
      />

      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed top-4 right-4 p-3 rounded-full z-50 ${
          darkMode ? 'bg-[#172a46] text-[#64ffda]' : 'bg-white text-gray-800'
        } shadow-lg hover:scale-110 transition-transform duration-200`}
      >
        {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>

      <div className="container mx-auto px-4 py-16 max-w-2xl relative z-10">
        <div className="text-center mb-12">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden ring-1 ring-[#64ffda] ring-offset-4 ring-offset-transparent">
            <img
              src="https://i.ibb.co.com/tPbYS4M1/profile-pic-9.png"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className={`text-4xl font-bold mb-2 ${darkMode ? 'text-[#64ffda]' : 'text-gray-800'}`}>
            Aditya Fakhri Riansyah, S.Kom.
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Help you to learn coding <br/>
          👨‍🏫 Mentor | 🗣️ Speaker | 👨‍💻 Coder | 🎤 MC
          | 👤 ex-Google DSC Lead '23
          </p>
        </div>

        <div className="space-y-4">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block w-full p-4 rounded-xl ${
                darkMode
                  ? 'bg-[#172a46] hover:bg-[#1f3555] text-white'
                  : 'bg-white hover:bg-gray-50 text-gray-800'
              } shadow-lg hover:scale-[1.02] transition-all duration-200 group backdrop-blur-sm bg-opacity-80`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`${darkMode ? 'text-[#64ffda]' : 'text-gray-700'}`}>
                    {link.icon}
                  </div>
                  <div>
                    <span className="font-medium">{link.title}</span>
                    {link.description && (
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {link.description}
                      </p>
                    )}
                  </div>
                </div>
                <ExternalLink className={`w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity ${darkMode ? 'text-[#64ffda]' : 'text-gray-600'}`} />
              </div>
            </a>
          ))}
        </div>

        <footer className="mt-12 text-center">
          <div className={`space-y-2 ${darkMode ? 'text-[#64ffda]' : 'text-gray-500'}`}>
            <p className="text-sm font-medium">
              RamadanJS - Day 9
            </p>
            <p className="text-sm">
              Created by Aditya Fakhri Riansyah
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;