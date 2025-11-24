const sendOtpBtn = document.getElementById("sendOtpBtn");
const otpSection = document.getElementById("otpSection");
const verifyBtn = document.getElementById("verifyBtn");
const timer = document.getElementById("timer");

const identifierError = document.getElementById("identifierError");
const passwordError = document.getElementById("passwordError");
const otpError = document.getElementById("otpError");

let countdown = 60;
let interval = null;

// Validate inputs
function validateFields() {
  let valid = true;

  identifierError.innerText = "";
  passwordError.innerText = "";

  const identifier = document.getElementById("identifier").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!identifier) {
    identifierError.innerText = "Enter phone/email";
    valid = false;
  }
  if (!password) {
    passwordError.innerText = "Enter password";
    valid = false;
  }

  return valid;
}

// Show OTP section
sendOtpBtn.onclick = () => {
  if (!validateFields()) return;

  sendOtpBtn.classList.add("loading");

  setTimeout(() => {
    sendOtpBtn.classList.remove("loading");
    otpSection.classList.remove("hidden");
    startTimer();

    sendOtpBtn.innerText = "OTP Sent";
    sendOtpBtn.disabled = true;
  }, 900);
};

function startTimer() {
  countdown = 60;
  timer.innerText = "Resend OTP in 60s";

  interval = setInterval(() => {
    countdown--;
    timer.innerText = `Resend OTP in ${countdown}s`;

    if (countdown <= 0) {
      clearInterval(interval);
      timer.innerText = "";
      sendOtpBtn.disabled = false;
      sendOtpBtn.innerText = "Send OTP Again";
    }
  }, 1000);

  verifyBtn.classList.remove("hidden");
}

// Verify OTP
verifyBtn.onclick = async () => {
  otpError.innerText = "";
  verifyBtn.classList.add("loading");

  const identifier = document.getElementById("identifier").value.trim();
  const password = document.getElementById("password").value.trim();
  const otpInputs = document.querySelectorAll(".otp");

  let otp = "";
  otpInputs.forEach(i => otp += i.value);

  if (otp.length !== 4) {
    otpError.innerText = "Enter 4-digit OTP";
    verifyBtn.classList.remove("loading");
    return;
  }

  const response = await fetch("/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password, otp })
  });

  const data = await response.json();

  verifyBtn.classList.remove("loading");

  if (!data.success) {
    otpError.innerText = data.message || "Invalid OTP";
  } else {
    alert("Login Successful");
  }
};

const otpSentMsg = document.getElementById("otpSentMsg");

sendOtpBtn.onclick = () => {
  if (!validateFields()) return;

  sendOtpBtn.classList.add("loading");

  // Detect email or phone
  const identifier = document.getElementById("identifier").value.trim();
  let message = "";

  if (identifier.includes("@")) {
    message = `OTP sent to ${identifier} via Email or whatsapp`;
  } else if (!isNaN(identifier)) {
    message = `OTP sent to ${identifier} via SMS or Whatsapp`;
  } else {
    message = `OTP sent to ${identifier}`;
  }

  setTimeout(() => {
    sendOtpBtn.classList.remove("loading");
    otpSection.classList.remove("hidden");
    startTimer();

    sendOtpBtn.innerText = "Resend OTP";
    sendOtpBtn.disabled = true;

    otpSentMsg.innerText = message;   // SHOW GREEN SUCCESS LABEL
  }, 900);
};
