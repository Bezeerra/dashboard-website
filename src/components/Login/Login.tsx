import {useContext} from "react";
import {AuthContext} from "../../contexts/Auth/AuthContext.tsx";
import {Link, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {Form, Input, SubmitButton} from "../Utils/DefaultComponents.tsx";
import {ApiUser} from "../../api/ApiUser.ts";
import {User} from "../../types/User.ts";


export default function Login() {


    const auth = useContext(AuthContext)
    const navigate = useNavigate();
    const methods = useForm();

    const onSubmit = (data: User) => {
        ApiUser.signIn({
            email: data.email,
            password: data.password
        }).then((res) => {
                console.log("Alert Successfully Created", res);
                auth.setToken(res.data.token)
                auth.validateToken()
                navigate('/');
        }).catch((error) => {
                console.log(error);
            }
        )
    }


    const classInput = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    const classLabel = "block text-gray-700 text-sm font-bold mb-2 text-left px-3"

    return <div className="pt-48">
        <div className="flex items-center justify-center ">
            <div className="">
            <Form methods={methods} onSubmit={onSubmit}
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <Input name='email' label={"Email"} classInput={classInput} type="email"
                           classLabel={classLabel} placeholder="example@gmail.com"/>
                </div>
                <div className="mb-4">
                     <Input name='password' label={"Password"} classInput={classInput} type="password"
                            classLabel={classLabel} placeholder="**********"/>
                </div>
                <div>
                    <SubmitButton>Login</SubmitButton>
                </div>
                <Link to={'/create-account'} className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">You don't have account?</Link>
            </Form>
            </div>
        </div>
    </div>
}