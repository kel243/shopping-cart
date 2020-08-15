import axios from "axios";

const loginForm = document.querySelector(".login-form");

const login = async (username, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/login",
      data: {
        username,
        password,
      },
    });

    if (res.data.status === "success") {
      window.setTimeout(() => {
        location.assign("/admin");
      }, 1500);
    }
  } catch (err) {
    window.setTimeout(() => {
      location.assign("/error");
    }, 1500);
  }
};

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  login(username, password);
});
