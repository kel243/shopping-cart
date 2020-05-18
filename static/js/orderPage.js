const stripePublicKey = document.getElementById("publicKey").value;
const stripe = Stripe("pk_test_RaH2Cdy11oghW04JmLnpOzrD008SXm6Eah");
const elements = stripe.elements();
// Tab Code

const openTab = (event) => {
  let i, tabcontent, tablinks;
  const tabName = event.target.id;

  tabcontent = document.getElementsByClassName("orderMenus");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("menu-tab");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(
      " menu-tab-active",
      ""
    );
  }

  document.getElementById(`menu-${tabName}`).style.display = "block";

  event.currentTarget.className += " menu-tab-active";
};

const menuTabs = document.getElementsByClassName("menu-tab");

if (menuTabs) {
  for (let i = 0; i < menuTabs.length; i++) {
    menuTabs[i].addEventListener("click", openTab);
  }

  if (document.getElementById("regular"))
    document.getElementById("regular").click();
}

// Modal Code

const openModal = (event) => {
  let itemId = event.target.id;
  let modal = document.getElementById(`${itemId}-modal`);

  if (!modal) {
    itemId = event.target.parentElement.id;
    modal = document.getElementById(`${itemId}-modal`);
  }

  modal.style.display = "block";
};

const itemBoxes = document.getElementsByClassName("itemBox");
const scBtn = document.getElementById("sc");
const payBtn = document.getElementById("pay");

for (let i = 0; i < itemBoxes.length; i++) {
  itemBoxes[i].onclick = openModal;
}

scBtn.onclick = openModal;
payBtn.onclick = openModal;

const x = document.getElementsByClassName("close");

const modals = document.getElementsByClassName("itemModal");

const closeModal = (event) => {
  const closeId = event.target.id;
  const chowFunOption = document.getElementsByClassName("chowFun");
  let itemId = closeId.split("-")[0];

  if (chowFunOption) {
    for (let i = 0; i < chowFunOption.length; i++) {
      chowFunOption[i].checked = false;
    }
  }

  let modal = document.getElementById(`${itemId}-modal`);
  modal.style.display = "none";
};

for (let i = 0; i < x.length; i++) {
  x[i].addEventListener("click", closeModal);
}

// Modal Purchase Code
const modalForm = document.getElementsByClassName("itemModal-box");
const scList = document.getElementById("sc-list");
const scTotal = document.getElementById("cost");
const amtDue = document.getElementById("amount");
const paymentAmt = document.getElementById("cc-amount");

const itemArray = [];

