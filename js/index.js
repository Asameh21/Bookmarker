let bookmarkName = document.getElementById("bookmarkName");
let bookmarkURL = document.getElementById("bookmarkURL");
let search = document.getElementById("searchPrduct");
if (
  localStorage.getItem("container") === "" ||
  localStorage.getItem("container") === null ||
  localStorage.getItem("container") === undefined
) {
  sitesContainer = [];
} else {
  sitesContainer = JSON.parse(localStorage.getItem("container"));
  display();
}

if (
  localStorage.getItem("deletedItems") === "" ||
  localStorage.getItem("deletedItems") === null ||
  localStorage.getItem("deletedItems") === undefined
) {
  deletedItems = [];
} else {
  deletedItems = JSON.parse(localStorage.getItem("deletedItems"));
}

function createSite() {
  if (
    bookmarkName.classList.contains("is-valid") &&
    bookmarkURL.classList.contains("is-valid")
  ) {
    let site = {
      name: bookmarkName.value,
      url: bookmarkURL.value,
    };
    sitesContainer.push(site);
    localStorage.setItem("container", JSON.stringify(sitesContainer));
    display();
    clearData();
  } else if (
    bookmarkName.classList.contains("is-valid") &&
    !bookmarkURL.classList.contains("is-valid")
  ) {
    Swal.fire({
      html: `<p class="m-0 mb-2">Invalid site url. Please ensure the site name starts with http://, https://, or www. and ends with .com </p>
      <p>
      Examples of valid formats include:
      </p>
      <p>http://example.com</p>
      <p>https://example.com</p>
      <p>http://www.example.com</p>
      <p>https://www.example.com</p>
      <p>www.example.com</p>
      <p>example.com</p>
      `,
    });
  } else if (
    !bookmarkName.classList.contains("is-valid") &&
    bookmarkURL.classList.contains("is-valid")
  ) {
    Swal.fire({
      html: `<p class="m-0 mb-2">"Invalid name. Please ensure the name:Contains only alphabetic characters, spaces, hyphens, or apostrophes.
      Is between 6 and 20 characters in length.
      </p>
      <p>
      Examples of valid names include:
      </p>
      <p>
      Google
      </p>
      <p>
      Youtube
      </p>
      <p>
      Git-hub
      </p>
      `,
    });
  } else {
    Swal.fire({
      html: `<p >Invalid site url. Please ensure the site name starts with http://, https://, or www. and ends with .com you can also write  just the site name ends with .com like "google.com"</p>
      <p >"Invalid name. Please ensure the name:Contains only alphabetic characters, spaces, hyphens, or apostrophes.
      Is between 6 and 20 characters in length.
      </p>
      `,
    });
  }
}

function display() {
  let cartona = "";
  for (let i = 0; i < sitesContainer.length; i++) {
    cartona += `
  <tr>
              <td>${i + 1}</td>
              <td>${sitesContainer[i].name}</td>
              <td>
                <button onclick="visit(${i})" class="btn btn-visit" >
                  <i class="fa-solid fa-eye pe-2"></i>Visit
                </button>
              </td>
              <td>
                <button onclick="deleteSite(${i})" class="btn btn-delete pe-2" >
                  <i class="fa-solid fa-trash-can"></i>
                  Delete
                </button>
              </td>
              <td>
                <button onclick="updatefilteredValues(${i})" class="btn btn-update pe-2 bg-warning" >
                <i class="fa-solid fa-pen"></i>
                Update
                </button>
              </td>
            </tr>
  `;
  }
  document.getElementById("tableContent").innerHTML = cartona;
}

function visit(x) {
  if (sitesContainer[x].url.includes("https")) {
    window.open(sitesContainer[x].url);
  } else {
    window.open("https://" + sitesContainer[x].url);
  }
}

function deleteSite(z) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success mx-2",
      cancelButton: "btn btn-danger mx-2",
    },
    buttonsStyling: false,
  });
  swalWithBootstrapButtons
    .fire({
      title: "Are you sure?",
      text: "You are going to delete this bookmark",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire({
          title: "Deleted!",
          text: "Your bookmark has been deleted.",
          icon: "success",
        });
        let deletedSite = sitesContainer.splice(z, 1);
        deletedItems.push(deletedSite);
        localStorage.setItem("deletedItems", JSON.stringify(deletedItems));
        localStorage.setItem("container", JSON.stringify(sitesContainer));
        display();
        const Toast = Swal.mixin({
          showCloseButton: true,
          toast: true,
          position: "top-end",
          showConfirmButton: true,
          confirmButtonText: `Undo`,
          timer: 5000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "warning",
          title: `"Bookmark deleted. If this was a mistake, you can undo the deletion by clicking the 'Undo' button below."          `,
        }).then((result) => {
          if (result.isConfirmed) {
            site = {
              name: deletedItems[deletedItems.length - 1][0].name,
              url: deletedItems[deletedItems.length - 1][0].url,
            };
            sitesContainer.push(site);
            localStorage.setItem("container", JSON.stringify(sitesContainer));
            display();
          }
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your bookmark is safe :)",
          icon: "error",
        });
      }
    });
}

