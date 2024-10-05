import {useContext} from "react";
import {AuthContext} from "../../contexts/Auth/AuthContext.tsx";


export default function Home() {

    const {user} = useContext(AuthContext)

    return (<div>
            <div className="mt-24 justify-center items-center">
                <div className="">
                    <p className="text-2xl font-bold text-gray-900 sm:text-3xl ">
                        Welcome to my App {user && `User: ${user.name}`}
                    </p>
                    <div className="mt-4">
                        This site is used only by test, if you want to see the code, please visit my github.
                        <br/>
                        For use the features in this site, you need to login.
                        <br/>
                        You can access the features of the site by clicking on the menu.
                    </div>
                </div>
                <div>
                    New Posts...  TRU
                </div>
            </div>
        </div>
    )
}
