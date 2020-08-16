import openSocket from "socket.io-client";

const incompleteTab = document.querySelector("#incomplete-tab");

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const socket = openSocket("http://localhost:8080", {
  transports: ["websocket", "polling", "flashsocket"],
});

socket.on("new-order", (data) => {
  const newBox = document.createElement("div");
  let itemList = "";

  newBox.classList.add("admin-orders-box");

  data.order.items.forEach((el) => {
    itemList += `<p class="admin-orders-text">${el.name}</p>`;
  });

  newBox.innerHTML = `<div class='admin-orders-header'>
  <p class="admin-orders-text" id="customer">Customer: ${
    data.order.customer
  }</p>
  <p class="admin-orders-text">${months[data.date.month - 1]} ${
    data.date.date
  }, ${data.date.year}</p>
  <p class="admin-orders-text">${data.date.hour}:${data.date.minute}:${
    data.date.second
  }${+data.date.hour > 11 ? "pm" : "am"}</p>
  </div>
  <div class='admin-orders-items'>
  ${itemList}
  </div>
  <p class="admin-orders-text" id="total">Total: $${data.order.total}</p>
  <form action='/admin/orders/${data.order._id}' method='post'>
  <button class='admin-orders-btn'>Complete</button>
  </form>
  `;

  incompleteTab.insertBefore(newBox, incompleteTab.childNodes[0]);
});
