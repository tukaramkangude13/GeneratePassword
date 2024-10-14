const inputSlider = document.getElementById("length-slider");
const lengthDisplay = document.getElementById("length-number");
const passwordDisplay = document.querySelector(".password-display");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const refreshBtn = document.getElementById("refreshBtn"); // Get the refresh button

const uppercaseCheckbox = document.getElementById("Uppercase");
const lowercaseCheckbox = document.getElementById("Lowercase");
const numbersCheckbox = document.getElementById("Numbers");
const symbolsCheckbox = document.getElementById("Symbol");
const allCheckboxes = document.querySelectorAll("input[type=checkbox]");
const symbols = " !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
const dataIndicator = document.getElementById("indicator");
const generateBtn = document.querySelector(".generatebutton");

let passwordLength = 10;
let checkCount = 0;

function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

handleSlider();

function setIndicator(color) {
    dataIndicator.style.backgroundColor = color;
    dataIndicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomLower() {
    return String.fromCharCode(getRandomInteger(97, 123));
}

function getRandomUpper() {
    return String.fromCharCode(getRandomInteger(65, 91));
}

function generateSymbol() {
    const randNum = getRandomInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calculateStrength() {
    let upper = uppercaseCheckbox.checked;
    let lower = lowercaseCheckbox.checked;
    let number = numbersCheckbox.checked;
    let symbol = symbolsCheckbox.checked;

    if (upper && lower && (number || symbol) && passwordLength >= 8) {
        setIndicator("#0f0");  // Strong password (green)
    } else if ((lower || upper) && (number || symbol) && passwordLength >= 6) {
        setIndicator("#ff0");  // Medium password (yellow)
    } else {
        setIndicator("#f00");  // Weak password (red)
    }
}

async function copyContent() {
    try {
        const copyButton = document.querySelector("[data-copy] svg");
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied!";
        copyButton.style.opacity = "0";
    } catch (e) {
        copyMsg.innerText = "Failed!";
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join("");
}

function handleCheckboxChange() {
    checkCount = 0;
    allCheckboxes.forEach((checkbox) => {
        if (checkbox.checked) checkCount++;
    });
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckboxChange);
});

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener("click", () => {
    if (passwordDisplay.value) copyContent();
});

generateBtn.addEventListener('click', () => {
    if (checkCount == 0) return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    let password = "";
    let funcArr = [];

    if (uppercaseCheckbox.checked) funcArr.push(getRandomUpper);
    if (lowercaseCheckbox.checked) funcArr.push(getRandomLower);
    if (numbersCheckbox.checked) funcArr.push(getRandomInteger);
    if (symbolsCheckbox.checked) funcArr.push(generateSymbol);
    generateBtn.style.opacity="0";

    // Compulsory addition of one character from each selected type
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // Fill remaining characters with random choices from the selected types
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRandomInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // Shuffle the password
    password = shufflePassword(Array.from(password));

    // Display the password
    passwordDisplay.value = password;

    // Calculate the strength
    calculateStrength();
});

// Reset function
function resetDefaults() {
    passwordLength = 10; // Reset to the default password length
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    // Reset checkboxes
    allCheckboxes.forEach(checkbox => {
        checkbox.checked = false; // Uncheck all checkboxes
    });

    // Reset the password display (clear the password)
    passwordDisplay.value = "";

    // Reset the indicator
    setIndicator("#f00"); // Default indicator color (red)
}

// Add event listener for the refresh button
refreshBtn.addEventListener('click', resetDefaults);