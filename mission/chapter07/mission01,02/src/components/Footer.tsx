// src/components/Footer.tsx
import { Link } from "react-router-dom";
import { Github, Mail, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700/50 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* 로고 및 저작권 */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              My LP
            </h3>
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} My LP. All rights reserved.
            </p>
          </div>

          {/* 링크 */}
          <div className="flex items-center gap-6">
            <Link
              to="#"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              to="#"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Terms of Service
            </Link>
            <Link
              to="#"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Contact Us
            </Link>
          </div>

          {/* 소셜 아이콘 */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all border border-gray-700 hover:border-gray-600"
              aria-label="Github"
            >
              <Github size={20} className="text-gray-400 hover:text-white" />
            </a>
            <a
              href="#"
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all border border-gray-700 hover:border-gray-600"
              aria-label="Email"
            >
              <Mail size={20} className="text-gray-400 hover:text-white" />
            </a>
          </div>
        </div>

        {/* 하단 메시지 */}
        <div className="mt-6 pt-6 border-t border-gray-700/50 text-center">
          <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
            Made with <Heart size={16} className="text-red-500 fill-red-500" /> by My LP Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;