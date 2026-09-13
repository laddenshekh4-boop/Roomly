const DEMO_ROOMS=[
{id:1,title:"Furnished Single Room",area:"Whitefield, Bengaluru",rent:7500,deposit:15000,type:"Single Room",image_url:"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",facilities:["Wi-Fi","Attached Bathroom","Parking"],phone:"919876543210",description:"Clean furnished room close to offices and public transport.",verified:true},
{id:2,title:"Modern PG for Working Professionals",area:"HSR Layout, Bengaluru",rent:9000,deposit:18000,type:"PG",image_url:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",facilities:["Wi-Fi","AC","Food"],phone:"919876543211",description:"Comfortable PG with modern facilities.",verified:true},
{id:3,title:"Affordable Shared Room",area:"Electronic City, Bengaluru",rent:5000,deposit:10000,type:"Shared Room",image_url:"https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=900&q=80",facilities:["Wi-Fi","Parking"],phone:"919876543212",description:"Budget-friendly shared room near IT parks.",verified:false},
{id:4,title:"Cozy 1BHK Apartment",area:"Marathahalli, Bengaluru",rent:12500,deposit:25000,type:"1BHK",image_url:"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",facilities:["AC","Attached Bathroom","Parking"],phone:"919876543213",description:"Private 1BHK suitable for working professionals.",verified:true}];

let supabaseClient=null,user=null,rooms=[],filtered=[],authMode="login";

function configured(){return window.ROOMLY_SUPABASE_URL && !window.ROOMLY_SUPABASE_URL.startsWith("PASTE_") && window.ROOMLY_SUPABASE_KEY && !window.ROOMLY_SUPABASE_KEY.startsWith("PASTE_")}
if(configured() && window.supabase) supabaseClient=window.supabase.createClient(window.ROOMLY_SUPABASE_URL,window.ROOMLY_SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});

const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const localSaved=()=>JSON.parse(localStorage.getItem("roomlySaved")||"[]").map(Number);

async function init(){
 if(supabaseClient){
  const s=await supabaseClient.auth.getSession(); user=s.data.session?.user||null;
  supabaseClient.auth.onAuthStateChange((_e,session)=>{user=session?.user||null;updateUserUI();loadRooms();});
  await loadRooms();
 }else{
  rooms=JSON.parse(localStorage.getItem("roomlyRooms")||"null")||DEMO_ROOMS;
  filtered=[...rooms];render();updateUserUI();
 }
}

async function loadRooms(){
 if(!supabaseClient){render();return}
 const {data,error}=await supabaseClient.from("rooms").select("*").eq("status","active").order("created_at",{ascending:false});
 if(error){console.error(error);rooms=DEMO_ROOMS;toast("Database setup not finished — showing demo rooms.");}
 else rooms=data||[];
 filtered=[...rooms];render();
}