const addToCart = (event) => {
  event.preventDefault();
  const modalId = event.target.id;
  let itemId = modalId.split("-")[0];
  const price = document.getElementsByName(`${itemId}-price`);
  const options = document.getElementsByName(`${itemId}-options`);
  const meatOptions = document.getElementsByName(`${itemId}-meat-options`);
  const riceOptions = document.getElementsByName(`${itemId}-rice-options`);
  let name = document.getElementById(`${itemId}-name`).value;
  let cost = 0;

  for (let i = 0; i < price.length; i++) {
    if (price[i].checked) {
      const priceArr = price[i].value.split(" ");
      if (priceArr.length == 2) {
        name += ` ${priceArr[0]}`;
        cost += parseFloat(priceArr[1].replace("$", ""));
      } else if (priceArr.length == 3) {
        name += ` ${priceArr[0]} ${priceArr[1]}`;
        cost += parseFloat(priceArr[2].replace("$", ""));
      } else {
        cost += parseFloat(priceArr[0].replace("$", ""));
      }
    }
  }

  for (let i = 0; i < options.length; i++) {
    if (options[i].checked) {
      if (options[i].value == "white") {
        name += " White Rice";
      } else if (options[i].value == "fried") {
        name += " Fried Rice";
      } else if (options[i].value == "loMein") {
        name += " with Plain Lo Mein";
        cost += 3.25;
      } else if (options[i].value == "pLoMein") {
        name += " with Pork Lo Mein";
        cost += 3.75;
      } else if (options[i].value == "bLoMein") {
        name += " with Beef Lo Mein";
        cost += 3.75;
      } else if (options[i].value == "sLoMein") {
        name += " with Seafood Lo Mein";
        cost += 3.75;
      } else if (options[i].value == "chowFun") {
        name += " with Chow Fun";
        cost += 1.0;
      } else if (options[i].value == "panFried") {
        name = name.replace("Pan Fried or Steamed", "Pan Fried");
      } else if (options[i].value == "steamed") {
        name = name.replace("Pan Fried or Steamed", "Steamed");
      }
    }
  }

  for (let i = 0; i < meatOptions.length; i++) {
    if (meatOptions[i].checked) {
      name = name.replace("Chicken or Fish", meatOptions[i].value);
      name = name.replace("Choice of Meat", meatOptions[i].value);
      name = name.replace("Beef or Seafood", meatOptions[i].value);
      name = name.replace("Fish Fillet or Beef", meatOptions[i].value);
      name = name.replace("Beef or Fish Fillet", meatOptions[i].value);
      name = name.replace("Fried Chicken or Tofu", meatOptions[i].value);
    }
  }

  for (let i = 0; i < riceOptions.length; i++) {
    if (riceOptions[i].checked) {
      name += ` ${riceOptions[i].value} Rice`;
    }
  }

  const id = scList.children.length + 1;

  const li = document.createElement("li");
  li.innerHTML = `<li 
    id=${id}
    class="shopping-cart-modal-item"><span class="sc-item-name">${name}</span><span class="sc-item-price">$${cost.toFixed(
    2
  )}</span> <button class="deleteBtn" id=${id}-btn>Delete</button></li>`;

  scList.append(li);

  scTotal.innerHTML = (parseFloat(scTotal.innerHTML) + cost).toFixed(2);
  paymentAmt.value = parseFloat(scTotal.innerHTML).toFixed(2);
  amtDue.innerHTML = parseFloat(scTotal.innerHTML).toFixed(2);

  const itemObj = { id: id, name: name, price: cost.toFixed(2) };
  itemArray.push(itemObj);
  localStorage.setItem("items", JSON.stringify(itemArray));

  const deleteBtn = document.getElementById(`${scList.children.length}-btn`);

  deleteBtn.addEventListener("click", (event) => {
    const item = document.getElementById(id);
    scTotal.innerHTML = (parseFloat(scTotal.innerHTML) - cost).toFixed(2);
    amtDue.innerHTML = parseFloat(scTotal.innerHTML).toFixed(2);
    paymentAmt.value = parseFloat(scTotal.innerHTML).toFixed(2);
    for (let i = 0; i < itemArray.length; i++) {
      if (itemArray[i].id == id) {
        itemArray.splice(i, 1);
      }
    }
    localStorage.setItem("items", JSON.stringify(itemArray));
    item.parentNode.removeChild(item);
  });

  let modal = document.getElementById(`${itemId}-modal`);
  modal.style.display = "none";
};

for (let i = 0; i < modalForm.length; i++) {
  modalForm[i].addEventListener("submit", addToCart);
}

// Load items into Shopping Cart from LocalStorage

let itemStorage = JSON.parse(localStorage.getItem("items"));

