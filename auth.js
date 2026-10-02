import {auth,db} from "./firebase-config.js";
import {createUserWithEmailAndPassword,signInWithEmailAndPassword,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {doc,setDoc,getDoc,serverTimestamp} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const msg=document.getElementById("msg");
const reg=document.getElementById("registerBtn");
const login=document.getElementById("loginBtn");

if(reg) reg.onclick=async()=>{try{
 const name=document.getElementById("name").value.trim(),email=document.getElementById("email").value.trim(),password=document.getElementById("password").value;
 if(!name||!email||password.length<6) throw new Error("Enter all details. Password must be 6+ characters.");
 const c=await createUserWithEmailAndPassword(auth,email,password);
 await setDoc(doc(db,"users",c.user.uid),{name,email,role:"voter",createdAt:serverTimestamp()});
 location.href="voter.html";
}catch(e){msg.textContent=e.message;msg.className="error"}};

if(login) login.onclick=async()=>{try{
 await signInWithEmailAndPassword(auth,document.getElementById("email").value.trim(),document.getElementById("password").value);
 const s=await getDoc(doc(db,"users",auth.currentUser.uid));
 if(s.exists()&&s.data().role==="host") location.href="host.html"; else location.href="voter.html";
}catch(e){msg.textContent=e.message;msg.className="error"}};

onAuthStateChanged(auth,u=>{if(u&&location.pathname.endsWith("login.html")){}});
