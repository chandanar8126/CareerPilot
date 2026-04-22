// Redirect if not logged in
function checkLogin(redirectPage) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn === "true") {
    window.location.href = redirectPage;
  } else {
    // Save the page user wanted to visit before login
    localStorage.setItem("redirectAfterLogin", redirectPage);
    alert("You must log in first!");
    window.location.href = "login.html";
  }
}

// Login
function loginUser() {
  localStorage.setItem("isLoggedIn", "true");

  // Redirect to the intended page if stored
  const redirectPage = localStorage.getItem("redirectAfterLogin");
  if (redirectPage) {
    localStorage.removeItem("redirectAfterLogin"); // clear after use
    window.location.href = redirectPage;
  } else {
    window.location.href = "career.html"; // default after login
  }
}

// Signup
function signupUser() {
  localStorage.setItem("isLoggedIn", "true");

  const redirectPage = localStorage.getItem("redirectAfterLogin");
  if (redirectPage) {
    localStorage.removeItem("redirectAfterLogin");
    window.location.href = redirectPage;
  } else {
    window.location.href = "career.html"; // default after signup
  }
}

// Logout
function logoutUser() {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "index.html";
}
