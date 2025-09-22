import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Download, Palette, Info } from 'lucide-react';

interface ThemeConfig {
  name: string;
  author: string;
  target: string;
  backgroundImage: File | null;
}

interface ThemeBuilderProps {
  themeConfig: ThemeConfig;
  onConfigChange: (config: ThemeConfig) => void;
  onGenerateTheme: () => void;
}

const ThemeBuilder: React.FC<ThemeBuilderProps> = ({
  themeConfig,
  onConfigChange,
  onGenerateTheme
}) => {

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-3xl font-bold text-white mb-2">
          <Palette className="inline-block w-8 h-8 mr-3 text-blue-400" />
          Nintendo Switch Theme Builder
        </h1>
        <p className="text-gray-300">
          Create custom themes for your Nintendo Switch homebrew setup
        </p>
      </div>

      {/* Layout Information Banner */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 m-6">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-blue-400 font-medium mb-1">Need Layouts?</h3>
            <p className="text-gray-300 text-sm mb-3">
              This tool creates <strong>theme files</strong> (backgrounds and colors) only.
              For <strong>layout modifications</strong> (moving UI elements, changing positions),
              get layouts from the community:
            </p>
            <motion.a
              href="https://themezer.net/switch/layouts"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ExternalLink className="w-4 h-4" />
              <span>Browse Layouts on Themezer</span>
            </motion.a>
          </div>
        </div>
      </div>

      {/* Theme Configuration */}
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Theme Details */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">Theme Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Theme Name
                </label>
                <input
                  type="text"
                  value={themeConfig.name}
                  onChange={(e) => onConfigChange({ ...themeConfig, name: e.target.value })}
                  placeholder="My Custom Theme"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Author Name
                </label>
                <input
                  type="text"
                  value={themeConfig.author}
                  onChange={(e) => onConfigChange({ ...themeConfig, author: e.target.value })}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target
                </label>
                <select
                  value={themeConfig.target}
                  onChange={(e) => onConfigChange({ ...themeConfig, target: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Home Menu">Home Menu</option>
                  <option value="Lockscreen">Lockscreen</option>
                  <option value="Settings">Settings</option>
                  <option value="All Apps">All Apps</option>
                  <option value="User Page">User Page</option>
                  <option value="Player Select">Player Select</option>
                  <option value="News">News</option>
                  <option value="Album">Album</option>
                </select>
              </div>
            </div>
          </div>

          {/* Background Image */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">Background Image</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Choose Background (1280x720 recommended)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    onConfigChange({ ...themeConfig, backgroundImage: file });
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition-colors"
                />
              </div>

              {themeConfig.backgroundImage && (
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2">Preview:</p>
                  <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
                    <img
                      src={URL.createObjectURL(themeConfig.backgroundImage)}
                      alt="Background preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <motion.button
            onClick={onGenerateTheme}
            disabled={!themeConfig.backgroundImage || !themeConfig.name.trim() || !themeConfig.author.trim()}
            className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-white flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-5 h-5" />
            <span>Generate Theme File</span>
          </motion.button>

          {(!themeConfig.backgroundImage || !themeConfig.name.trim() || !themeConfig.author.trim()) && (
            <p className="text-center text-sm text-gray-400">
              Please fill in all fields and upload a background image to generate your theme
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeBuilder;