import { useAuth } from "../hooks/auth.hooks";
import { Navigate } from "react-router";
export default function Protected({children}) {
    const {user, loading} = useAuth();

    if(loading){
        return (<main><h1>Loading.......</h1></main>)
    }


    if(!user){
        return <Navigate to={"/login"} />
    }   

    return children;
}