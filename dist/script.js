import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.querySelector(".chat_container");
const landingAnimation = document.querySelector(".landing-animation");

let loadInterval;

function loader(e) {
  e.textContent = "";
  loadInterval = setInterval(() => {
    e.textContent += ".";
    if (e.textContent === "....") e.textContent = "";
  }, 300);
}

function typeText(e, ans) {
  let index = 0;
  let interval = setInterval(() => {
    if (index < ans.length) {
      e.innerHTML += ans.charAt(index);
      index++;
    } else clearInterval(interval);
  }, 35);
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, id) {
  return `
    <div class="wrapper ${isAi && "ai"}">
      <div class="chat">
        <div class="profile">
          <img
            src="${isAi ? bot : user}"
            alt="${isAi ? "bot" : "user"}"
          />
        </div>
        <div class="message" id="${id}">${value}</div>
      </div>
    </div>
    `;
}

const handleSubmit = async (e) => {
  landingAnimation.remove();
  e.preventDefault();
  const data = new FormData(form);

  // user
  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));
  form.reset();

  // ai
  const id = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", id);

  chatContainer.scrollTop = chatContainer.scrollHeight;
  const messageDiv = document.getElementById(id);
  loader(messageDiv);

  const response = await fetch("https://modern-ai.onrender.com/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: data.get("prompt"),
    }),
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = "";

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();

    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();
    messageDiv.innerHTML = "Something went wrong...";
    alert(err);
  }
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) handleSubmit(e);
});
