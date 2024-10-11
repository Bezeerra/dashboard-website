import {Link, useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../contexts/Auth/AuthContext";
import {useConfirmDialog} from "../Utils/ConfirmSubmit.tsx";


export default function HeaderBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const {user, setToken} = useContext(AuthContext);
    const navigate = useNavigate();
    const {requestConfirm} = useConfirmDialog();
    const colorSet = localStorage.getItem('color');

    const [color, setColor] = useState(colorSet || "white");

    useEffect(() => {
        const root = document.documentElement;
        if (color === "dark") {
            localStorage.setItem('color', 'dark');
            root?.classList.add('dark');
        }else{
            localStorage.setItem('color', 'white');
            root?.classList.remove('dark');
        }
    }, [color]);


    const handleLogout = async () => {
        await setToken('');
        navigate('/login');
    }

    return <>
        <header className="">
            <nav className="mx-auto flex items-center justify-between p-4 ">
                <div className="flex items-center dark:text-white text-black ml-8 sm:ml-14 md:ml-0">
                    <span className="text-xl font-semibold">Logo</span>
                </div>
                <div className="hidden md:flex space-x-4">
                    <Link to={"/"} className="hover:text-gray-600 dark:text-white text-black">Home</Link>
                    {user && <button onClick={async () => await handleLogout()} className="hover:text-gray-600  dark:text-white text-black">Logout</button>}
                    <Link to={"/my-account"} className="hover:text-gray-600 dark:text-white text-black">My Account</Link>
                    <Link to={"https://github.com/Bezeerra"} target="_blank" className="hover:text-gray-600 dark:text-white text-black">GitHub</Link>
                    <div className="dark:text-white">
                        <button onClick={() => setColor(color === "white" ? "dark": "white")}>
                            Color
                        </button>
                    </div>
                    <div className="hover:text-gray-300">{}</div>
                </div>
                <button className="md:hidden p-2 rounded focus:outline-none focus:ring dark:text-white text-white"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}>Menu</button>
                {isMenuOpen && (
                    <div className="absolute top-16 right-8 w-40 bg-gray-100 rounded dark:text-white dark:bg-gray-700 text-black shadow-md mt-2 py-2 md:hidden">
                        <Link to={"/"} className="block dark:text-white text-black dark:hover:bg-gray-600 px-4 py-2 hover:bg-gray-200">Home</Link>
                        {user && <button onClick={async () => requestConfirm(async () => await handleLogout())} className="xterm-cursor-pointer dark:hover:bg-gray-600 text-black dark:text-white block px-4 py-2 hover:bg-gray-200">Logout</button>}
                        <Link to={"/my-account"} className="block dark:text-white text-black px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600">My Account</Link>
                        <Link to={"https://github.com/Bezeerra"} target="_blank" className="dark:text-white text-black block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600">GitHub</Link>
                    </div>
                )}
            </nav>
        </header>
        <hr/>
    </>
}