import { useAuth } from "../hooks/auth.hooks";
import { Navigate } from "react-router";

export default function Protected({children}) {
    const {user, loading} = useAuth();

    if(loading){
        return (
            <main style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                backgroundColor: "#0f172a",
                gap: "24px"
            }}>
                <img 
                    src="/logo-icon.svg" 
                    alt="PrepWise"
                    style={{ width: "96px", height: "96px" }}
                />
                <h1 style={{ color: "white", fontSize: "2.5rem", fontWeight: "bold" }}>
                    Prep<span style={{ color: "#60a5fa" }}>Wise</span>
                </h1>
                <div style={{ display: "flex", gap: "12px" }}>
                    <span style={{ width: "12px", height: "12px", backgroundColor: "#60a5fa", borderRadius: "50%", display: "inline-block", animation: "bounce 1s infinite" }}></span>
                    <span style={{ width: "12px", height: "12px", backgroundColor: "#60a5fa", borderRadius: "50%", display: "inline-block", animation: "bounce 1s infinite 0.15s" }}></span>
                    <span style={{ width: "12px", height: "12px", backgroundColor: "#60a5fa", borderRadius: "50%", display: "inline-block", animation: "bounce 1s infinite 0.3s" }}></span>
                </div>
                <p style={{ color: "#94a3b8", fontSize: "1rem" }}>
                    Preparing your experience...
                </p>
            </main>
        )
    }

    if(!user){
        return <Navigate to={"/login"} />
    }   

    return children;
}