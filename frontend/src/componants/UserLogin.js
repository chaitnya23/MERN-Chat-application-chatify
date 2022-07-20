import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Profile from "./Profile";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BeatLoader } from "react-spinners";
import Loader from "react-spinners/BarLoader";

export default function UserLogin() {

  const [Loading, setLoading] = useState(false);
  const [loginState, setloginState] = useState(true);
  const [userLogin, setuserLogin] = useState({
    email: "",
    password: "",
  });
  const [profilePic, setprofilePic] = useState("");

  const [userSign, setuserSign] = useState({
    name: "",
    email: "",
    password: "",
  });

  const history = useHistory();
  //handling input changes
  const handleLoginChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setuserLogin({ ...userLogin, [name]: value });
  };

  const handleSigninChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setuserSign({ ...userSign, [name]: value });
  };

  //post login info
  const postLogin = async (e) => {
    e.preventDefault();
    const { email, password } = userLogin;
    if (!email || !password) {
      console.log("fill all fields");
    }

    try {
      const { data } = await axios.post("/api/login", {
        email,
        password,
      });

     localStorage.setItem('userInfo' ,JSON.stringify(data));
     history.push("/chatpage");

    } catch (error) {
      toast.error("wrong credencials.. try again")
    
    }
  };

  //create an user account
  const postSignin = async (e) => {
    e.preventDefault();
    try {
      const { name, email, password } = userSign;

      const { data } = await axios.post("/api/signin", {
        name,
        email,
        password,
        profilePic,
      });
      console.log(data);
      if(data){
        window.alert('signed up successfully !!!');
        localStorage.setItem('userInfo' ,JSON.stringify(data));
        
        history.push("/chatpage");
      }
     

    } catch (error) {
      console.log(error.message);
      window.alert("something went wrong!!");
    }
  };

  //setting profile picture data
  const handleFileChange = async (file) => {
    if (file === undefined) {
      window.alert("something went wrong!! upload ur profile");
    }
    try {
      if (
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg"
      ) {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "socialix");
        data.append("cloud_name", "dkvpwutkh");

        setLoading(true);
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dkvpwutkh/image/upload",
          data
        );
        console.log(res);
        if(res){
          setLoading(false);
          setprofilePic(res.data.url);
        }
      
        window.alert('profile uploaded successfully');
      }
    } catch (error) {
      console.log(error.message);
      setLoading(false);

      window.alert("something went wrong!!");
    }
  };

  return (
    <>
   
    <div className="d-flex main-box-auth">
    
      <div className="container  box shadow-lg py-4"> 
        <div className="row btns justify-content-center m-auto">
          <div
            className=""
            style={
              loginState
                ? { backgroundColor: "#6ec3ed" }
                : { backgroundColor: "white" }
            }
            onClick={() => {
              setloginState(true);
            }}
          >
            Login
          </div>
          <div
            className=""
            style={
              loginState
                ? { backgroundColor: "white" }
                : { backgroundColor: "#6ec3ed" }
            }
            onClick={() => setloginState(false)}
          >
            signin
          </div>
        </div>

        {loginState ? (
          <div className="login-box row  m-auto ">
            <div className="row">
              <div className="form-group my-3">
                <label htmlFor="email">*email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="       email"
                  name="email"
                  id="email"
                  value={userLogin.email}
                  onChange={handleLoginChange}
                />
              </div>

              <div className="form-group my-3">
                <label htmlFor="email">*password</label>

                <input
                  type="password"
                  className="form-control"
                  placeholder="       password"
                  name="password"
                  id="password"
                  value={userLogin.password}
                  onChange={handleLoginChange}
                />
              </div>

              <div className="form-group my-3">
                <input
                  type="button"
                  className="form-control btn btn-primary"
                  value="log in"
                  onClick={postLogin}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="signup-box  row m-auto ">
            <div className="row">
              <div className="form-group my-3">
                <label htmlFor="name">*name</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="       name"
                  name="name"
                  id="name"
                  value={userSign.name}
                  onChange={handleSigninChange}
                />
              </div>
              <div className="form-group my-3">
                <label htmlFor="email">*email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="       email"
                  name="email"
                  id="email"
                  value={userSign.email}
                  onChange={handleSigninChange}
                />
              </div>

              <div className="form-group my-3">
                <label htmlFor="password">*password</label>

                <input
                  type="password"
                  className="form-control"
                  placeholder="       password"
                  name="password"
                  id="password"
                  value={userSign.password}
                  onChange={handleSigninChange}
                />
              </div>

              <div className="form-group my-3">
                <label htmlFor="profile picture">*profile picture</label>

                {Loading?(
                  <BeatLoader loading={Loading} size={20} color="#6bacf7f3"/>
                ):(
                  <input
                  type="file"
                  className="form-control"
                  name="dp"
                  id="profile picture"
                  accept="image/"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                />
                )}
              </div>
              <div className="form-group my-3">
                <input
                  type="button"
                  className="form-control btn btn-primary"
                  value="Sign in"
  
                  onClick={postSignin}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      </div>

      <ToastContainer position="top-center"/>
    </>
  );
}
