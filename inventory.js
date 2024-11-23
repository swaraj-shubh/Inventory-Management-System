const products = [];
let totalMoneyEarned = 0;

function addProduct() {
    const productName = document.getElementById("productName").value.trim();
    const productQuantity = parseInt(document.getElementById("productQuantity").value);
    const productCost = parseFloat(document.getElementById("productCost").value);

    if (!productName  || productCost <= 0) {
        alert("Please enter valid product details.");
        return;
    }

    const existingProduct = products.find(product => product.name === productName);

    if (existingProduct) {
        existingProduct.quantityPurchased += productQuantity;
        existingProduct.totalCost = existingProduct.quantityPurchased * existingProduct.cost;
    } else {
        products.push({
            name: productName,
            quantityPurchased: productQuantity,
            quantitySold: 0,
            cost: productCost,
            totalCost: productQuantity * productCost
        });
    }

    updateTable();
    calculateTotalMoneyEarned();

    // Clear input fields
    document.getElementById("productName").value = "";
    document.getElementById("productQuantity").value = "";
    document.getElementById("productCost").value = "";
}

function updateTable() {
    const tableBody = document.getElementById("inventoryTable").getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ""; // Clear existing rows

    products.forEach(product => {
        const amountSold = product.quantitySold * product.cost;  // Calculate Amount Sold

        const newRow = tableBody.insertRow(-1);
        const cell1 = newRow.insertCell(0);
        const cell2 = newRow.insertCell(1);
        const cell3 = newRow.insertCell(2);
        const cell4 = newRow.insertCell(3);
        const cell5 = newRow.insertCell(4);
        const cell6 = newRow.insertCell(5);
        const cell7 = newRow.insertCell(6);

        cell1.textContent = product.name;
        cell2.innerHTML = `
            ${product.quantityPurchased}
            <button onclick="sellProduct('${product.name}')">Sell</button>
            <button onclick="returnProduct('${product.name}')">Returned</button> <!-- New Button -->
        `;
        cell3.textContent = product.quantitySold;
        cell4.textContent = product.cost.toFixed(2);
        cell5.textContent = product.totalCost.toFixed(2);
        cell6.textContent = amountSold.toFixed(2); // Display Amount Sold
        cell7.innerHTML = '<button onclick="deleteProduct(this)">Delete</button>';
    });
}

function sellProduct(productName) {
    const product = products.find(product => product.name === productName);
    if (product) {
        if (product.quantityPurchased > product.quantitySold) {
            product.quantitySold += 1;
            updateTable();
            calculateTotalMoneyEarned();
        } else {
            alert("No more items left to sell.");
        }
    }
}

function returnProduct(productName) {
    const product = products.find(product => product.name === productName);
    if (product) {
        if (product.quantitySold > 0) {
            product.quantitySold -= 1;
            updateTable();
            calculateTotalMoneyEarned();
        } else {
            alert("No items have been sold yet to return.");
        }
    }
}

function deleteProduct(button) {
    const row = button.parentNode.parentNode;
    const productName = row.cells[0].textContent;

    const productIndex = products.findIndex(product => product.name === productName);
    products.splice(productIndex, 1);

    row.parentNode.removeChild(row);
    calculateTotalMoneyEarned();
}

function calculateTotalMoneyEarned() {
    totalMoneyEarned = products.reduce((total, product) => {
        const amountSold = product.quantitySold * product.cost;
        const netValue = product.totalCost - amountSold;
        return total + netValue;
    }, 0);
    
    document.getElementById('totalMoneyEarned').textContent = `Net Inventory Value: Rs.${totalMoneyEarned.toFixed(2)}`;
}

function showCharts() {
    const productNames = products.map(product => product.name);
    const productQuantities = products.map(product => product.quantityPurchased - product.quantitySold);
    const productCosts = products.map(product => product.totalCost);
    const productAmountsSold = products.map(product => product.quantitySold * product.cost);

    // Create Quantity Chart
    const quantityCtx = document.getElementById('quantityChart').getContext('2d');
    new Chart(quantityCtx, {
        type: 'pie',
        data: {
            labels: productNames,
            datasets: [{
                label: 'Quantity Remaining',
                data: productQuantities,
                backgroundColor: productNames.map(() => '#' + Math.floor(Math.random() * 16777215).toString(16)),
                borderWidth: 1
            }]
        }
    });

    // Create Sold Chart
    const soldCtx = document.getElementById('soldChart').getContext('2d');
    new Chart(soldCtx, {
        type: 'pie',
        data: {
            labels: productNames,
            datasets: [{
                label: 'Amount Sold',
                data: productAmountsSold,
                backgroundColor: productNames.map(() => '#' + Math.floor(Math.random() * 16777215).toString(16)),
                borderWidth: 1
            }]
        }
    });

    // Create Cost Chart
    const costCtx = document.getElementById('costChart').getContext('2d');
    new Chart(costCtx, {
        type: 'pie',
        data: {
            labels: productNames,
            datasets: [{
                label: 'Cost Distribution',
                data: productCosts,
                backgroundColor: productNames.map(() => '#' + Math.floor(Math.random() * 16777215).toString(16)),
                borderWidth: 1
            }]
        }
    });
}
