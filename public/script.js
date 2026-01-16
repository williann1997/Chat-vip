const socket = io();

function enterChat() {
  const nick = document.getElementById("nickname").value.trim();
  if (!nick) return;

  document.getElementById("login").classList.add("hidden");
  document.getElementById("chat").classList.remove("hidden");

  socket.emit("join", nick);
}

function sendMessage() {
  const input = document.getElementById("messageInput");
  if (!input.value) return;

  socket.emit("public:message", input.value);
  input.value = "";
}

socket.on("public:message", (data) => {
  const div = document.createElement("div");

  if (data.system) {
    div.innerHTML = `<em>${data.message}</em>`;
  } else {
    div.innerHTML = `<strong>${data.user}:</strong> ${data.message}`;
  }

  document.getElementById("messages").appendChild(div);
});

socket.on("users:update", (list) => {
  const ul = document.getElementById("users");
  ul.innerHTML = "";

  list.forEach(user => {
    const li = document.createElement("li");
    li.textContent = user.nickname + (user.isVip ? " ⭐" : "");
    ul.appendChild(li);
  });
});
