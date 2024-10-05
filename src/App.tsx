import './App.css'
import HeaderBar from "./components/Header/Header.tsx";

import {useLocation} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "react-query";
import NavBarLeft from "./components/Header/NavBarLeft.tsx";


function App({ children }: any) {
  const location = useLocation();
  const queryClient = new QueryClient();
  const registerUser = location.pathname === '/login' || location.pathname === '/create-account';

  return (
    <div className="bg-white text-black dark:bg-slate-800 dark:text-white min-h-screen">
      <QueryClientProvider client={queryClient}>
        {!registerUser && <HeaderBar />}
        <div className="flex">
          {!registerUser && (
            <div className="fixed top-0 left-0 h-full z-10">
              <NavBarLeft />
            </div>
          )}
            <div
            className={`flex-1 ${!registerUser ? 'ml-4 sm:ml-20 ' : ''} transition-all duration-300`}
          >
            {children}
          </div>
        </div>
      </QueryClientProvider>
    </div>
  );
}

export default App;
