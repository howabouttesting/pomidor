import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout} from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import {getDownloadURL, getStorage, ref} from "firebase/storage"

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [catUrl, setUrl] = useState();
  const navigate = useNavigate();
  
  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    const storage = getStorage();
    const starsRef = ref(storage, 'images/cats/k'+Math.floor(Math.random() * 5)+'.jpeg');
    getDownloadURL(starsRef).then(function(result){
      setUrl(result);
    })

    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
  }, [user, loading ]);
  return (
    <div className="dashboard">
       <div className="dashboard__container">
        <div>
        <img src={catUrl} width="250" height="200"/>
        </div>
        
        Hello {name}. How are you today?
         <div>{user?.email}</div>
         <button className="dashboard__btn" onClick={logout}>
          Logout
         </button>
       </div>
     </div>
  );
}
export default Dashboard;