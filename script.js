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
          <path class="logo-house" d="M17 31 32 19l15 12v18H17z"/>
          <path class="logo-house" d="M27 49V37h10v12"/>
          <path class="logo-house" d="M43 16c6-.8 10 1.2 12 5.8-6 .8-10-1.2-12-5.8z"/>
          <path class="final-check" d="m19 33 9 9 18-21"/>
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
      --ink:#39484b;
      --muted:#7c8888;
      --paper:#fcfcfa;
      --sage:#c8d5ca;
      --sage-dark:#708a78;
      --sage-soft:#f5f8f4;
      --blue:#c1d2d8;
      --blue-soft:#f4f8f9;
      --line:#e8ede9;
      --rose:#b5c9d0;
      --rose-deep:#829da7;
      --plum:#697f7a;
    }

    body{background:#fcfcfa}
    .site-header{background:rgba(252,252,250,.94)}
    .hero{
      background:
        radial-gradient(circle at 84% 12%, rgba(193,210,216,.15), transparent 32%),
        radial-gradient(circle at 10% 92%, rgba(200,213,202,.15), transparent 31%),
        linear-gradient(180deg,#fdfdfa 0%,#f9fbf9 100%) !important;
    }
    .services-section{background:#f5f8f5 !important}
    .request-section{
      background:linear-gradient(180deg,#fbfcfa 0%,#f5f8f6 100%) !important;
      padding:112px 0 !important;
    }
    .request-grid{
      grid-template-columns:1.04fr .96fr !important;
      gap:86px !important;
      align-items:center !important;
    }
    .request-form{
      order:1;
      padding:34px !important;
      border-radius:30px !important;
      box-shadow:0 24px 70px rgba(62,82,84,.07) !important;
    }
    .request-copy{order:2}
    .request-copy h2{font-size:clamp(2.2rem,4vw,3.7rem) !important;max-width:440px}
    .request-copy>p{max-width:450px}

    .btn-primary{background:#93adb5 !important;box-shadow:0 12px 28px rgba(147,173,181,.15)!important}
    .btn-primary:hover{background:#7f99a3 !important}
    .hero h1 span,.service-link{color:#7f99a3 !important}
    .service-icon,.step-icon,.center-icon{background:#f4f7f4 !important;color:#7f99a3 !important}

    .request-flow-visual{
      position:relative;
      height:375px;
      margin-top:10px;
      overflow:visible;
      isolation:isolate;
    }
    .flow-ring{
      position:absolute;
      left:50%;top:46%;
      border-radius:50%;
      transform:translate(-50%,-50%);
      pointer-events:none;
      transform-origin:center;
      box-shadow:inset 0 0 30px rgba(255,255,255,.22);
    }
    .flow-ring-one{
      width:334px;height:334px;
      border:1.5px solid rgba(130,157,167,.24);
      animation:idleRingA 8s ease-in-out infinite;
    }
    .flow-ring-two{
      width:258px;height:258px;
      border:1.5px solid rgba(112,138,120,.20);
      animation:idleRingB 10s ease-in-out infinite;
    }
    .flow-ring-three{
      width:184px;height:184px;
      border:1px dashed rgba(130,157,167,.17);
      animation:idleRingA 12s ease-in-out infinite reverse;
    }

    .logo-piece{
      position:absolute;
      left:50%;top:46%;
      width:54px;height:54px;
      border-radius:18px;
      display:grid;place-items:center;
      background:rgba(255,255,255,.94);
      border:1px solid rgba(228,236,232,.98);
      box-shadow:0 12px 30px rgba(65,85,89,.07);
      opacity:0;
      z-index:3;
    }
    .logo-piece span{
      width:21px;height:21px;
      border-radius:7px;
      border:2px solid #7f9b91;
      position:relative;
    }
    .piece-top{transform:translate(-50%,-174px)}
    .piece-right{transform:translate(121px,-50%)}
    .piece-bottom{transform:translate(-50%,121px)}
    .piece-left{transform:translate(-174px,-50%)}
    .piece-top span:after,.piece-bottom span:after{
      content:"";position:absolute;left:4px;right:4px;top:8px;height:2px;border-radius:9px;background:#9bb7a2;
    }
    .piece-left span:after,.piece-right span:after{
      content:"";position:absolute;top:4px;bottom:4px;left:8px;width:2px;border-radius:9px;background:#9bb7a2;
    }

    .assembled-logo{
      position:absolute;
      left:50%;top:46%;
      width:150px;height:150px;
      transform:translate(-50%,-50%) scale(.72);
      border-radius:50%;
      display:grid;place-items:center;
      background:rgba(255,255,255,.96);
      border:1px solid rgba(229,236,232,.98);
      box-shadow:0 20px 54px rgba(65,85,89,.08);
      opacity:0;
      z-index:4;
    }
    .assembled-logo svg{width:72px;height:72px;color:#6f8b81}
    .assembled-logo path{
      fill:none;stroke:currentColor;stroke-width:2.8;stroke-linecap:round;stroke-linejoin:round;
      transition:opacity .28s ease;
    }
    .assembled-logo .final-check{
      color:#3f7251;
      stroke-width:5.2;
      stroke-dasharray:60;
      stroke-dashoffset:60;
      filter:drop-shadow(0 1px 0 rgba(255,255,255,.9));
    }

    .flow-copy{
      position:absolute;
      left:50%;bottom:-2px;
      transform:translateX(-50%);
      min-width:280px;
      text-align:center;
    }
    .flow-kicker{
      display:block;margin-bottom:3px;font-size:.68rem;text-transform:uppercase;
      letter-spacing:.13em;color:#94a39f;font-weight:800;
    }
    .flow-copy strong{display:block;font:800 1.05rem "Manrope",sans-serif;color:#39484b}
    .flow-copy>span:last-child{display:block;margin-top:3px;color:#7c8888;font-size:.8rem}

    .request-flow-visual.is-thinking .flow-ring-one{animation:fastRingA .82s linear infinite}
    .request-flow-visual.is-thinking .flow-ring-two{animation:fastRingB .66s linear infinite}
    .request-flow-visual.is-thinking .flow-ring-three{animation:fastRingA .50s linear infinite reverse}

    .request-flow-visual.is-assembling .logo-piece{opacity:1}
    .request-flow-visual.is-assembling .piece-top{animation:pieceTopIn .78s cubic-bezier(.2,.85,.25,1) forwards}
    .request-flow-visual.is-assembling .piece-right{animation:pieceRightIn .78s cubic-bezier(.2,.85,.25,1) .06s forwards}
    .request-flow-visual.is-assembling .piece-bottom{animation:pieceBottomIn .78s cubic-bezier(.2,.85,.25,1) .12s forwards}
    .request-flow-visual.is-assembling .piece-left{animation:pieceLeftIn .78s cubic-bezier(.2,.85,.25,1) .18s forwards}
    .request-flow-visual.is-assembling .flow-ring-one{animation:collapseRing 1s cubic-bezier(.25,.8,.25,1) forwards}
    .request-flow-visual.is-assembling .flow-ring-two{animation:collapseRing .9s cubic-bezier(.25,.8,.25,1) .05s forwards}
    .request-flow-visual.is-assembling .flow-ring-three{animation:collapseRing .8s cubic-bezier(.25,.8,.25,1) .1s forwards}

    .request-flow-visual.is-complete .logo-piece{opacity:0}
    .request-flow-visual.is-complete .assembled-logo{
      opacity:1;
      animation:logoSnap .58s cubic-bezier(.16,1,.3,1) forwards;
      background:#f7fbf7;
      border-color:rgba(112,138,120,.24);
      box-shadow:0 20px 58px rgba(80,120,91,.15);
    }
    .request-flow-visual.is-complete .logo-house{opacity:.14}
    .request-flow-visual.is-complete .final-check{animation:drawFinalCheck .52s ease .22s forwards}
    .request-flow-visual.is-complete .flow-ring-one,
    .request-flow-visual.is-complete .flow-ring-two,
    .request-flow-visual.is-complete .flow-ring-three{
      opacity:.52;
      animation:completedRing 5s ease-in-out infinite;
    }

    @keyframes idleRingA{
      0%,100%{transform:translate(-50%,-50%) scale(1) rotate(0deg);opacity:1}
      50%{transform:translate(-50%,-50%) scale(1.025) rotate(4deg);opacity:.72}
    }
    @keyframes idleRingB{
      0%,100%{transform:translate(-50%,-50%) scale(1.015) rotate(0deg);opacity:.82}
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
      100%{transform:translate(-50%,-50%) scale(.54);opacity:.22}
    }
    @keyframes completedRing{
      0%,100%{transform:translate(-50%,-50%) scale(.98);opacity:.52}
      50%{transform:translate(-50%,-50%) scale(1.02);opacity:.78}
    }
    @keyframes pieceTopIn{
      0%{transform:translate(-50%,-174px) scale(.92);opacity:0}
      28%{opacity:1}
      100%{transform:translate(-50%,-50%) scale(.7);opacity:.95}
    }
    @keyframes pieceRightIn{
      0%{transform:translate(121px,-50%) scale(.92);opacity:0}
      28%{opacity:1}
      100%{transform:translate(-50%,-50%) scale(.7);opacity:.95}
    }
    @keyframes pieceBottomIn{
      0%{transform:translate(-50%,121px) scale(.92);opacity:0}
      28%{opacity:1}
      100%{transform:translate(-50%,-50%) scale(.7);opacity:.95}
    }
    @keyframes pieceLeftIn{
      0%{transform:translate(-174px,-50%) scale(.92);opacity:0}
      28%{opacity:1}
      100%{transform:translate(-50%,-50%) scale(.7);opacity:.95}
    }
    @keyframes logoSnap{
      0%{transform:translate(-50%,-50%) scale(.72);opacity:0}
      65%{transform:translate(-50%,-50%) scale(1.08);opacity:1}
      100%{transform:translate(-50%,-50%) scale(1);opacity:1}
    }
    @keyframes drawFinalCheck{to{stroke-dashoffset:0}}

    @media(max-width:880px){
      .request-grid{grid-template-columns:1fr !important;gap:46px !important}
      .request-form{order:2}
      .request-copy{order:1}
      .request-flow-visual{height:340px;max-width:440px;margin-left:auto;margin-right:auto}
    }
    @media(max-width:620px){
      .request-section{padding:78px 0 !important}
      .request-form{padding:24px !important}
      .request-flow-visual{height:315px}
      .flow-ring-one{width:278px;height:278px}
      .flow-ring-two{width:216px;height:216px}
      .flow-ring-three{width:154px;height:154px}
      .assembled-logo{width:130px;height:130px}
      .piece-top{transform:translate(-50%,-146px)}
      .piece-right{transform:translate(94px,-50%)}
      .piece-bottom{transform:translate(-50%,94px)}
      .piece-left{transform:translate(-146px,-50%)}
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
  }, 1020);
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
