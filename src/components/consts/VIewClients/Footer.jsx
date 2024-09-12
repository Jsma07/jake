import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white rounded-lg shadow dark:bg-gray-900 border-t border-gray-200 mt-auto py-4">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a href="#" className="flex items-center mb-4 sm:mb-0 space-x-6">
            <img src="/Jacke.png" className="h-8" alt="Jacke Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Jacke Nail
            </span>
          </a>
          <ul className="flex space-x-8 mb-6 text-xl sm:mb-0 dark:text-gray-400">
            <li>
              <a
                href="#"
                className="hover:text-green-600 transition-colors duration-300"
              >
                <i
                  className="bx bxl-whatsapp"
                  style={{ color: "#08aa2b", fontSize: "2rem" }}
                ></i>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-blue-600 transition-colors duration-300"
              >
                <i
                  className="bx bxl-facebook-circle"
                  style={{ color: "#001cff", fontSize: "2rem" }}
                ></i>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-pink-600 transition-colors duration-300"
              >
                <i
                  className="bx bxl-instagram"
                  style={{ color: "rgba(245,2,144,0.64)", fontSize: "2rem" }}
                ></i>
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2023{" "}
          <a href="#" className="hover:underline">
            Jacke Nail
          </a>
          . Todos los derechos reservados.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
