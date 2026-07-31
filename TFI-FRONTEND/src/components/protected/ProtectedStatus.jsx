import { useContext } from "react"
import { Outlet, useNavigate } from "react-router"
import { AuthContext } from "../../services/authContext/AuthContext";
import { IsTokenValid } from "./Protected.helper";
import Layout from "../layout/Layout";

const ProtectedStatus = ({ roleNeeded }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleClickButton = () => {
        navigate("/home");
    }
    
    if (!IsTokenValid(user?.token, user?.role, roleNeeded)) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] p-5 text-center">
                    <img 
                        src="https://t3.ftcdn.net/jpg/07/30/13/62/360_F_730136273_MIQk4I8Wnpvw4M3GvmUuyYTVL1RJviHK.jpg" 
                        alt="Forbidden" 
                        className="max-w-md w-full mb-8 rounded-lg"
                    />
                    <h1 className="text-2xl font-bold mb-6 text-white"> 
                        You don't have the permissions to see this screen 
                    </h1>
                    <button 
                        onClick={handleClickButton}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                        Go to Home
                    </button>
                </div>
            </Layout>
        )
    }
    return <Outlet />
}

export default ProtectedStatus
