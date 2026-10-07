function encodeForm(form) {
  return new URLSearchParams(new FormData(form)).toString();
}

async function submitNetlifyForm(form) {
  const response = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: encodeForm(form)
  });
  if (!response.ok) throw new Error("Form submission failed.");
}

function installFreshRequestVisual() {
  const old = document.getElementById("requestChecklist");
  if (!old) return;

  old.outerHTML = `
    <div class="request-flow-visual" id="requestFlowVisual" aria-label="Simple Life request preview">
      <div class="flow-ring flow-ring-one"></div>
      <div class="flow-ring flow-ring-two"></div>
      <div class="flow-ring flow-ring-three"></div>

      <div class="logo-piece piece-top"><span></span></div>
      <div class="logo-piece piece-right"><span></span></div>
      <div class="logo-piece piece-bottom"><span></span></div>
      <div class="logo-piece piece-left"><span></span></div>

      <div class="assembled-logo" id="assembledLogo" aria-hidden="true">
        <svg viewBox="0 0 64 64">
          <path d="M17 31 32 19l15 12v18H17z"/>
          <path d="M27 49V37h10v12"/>
          <path d="M43 16c6-.8 10 1.2 12 5.8-6 .8-10-1.2-12-5.8z"/>
          <path class="final-check" d="m22 33 7 7 14-16"/>
        </svg>
      </div>

      <div class="flow-copy">
        <span class="flow-kicker">Simple Life</span>
        <strong id="flowTitle">Tell us what you need</strong>
        <span id="flowDetail">We’ll take it from there.</span>
      </div>
    </div>`;

  const style = document.createElement("style");
  style.id = "freshRequestVisualStyles";
  style.textContent = `
    :root{
      --ink:#354448;
      --muted:#7b888a;
      --paper:#fbfcfa;
      --sage:#c1d1c4;
      --sage-dark:#78917f;
      --sage-soft:#f4f8f4;
      --blue:#b8ccd5;
      --blue-soft:#f3f7f8;
      --line:#e7ede9;
      --rose:#aec5cf;
      --rose-deep:#809ea9;
      --plum:#667e79;
    }

    body{background:#fbfcfa}
    .site-header{background:rgba(251,252,250,.92)}
    .hero{
      background:
        radial-gradient(circle at 84% 12%, rgba(184,204,213,.16), transparent 32%),
        radial-gradient(circle at 10% 92%, rgba(193,209,196,.16), transparent 31%),
        linear-gradient(180deg,#fcfcfa 0%,#f8faf8 100%) !important;
    }
    .services-section{background:#f4f7f4 !important}
    .request-section{background:#fbfcfa !important}
    .btn-primary{background:#92acb5 !important;box-shadow:0 12px 28px rgba(146,172,181,.16)!important}
    .btn-primary:hover{background:#7f9ba5 !important}
    .hero h1 span,.service-link{color:#7f9ba5 !important}
    .service-icon,.step-icon,.center-icon{background:#f3f6f3 !important;color:#7f9ba5 !important}

    .request-flow-visual{
      position:relative;
      height:360px;
      margin-top:18px;
      overflow:visible;
      isolation:isolate;
    }
    .flow-ring{
      position:absolute;
      left:50%;
      top:47%;
      border-radius:50%;
      transform:translate(-50%,-50%);
      pointer-events:none;
      transform-origin:center;
    }
    .flow-ring-one{
      width:326px;height:326px;
      border:1px solid rgba(128,158,169,.13);
      animation:idleRingA 8s ease-in-out infinite;
    }
    .flow-ring-two{
      width:254px;height:254px;
      border:1px solid rgba(120,145,127,.12);
      animation:idleRingB 10s ease-in-out infinite;
    }
    .flow-ring-three{
      width:182px;height:182px;
      border:1px dashed rgba(128,158,169,.09);
      animation:idleRingA 12s ease-in-out infinite reverse;
    }

    .logo-piece{
      position:absolute;
      left:50%;top:47%;
      width:52px;height:52px;
      border-radius:17px;
      display:grid;
      place-items:center;
      background:rgba(255,255,255,.90);
      border:1px solid rgba(228,236,232,.95);
      box-shadow:0 12px 30px rgba(65,85,89,.06);
      opacity:0;
      z-index:3;
    }
    .logo-piece span{
      width:20px;height:20px;
      border-radius:7px;
      border:2px solid #7f9b91;
      position:relative;
    }
    .piece-top{transform:translate(-50%,-168px)}
    .piece-right{transform:translate(116px,-50%)}
    .piece-bottom{transform:translate(-50%,116px)}
    .piece-left{transform:translate(-168px,-50%)}
    .piece-top span:after,.piece-bottom span:after{
      content:"";position:absolute;left:4px;right:4px;top:8px;height:2px;border-radius:9px;background:#9bb7a2;
    }
    .piece-left span:after,.piece-right span:after{
      content:"";position:absolute;top:4px;bottom:4px;left:8px;width:2px;border-radius:9px;background:#9bb7a2;
    }

    .assembled-logo{
      position:absolute;
      left:50%;top:47%;
      width:142px;height:142px;
      transform:translate(-50%,-50%) scale(.72);
      border-radius:50%;
      display:grid;place-items:center;
      background:rgba(255,255,255,.91);
      border:1px solid rgba(229,236,232,.96);
      box-shadow:0 18px 46px rgba(65,85,89,.07);
      opacity:0;
      z-index:4;
    }
    .assembled-logo svg{width:64px;height:64px;color:#6f8b81}
    .assembled-logo path{
      fill:none;stroke:currentColor;stroke-width:2.7;stroke-linecap:round;stroke-linejoin:round;
    }
    .assembled-logo .final-check{
      color:#6f947d;
      stroke-width:3.4;
      stroke-dasharray:44;
      stroke-dashoffset:44;
    }

    .flow-copy{
      position:absolute;
      left:50%;bottom:0;
      transform:translateX(-50%);
      min-width:270px;
      text-align:center;
    }
    .flow-kicker{
      display:block;margin-bottom:3px;font-size:.68rem;text-transform:uppercase;
      letter-spacing:.13em;color:#94a39f;font-weight:800;
    }
    .flow-copy strong{display:block;font:800 1.05rem "Manrope",sans-serif;color:#354448}
    .flow-copy>span:last-child{display:block;margin-top:3px;color:#7b888a;font-size:.8rem}

    .request-flow-visual.is-thinking .flow-ring-one{animation:fastRingA .9s linear infinite}
    .request-flow-visual.is-thinking .flow-ring-two{animation:fastRingB .72s linear infinite}
    .request-flow-visual.is-thinking .flow-ring-three{animation:fastRingA .58s linear infinite reverse}

    .request-flow-visual.is-assembling .logo-piece{opacity:1}
    .request-flow-visual.is-assembling .piece-top{animation:pieceTopIn .8s cubic-bezier(.2,.85,.25,1) forwards}
    .request-flow-visual.is-assembling .piece-right{animation:pieceRightIn .8s cubic-bezier(.2,.85,.25,1) .07s forwards}
    .request-flow-visual.is-assembling .piece-bottom{animation:pieceBottomIn .8s cubic-bezier(.2,.85,.25,1) .14s forwards}
    .request-flow-visual.is-assembling .piece-left{animation:pieceLeftIn .8s cubic-bezier(.2,.85,.25,1) .21s forwards}
    .request-flow-visual.is-assembling .flow-ring-one{animation:collapseRing 1s cubic-bezier(.25,.8,.25,1) forwards}
    .request-flow-visual.is-assembling .flow-ring-two{animation:collapseRing .9s cubic-bezier(.25,.8,.25,1) .05s forwards}
    .request-flow-visual.is-assembling .flow-ring-three{animation:collapseRing .8s cubic-bezier(.25,.8,.25,1) .1s forwards}

    .request-flow-visual.is-complete .logo-piece{opacity:0}
    .request-flow-visual.is-complete .assembled-logo{
      opacity:1;
      animation:logoSnap .58s cubic-bezier(.16,1,.3,1) forwards;
    }
    .request-flow-visual.is-complete .final-check{animation:drawFinalCheck .48s ease .28s forwards}
    .request-flow-visual.is-complete .flow-ring-one,
    .request-flow-visual.is-complete .flow-ring-two,
    .request-flow-visual.is-complete .flow-ring-three{opacity:.34;animation:none}

    @keyframes idleRingA{
      0%,100%{transform:translate(-50%,-50%) scale(1) rotate(0deg);opacity:.9}
      50%{transform:translate(-50%,-50%) scale(1.025) rotate(4deg);opacity:.58}
    }
    @keyframes idleRingB{
      0%,100%{transform:translate(-50%,-50%) scale(1.015) rotate(0deg);opacity:.72}
      50%{transform:translate(-50%,-50%) scale(.985) rotate(-5deg);opacity:1}
    }
    @keyframes fastRingA{
      from{transform:translate(-50%,-50%) rotate(0deg) scale(1)}
      to{transform:translate(-50%,-50%) rotate(360deg) scale(1.025)}
    }
    @keyframes fastRingB{
      from{transform:translate(-50%,-50%) rotate(360deg) scale(1)}
      to{transform:translate(-50%,-50%) rotate(0deg) scale(.985)}
    }
    @keyframes collapseRing{
      0%{transform:translate(-50%,-50%) scale(1);opacity:1}
      100%{transform:translate(-50%,-50%) scale(.54);opacity:.18}
    }
    @keyframes pieceTopIn{
      0%{transform:translate(-50%,-168px) scale(.92);opacity:0}
      28%{opacity:1}
      100%{transform:translate(-50%,-50%) scale(.7);opacity:.95}
    }
    @keyframes pieceRightIn{
      0%{transform:translate(116px,-50%) scale(.92);opacity:0}
      28%{opacity:1}
      100%{transform:translate(-50%,-50%) scale(.7);opacity:.95}
    }
    @keyframes pieceBottomIn{
      0%{transform:translate(-50%,116px) scale(.92);opacity:0}
      28%{opacity:1}
      100%{transform:translate(-50%,-50%) scale(.7);opacity:.95}
    }
    @keyframes pieceLeftIn{
      0%{transform:translate(-168px,-50%) scale(.92);opacity:0}
      28%{opacity:1}
      100%{transform:translate(-50%,-50%) scale(.7);opacity:.95}
    }
    @keyframes logoSnap{
      0%{transform:translate(-50%,-50%) scale(.72);opacity:0}
      65%{transform:translate(-50%,-50%) scale(1.07);opacity:1}
      100%{transform:translate(-50%,-50%) scale(1);opacity:1}
    }
    @keyframes drawFinalCheck{to{stroke-dashoffset:0}}

    @media(max-width:880px){
      .request-flow-visual{height:330px;max-width:430px;margin-left:auto;margin-right:auto}
    }
    @media(max-width:620px){
      .request-flow-visual{height:310px}
      .flow-ring-one{width:276px;height:276px}
      .flow-ring-two{width:216px;height:216px}
      .flow-ring-three{width:154px;height:154px}
      .assembled-logo{width:126px;height:126px}
      .piece-top{transform:translate(-50%,-145px)}
      .piece-right{transform:translate(93px,-50%)}
      .piece-bottom{transform:translate(-50%,93px)}
      .piece-left{transform:translate(-145px,-50%)}
    }
    @media(prefers-reduced-motion:reduce){
      .request-flow-visual *{animation:none!important;transition:none!important}
      .request-flow-visual.is-complete .assembled-logo{opacity:1;transform:translate(-50%,-50%) scale(1)}
      .request-flow-visual.is-complete .final-check{stroke-dashoffset:0}
    }
  `;
  document.head.appendChild(style);
}

