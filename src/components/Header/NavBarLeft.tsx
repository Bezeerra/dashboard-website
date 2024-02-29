import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {SubmitButton} from "../Utils/DefaultComponents.tsx";


export default function NavBarLeft() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate()


    return (
      <div>
          <div className="hidden md:flex mt-14">
              <div className='fixed h-5/6 text-white w-64 lg:w-80 border-r-4 '>
                  <div className="">
                      <div className="text-xl mt-8 items-center justify-start pl-14 lg:pl-24 text-black under">
                           <SubmitButton className="bg-gray-700 hover:bg-gray-700" onClick={() => {}}>Simple Chat</SubmitButton>
                           <SubmitButton className="mt-8" onClick={() => {navigate("/annotations")}}>Annotations</SubmitButton>
                      </div>
                  </div>
              </div>
          </div>
          <button
              className="md:hidden p-2 px-4 rounded fixed top-4 focus:outline-none focus:ring dark:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
              <FontAwesomeIcon icon={faBars} />
          </button>
          {isMenuOpen && (
              <div className="absolute top-16 w-40 left-6 bg-gray-100 rounded shadow-md md:hidden">
                  <Link to={"/"}  className="block px-4 py-2 hover:bg-gray-200">Simple Text</Link>
                  <Link to={"/annotations"} className="block px-4 py-2 hover:bg-gray-200">Annotations</Link>
              </div>
          )}
      </div>
    );
}
