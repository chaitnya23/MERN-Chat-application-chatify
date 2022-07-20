import React ,{createContext ,useState ,useContext,useEffect} from 'react'
import { useHistory } from 'react-router-dom';


const UserContext = createContext();

export default function UserIdContext({children}) {

    const [user, setuser] = useState('');
  
    const history = useHistory();

    useEffect(() => {
        
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        
        if(!userInfo){
            history.push('/auth');
        }else{
            
            setuser(userInfo);
            history.push('/chatpage');

        }

        
    } ,[history]);


    return (
       
            <UserContext.Provider value={{user ,setuser}} >
                {children}
            </UserContext.Provider>           
     
    )
}

export const ChatState = ()=>{

    return useContext(UserContext);
};