function setFlowTask(taskText) {
  const wrap = document.getElementById("requestFlowVisual");
  const title = document.getElementById("flowTitle");
  const detail = document.getElementById("flowDetail");
  if (!wrap) return;

  wrap.classList.remove("is-complete", "is-assembling");
  wrap.classList.add("is-thinking");

  const cleaned = (taskText || "").trim();
  if (title) title.textContent = cleaned ? "Request in progress" : "Tell us what you need";
  if (detail) detail.textContent = cleaned ? "We’ll take it from there." : "Start with any task — big or small.";
}

function completeFlow() {
  const wrap = document.getElementById("requestFlowVisual");
  const title = document.getElementById("flowTitle");
  const detail = document.getElementById("flowDetail");
  if (!wrap) return;

  wrap.classList.remove("is-thinking", "is-complete");
  wrap.classList.add("is-assembling");
  if (title) title.textContent = "Putting it together";
  if (detail) detail.textContent = "Almost there.";

  setTimeout(() => {
    wrap.classList.remove("is-assembling");
    wrap.classList.add("is-complete");
    if (title) title.textContent = "Request sent";
    if (detail) detail.textContent = "One less thing on your list.";
  }, 1050);
}

function wireForm(formId, successId, sendingText, sentText) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const success = document.getElementById(successId);
    const originalText = button.textContent;
    try {
      button.disabled = true;
      button.textContent = sendingText;
      if (success) success.hidden = true;
      if (formId === "requestForm") setFlowTask(document.getElementById("task")?.value || "");
      await submitNetlifyForm(form);
      if (formId === "requestForm") completeFlow();
      form.reset();
      button.textContent = sentText;
      if (success) success.hidden = false;
      setTimeout(() => { button.textContent = originalText; button.disabled = false; }, 1800);
    } catch (error) {
      button.disabled = false;
      button.textContent = originalText;
      alert("Something went wrong. Please try again.");
      console.error(error);
    }
  });
}

