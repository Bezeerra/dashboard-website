import {Form, Input, SubmitButton} from "../Utils/DefaultComponents.tsx";
import {useForm} from "react-hook-form";
import {Link, useNavigate} from "react-router-dom";
import {User} from "../../types/User.ts";
import {ApiUser} from "../../api/ApiUser.ts";
import {handleServerSideValidation} from "../Utils/Validations.tsx";
import {useContext} from "react";
import {AuthContext} from "../../contexts/Auth/AuthContext.tsx";

export default function FormCreateAccount() {

    const auth = useContext(AuthContext)
    const methods = useForm<User>();
    const navigate = useNavigate();

    if (auth.user){
        navigate('/')
    }
    const onSubmit = (data: User) => {
        ApiUser.createUser({...data})
            .then(async (res) => {
                console.log("Alert Suceffuly Created", res);
                navigate('/login');
            }).catch(async (err) => {
                console.log(err);
                await handleServerSideValidation(err?.response?.data, methods.setError);
                console.log(err);
            }
        )
    }
    // const errors = methods.formState.errors
    const classInput = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    const classLabel = "block text-gray-700 text-sm font-bold mb-2 text-left px-3"

    return <div className="pt-48">
        <div className="flex items-center justify-center">
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
                <div className="mb-4">
                    <Input name='name' label={"Name"} classInput={classInput} type="text"
                           classLabel={classLabel} placeholder="Joaozinho Bezerra"/>
                </div>
                <div>
                    <SubmitButton>Create</SubmitButton>
                </div>
                <Link to={'/login'} className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">Do you have account?</Link>
            </Form>
        </div>
    </div>
}