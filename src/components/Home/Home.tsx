import {useContext} from "react";
import {AuthContext} from "../../contexts/Auth/AuthContext.tsx";
import RowUsers from "../Chat/RowUsers.tsx";


export default function Home() {

    const {user} = useContext(AuthContext)

    return (<div>
        <div className="mt-24 flex justify-center items-center w-full">
            <div className="">
                <p className="text-2xl font-bold text-gray-900  sm:text-3xl sm:tracking-tight">
                    Welcome to my App {user && user.name}
                </p>
                <div className="mt-4">
                    This site is used only by test, if you want to see the code, please visit my github.
                    <br/>
                    For use the features in this site, you need to login.
                    <br/>
                    You can access the features of the site by clicking on the menu.
                </div>
            </div>
        </div>
        <div>
            New Posts...
        </div>
        </div>
    )
}