const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector("input");  // Assuming only one input in form

// Populate dropdowns with currency options and set initial flags
for (let select of dropdowns) {
  for (let currCode in countryList) {
    const option = document.createElement("option");
    option.value = currCode;
    option.innerText = currCode;

    if (select.name === "from" && currCode === "USD") {
      option.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      option.selected = true;
    }

    select.appendChild(option);
  }

  // Update flag on currency change
  select.addEventListener("change", (e) => {
    updateFlag(e.target);
  });
}

// Update flag image
const updateFlag = (element) => {
  const currCode = element.value;
  const countryCode = countryList[currCode];
  const imgTag = element.parentElement.querySelector("img");
  imgTag.src = `https://flagsapi.com/${countryCode}/shiny/64.png`;
};

// Get exchange rate and display result
const updateExchangeRate = async () => {
  let amtVal = parseFloat(amountInput.value);

  if (isNaN(amtVal) || amtVal <= 0) {
    amtVal = 1;
    amountInput.value = "1";
  }

  const from = fromCurr.value.toLowerCase();
  const to = toCurr.value.toLowerCase();

  try {
    const response = await fetch(`${BASE_URL}/${from}.json`);
    const data = await response.json();
    const rate = data[from][to];

    if (rate) {
      const converted = (amtVal * rate).toFixed(2);
      msg.innerText = `${amtVal} ${fromCurr.value} = ${converted} ${toCurr.value}`;
    } else {
      msg.innerText = "Exchange rate not found.";
    }
  } catch (error) {
    msg.innerText = "Failed to fetch exchange rate.";
    console.error(error);
  }
};

// Event listener on button click
btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

// Initial fetch on page load
window.addEventListener("load", () => {
  updateExchangeRate();
});
