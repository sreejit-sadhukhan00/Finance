import { Github, Mail, Heart, TrendingUp, Shield, Users } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 border-t border-slate-200/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Main Footer Content - Two Sections Side by Side */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-8 mb-4 ">
          {/* Left Section - Brand & Contact */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FinanceTracker
              </h3>
            </div>
            <p className="text-slate-600 mb-3 leading-relaxed text-sm">
              Take control of your financial future with comprehensive tracking and analytics.
            </p>
            
            {/* Contact Information */}
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com/sreejit-sadhukhan00" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors duration-200 group"
              >
                <div className="w-7 h-7 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center group-hover:border-blue-300 group-hover:shadow-md transition-all duration-200">
                  <Github className="w-4 h-4" />
                </div>
                <span className="font-medium text-sm">GitHub</span>
              </a>
              
              <a 
                href="mailto:your.email@example.com" 
                className="flex items-center space-x-2 text-slate-600 hover:text-purple-600 transition-colors duration-200 group"
              >
                <div className="w-7 h-7 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center group-hover:border-purple-300 group-hover:shadow-md transition-all duration-200">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="font-medium text-sm">Contact</span>
              </a>
            </div>
          </div>

          {/* Right Section - Trust & Security */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-3 text-sm">Trust & Security</h4>
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2 text-slate-600">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-sm">Bank-level Security</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-sm">10,000+ Users</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-sm">Made with Care</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-3 space-y-2 md:space-y-0 border-t border-slate-200/50">
          <div className="text-slate-600 text-xs">
            © {new Date().getFullYear()} FinanceTracker. Built with{' '}
            <Heart className="w-3 h-3 inline text-red-500 mx-1" />
            for better financial wellness.
          </div>
          
          <div className="flex items-center space-x-4 text-xs text-slate-600">
            <button className="hover:text-blue-600 transition-colors duration-200">
              Privacy Policy
            </button>
            <button className="hover:text-purple-600 transition-colors duration-200">
              Terms of Service
            </button>
            <span className="text-slate-400">•</span>
            <span className="font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              v1.0.0
            </span>
          </div>
        </div>
      </div>

      {/* Subtle bottom gradient */}
      <div className="h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 opacity-30"></div>
    </footer>
  );
};

export default Footer;