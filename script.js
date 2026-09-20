// Alfrzo frontend — demo-ready UI with optional Supabase integration.
const citiesByState={
  "Karnataka":["Bengaluru","Mysuru","Mangaluru","Hubballi"],
  "Maharashtra":["Mumbai","Pune","Nagpur","Nashik"],
  "Delhi":["New Delhi"],
  "Telangana":["Hyderabad","Warangal"],
  "Tamil Nadu":["Chennai","Coimbatore","Madurai"],
  "West Bengal":["Kolkata","Howrah"],
  "Uttar Pradesh":["Noida","Lucknow","Kanpur","Varanasi"],
  "Gujarat":["Ahmedabad","Surat","Vadodara"],
  "Rajasthan":["Jaipur","Udaipur","Jodhpur"],
  "Kerala":["Kochi","Thiruvananthapuram"]
};
const cityImages={
 Bengaluru:"https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=900&q=80",
 Mumbai:"https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=900&q=80",
 Pune:"https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=900&q=80",
 Hyderabad:"https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?auto=format&fit=crop&w=900&q=80",
 Chennai:"https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=900&q=80",
 Delhi:"https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=900&q=80",
 Kolkata:"https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=900&q=80",
 Jaipur:"https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=80",
 Kochi:"https://images.unsplash.com/photo-1602303777238-6f5f9e7f2f1d?auto=format&fit=crop&w=900&q=80",
 Mysuru:"https://images.unsplash.com/photo-1600112356915-9e1b9a5a1f75?auto=format&fit=crop&w=900&q=80"
};
const demoRooms=[
 {id:"r1",title:"Modern private room near ITPL",state:"Karnataka",city:"Bengaluru",area:"Whitefield",rent:8500,deposit:17000,type:"Private Room",gender:"Men",furnishing:"Fully Furnished",verified:true,image:cityImages.Bengaluru,facilities:["WiFi","AC","Bed"],nearby:"ITPL • Metro • Phoenix Mall",description:"Bright furnished room with easy access to offices, metro and daily essentials.",phone:"9999999999",status:"available"},
 {id:"r2",title:"Girls PG near HSR Layout",state:"Karnataka",city:"Bengaluru",area:"HSR Layout",rent:7200,deposit:12000,type:"PG",gender:"Women",furnishing:"Fully Furnished",verified:true,image:"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80",facilities:["WiFi","Food","Security"],nearby:"HSR BDA Complex • Bus Stop",description:"Managed PG with furnished rooms and common facilities.",phone:"9999999999",status:"available"},
 {id:"r3",title:"Affordable shared flat in Gachibowli",state:"Telangana",city:"Hyderabad",area:"Gachibowli",rent:6500,deposit:10000,type:"Shared Room",gender:"Anyone",furnishing:"Semi Furnished",verified:false,image:cityImages.Hyderabad,facilities:["WiFi","Parking"],nearby:"Metro • Tech parks • Cafes",description:"Budget-friendly shared accommodation close to major work hubs.",phone:"9999999999",status:"available"},
 {id:"r4",title:"Premium 1 BHK close to metro",state:"Maharashtra",city:"Mumbai",area:"Andheri",rent:18000,deposit:36000,type:"1 BHK",gender:"Anyone",furnishing:"Fully Furnished",verified:true,image:cityImages.Mumbai,facilities:["AC","WiFi","Kitchen"],nearby:"Metro • Station • Market",description:"Compact premium home with good connectivity.",phone:"9999999999",status:"available"},
 {id:"r5",title:"Student-friendly room near university",state:"Delhi",city:"New Delhi",area:"North Campus",rent:9500,deposit:19000,type:"Private Room",gender:"Anyone",furnishing:"Semi Furnished",verified:true,image:cityImages.Delhi,facilities:["WiFi","Study Table"],nearby:"University • Metro • Cafes",description:"Convenient room for students with essentials nearby.",phone:"9999999999",status:"available"},
 {id:"r6",title:"Furnished room in Koregaon Park",state:"Maharashtra",city:"Pune",area:"Koregaon Park",rent:11000,deposit:22000,type:"Private Room",gender:"Women",furnishing:"Fully Furnished",verified:true,image:cityImages.Pune,facilities:["WiFi","AC","Washing Machine"],nearby:"Cafes • Offices • Bus Stop",description:"Furnished room in a popular residential and lifestyle area.",phone:"9999999999",status:"available"}
];
let rooms=[...demoRooms], currentRooms=[...rooms], currentRoom=null;
let saved=JSON.parse(localStorage.getItem("alfrzo_saved")||"[]");
let bookings=JSON.parse(localStorage.getItem("alfrzo_bookings")||"[]");
let user=JSON.parse(localStorage.getItem("alfrzo_user")||"null");
let authMode="login";

