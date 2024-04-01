"use strict";

const url = "https://localhost:3000";
const employersUrl = url + "/employers";

const form = document.getElementById("dataForm");
const loadDataBtn = document.querySelector(".button-load");
const tableBody = document.getElementById("employee-body");
const takeInputField = document.getElementById("take");

(() => {
  const dataFields = ["name", "age", "position", "department"];

  dataFields.forEach((option) => {
    const sortBySelect = document.getElementById("sortBy");
    const filterSelect = document.getElementById("filterSelect");

    const optionElement = `<option value="${option}">${option}</option>`;
    sortBySelect.insertAdjacentHTML("beforeend", optionElement);
    filterSelect.insertAdjacentHTML("beforeend", optionElement);
  });
})();

const displayData = (data) => {
  tableBody.innerHTML = "";

  data.forEach((employee, index) => {
    const rowClass = index % 2 === 0 ? "" : "accent-row";
    const row = `
                <tr class="${rowClass}">
                    <td>${employee._id}</td>
                    <td>${employee.name}</td>
                    <td>${employee.age}</td>
                    <td>${employee.position}</td>
                    <td>${employee.department}</td>
                </tr>
            `;
    tableBody.insertAdjacentHTML("beforeend", row);
  });
};

const fetchAndDisplayData = async (options) => {
  try {
    const response = await fetch(options.url, options);
    const responseBody = await response.json();

    if (response.status !== 200) {
      window.alert(
        `Request finished with code ${response.status} \n 
        ${responseBody.name} \n 
        ${responseBody.message} \n 
        ${responseBody.data && JSON.stringify(responseBody.data)}`,
      );
      return;
    }

    if (!responseBody.data) {
      window.alert(
        "No more data left in cursor. Send cursor options to recreate cursor!",
      );
      return;
    }

    displayData(responseBody.data);
    return response;
  } catch (err) {
    window.alert(`⛔ Error: ${err.message}`);
  }
};

loadDataBtn.addEventListener("click", () => {
  const take = takeInputField.value;
  const params = new URLSearchParams({ take });

  const url = take ? employersUrl + "?" + params : employersUrl;

  const requestOptions = {
    url,
    method: "GET",
    headers: {
      service: "LOAD_EMPLOYERS",
    },
  };

  return fetchAndDisplayData(requestOptions);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const formExtractedData = Object.fromEntries(formData.entries());

  const formParsedData = {};

  if (formExtractedData.reset) {
    formParsedData.reset = true;
  }

  if (formExtractedData.take) {
    formParsedData.take = Number(formExtractedData.take);
  }

  if (formExtractedData.sortBy && formExtractedData.sortOrder) {
    formParsedData.sort = {
      [formExtractedData.sortBy]: Number(formExtractedData.sortOrder),
    };
  }

  if (formExtractedData.filterSelect && formExtractedData.filterValue) {
    let filterValue;
    try {
      filterValue = JSON.parse(formExtractedData.filterValue);
    } catch (e) {
      console.warn(
        "Error parsing filterValue. If it suppose to be correct json - check value.",
      );
      filterValue = formExtractedData.filterValue;
    }
    formParsedData.filters = { [formExtractedData.filterSelect]: filterValue };
  }

  const requestOptions = {
    url: employersUrl,
    method: "POST",
    body: JSON.stringify(formParsedData),
    headers: {
      service: "POST_LOAD_EMPLOYERS_OPTIONS",
      command: "NOTIFY",
    },
  };

  return fetchAndDisplayData(requestOptions);
});
