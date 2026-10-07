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

function setVisualState(state, detailText = "") {
  const visual = document.getElementById("requestVisual");
  const title = document.getElementById("motionTitle");
  const detail = document.getElementById("motionDetail");
  if (!visual) return;

  visual.classList.remove("is-thinking", "is-assembling", "is-complete");

  if (state === "thinking") {
    visual.classList.add("is-thinking");
    if (title) title.textContent = "We’re on it.";
    if (detail) detail.textContent = detailText || "Getting your request ready.";
  } else if (state === "assembling") {
    visual.classList.add("is-assembling");
    if (title) title.textContent = "Putting it together.";
    if (detail) detail.textContent = "Almost there.";
  } else if (state === "complete") {
    visual.classList.add("is-complete");
    if (title) title.textContent = "Request sent.";
    if (detail) detail.textContent = "One less thing to think about.";
  } else {
    if (title) title.textContent = "Ready when you are.";
    if (detail) detail.textContent = "Start with any task.";
  }
}

function goToRequest(prefill = "") {
  const requestSection = document.getElementById("request");
  const taskField = document.getElementById("task");
  if (prefill && taskField) {
    if (prefill === "Cleaning") taskField.value = "I need help with cleaning.";
    else if (prefill === "Yard Work") taskField.value = "I need help with yard work.";
    else if (prefill === "Organizing") taskField.value = "I need help with organizing.";
    else taskField.value = prefill;
  }
  setVisualState("thinking", taskField?.value ? "We’ll take it from here." : "Getting your request ready.");
  requestSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  setTimeout(() => taskField?.focus(), 500);
}

document.querySelectorAll(".service-choice").forEach(card => {
  card.addEventListener("click", () => goToRequest(card.dataset.service || ""));
});

const heroContinue = document.getElementById("heroContinue");
const heroTask = document.getElementById("heroTask");
if (heroContinue && heroTask) {
  heroContinue.addEventListener("click", () => goToRequest(heroTask.value.trim()));
  heroTask.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      goToRequest(heroTask.value.trim());
    }
  });
}

const taskLive = document.getElementById("task");
if (taskLive) {
  taskLive.addEventListener("input", () => {
    if (taskLive.value.trim()) setVisualState("thinking", "We’ll take it from here.");
    else setVisualState("idle");
  });
}

function wireForm(formId, successId, sendingText, sentText) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", async event => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const success = document.getElementById(successId);
    const originalText = button.textContent;

    try {
      button.disabled = true;
      button.textContent = sendingText;
      if (success) success.hidden = true;

      if (formId === "requestForm") setVisualState("thinking", "Sending your request.");
      await submitNetlifyForm(form);

      if (formId === "requestForm") {
        setVisualState("assembling");
        setTimeout(() => setVisualState("complete"), 1050);
      }

      form.reset();
      button.textContent = sentText;
      if (success) success.hidden = false;
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 1800);
    } catch (error) {
      button.disabled = false;
      button.textContent = originalText;
      alert("Something went wrong. Please try again.");
      console.error(error);
    }
  });
}

wireForm("requestForm", "formSuccess", "Sending…", "Sent");
wireForm("helperForm", "helperSuccess", "Submitting…", "Submitted");
setVisualState("idle");

// Softer, less boxy Simple Life mark.
const softerMarkStyle = document.createElement("style");
softerMarkStyle.textContent = `
  .brand-mark span,
  .mini-mark i,
  .assembled-mark span {
    border-radius: 70% 45% 62% 52% / 52% 68% 44% 70% !important;
  }
  .brand-mark span:nth-child(1), .mini-mark i:nth-child(1), .assembled-mark span:nth-child(1){transform:rotate(-8deg)}
  .brand-mark span:nth-child(2), .mini-mark i:nth-child(2), .assembled-mark span:nth-child(2){transform:rotate(7deg)}
  .brand-mark span:nth-child(3), .mini-mark i:nth-child(3), .assembled-mark span:nth-child(3){transform:rotate(6deg)}
  .brand-mark span:nth-child(4), .mini-mark i:nth-child(4), .assembled-mark span:nth-child(4){transform:rotate(-6deg)}
  .piece{
    border-radius: 58% 42% 64% 46% / 48% 64% 42% 62% !important;
  }
  .pc1{rotate:-8deg}
  .pc2{rotate:7deg}
  .pc3{rotate:6deg}
  .pc4{rotate:-6deg}
`;
document.head.appendChild(softerMarkStyle);