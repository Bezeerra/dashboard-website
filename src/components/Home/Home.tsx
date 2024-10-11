import {useContext} from "react";
import {AuthContext} from "../../contexts/Auth/AuthContext.tsx";


export default function Home() {

    const {user} = useContext(AuthContext)




    return (
        <div className="min-h-screen flex justify-center items-start mt-12">
            <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    Welcome to my App {user && `User: ${user.name}`}
                </p>
                <div className="mt-4">
                    This site is used only for testing. If you want to see the code, please visit my GitHub.
                    <br />
                    To use the features on this site, you need to log in.
                    <br />
                    You can access the features of the site by clicking on the menu.
                </div>
                <div className="mt-4">
                    Last users used to create annotations here:

                </div>
            </div>
        </div>
    );}

