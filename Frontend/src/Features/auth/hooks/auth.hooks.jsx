import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { getMe, login, logout, register } from "../services/auth.api";

export const useAuth = () =>{
    const {user, setUser, loading, setLoading} = useContext(AuthContext);


    const handleLogin = async ({email, password}) => {
        setLoading(true);
        try {
            const data = await login({email, password});
            
            setUser(data.user);
        } catch (error) {
            console.log(error);
        }
        finally{
            setLoading(false);
            
        }
    }

    const handleRegister = async ({username, email, password}) =>{
        setLoading(true);
        try {
            
            const data  = await register({username, email, password});
            setUser(data.user);
        } catch (error) {
            console.log(error);
        }
        finally{

            setLoading(false);
        }
    }

    const handleLogout = async () => {
        setLoading(true);
        try {
            
            await logout();
            setUser(null);
        } catch (error) {
            console.log(error);
        }
        finally{

            setLoading(false);
        }
    }


    useEffect(()=>{
        const fetchUser = async() =>{
            try {
                const data =  await getMe();
                setUser(data.user);
            } catch (error) {
                console.log(error);
            }
            finally{
                setLoading(false);

            }
        }
        fetchUser();
    },[])



    return {user, loading, handleLogin, handleRegister, handleLogout};
}