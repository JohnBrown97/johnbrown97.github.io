const outputs = {
    "Calspar": 360,
    "Malachite": 891,
    "Flakestone": 180,
    "Coal": 2151,
    "Calx Powder": 1361
};

function parseCurrency(value) {
    const parts = value.split(".");
    const gold = parseInt(parts[0]) || 0;
    const silver = parseInt(parts[1]) || 0;
    const copper = parseInt(parts[2]) || 0;
    return (gold * 10000) + (silver * 100) + copper;
}

function formatCurrency(copperAmount) {
    const gold = Math.floor(copperAmount / 10000);
    const remaining = copperAmount % 10000;
    const silver = Math.floor(remaining / 100);
    const copper = remaining % 100;
    return `${gold}.${silver}.${copper}`;
}

function calculateProfit() {
    const calxCost = parseCurrency(document.getElementById("calxCost").value);
    const includeCalx = document.getElementById("includeCalx").checked;

    let totalRevenue = 0;
    let keptMaterials = [];
    let details = "Calculation Details:\n\n";

    for (const [material, amount] of Object.entries(outputs)) {
        const priceInput = document.getElementById(`${material.toLowerCase()}Price`);
        const price = parseCurrency(priceInput.value);
        const revenue = price * amount;
        const includeMaterial = document.getElementById(`${material.toLowerCase()}Toggle`).checked;

        if (includeMaterial) {
            totalRevenue += revenue;
            details += `${material}:\n  Status: Selling\n  Amount: ${amount}\n  Price per unit: ${formatCurrency(price)}\n  Value: ${formatCurrency(revenue)}\n\n`;
        } else {
            keptMaterials.push({ material, amount, revenue });
        }
    }

    const profit = totalRevenue - (includeCalx ? calxCost : 0);
    details += `Total Revenue: ${formatCurrency(totalRevenue)}\n`;
    details += `Calx Cost: ${formatCurrency(includeCalx ? calxCost : 0)}\n`;
    details += `Net Profit/Loss: ${formatCurrency(profit)}\n\n`;

    if (keptMaterials.length) {
        details += "Theoretical Costs for Kept Materials:\n";
        for (const { material, amount } of keptMaterials) {
            const theoreticalCostPerUnit = Math.abs(profit) / amount;
            const theoreticalCost10000 = theoreticalCostPerUnit * 10000;
            const theoreticalCostStr = formatCurrency(Math.round(theoreticalCost10000));
            details += `${material}:\n  Theoretical Cost for 10,000: ${theoreticalCostStr}\n\n`;
        }
    }

    document.getElementById("resultLabel").innerText = profit < 0 ? `Loss: ${formatCurrency(Math.abs(profit))}` : `Profit: ${formatCurrency(Math.abs(profit))}`;
    document.getElementById("detailedResult").innerText = details;
}

document.getElementById("calculateButton").addEventListener("click", calculateProfit);

// Populate material inputs dynamically
const materialInputsDiv = document.getElementById("materialInputs");
for (const material of Object.keys(outputs)) {
    const div = document.createElement("div");
    div.classList.add("input-group");
    div.innerHTML = `
        <label for="${material.toLowerCase()}Price">${material} Price (g.s.c):</label>
        <input type="text" id="${material.toLowerCase()}Price" value="0.0.0">
        <label>
            <input type="checkbox" id="${material.toLowerCase()}Toggle" checked>
            Include in Profit
        </label>
    `;
    materialInputsDiv.appendChild(div);
}
