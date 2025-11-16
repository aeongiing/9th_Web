import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-6 mt-12">
      <div className="constainer mx-auto text-center text-gray-400 dark:text-gray-200 ">
        <p> &copy; {new Date().getFullYear()} My LP. All rights reserved </p>
        <div className="flex justify-center space-x-4 mt-4">
          <Link
            to="#"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            Privacy Policy
          </Link>
          <Link
            to="#"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            Terms of Service
          </Link>
          <Link
            to="#"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;