window.onload = (event) => {
  scTotal.innerHTML = "0.00";
  paymentAmt.value = 0;
  amtDue.innerHTML = "0.00";
  if (itemStorage) {
    itemStorage.forEach((item) => {
      itemArray.push(item);
    });

    for (let i = 0; i < itemStorage.length; i++) {
      const cost = parseFloat(itemStorage[i].price);
      const li = document.createElement("li");
      li.innerHTML = `<li 
        id=${itemStorage[i].id}
        class="shopping-cart-modal-item"><span class="sc-item-name">${itemStorage[i].name}</span><span class="sc-item-price">$${itemStorage[i].price}</span> <button class="deleteBtn" id=${itemStorage[i].id}-btn>Delete</button></li>`;
      scList.append(li);
      scTotal.innerHTML = (parseFloat(scTotal.innerHTML) + cost).toFixed(2);
      paymentAmt.value = parseFloat(scTotal.innerHTML).toFixed(2);
      amtDue.innerHTML = parseFloat(scTotal.innerHTML).toFixed(2);

      const deleteBtn = document.getElementById(`${itemStorage[i].id}-btn`);

      deleteBtn.addEventListener("click", (event) => {
        const item = document.getElementById(itemStorage[i].id);
        scTotal.innerHTML = (parseFloat(scTotal.innerHTML) - cost).toFixed(2);
        amtDue.innerHTML = parseFloat(scTotal.innerHTML).toFixed(2);
        paymentAmt.value = parseFloat(scTotal.innerHTML).toFixed(2);
        for (let j = 0; j < itemArray.length; j++) {
          if (itemArray[j].id == itemStorage[i].id) {
            itemArray.splice(j, 1);
          }
        }
        localStorage.setItem("items", JSON.stringify(itemArray));
        item.parentNode.removeChild(item);
      });
    }
  }
};

// Stripe
const paymentForm = document.getElementById("payment-form");
const checkoutBtn = document.getElementById("pay-submit");

// Custom styling can be passed to options when creating an Element.
const style = {
  base: {
    // Add your base input styles here. For example:
    color: "black",
    fontSize: "18px",
    backgroundColor: "white",
    fontFamily: "Gotu, sans-serif",
    fontSmoothing: "antialiased",
    "::placeholder": {
      color: "black",
    },
  },
  invalid: {
    color: "red",
  },
};

// Create an instance of the card Element.
const card = elements.create("card", { style: style });

// Add an instance of the card Element into the `card-element` <div>.
card.mount("#card-element");

const stripeTokenHandler = (token) => {
  const hiddenInput = document.createElement("input");
  hiddenInput.setAttribute("type", "hidden");
  hiddenInput.setAttribute("name", "stripeToken");
  hiddenInput.setAttribute("value", token.id);
  paymentForm.appendChild(hiddenInput);

  const itemsInput = document.createElement("input");

  let itemsList = "";

  itemStorage = JSON.parse(localStorage.getItem("items"));

  itemStorage.map((item) => (itemsList = itemsList + item.name + "; "));

  itemsInput.setAttribute("type", "hidden");
  itemsInput.setAttribute("name", "items");
  itemsInput.setAttribute("value", itemsList);
  paymentForm.appendChild(itemsInput);

  // Submit the form
  paymentForm.submit();

  // Remove items from storage and shopping cart and reset all dues
  resetAll();
};

const paymentSubmitHandler = (event) => {
  event.preventDefault();
  checkoutBtn.disabled = true;

  const cardName = document.querySelector(".card-name").value;

  stripe
    .createToken(card, {
      name: cardName,
    })
    .then((result) => {
      if (result.error) {
        // Inform the customer that there was an error.
        console.log(result.error);
      } else {
        // Send the token to your server.
        stripeTokenHandler(result.token);
      }
    });
};

const resetAll = () => {
  localStorage.removeItem("items");
  scTotal.innerHTML = "0.00";
  paymentAmt.value = 0;
  amtDue.innerHTML = "0.00";
  while (scList.firstChild) scList.removeChild(scList.firstChild);
};

paymentForm.addEventListener("submit", paymentSubmitHandler);

// Responsive nav

const navLinks = document.getElementsByClassName("ham__nav__link");
const navToggle = document.getElementById("ham-toggle");

const closeNav = (e) => {
  navToggle.checked = false;
};

if (navLinks) {
  for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", closeNav);
  }
}
