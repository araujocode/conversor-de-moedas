let usdInput = document.querySelector('#usd');
let brlInput = document.querySelector('#brl');
let dolar = null;

async function getExchangeRate() {
    try {
        let response = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados/ultimos/1?formato=json');
        let data = await response.json();
        dolar = parseFloat(data[0].valor);
        console.log(`1 USD = ${dolar} BRL`);
        usdInput.value = "1,00";
        convert("usd-to-brl");
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
    }
}

usdInput.addEventListener("keyup", () => {
    if (usdInput.value.trim() === "") {
        brlInput.value = "";
    } else if (dolar !== null) {
        convert("usd-to-brl");
    }
});

brlInput.addEventListener("keyup", () => {
    if (brlInput.value.trim() === "") {
        usdInput.value = "";
    } else if (dolar !== null) {
        convert("brl-to-usd");
    }
});

usdInput.addEventListener("blur", () => { 
    if (usdInput.value.trim() !== "") {
        usdInput.value = formatCurrency(usdInput.value);
    }
});

brlInput.addEventListener("blur", () => {
    if (brlInput.value.trim() !== "") {
        brlInput.value = formatCurrency(brlInput.value);
    }
});

function formatCurrency(value) {
    let fixedValue = fixValue(value);
    let options = {
        useGrouping: false,
        minimumFractionDigits: 2
    };
    let formatter = new Intl.NumberFormat('pt-BR', options);
    return formatter.format(fixedValue);
}

function fixValue(value) {
    if (value.trim() === "") {
        return 0;
    }
    let fixedValue = value.replace(",", ".");
    let floatValue = parseFloat(fixedValue);
    if (isNaN(floatValue)) {
        floatValue = 0;
    }
    return floatValue;
}

function convert(type) {
    if (dolar === null) {
        console.error('Exchange rate not available.');
        return;
    }
    if (type == "usd-to-brl") {
        let fixedValue = fixValue(usdInput.value);

        let result = fixedValue * dolar;
        result = result.toFixed(2);

        brlInput.value = formatCurrency(result);
    }

    if (type == "brl-to-usd") {
        let fixedValue = fixValue(brlInput.value);

        let result = fixedValue / dolar;
        result = result.toFixed(2);

        usdInput.value = formatCurrency(result);
    }
}

getExchangeRate();