function $(id){return document.getElementById(id)}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function money(v){return "₹"+Number(v||0).toLocaleString("en-IN")}
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");clearTimeout(window._toast);window._toast=setTimeout(()=>t.classList.remove("show"),2200)}
function imageFor(city){return cityImages[city]||"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80"}

function init(){
  renderCities();renderStates();renderRooms(rooms,$("roomsSection"));updateSaved();renderBookings();updateUser();
  const last=localStorage.getItem("alfrzo_last_city"); if(last) $("continueSection").classList.remove("hidden");
}
function renderCities(){
  const list=[["Bengaluru","Karnataka"],["Mumbai","Maharashtra"],["Pune","Maharashtra"],["Hyderabad","Telangana"],["Chennai","Tamil Nadu"],["Delhi","Delhi"],["Kolkata","West Bengal"],["Jaipur","Rajasthan"]];
  $("popularCities").innerHTML=list.slice(0,5).map(([city,state])=>`<article class="city-card" style="background-image:url('${imageFor(city)}')" onclick="searchByCity('${city}')"><div><strong>${city}</strong><span>${state}</span></div></article>`).join("");
}
function renderStates(){
  const states=["Karnataka","Maharashtra","Delhi","Telangana","Tamil Nadu","West Bengal","Uttar Pradesh","Gujarat","Rajasthan","Kerala"];
  $("stateCards").innerHTML=states.map(s=>`<button class="state-card" onclick="searchByState('${s}')"><span class="state-icon">⌖</span><span><strong>${s}</strong><span>${citiesByState[s].length} cities</span></span></button>`).join("");
}
function populateCities(){
  const state=$("stateSelect").value, sel=$("citySelect"); sel.innerHTML='<option value="">Select City</option>'+(citiesByState[state]||[]).map(c=>`<option>${c}</option>`).join("");
}
function populateOwnerCities(){
  const state=$("fState").value, sel=$("fCity"); sel.innerHTML='<option value="">Select city</option>'+(citiesByState[state]||[]).map(c=>`<option>${c}</option>`).join("");
}
function searchRooms(){
  const city=$("citySelect").value,state=$("stateSelect").value;
  currentRooms=rooms.filter(r=>(!state||r.state===state)&&(!city||r.city===city));
  $("roomsTitle").textContent=city?`Rooms in ${city}`:state?`Rooms in ${state}`:"Rooms in India";
  $("resultText").textContent=`${currentRooms.length} listing${currentRooms.length===1?"":"s"} found`;
  renderRooms(currentRooms,$("roomResults"));showSection("rooms");
  if(city)localStorage.setItem("alfrzo_last_city",city);
}
function searchByCity(city){
  currentRooms=rooms.filter(r=>r.city===city);$("roomsTitle").textContent=`Rooms in ${city}`;$("resultText").textContent=`${currentRooms.length} listing${currentRooms.length===1?"":"s"} found`;renderRooms(currentRooms,$("roomResults"));showSection("rooms");localStorage.setItem("alfrzo_last_city",city);
}
function searchByState(state){
  currentRooms=rooms.filter(r=>r.state===state);$("roomsTitle").textContent=`Rooms in ${state}`;$("resultText").textContent=`${currentRooms.length} listing${currentRooms.length===1?"":"s"} found`;renderRooms(currentRooms,$("roomResults"));showSection("rooms");
}
function roomCard(r){
  const isSaved=saved.includes(r.id);
  return `<article class="room-card"><div class="room-img" style="background-image:url('${esc(r.image||imageFor(r.city))}')"><span class="badge">${r.verified?"✓ Verified":"New listing"}</span><button class="heart ${isSaved?"saved":""}" onclick="event.stopPropagation();toggleSave('${r.id}')">${isSaved?"♥":"♡"}</button></div><div class="room-body"><div class="room-top"><span class="verified">${r.verified?"✓ Verified":" "}</span></div><h3>${esc(r.title)}</h3><div class="room-meta">⌖ ${esc(r.area)}, ${esc(r.city)} · ${esc(r.gender==="Men"?"Boys":r.gender==="Women"?"Girls":r.gender)}</div><div class="room-price">${money(r.rent)} <small>/ month</small></div><div class="tag-list">${(r.facilities||[]).slice(0,3).map(x=>`<span class="tag">${esc(x)}</span>`).join("")}</div><div class="card-actions"><button class="view-btn" onclick="openRoom('${r.id}')">View details</button><button class="wa-btn" onclick="event.stopPropagation();whatsapp('${r.id}')">WhatsApp</button></div></div></article>`;
}
function renderRooms(list,target){
  target.innerHTML=list.length?list.map(roomCard).join(""):`<div class="empty-state" style="grid-column:1/-1"><div>⌂</div><h3>No rooms found</h3><p>Try another city or relax your filters.</p></div>`;
}
function toggleSave(id){
  saved=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];localStorage.setItem("alfrzo_saved",JSON.stringify(saved));updateSaved();renderRooms(currentRooms,$("roomResults"));renderRooms(rooms,$("roomsSection"));toast(saved.includes(id)?"Added to wishlist":"Removed from wishlist");
}
function updateSaved(){
  $("navSavedCount").textContent=saved.length;
  const list=rooms.filter(r=>saved.includes(r.id));$("savedGrid").innerHTML=list.map(roomCard).join("");$("savedEmpty").classList.toggle("hidden",list.length>0);
}
function quickFilter(kind,btn){document.querySelectorAll(".filter-chip").forEach(x=>x.classList.remove("active"));btn.classList.add("active");let list=[...rooms];if(kind==="verified")list=list.filter(r=>r.verified);if(kind==="boys")list=list.filter(r=>r.gender==="Men");if(kind==="girls")list=list.filter(r=>r.gender==="Women");if(kind==="family")list=list.filter(r=>r.gender==="Family");currentRooms=list;renderRooms(list,$("roomsSection"))}
function applyLocalFilters(){
  let list=[...currentRooms];const rent=$("rentFilter")?.value||$("resultRent")?.value;const type=$("typeFilter")?.value||$("resultType")?.value;const gender=$("resultGender")?.value;
  if(rent)list=list.filter(r=>Number(r.rent)<=Number(rent));if(type)list=list.filter(r=>r.type===type);if(gender)list=list.filter(r=>r.gender===gender);renderRooms(list,$("roomsSection"));if($("rooms").classList.contains("active"))renderRooms(list,$("roomResults"));
}
function resetFilters(){currentRooms=[...rooms];["rentFilter","resultRent","typeFilter","resultType","resultGender"].forEach(id=>{if($(id))$(id).value=""});renderRooms(rooms,$("roomsSection"))}
function sortRooms(){const v=$("sort").value,list=[...currentRooms].sort((a,b)=>v==="low"?a.rent-b.rent:v==="high"?b.rent-a.rent:0);renderRooms(list,$("roomResults"))}
function openRoom(id){
  currentRoom=rooms.find(r=>r.id===id);if(!currentRoom)return;
  const r=currentRoom;$("modalGallery").style.backgroundImage=`url('${r.image||imageFor(r.city)}')`;$("modalType").textContent=r.type;$("modalVerified").textContent=r.verified?"✓ Verified listing":"";
  $("modalTitle").textContent=r.title;$("modalArea").textContent=`⌖ ${r.area}, ${r.city}, ${r.state}`;$("modalPrice").textContent=`${money(r.rent)} / month`;$("modalTotal").textContent=`Approx. monthly rent • Deposit ${money(r.deposit)}`;
  $("modalTags").innerHTML=(r.facilities||[]).map(x=>`<span class="tag">${esc(x)}</span>`).join("");$("modalDesc").textContent=r.description||"";$("modalDeposit").textContent=money(r.deposit);$("modalNearby").textContent=r.nearby||"—";$("modalRules").textContent=r.rules||"Please discuss property rules with the owner.";
  $("modalWa").onclick=()=>whatsapp(r.id);$("modalCall").onclick=()=>callOwner(r.id);$("modalSave").onclick=()=>toggleSave(r.id);$("modalCompare").onclick=()=>toast("Compare added");$("modalBook").onclick=()=>requestBooking(r.id);loadReviews(r.id);$("modal").classList.remove("hidden");
}
function closeModal(){$("modal").classList.add("hidden")}
function whatsapp(id){const r=rooms.find(x=>x.id===id);if(!r)return;window.open(`https://wa.me/91${String(r.phone||"9999999999").replace(/\D/g,"")}?text=${encodeURIComponent("Hi, I found your room on Alfrzo: "+r.title)}`,"_blank")}
function callOwner(id){const r=rooms.find(x=>x.id===id);if(r)window.location.href=`tel:${r.phone||""}`}
function requestBooking(id){
  const r=rooms.find(x=>x.id===id);if(!r)return;
  if(!user){closeModal();openAuth();toast("Login to request a booking");return}
  const b={id:"b"+Date.now(),roomId:r.id,title:r.title,city:r.city,image:r.image,status:"Pending",createdAt:new Date().toISOString()};bookings.unshift(b);localStorage.setItem("alfrzo_bookings",JSON.stringify(bookings));renderBookings();closeModal();showSection("bookings");toast("Booking request sent");
}
function renderBookings(){
  $("bookingList").innerHTML=bookings.map(b=>`<article class="booking-card"><div class="booking-thumb" style="background-image:url('${esc(b.image||imageFor(b.city))}')"></div><div><h3>${esc(b.title)}</h3><p>${esc(b.city)} · Requested ${new Date(b.createdAt).toLocaleDateString("en-IN")}</p></div><span class="status">${esc(b.status)}</span></article>`).join("");$("bookingEmpty").classList.toggle("hidden",bookings.length>0)
}
function loadReviews(){ $("reviewArea").innerHTML='<div class="review-item"><strong>New Alfrzo listing</strong><span>Reviews from verified users will appear here.</span></div>'}
function showSection(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));const page=$(id);if(page)page.classList.add("active");
  document.querySelectorAll(".bottom-nav button").forEach(b=>b.classList.toggle("active",b.dataset.page===id));window.scrollTo({top:0,behavior:"smooth"});
  if(id==="saved")updateSaved();if(id==="bookings")renderBookings();if(id==="profile")updateUser();
}
function openMenu(){$("menuDrawer").classList.remove("hidden")}
function closeMenu(){$("menuDrawer").classList.add("hidden")}
function showFromMenu(id){closeMenu();showSection(id)}
function openOwnerFromMenu(){closeMenu();openOwnerForm()}
function openOwnerForm(){if(!user){openAuth();toast("Login to list a room");return}showSection("owner")}
function toggleTheme(){document.body.classList.toggle("dark");localStorage.setItem("alfrzo_theme",document.body.classList.contains("dark")?"dark":"light")}
function updateUser(){
  $("profileName").textContent=user?.name||"Guest";$("drawerName").textContent=user?.name||"Guest";$("profileHint").innerHTML=user?`Logged in as ${esc(user.email)}`:`Kindly <button class="inline-link" onclick="openAuth()">login</button> to see full details.`;$("drawerLogin").textContent=user?user.email:"Login to continue";
}
function openAuth(){authMode="login";$("authTitle").textContent="Welcome back";$("authHint").textContent="Login to save rooms and manage bookings.";$("authMsg").textContent="";$("authModal").classList.remove("hidden")}
function closeAuth(){$("authModal").classList.add("hidden")}
function switchAuth(){authMode=authMode==="login"?"signup":"login";$("authTitle").textContent=authMode==="signup"?"Create your Alfrzo account":"Welcome back";$("authHint").textContent=authMode==="signup"?"Create an account to save rooms and request bookings.":"Login to save rooms and manage bookings."}
function submitAuth(e){e.preventDefault();const email=$("authEmail").value.trim();user={name:email.split("@")[0],email};localStorage.setItem("alfrzo_user",JSON.stringify(user));updateUser();closeAuth();toast(authMode==="signup"?"Account created":"Logged in")}
function copyReferral(){navigator.clipboard?.writeText(location.href+"?ref=alfrzo");toast("Referral link copied")}
function submitListing(e){
  e.preventDefault();if(!user){openAuth();return}
  const id=$("editId").value||"local_"+Date.now();const existing=rooms.find(r=>r.id===id);const obj={id,title:$("fTitle").value,state:$("fState").value,city:$("fCity").value,area:$("fArea").value,rent:Number($("fRent").value),deposit:Number($("fDeposit").value||0),type:$("fType").value,gender:$("fGender").value,furnishing:$("fFurnishing").value,verified:false,image:$("fImage").value||imageFor($("fCity").value),facilities:$("fFacilities").value.split(",").map(x=>x.trim()).filter(Boolean),nearby:$("fNearby").value,rules:$("fRules").value,description:$("fDesc").value,phone:$("fPhone").value||"",status:"available"};
  if(existing)rooms=rooms.map(r=>r.id===id?{...r,...obj}:r);else rooms.unshift(obj);localStorage.setItem("alfrzo_local_rooms",JSON.stringify(rooms.filter(r=>String(r.id).startsWith("local_"))));currentRooms=[...rooms];$("listingForm").reset();$("editId").value="";showSection("home");renderRooms(rooms,$("roomsSection"));toast(existing?"Listing updated":"Listing published");
}
(function(){
  const local=JSON.parse(localStorage.getItem("alfrzo_local_rooms")||"[]");rooms=[...local,...demoRooms];
  if(localStorage.getItem("alfrzo_theme")==="dark")document.body.classList.add("dark");
  init();
})();
