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
      <div class="flow-orb orb-one"></div>
      <div class="flow-orb orb-two"></div>

      <div class="flow-logo" id="flowLogo">
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path class="flow-home" d="M17 31 32 19l15 12v18H17z"/>
          <path class="flow-door" d="M27 49V37h10v12"/>
          <path class="flow-leaf" d="M43 16c6-.8 10 1.2 12 5.8-6 .8-10-1.2-12-5.8z"/>
          <path class="flow-check" d="m23 33 6 6 13-15"/>
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
      --sage:#bdcdbf;
      --sage-dark:#758f7c;
      --sage-soft:#f3f7f3;
      --blue:#aec7d1;
      --blue-soft:#f2f7f8;
      --line:#e5ece8;
      --rose:#a8c0cb;
      --rose-deep:#7898a6;
      --plum:#607a75;
    }

    body{background:#fbfcfa}
    .site-header{background:rgba(251,252,250,.90)}
    .hero{
      background:
        radial-gradient(circle at 84% 12%, rgba(174,199,209,.18), transparent 32%),
        radial-gradient(circle at 10% 92%, rgba(189,205,191,.18), transparent 31%),
        linear-gradient(180deg,#fcfcfa 0%,#f8faf8 100%) !important;
    }
    .services-section{background:#f3f7f4 !important}
    .request-section{background:#fafcfb !important}
    .btn-primary{background:#8faeb9 !important;box-shadow:0 12px 28px rgba(143,174,185,.17)!important}
    .btn-primary:hover{background:#7898a6 !important}
    .hero h1 span,.service-link{color:#7898a6 !important}
    .service-icon,.step-icon,.center-icon{background:#f2f6f3 !important;color:#7898a6 !important}

    .request-flow-visual{
      position:relative;
      height:350px;
      margin-top:22px;
      overflow:visible;
      isolation:isolate;
    }
    .flow-ring{
      position:absolute;
      left:50%;
      top:49%;
      border-radius:50%;
      transform:translate(-50%,-50%);
      pointer-events:none;
    }
    .flow-ring-one{
      width:320px;
      height:320px;
      border:1px solid rgba(120,152,166,.14);
    }
    .flow-ring-two{
      width:238px;
      height:238px;
      border:1px solid rgba(117,143,124,.13);
    }
    .flow-ring-one:before,
    .flow-ring-two:before{
      content:"";
      position:absolute;
      inset:10%;
      border-radius:50%;
      border:1px dashed rgba(120,152,166,.08);
    }
    .flow-orb{
      position:absolute;
      border-radius:50%;
      filter:blur(.1px);
      z-index:-1;
    }
    .orb-one{
      width:76px;height:76px;
      left:19%;top:20%;
      background:rgba(189,205,191,.17);
      animation:driftOne 7s ease-in-out infinite;
    }
    .orb-two{
      width:54px;height:54px;
      right:18%;bottom:18%;
      background:rgba(174,199,209,.18);
      animation:driftTwo 8s ease-in-out infinite;
    }
    .flow-logo{
      position:absolute;
      left:50%;top:47%;
      width:138px;height:138px;
      transform:translate(-50%,-50%);
      border-radius:50%;
      display:grid;
      place-items:center;
      background:rgba(255,255,255,.88);
      border:1px solid rgba(229,236,232,.95);
      box-shadow:0 18px 46px rgba(64,84,88,.07);
      transition:transform .55s cubic-bezier(.2,.8,.2,1), box-shadow .4s ease;
    }
    .flow-logo svg{width:62px;height:62px;color:#6f8d83}
    .flow-home,.flow-door,.flow-leaf,.flow-check{
      fill:none;
      stroke:currentColor;
      stroke-width:2.7;
      stroke-linecap:round;
      stroke-linejoin:round;
    }
    .flow-leaf{color:#89a796}
    .flow-check{
      color:#6f947d;
      stroke-width:3.4;
      stroke-dasharray:42;
      stroke-dashoffset:42;
      opacity:0;
    }
    .flow-copy{
      position:absolute;
      left:50%;bottom:-2px;
      transform:translateX(-50%);
      min-width:260px;
      text-align:center;
    }
    .flow-kicker{
      display:block;
      margin-bottom:3px;
      font-size:.68rem;
      text-transform:uppercase;
      letter-spacing:.13em;
      color:#90a09d;
      font-weight:800;
    }
    .flow-copy strong{
      display:block;
      font:800 1.05rem "Manrope",sans-serif;
      color:#354448;
    }
    .flow-copy>span:last-child{
      display:block;
      margin-top:3px;
      color:#7b888a;
      font-size:.8rem;
    }
    .request-flow-visual.is-thinking .flow-logo{
      animation:logoBreathe 1.45s ease-in-out infinite;
      box-shadow:0 20px 52px rgba(120,152,166,.12);
    }
    .request-flow-visual.is-thinking .flow-ring-one{animation:ringPulse 2.2s ease-in-out infinite}
    .request-flow-visual.is-thinking .flow-ring-two{animation:ringPulse 2.2s ease-in-out .3s infinite}
    .request-flow-visual.is-complete .flow-logo{
      transform:translate(-50%,-50%) scale(1.07);
      box-shadow:0 20px 54px rgba(111,148,125,.14);
    }
    .request-flow-visual.is-complete .flow-check{
      opacity:1;
      animation:drawFlowCheck .52s ease .15s forwards;
    }
    .request-flow-visual.is-complete .flow-home,
    .request-flow-visual.is-complete .flow-door,
    .request-flow-visual.is-complete .flow-leaf{
      opacity:.25;
      transition:opacity .35s ease;
    }
    .request-flow-visual.is-complete .flow-ring-one{
      animation:finishRing .8s ease;
    }
    @keyframes driftOne{
      0%,100%{transform:translate(0,0)}
      50%{transform:translate(18px,-12px)}
    }
    @keyframes driftTwo{
      0%,100%{transform:translate(0,0)}
      50%{transform:translate(-14px,10px)}
    }
    @keyframes logoBreathe{
      0%,100%{transform:translate(-50%,-50%) scale(1)}
      50%{transform:translate(-50%,-50%) scale(1.035)}
    }
    @keyframes ringPulse{
      0%,100%{transform:translate(-50%,-50%) scale(1);opacity:1}
      50%{transform:translate(-50%,-50%) scale(1.035);opacity:.55}
    }
    @keyframes finishRing{
      0%{transform:translate(-50%,-50%) scale(1);opacity:1}
      55%{transform:translate(-50%,-50%) scale(1.06);opacity:.3}
      100%{transform:translate(-50%,-50%) scale(1);opacity:1}
    }
    @keyframes drawFlowCheck{to{stroke-dashoffset:0}}

    @media(max-width:880px){
      .request-flow-visual{height:320px;max-width:420px;margin-left:auto;margin-right:auto}
    }
    @media(max-width:620px){
      .request-flow-visual{height:300px}
      .flow-ring-one{width:270px;height:270px}
      .flow-ring-two{width:202px;height:202px}
      .flow-logo{width:122px;height:122px}
      .flow-copy{bottom:-4px}
    }
    @media(prefers-reduced-motion:reduce){
      .request-flow-visual *{animation:none!important;transition:none!important}
    }
  `;
  document.head.appendChild(style);
}

function setFlowTask(taskText) {
  const wrap = document.getElementById("requestFlowVisual");
  const title = document.getElementById("flowTitle");
  const detail = document.getElementById("flowDetail");
  if (!wrap) return;

  wrap.classList.remove("is-complete");
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
  wrap.classList.remove("is-thinking");
  wrap.classList.add("is-complete");
  if (title) title.textContent = "Request sent";
  if (detail) detail.textContent = "One less thing on your list.";
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
