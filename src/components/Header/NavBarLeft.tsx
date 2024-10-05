import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faStickyNote, faBars, faNewspaper } from '@fortawesome/free-solid-svg-icons';

export default function NavBarLeft() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div>
      <div className="hidden md:fixed md:top-0 md:left-0 md:h-full md:flex md:flex-col md:items-center bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white
                      transition-all duration-300 ease-in-out w-16 hover:w-64 overflow-hidden group">
          <div className="mt-16 w-full">
              <button
                  className="flex items-center w-full px-6 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() => navigate('/')}
              >
                  <FontAwesomeIcon icon={faHome}/>
                  <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Home</span>
              </button>
              <button
                  className="flex items-center w-full px-6 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() => navigate('/annotations')}
              >
                  <FontAwesomeIcon icon={faStickyNote}/>
                  <span
                      className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Annotations</span>
              </button>
              <button
                  className="flex items-center w-full px-6 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() => navigate('/articles')}
              >
                  <FontAwesomeIcon icon={faNewspaper}/>
                  <span
                      className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Articles</span>
              </button>
          </div>
      </div>

        <button
            className="md:hidden p-2 fixed top-4 left-4 focus:outline-none focus:ring dark:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
            <FontAwesomeIcon icon={faBars}/>
        </button>

        {isMenuOpen && (
            <div className="absolute top-16 left-6 bg-white dark:bg-gray-800 rounded shadow-md md:hidden">
            <button
            className="block w-full px-4 py-2 text-left hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => { navigate('/'); setIsMenuOpen(false); }}
          >
            Home
          </button>
          <button
            className="block w-full px-4 py-2 text-left hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => { navigate('/annotations'); setIsMenuOpen(false); }}
          >
            Annotations
          </button>
        </div>
      )}
    </div>
  );
}