function clearData() {
  bookmarkName.value = null;
  bookmarkURL.value = null;
  bookmarkName.classList.remove("is-valid");
  bookmarkURL.classList.remove("is-valid");
}

function validateForm(ele) {
  let regex = {
    bookmarkName: /^(?=.{3,20}$)[a-zA-Z]+([ '-][a-zA-Z]+)*$/,
    bookmarkURL: /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.com$/,
  };
  if (regex[ele.id].test(ele.value)) {
    ele.classList.add("is-valid");
    ele.classList.remove("is-invalid");
  } else {
    ele.classList.remove("is-valid");
    ele.classList.add("is-invalid");
  }
}
function filteredResults() {
  let searchValue = search.value;
  let filteredItems = [];
  for (let i = 0; i < sitesContainer.length; i++) {
    if (
      sitesContainer[i].name.toLowerCase().includes(searchValue.toLowerCase())
    ) {
      filteredItems.push(sitesContainer[i]);
    }
  }
  return filteredItems;
}

function displayfiltered() {
  let cartona = "";
  for (let i = 0; i < filteredResults().length; i++) {
    cartona += `
  <tr>
              <td>${i + 1}</td>
              <td>${filteredResults()[i].name}</td>
              <td>
                <button onclick="visit(${i})" class="btn btn-visit" >
                  <i class="fa-solid fa-eye pe-2"></i>Visit
                </button>
              </td>
              <td>
                <button onclick="deleteFilteredSite(${i})" class="btn btn-delete pe-2" >
                  <i class="fa-solid fa-trash-can"></i>
                  Delete
                </button>
              </td>
              <td>
              <button onclick="updatefilteredValues(${i})" class="btn btn-update pe-2 bg-warning" >
              <i class="fa-solid fa-pen"></i>
              Update
              </button>
            </td>
            </tr>
  `;
  }
  document.getElementById("tableContent").innerHTML = cartona;
}

function deleteFilteredSite(y) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success mx-2",
      cancelButton: "btn btn-danger mx-2",
    },
    buttonsStyling: false,
  });
  swalWithBootstrapButtons
    .fire({
      title: "Are you sure?",
      text: "You are going to delete this bookmark",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire({
          title: "Deleted!",
          text: "Your bookmark has been deleted.",
          icon: "success",
        });
        let itemName = filteredResults()[y].name;
        for (let i = 0; i < sitesContainer.length; i++) {
          if (sitesContainer[i].name === itemName) {
            let deletedSite = filteredResults().splice(y, 1);
            deletedItems.push(deletedSite);
            localStorage.setItem("deletedItems", JSON.stringify(deletedItems));
            sitesContainer.splice(i, 1);
            localStorage.setItem("container", JSON.stringify(sitesContainer));
            displayfiltered();
          }
        }
        const Toast = Swal.mixin({
          showCloseButton: true,
          toast: true,
          position: "top-end",
          showConfirmButton: true,
          confirmButtonText: `Undo`,
          timer: 5000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "warning",
          title: `"Bookmark deleted. If this was a mistake, you can undo the deletion by clicking the 'Undo' button below."          `,
        }).then((result) => {
          if (result.isConfirmed) {
            site = {
              name: deletedItems[deletedItems.length - 1][0].name,
              url: deletedItems[deletedItems.length - 1][0].url,
            };
            sitesContainer.push(site);
            localStorage.setItem("container", JSON.stringify(sitesContainer));
            displayfiltered();
          }
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your bookmark is safe :)",
          icon: "error",
        });
      }
    });
}
let updateIndex;
function updateValues(t) {
  updateIndex = t;
  bookmarkName.classList.add("is-valid");
  bookmarkURL.classList.add("is-valid");
  bookmarkName.value = sitesContainer[t].name;
  bookmarkURL.value = sitesContainer[t].url;
  document.getElementById("submitBtn").classList.add("d-none");
  document.getElementById("update-Btn").classList.remove("d-none");
}
let updatefilteredIndex;
function updatefilteredValues(f) {
  updatefilteredIndex = f;
  bookmarkName.classList.add("is-valid");
  bookmarkURL.classList.add("is-valid");
  bookmarkName.value = filteredResults()[f].name;
  bookmarkURL.value = filteredResults()[f].url;
  document.getElementById("submitBtn").classList.add("d-none");
  document.getElementById("update-filtered-Btn").classList.remove("d-none");
}
function setFilterdUpdatedValues() {
  if (
    bookmarkName.classList.contains("is-valid") &&
    bookmarkURL.classList.contains("is-valid")
  ) {
    filteredResults()[updatefilteredIndex].name = bookmarkName.value;
    filteredResults()[updatefilteredIndex].url = bookmarkURL.value;
    localStorage.setItem("container", JSON.stringify(sitesContainer));
    document.getElementById("submitBtn").classList.remove("d-none");
    document.getElementById("update-filtered-Btn").classList.add("d-none");

    displayfiltered();
    clearData();
  } else if (
    bookmarkName.classList.contains("is-valid") &&
    !bookmarkURL.classList.contains("is-valid")
  ) {
    Swal.fire({
      html: `<p class="m-0 mb-2">Invalid site url. Please ensure the site name starts with http://, https://, or www. and ends with .com </p>
      <p>
      Examples of valid formats include:
      </p>
      <p>http://example.com</p>
      <p>https://example.com</p>
      <p>http://www.example.com</p>
      <p>https://www.example.com</p>
      <p>www.example.com</p>
      <p>example.com</p>
      `,
    });
  } else if (
    !bookmarkName.classList.contains("is-valid") &&
    bookmarkURL.classList.contains("is-valid")
  ) {
    Swal.fire({
      html: `<p class="m-0 mb-2">"Invalid name. Please ensure the name:Contains only alphabetic characters, spaces, hyphens, or apostrophes.
      Is between 6 and 20 characters in length.
      </p>
      <p>
      Examples of valid names include:
      </p>
      <p>
      Google
      </p>
      <p>
      Youtube
      </p>
      <p>
      Git-hub
      </p>
      `,
    });
  } else {
    Swal.fire({
      html: `<p >Invalid site url. Please ensure the site name starts with http://, https://, or www. and ends with .com you can also write  just the site name ends with .com like "google.com"</p>
      <p >"Invalid name. Please ensure the name:Contains only alphabetic characters, spaces, hyphens, or apostrophes.
      Is between 6 and 20 characters in length.
      </p>
      `,
    });
  }
}

