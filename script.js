function encodeForm(form){
  return new URLSearchParams(new FormData(form)).toString();
}

async function submitNetlifyForm(form){
  const response=await fetch("/",{
    method:"POST",
    headers:{"Content-Type":"application/x-www-form-urlencoded"},
    body:encodeForm(form)
  });
  if(!response.ok) throw new Error("Form submission failed");
}

const menuButton=document.getElementById("menuButton");
const mobileNav=document.getElementById("mobileNav");

if(menuButton&&mobileNav){
  menuButton.addEventListener("click",()=>{
    const open=menuButton.getAttribute("aria-expanded")==="true";
    menuButton.setAttribute("aria-expanded",String(!open));
    mobileNav.hidden=open;
  });
  mobileNav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{
    mobileNav.hidden=true;
    menuButton.setAttribute("aria-expanded","false");
  }));
}

function goToRequest(service=""){
  const section=document.getElementById("request");
  const task=document.getElementById("task");
  if(task&&service){
    if(service==="Cleaning") task.value="I need help with cleaning.";
    if(service==="Organizing") task.value="I need help with organizing.";
    if(service==="Yard Work") task.value="I need help with yard work.";
  }
  section?.scrollIntoView({behavior:"smooth",block:"start"});
}

document.querySelectorAll(".service-choice").forEach(el=>{
  el.addEventListener("click",()=>goToRequest(el.dataset.service||""));
});

function wireForm(formId,successId,sendingText,doneText){
  const form=document.getElementById(formId);
  if(!form) return;
  form.addEventListener("submit",async e=>{
    e.preventDefault();
    const button=form.querySelector('button[type="submit"]');
    const success=document.getElementById(successId);
    const original=button?.textContent||"";
    try{
      if(button){button.disabled=true;button.textContent=sendingText;}
      if(success) success.hidden=true;
      await submitNetlifyForm(form);
      form.reset();
      if(success) success.hidden=false;
      if(button) button.textContent=doneText;
      setTimeout(()=>{
        if(button){button.disabled=false;button.textContent=original;}
      },1800);
    }catch(err){
      if(button){button.disabled=false;button.textContent=original;}
      alert("Something went wrong. Please try again.");
      console.error(err);
    }
  });
}

wireForm("requestForm","formSuccess","Sending…","Sent");
wireForm("helperForm","helperSuccess","Submitting…","Submitted");