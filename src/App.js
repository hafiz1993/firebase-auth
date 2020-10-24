import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser] =useState(false)
  const [user, setUser] = useState({
    isSignIn: false,
    newUser:false,
    name: '',
    email:'', 
    password:'',
    photo:''
  })



const provider = new firebase.auth.GoogleAuthProvider();
const handleSignIn = () =>{
  firebase.auth().signInWithPopup(provider)
  .then(res => {
    const {displayName, photoURL, email} = res.user;
    const signInUser = {
      isSignIn: true,
      name: displayName,
      email:email, 
      photo:photoURL
    }
    setUser(signInUser);
    // console.log(displayName, photoURL, email);
  })
  .catch(error =>{
    console.log(error);
    console.log(error.massage);
  });

}

const handleSignOut = () =>{
  firebase.auth().signOut()
  .then (res=>{
   const signOutUser ={
    isSignIn: false,
    name: '',
    email:'', 
    photo:''
   }
   setUser(signOutUser);
  })
  .catch(error =>{

  })
}

const handleSubmit = (e) =>{
if (newUser && user.email && user.password){
  firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
  .then(res =>{
    const newUserInfo = {...user};
    newUserInfo.error = '';
    newUserInfo.success = true;
    updateUserInfo(user.name);
    setUser(newUserInfo);
  })
  
  .catch( error =>{
 const newUserInfo ={...user};
 newUserInfo.error = error.message;
 newUserInfo.success = false;
 setUser(newUserInfo);
  });
 
}
if(!newUser && user.email && user.password){
  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then(res =>{
    const newUserInfo = {...user};
    newUserInfo.error = '';
    newUserInfo.success = true;
    setUser(newUserInfo);
    console.log('sign in user info', res.user);
  })
  
  .catch(function(error) {
    const newUserInfo ={...user};
    newUserInfo.error = error.message;
    newUserInfo.success = false;
    setUser(newUserInfo);
    
  });
}
e.preventDefault()
}

const handleBlur = (e) =>{
  let isFormValid =true;
  console.log(e.target.value, e.target.name);
  if(e.target.name ==='email'){
    const isEmailValid  = /\S+@\S+\.\S+/.test(e.target.value);
    console.log(isEmailValid);
  }
  if(e.target.name === 'password'){
    const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      // console.log(isPasswordValid && passwordHasNumber);
      isFormValid = isPasswordValid && passwordHasNumber;
  }
  if(isFormValid){
    const newUserInfo = {...user};
    newUserInfo[e.target.name] = e.target.value;
    setUser(newUserInfo);

  }

}

const updateUserInfo = name  =>{
  const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name
     
    }).then(function() {
      console.log('user name updated')
    }).catch(function(error) {
      console.log(error)
    });
}


  return (
    <div className="App">
      { user.isSignIn ? <button onClick={handleSignOut}>Sign out</button> :
      <button onClick={handleSignIn}>google</button>
       
       }
      {
        user.isSignIn && <div>
        <p>welcome, {user.name}</p> 
        <p>{user.email}</p>  
        <img src={user.photo} alt=""/>    
        </div> 
        
      }

      <h1>Our own Authentication</h1>
      {/* <p>Email:{user.email}</p>
    <p>Password:{user.password}</p> */}
    <input type="checkbox" onChange={()=> setNewUser(!newUser)} name="newUser" id=""/>
    <label htmlFor="newUser">New User Sign Up</label>
      <form onSubmit={handleSubmit}>
      {newUser && <input type="text" onBlur={handleBlur} name="name" id="" placeholder="name" />}
      <br/>
      <input type="text" onBlur={handleBlur} name="email" id="" placeholder="email" required/>
      <br/>
     <input type="password" onBlur={handleBlur} name="password" id="" placeholder="password"required/>
      <br/>
      
      <input type="submit" value="Submit"/>
      </form>
  <p style={{color:'red'}}>{user.error}</p>
  {user.success && <p style={{color:'green'}}>User {newUser ? 'Created': 'Logged In'} Successfully</p>}
    </div>
  );
}

export default App;