function card(r){
 const p=String(r.phone||"").replace(/\D/g,""),saved=localSaved().includes(+r.id);
 const wa=`https://wa.me/${p}?text=${encodeURIComponent("Hi, I found your room on Roomly: "+r.title+" in "+r.area+". Is it available?")}`;
 const fac=r.facilities||[];
 return `<article class="card"><img src="${esc(r.image_url)}" alt="${esc(r.title)}" onclick="openRoom('${r.id}')"><div class="card-body"><div class="muted">${esc(r.type)}${r.verified?" • ✓ Verified":""}</div><h3>${esc(r.title)}</h3><div class="muted">📍 ${esc(r.area)}</div><p class="price">₹${Number(r.rent).toLocaleString("en-IN")} <small>/month</small></p><div class="tags">${fac.map(x=>`<span class="tag">${esc(x)}</span>`).join("")}</div><p class="muted">${esc(r.description||"")}</p><div class="actions"><a class="wa" target="_blank" href="${wa}">💬 WhatsApp</a><button class="save" onclick="saveRoom('${r.id}')">${saved?"♥ Saved":"♡ Save"}</button><button class="call" onclick="callOwner('${p}')">📞</button></div></div></article>`;
}
function render(){
 const s=document.getElementById("sort").value,list=[...filtered].sort((a,b)=>s==="low"?a.rent-b.rent:s==="high"?b.rent-a.rent:0);
 document.getElementById("roomGrid").innerHTML=list.length?list.map(card).join(""):"<p class='muted'>No matching rooms found.</p>";
 document.getElementById("resultText").textContent=`${list.length} room${list.length!==1?"s":""} found`;
 renderSaved();updateStats();
}
async function renderSaved(){
 if(!user){document.getElementById("savedGrid").innerHTML="<p class='muted'>Login to sync your saved rooms.</p>";return}
 const {data,error}=await supabaseClient.from("favorites").select("room_id").eq("user_id",user.id);
 if(error){document.getElementById("savedGrid").innerHTML="<p class='muted'>Could not load saved rooms.</p>";return}
 const ids=(data||[]).map(x=>String(x.room_id)),list=rooms.filter(r=>ids.includes(String(r.id)));
 document.getElementById("savedGrid").innerHTML=list.length?list.map(card).join(""):"<p class='muted'>No saved rooms yet.</p>";
}
async function saveRoom(id){
 if(!user){openAuth();return}
 const {data}=await supabaseClient.from("favorites").select("id").eq("user_id",user.id).eq("room_id",id).maybeSingle();
 if(data){await supabaseClient.from("favorites").delete().eq("id",data.id)}else{const {error}=await supabaseClient.from("favorites").insert({user_id:user.id,room_id:id});if(error){toast(error.message);return}}
 render();
}
function searchRooms(){
 const l=document.getElementById("location").value.toLowerCase().trim(),max=+document.getElementById("maxRent").value||Infinity,t=document.getElementById("type").value,fs=[...document.querySelectorAll(".facility:checked")].map(x=>x.value);
 filtered=rooms.filter(r=>(!l||String(r.area).toLowerCase().includes(l)||String(r.title).toLowerCase().includes(l))&&Number(r.rent)<=max&&(!t||r.type===t)&&fs.every(f=>(r.facilities||[]).includes(f)));
 render();document.getElementById("rooms").scrollIntoView({behavior:"smooth"});
}
function clearFilters(){document.getElementById("location").value="";document.getElementById("maxRent").value="";document.getElementById("type").value="";document.querySelectorAll(".facility").forEach(x=>x.checked=false);filtered=[...rooms];render()}
function callOwner(p){if(p)location.href="tel:"+p}
function openRoom(id){
 const r=rooms.find(x=>String(x.id)===String(id));if(!r)return;
 modalImg.src=r.image_url;modalTitle.textContent=r.title;modalType.textContent=r.type+(r.verified?" • ✓ Verified":"");modalArea.textContent="📍 "+r.area;modalPrice.innerHTML="₹"+Number(r.rent).toLocaleString("en-IN")+" <small>/month</small>";modalTags.innerHTML=(r.facilities||[]).map(x=>`<span class="tag">${esc(x)}</span>`).join("");modalDesc.textContent=r.description||"";modalDeposit.textContent=r.deposit?"Security deposit: ₹"+Number(r.deposit).toLocaleString("en-IN"):"";
 const p=String(r.phone||"").replace(/\D/g,"");modalWa.href=`https://wa.me/${p}?text=${encodeURIComponent("Hi, I found your room on Roomly: "+r.title+" in "+r.area+". Is it available?")}`;modalCall.onclick=()=>callOwner(p);modalSave.onclick=()=>saveRoom(r.id);modalReport.onclick=()=>reportRoom(r.id);document.getElementById("modal").classList.add("open")
}
function closeModal(e){if(!e||e.target.id==="modal")document.getElementById("modal").classList.remove("open")}
async function reportRoom(id){if(!user){openAuth();return}const reason=prompt("Why are you reporting this listing?","Incorrect or suspicious listing");if(!reason)return;const {error}=await supabaseClient.from("reports").insert({user_id:user.id,room_id:id,reason});toast(error?error.message:"🚩 Report submitted.");}
function toggleTheme(){document.body.classList.toggle("dark");localStorage.setItem("roomlyTheme",document.body.classList.contains("dark")?"dark":"light");document.querySelector(".theme").textContent=document.body.classList.contains("dark")?"☀️":"🌙"}
function openAuth(){document.getElementById("authModal").classList.add("open");document.getElementById("authMsg").textContent=""}
function closeAuth(){document.getElementById("authModal").classList.remove("open")}
function switchAuth(){authMode=authMode==="login"?"signup":"login";document.getElementById("authTitle").textContent=authMode==="login"?"Login to Roomly":"Create your Roomly account";document.querySelector("#authModal .secondary").textContent=authMode==="login"?"Create account":"Back to login";document.getElementById("authMsg").textContent=""}
async function submitAuth(){
 if(!supabaseClient){document.getElementById("authMsg").textContent="First connect Supabase in config.js.";return}
 const email=authEmail.value.trim(),password=authPassword.value;if(password.length<6){authMsg.textContent="Password must be at least 6 characters.";return}
 let res=authMode==="login"?await supabaseClient.auth.signInWithPassword({email,password}):await supabaseClient.auth.signUp({email,password});
 if(res.error){authMsg.textContent=res.error.message;return}
 authMsg.style.color="#16823b";authMsg.textContent=authMode==="signup"?"Account created. Check your email if confirmation is enabled.":"Logged in.";setTimeout(closeAuth,900)
}
async function updateUserUI(){
 const el=document.getElementById("userStatus");el.textContent=user?`Logged in: ${user.email}`:"Not logged in";
 document.querySelector(".login-mini").textContent=user?"Logout":"Login";
 document.querySelector(".login-mini").onclick=user?logout:openAuth;
}
async function logout(){if(supabaseClient)await supabaseClient.auth.signOut()}
async function updateStats(){
 document.getElementById("statListings").textContent=user?rooms.filter(r=>r.user_id===user.id).length:"0";
 document.getElementById("statSaved").textContent=user?document.querySelectorAll("#savedGrid .card").length:"0";
 document.getElementById("statReports").textContent="—";
}
document.getElementById("listingForm").addEventListener("submit",async e=>{
 e.preventDefault();if(!user){openAuth();return}
 if(!supabaseClient){toast("Connect Supabase first.");return}
 const r={user_id:user.id,title:fTitle.value.trim(),area:fArea.value.trim(),rent:+fRent.value,deposit:+fDeposit.value||0,type:fType.value,image_url:fImage.value.trim()||DEMO_ROOMS[0].image_url,phone:fPhone.value.trim(),facilities:fFacilities.value.split(",").map(x=>x.trim()).filter(Boolean),description:fDesc.value.trim(),status:"active",verified:false};
 const {error}=await supabaseClient.from("rooms").insert(r);if(error){toast(error.message);return}e.target.reset();await loadRooms();toast("✅ Listing published online.");document.getElementById("rooms").scrollIntoView({behavior:"smooth"})
});
function toast(msg){alert(msg)}
if(localStorage.getItem("roomlyTheme")==="dark"){document.body.classList.add("dark");document.querySelector(".theme").textContent="☀️"}
init();

