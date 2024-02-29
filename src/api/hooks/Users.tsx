import {useQuery, UseQueryResult} from "react-query";
import {ApiUser} from "../ApiUser.ts";
import {User} from "../../types/User.ts";


export const useGetUsers = (): UseQueryResult<{data: {users: User[]}}> => {
    return useQuery(["usersRow"], ApiUser.getUsers);
}