function setUpdatedValues() {
  if (
    bookmarkName.classList.contains("is-valid") &&
    bookmarkURL.classList.contains("is-valid")
  ) {
    sitesContainer[updateIndex].name = bookmarkName.value;
    sitesContainer[updateIndex].url = bookmarkURL.value;
    localStorage.setItem("container", JSON.stringify(sitesContainer));
    document.getElementById("submitBtn").classList.remove("d-none");
    document.getElementById("update-Btn").classList.add("d-none");

    display();
    clearData();
  } else if (
    bookmarkName.classList.contains("is-valid") &&
    !bookmarkURL.classList.contains("is-valid")
  ) {
    Swal.fire({
      html: `<p class="m-0 mb-2">Invalid site url. Please ensure the site name starts with http://, https://, or www. and ends with .com </p>
      <p>
      Examples of valid formats include:
      </p>
      <p>http://example.com</p>
      <p>https://example.com</p>
      <p>http://www.example.com</p>
      <p>https://www.example.com</p>
      <p>www.example.com</p>
      <p>example.com</p>
      `,
    });
  } else if (
    !bookmarkName.classList.contains("is-valid") &&
    bookmarkURL.classList.contains("is-valid")
  ) {
    Swal.fire({
      html: `<p class="m-0 mb-2">"Invalid name. Please ensure the name:Contains only alphabetic characters, spaces, hyphens, or apostrophes.
      Is between 6 and 20 characters in length.
      </p>
      <p>
      Examples of valid names include:
      </p>
      <p>
      Google
      </p>
      <p>
      Youtube
      </p>
      <p>
      Git-hub
      </p>
      `,
    });
  } else {
    Swal.fire({
      html: `<p >Invalid site url. Please ensure the site name starts with http://, https://, or www. and ends with .com you can also write  just the site name ends with .com like "google.com"</p>
      <p >"Invalid name. Please ensure the name:Contains only alphabetic characters, spaces, hyphens, or apostrophes.
      Is between 6 and 20 characters in length.
      </p>
      `,
    });
  }
}
