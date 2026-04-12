function registerUser() {
  console.log("Register button clicked");

  const regNo = document.getElementById("regNo").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;

  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  fetch("http://127.0.0.1:5000/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ regNo, email, phone, password })
  })
  .then(res => {
    console.log("Register response status:", res.status);
    return res.json();
  })
  .then(data => {
    console.log("Register response data:", data);

    if (data.message) {
      alert("Registration successful! Please login.");
      window.location.href = "/login-page";
    } else {
      alert(data.error);
    }
  })
  .catch(err => console.error("Register error:", err));
}

function loginUser() {
  const loginId = document.getElementById("loginId").value;
  const password = document.getElementById("loginPassword").value;

  if (!loginId || !password) {
    alert("Please enter login details");
    return;
  }

  fetch("http://127.0.0.1:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ loginId, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.message) {
      alert("Login successful!");
      window.location.href = "/levels";
      // redirect later
    } else {
      alert(data.error);
    }
  });
}

function openLogin() {
  console.log("Login button clicked"); // DEBUG
  window.location.href = "/login-page";
}

function forgotpassword() {
  window.location.href = "/forgot-password-page";
}

function sendOTP() {
  const contact = document.getElementById("contact").value;

  fetch("/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contact })
  })
  .then(res => res.json())
  .then(data => alert(data.message || data.error));
}

function resetPassword() {
  const contact = document.getElementById("contact").value;
  const otp = document.getElementById("otp").value;
  const newPassword = document.getElementById("newPassword").value;

  fetch("/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contact, otp, newPassword })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message || data.error);
    if (data.message) {
      window.location.href = "/login-page";
    }
  });
}

const card = document.getElementById("loginCard");

document.addEventListener("mousemove", (e) => {

if(!card) return;

const x = (window.innerWidth / 2 - e.pageX) / 25;
const y = (window.innerHeight / 2 - e.pageY) / 25;

card.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;

});

