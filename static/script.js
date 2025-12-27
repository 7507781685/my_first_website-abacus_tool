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




