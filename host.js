import {auth,db} from "./firebase-config.js";
import {onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {doc,getDoc,collection,addDoc,getDocs,query,where,serverTimestamp,Timestamp} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const msg=document.getElementById("msg");
document.getElementById("logout").onclick=()=>signOut(auth).then(()=>location.href="index.html");
let uid;
onAuthStateChanged(auth,async u=>{if(!u){location.href="login.html";return}uid=u.uid;const s=await getDoc(doc(db,"users",uid));if(!s.exists()||s.data().role!=="host"){location.href="voter.html";return}load()});
document.getElementById("createEvent").onclick=async()=>{try{
 const title=document.getElementById("title").value.trim(),description=document.getElementById("description").value.trim(),a=document.getElementById("startAt").value,b=document.getElementById("endAt").value;
 if(!title)throw new Error("Enter an election title.");
 const ref=await addDoc(collection(db,"elections"),{title,description,hostId:uid,status:"published",startAt:a?Timestamp.fromDate(new Date(a)):null,endAt:b?Timestamp.fromDate(new Date(b)):null,createdAt:serverTimestamp()});
 msg.textContent="Election created. Now add candidates below.";msg.className="success";load();
 }catch(e){msg.textContent=e.message;msg.className="error"}};
async function load(){const box=document.getElementById("events");box.innerHTML="";const s=await getDocs(query(collection(db,"elections"),where("hostId","==",uid)));
 for(const d of s.docs){const e=d.data();box.innerHTML+=`<div class=card><h3>${esc(e.title)}</h3><p>${esc(e.description||"")}</p><a class=btn href="manage.html?id=${d.id}">Manage Candidates</a> <a class="btn secondary" href="results.html?id=${d.id}">Results</a></div>`}}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
