import {auth,db} from "./firebase-config.js";
import {onAuthStateChanged} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {doc,getDoc,collection,getDocs,runTransaction,serverTimestamp,increment,update} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const id=new URLSearchParams(location.search).get("id"); const app=document.getElementById("app");
onAuthStateChanged(auth,async u=>{if(!u){location.href="login.html";return} if(!id){app.innerHTML="<div class=card>Election not found.</div>";return}
 const ed=await getDoc(doc(db,"elections",id)); if(!ed.exists()){app.innerHTML="<div class=card>Election not found.</div>";return}
 const e=ed.data(), end=e.endAt?.toDate?.(), start=e.startAt?.toDate?.(); if((start&&new Date()<start)||(end&&new Date()>end)){app.innerHTML="<div class=card>Voting is currently closed.</div>";return}
 const mine=await getDoc(doc(db,"elections",id,"votes",u.uid)); if(mine.exists()){app.innerHTML="<div class=card><h2>You have already voted.</h2><a class=btn href=voter.html>Back</a></div>";return}
 const cs=await getDocs(collection(db,"elections",id,"candidates"));
 app.innerHTML=`<div class=card><h2>${esc(e.title)}</h2><p>${esc(e.description||"")}</p><form id=form>${cs.docs.map(c=>`<div class=candidate><label><input type=radio name=candidate value="${c.id}" required><span><b>${esc(c.data().name)}</b><br>${esc(c.data().description||"")}</span></label></div>`).join("")}<button class=btn type=submit>Submit Vote</button><p id=msg></p></form></div>`;
 document.getElementById("form").onsubmit=async ev=>{ev.preventDefault();const cid=new FormData(ev.target).get("candidate"),msg=document.getElementById("msg");
 try{await runTransaction(db,async tx=>{const voteRef=doc(db,"elections",id,"votes",u.uid);const v=await tx.get(voteRef);if(v.exists())throw new Error("You already voted.");tx.set(voteRef,{candidateId:cid,voterId:u.uid,createdAt:serverTimestamp()});tx.update(doc(db,"elections",id,"candidates",cid),{votes:increment(1)});});msg.textContent="Vote submitted successfully.";msg.className="success";setTimeout(()=>location.href="voter.html",1200)}
 catch(err){msg.textContent=err.message;msg.className="error"}};
});
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
