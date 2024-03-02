import './App.css'
import HeaderBar from "./components/Header/Header.tsx";

import {useLocation} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "react-query";
import NavBarLeft from "./components/Header/NavBarLeft.tsx";

function App({children}: any) {
    const location = useLocation()
    const queryClient = new QueryClient()
    const registerUser = location.pathname === '/login' || location.pathname === '/create-account'

    return (<div className="bg-white text-black dark:bg-slate-800 dark:text-white min-h-screen">
        <QueryClientProvider client={queryClient}>
            {!registerUser ? <HeaderBar/> : null}
            <div className={`${registerUser ? '' : 'md:grid md:grid-cols-[23%_77%] lg:grid-cols-[23%_77%]'}`}>
                <div className={`${!registerUser ? '' : 'hidden'}`}>
                    {!registerUser && <NavBarLeft/>}
                </div>
                <div className="">
                    {children}
                </div>
            </div>
        </QueryClientProvider>
        </div>
    )
}
export default App