installFreshRequestVisual();
wireForm("requestForm", "formSuccess", "Sending…", "Sent");
wireForm("helperForm", "helperSuccess", "Submitting…", "Submitted");

function goToRequest(prefill = "") {
  const requestSection = document.getElementById("request");
  const taskField = document.getElementById("task");
  if (prefill && taskField) {
    if (prefill === "Cleaning") taskField.value = "I need help with cleaning.";
    else if (prefill === "Yard Work") taskField.value = "I need help with yard work.";
    else if (prefill === "Organizing") taskField.value = "I need help with organizing.";
    else taskField.value = prefill;
  }
  setFlowTask(taskField?.value || prefill);
  if (requestSection) {
    requestSection.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => { if (taskField) taskField.focus(); }, 500);
  }
}

document.querySelectorAll(".service-choice").forEach(card => {
  card.addEventListener("click", () => goToRequest(card.dataset.service || ""));
});

const heroContinue = document.getElementById("heroContinue");
const heroTask = document.getElementById("heroTask");
if (heroContinue && heroTask) {
  heroContinue.addEventListener("click", () => goToRequest(heroTask.value.trim()));
  heroTask.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      goToRequest(heroTask.value.trim());
    }
  });
}

const taskFieldLive = document.getElementById("task");
if (taskFieldLive) {
  taskFieldLive.addEventListener("input", () => setFlowTask(taskFieldLive.value));
}
