const openTabAdmin = (event) => {
  let i, tabcontent, tablinks;
  const tabName = event.target.id;

  tabcontent = document.getElementsByClassName("admin-products-tab");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("admin-products-tab-btn");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(
      " admin-products-tab-btn-active",
      ""
    );
  }

  document.getElementById(`${tabName}-tab`).style.display = "flex";

  event.currentTarget.className += " admin-products-tab-btn-active";
};

const adminTabs = document.getElementsByClassName("admin-products-tab-btn");

if (adminTabs) {
  for (let i = 0; i < adminTabs.length; i++) {
    adminTabs[i].addEventListener("click", openTabAdmin);
  }

  if (document.getElementById("reg")) document.getElementById("reg").click();
  if (document.getElementById("incomplete"))
    document.getElementById("incomplete").click();
}
