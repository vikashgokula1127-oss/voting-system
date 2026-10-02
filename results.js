import {auth,db} from "./firebase-config.js";
import {onAuthStateChanged} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {doc,getDoc,collection,getDocs} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
const id=new URLSearchParams(location.search).get("id"),app=document.getElementById("app");
onAuthStateChanged(auth,async u=>{if(!u){location.href="login.html";return}const e=await getDoc(doc(db,"elections",id));if(!e.exists()){app.innerHTML="<div class=card>Not found</div>";return}const s=await getDocs(collection(db,"elections",id,"candidates"));let rows="";s.forEach(c=>rows+=`<tr><td>${esc(c.data().name)}</td><td>${c.data().votes||0}</td></tr>`);app.innerHTML=`<div class=card><h2>${esc(e.data().title)} — Results</h2><table><tr><th>Candidate</th><th>Votes</th></tr>${rows}</table></div>`});
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
