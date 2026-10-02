import {auth,db} from "./firebase-config.js";
import {onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {collection,getDocs,query,where,doc,getDoc} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

document.getElementById("logout").onclick=()=>signOut(auth).then(()=>location.href="index.html");
onAuthStateChanged(auth,async u=>{if(!u){location.href="login.html";return}
 const us=await getDoc(doc(db,"users",u.uid)); document.getElementById("welcome").textContent="Welcome, "+(us.data()?.name||u.email);
 const box=document.getElementById("events"); box.innerHTML="";
 const snap=await getDocs(query(collection(db,"elections"),where("status","==","published")));
 if(snap.empty){box.innerHTML='<div class="card">No active elections.</div>';return}
 for(const d of snap.docs){const e=d.data();const end=e.endAt?.toDate?.(); const start=e.startAt?.toDate?.();
  let open=(!start||new Date()>=start)&&(!end||new Date()<=end);
  box.innerHTML+=`<div class="card"><h3>${esc(e.title)}</h3><p>${esc(e.description||"")}</p><p class="muted">${open?"Voting is open":"Voting is closed"}</p>${open?`<a class="btn" href="vote.html?id=${d.id}">Vote</a>`:`<a class="btn secondary" href="results.html?id=${d.id}">View Results</a>`}</div>`;
 }});
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
