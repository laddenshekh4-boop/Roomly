const defaultRooms=[
{id:1,title:"Furnished Single Room",area:"Whitefield, Bengaluru",rent:7500,type:"Single Room",img:"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",fac:["Wi-Fi","Attached Bathroom","Parking"],phone:"919876543210",desc:"Clean furnished room close to offices and public transport.",verified:true},
{id:2,title:"Modern PG for Working Professionals",area:"HSR Layout, Bengaluru",rent:9000,type:"PG",img:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",fac:["Wi-Fi","AC","Food"],phone:"919876543211",desc:"Comfortable PG with modern facilities.",verified:true},
{id:3,title:"Affordable Shared Room",area:"Electronic City, Bengaluru",rent:5000,type:"Shared Room",img:"https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=900&q=80",fac:["Wi-Fi","Parking"],phone:"919876543212",desc:"Budget-friendly shared room near IT parks.",verified:false},
{id:4,title:"Cozy 1BHK Apartment",area:"Marathahalli, Bengaluru",rent:12500,type:"1BHK",img:"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",fac:["AC","Attached Bathroom","Parking"],phone:"919876543213",desc:"Private 1BHK suitable for working professionals.",verified:true},
{id:5,title:"Budget Single Room",area:"Koramangala, Bengaluru",rent:8500,type:"Single Room",img:"https://images.unsplash.com/photo-1564078516393-cf04bd966897?auto=format&fit=crop&w=900&q=80",fac:["Wi-Fi","Attached Bathroom"],phone:"919876543214",desc:"Good location with shops and cafes nearby.",verified:false},
{id:6,title:"Girls PG — Near Metro",area:"Indiranagar, Bengaluru",rent:10000,type:"PG",img:"https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=900&q=80",fac:["Wi-Fi","AC","Food"],phone:"919876543215",desc:"PG with easy access to metro and daily essentials.",verified:true}
];
let rooms=JSON.parse(localStorage.getItem("roomlyRooms")||"null")||defaultRooms;
let filtered=[...rooms];

function render(){
 const sort=document.getElementById("sort").value;
 filtered=[...filtered].sort((a,b)=>sort==="low"?a.rent-b.rent:sort==="high"?b.rent-a.rent:0);
 document.getElementById("roomGrid").innerHTML=filtered.length?filtered.map(r=>`
 <article class="card">
 <img src="${r.img||defaultRooms[0].img}" onerror="this.src='${defaultRooms[0].img}'">
 <div class="card-body">
 <div class="muted">${r.type} ${r.verified?" • ✓ Verified":""}</div>
 <h3>${r.title}</h3><div class="muted">📍 ${r.area}</div>
 <p class="price">₹${Number(r.rent).toLocaleString("en-IN")} <small>/month</small></p>
 <div class="tags">${r.fac.map(x=>`<span class="tag">${x}</span>`).join("")}</div>
 <p class="muted">${r.desc||""}</p>
 <div class="actions"><a class="wa" target="_blank" href="https://wa.me/${String(r.phone).replace(/\D/g,"")}?text=${encodeURIComponent("Hi, I found your room on Roomly: "+r.title+" in "+r.area+". Is it available?")}">💬 WhatsApp</a><a class="save" href="#" onclick="saveRoom(${r.id});return false">♡ Save</a></div>
 </div></article>`).join(""):`<p>No matching rooms found. Try changing your filters.</p>`;
 document.getElementById("resultText").textContent=`${filtered.length} room${filtered.length!==1?"s":""} found`;
}
function searchRooms(){
 const loc=document.getElementById("location").value.toLowerCase().trim();
 const max=Number(document.getElementById("maxRent").value)||Infinity;
 const type=document.getElementById("type").value;
 const fs=[...document.querySelectorAll(".facility:checked")].map(x=>x.value);
 filtered=rooms.filter(r=>(!loc||r.area.toLowerCase().includes(loc)||r.title.toLowerCase().includes(loc))&&r.rent<=max&&(!type||r.type===type)&&fs.every(f=>r.fac.includes(f)));
 render();document.getElementById("rooms").scrollIntoView({behavior:"smooth"});
}
function saveRoom(id){
 let saved=JSON.parse(localStorage.getItem("roomlySaved")||"[]");
 if(!saved.includes(id)){saved.push(id);localStorage.setItem("roomlySaved",JSON.stringify(saved));alert("❤️ Room saved!");}
 else alert("Already saved ❤️");
}
document.getElementById("listingForm").addEventListener("submit",e=>{
 e.preventDefault();
 const r={id:Date.now(),title:fTitle.value,area:fArea.value,rent:Number(fRent.value),type:fType.value,img:fImage.value,phone:fPhone.value,fac:fFacilities.value.split(",").map(x=>x.trim()).filter(Boolean),desc:fDesc.value,verified:false};
 rooms.unshift(r);localStorage.setItem("roomlyRooms",JSON.stringify(rooms));filtered=[...rooms];render();e.target.reset();alert("✅ Listing published successfully!");document.getElementById("rooms").scrollIntoView({behavior:"smooth"});
});
render();