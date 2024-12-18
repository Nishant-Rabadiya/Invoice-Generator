"use strict";
const invoiceBody = document.getElementById('invoiceBody');
let invoice = {
    buyerDetails: {
        buyerAddress: "",
        buyerEmail: "",
        buyerName: ""
    },
    sellerDetails: {
        sellerAddress: "",
        sellerEmail: "",
        sellerName: ""
    },
    itemDetails: [],
    discount: "",
    dueDate: "",
    invoiceGenerateDate: "",
    taxRate: "",
    totalAmount: ""
};
const allInvoiceList = () => {
    let data = localStorage.getItem('allInvoiceData');
    return data ? JSON.parse(data) : [];
};
let invoiceData;
let allInvoice = allInvoiceList() || [];
const getInvoiceData = () => {
    let data = localStorage.getItem('invoiceData');
    return invoiceData = data ? JSON.parse(data) : [];
};
window.onload = () => {
    const addInvoiceButton = document.getElementById("addInvoiceButton");
    if (addInvoiceButton) {
        addInvoiceButton.click();
    }
};
const addInvoice = () => {
    if (invoiceBody) {
        invoiceBody.innerHTML = `
        <div class="invoice-details-section">

                <div class="invoice-date-section">
                    <p class="invoice-date">Date: <spans class="invoice-current-date">${new Date().toLocaleDateString('en-GB')}</spans>
                    </p>
                    <div>
                        <p class="invoice-date">Due date: <input type="date" class="invoice-due-date-input invoive-blank-input" id="dueDate" name="dueDate" oninput="detailField(this)" /></p>
                    </div>
                </div>

                <div class="invoice-buyer-seller-detalis">
                    <div>
                        <p class="invoice-bill-to-or-from">Bill to:</p>
                        <input oninput="detailField(this)" id="buyerName" name="buyerName" class="invoice-buyer-seller-detalis-input invoive-blank-input blank-invoice-input" type="text" placeholder="Who is this invoice to?" />
                        <input oninput="detailField(this)" id="buyerEmail" name="buyerEmail" class="invoice-buyer-seller-detalis-input invoive-blank-input invoice-email blank-invoice-input" type="text" placeholder="Email address" />
                        <input oninput="detailField(this)" id="buyerAddress" name="buyerAddress" class="invoice-buyer-seller-detalis-input invoive-blank-input blank-invoice-input" type="text" placeholder="Billing address" />
                    </div>
                    <div>
                        <p class="invoice-bill-to-or-from">Bill from:</p>
                        <input oninput="detailField(this)" id="sellerName" name="sellerName" class="invoice-buyer-seller-detalis-input invoive-blank-input" type="text" placeholder="Who is this invoice from?" />
                        <input oninput="detailField(this)" id="sellerEmail" name="sellerEmail" class="invoice-buyer-seller-detalis-input invoive-blank-input invoice-email" type="text" placeholder="Email address" />
                        <input oninput="detailField(this)" id="sellerAddress" name="sellerAddress" class="invoice-buyer-seller-detalis-input invoive-blank-input" type="text" placeholder="Billing address"/>
                    </div>
                </div>

                <div>
                    <table class="items-table">
                    <thead>
                        <tr>
                            <th class="table-item table-data">ITEM</th>
                            <th class="table-quantity table-data">QTY</th>
                            <th class="table-price-rate table-data">PRICE/RATE</th>
                            <th class="table-action table-data">ACTION</th>
                        </tr>
                    </thead>
                    <tbody  id="itemTable">

                    </tbody>    
                    </table>
                </div>
                <p class="item-table-error" id="itemTableError"></p>
                <div>
                    <button class="add-item-button" onclick="addItemTableRaw(this)">Add Item</button>
                </div>

                <div class="invoice-calculation-section">
                    <div class="invoice-calculation">
                        <p class="calculation-heading">Subtotal:</p>
                        <p class="calculation-number" id="subTotal"><span><i class="fa-solid fa-dollar-sign"></i></span> 0.00</p>
                    </div>
                    <div class="invoice-calculation">
                        <p class="calculation-heading">Discount:</p>
                        <p class="calculation-number"><span id="discountRate">(0%)</span> <span id="discountTotal"><i class="fa-solid fa-dollar-sign"></i> </span></p>
                    </div>
                    <div class="invoice-calculation">
                        <p class="calculation-heading">Tax:</p>
                        <p class="calculation-number"><span id="taxRate">(0%)</span> <span id="taxTotal"><i class="fa-solid fa-dollar-sign"></i></span> </p>
                    </div>
                    <div class="invoice-calculation final-calculation">
                        <p class="invoice-total-heading">Total:</p>
                        <p class="invoice-total" id="total"><i class="fa-solid fa-dollar-sign"></i> 0</p>
                    </div>
                </div>
                <hr class="horizontal-line">

                <div>
                    <p class="add-invoice-note-heading">Notes:</p>
                    <textarea oninput="detailField(this)" name="note" id="" class="add-invoice-note" placeholder="Thanks for your business"></textarea>
                </div>

                <div class="submit-section">
                    <button class="submit-invoice" onclick="submitInvoiceData(this)">Submit</button>
                </div>
            </div>

            <div class="invoice-currency-discount-tax-section">
                <div class="invoice-discount-tax">
                    <button class="review-invoice" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="reviewInvoice(this)">Review Invoice</button>

                    <div>
                        <label class="currency-label">Currency:</label>
                        <select onchange="currencyValue(this)" class="currency-dropdown">
                            <option>USD (United States Doller)</option>
                            <option>INR (Indian Rupee)</option>
                        </select>
                    </div>

                    <div>
                        <p class="discount-tax-rate-heading">Tax rate:</p>
                        <input oninput="detailField(this)" id="taxRateValue" name="taxRateValue" type="number" class="discount-tax-rate-input" placeholder="0.0" /><span class="discount-tax-rate-sign">%</span>
                    </div>

                    <div>
                        <p class="discount-tax-rate-heading">Discount rate:</p>
                        <input oninput="detailField(this)" id="discountValue" name="discountValue" type="number" class="discount-tax-rate-input" placeholder="0.0" /><span class="discount-tax-rate-sign">%</span>    
                    </div>
                </div>
                <button class="invoice-list-button" onclick="shawInvoiceList(this)">Invoice List</button>
            </div>
                `;
    }
    invoice = {
        buyerDetails: {
            buyerAddress: "",
            buyerEmail: "",
            buyerName: ""
        },
        sellerDetails: {
            sellerAddress: "",
            sellerEmail: "",
            sellerName: ""
        },
        itemDetails: [],
        discount: "",
        dueDate: "",
        invoiceGenerateDate: "",
        taxRate: "",
        totalAmount: ""
    };
    invoice.invoiceGenerateDate = new Date().toLocaleDateString('en-GB');
    invoice.invoiceId = new Date().getTime();
    invoice.currency = "USD (United States Doller)";
    localStorage.setItem('invoiceData', JSON.stringify(invoice));
    disabledPastDate();
};
const shawInvoiceList = () => {
    location.replace('/html/list.html');
};
const disabledPastDate = () => {
    const dueDate = document.getElementById('dueDate');
    const today = new Date().toISOString().split('T')[0];
    if (dueDate)
        dueDate.setAttribute('min', today);
};
const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const detailField = (e) => {
    if (!e.value.trim()) {
        e.style.border = "2px solid red";
    }
    else {
        e.style.border = "none";
        if (e.name === "dueDate") {
            invoice.dueDate = e.value;
        }
        else if (e.name === "buyerName") {
            invoice.buyerDetails.buyerName = e.value;
        }
        else if (e.name === "buyerAddress") {
            invoice.buyerDetails.buyerAddress = e.value;
        }
        else if (e.name === "sellerName") {
            invoice.sellerDetails.sellerName = e.value;
        }
        else if (e.name === "sellerAddress") {
            invoice.sellerDetails.sellerAddress = e.value;
        }
        else if (e.name === "taxRateValue") {
            maxTaxOrDiscount(e);
            const taxRate = document.getElementById('taxRate');
            if (taxRate) {
                taxRate.innerText = e.value ? `(${e.value}%)` : "(0%)";
            }
            invoice.taxRate = e.value;
        }
        else if (e.name === "discountValue") {
            maxTaxOrDiscount(e);
            const discountRate = document.getElementById('discountRate');
            if (discountRate) {
                discountRate.innerText = e.value ? `(${e.value}%)` : "(0%)";
            }
            invoice.discount = e.value;
        }
        else if (e.name === "buyerEmail") {
            if (!emailPattern.test(e.value)) {
                e.style.border = "2px solid red";
            }
            else {
                e.style.border = "none";
                invoice.buyerDetails.buyerEmail = e.value;
            }
        }
        else if (e.name === "sellerEmail") {
            if (!emailPattern.test(e.value)) {
                e.style.border = "2px solid red";
            }
            else {
                e.style.border = "none";
                invoice.sellerDetails.sellerEmail = e.value;
                localStorage.setItem('invoiceData', JSON.stringify(invoice));
            }
        }
    }
    if (e.name === "note") {
        invoice.note = e.value;
    }
    localStorage.setItem('invoiceData', JSON.stringify(invoice));
    calculation();
};
const maxTaxOrDiscount = (e) => {
    let value = parseFloat(e.value);
    if (value > 100) {
        value = 100;
        e.value = '100';
    }
};
const currencyValue = (e) => {
    invoice.currency = e.value;
    localStorage.setItem('invoiceData', JSON.stringify(invoice));
    calculation();
};
const addItemTableRaw = () => {
    const date = new Date().getTime();
    invoice.itemDetails.push({
        itemId: date,
        id: 0,
        itemPrice: "",
        itemName: "",
        itemQuantity: 0
    });
    localStorage.setItem('invoiceData', JSON.stringify(invoice));
    const itemTable = document.getElementById('itemTable');
    const invoiceData = getInvoiceData();
    if (itemTable) {
        itemTable.innerHTML = "";
    }
    const findFirstData = invoiceData.itemDetails.findIndex((item) => item.itemId === date);
    invoice.itemDetails[findFirstData].id = 0;
    localStorage.setItem('invoiceData', JSON.stringify(invoice));
    const max = getInvoiceData();
    const maxId = max.itemDetails.sort((a, b) => a.id <= b.id ? 1 : -1);
    invoiceData.itemDetails.map((x) => {
        if (itemTable) {
            itemTable.innerHTML += `
            <tr id="${x.id ? x.id : maxId[0].id + 1}">
                <td><input oninput="itemTable(this)" name="itemName" id="${x.itemId}" value="${x.itemName ? x.itemName : ""}" class="table-item-input table-item-name invoive-blank-input" type="text" placeholder="Item name" />
                <input oninput="itemTable(this)" name="itemDiscription" value="${x.itemDiscription ? x.itemDiscription : ""}" class="table-item-input table-item-discription" type="text" placeholder="Item description" /></td>
                <td><input oninput="itemTable(this)" name="itemQuantity" value="${x.itemQuantity ? x.itemQuantity : ""}" class="table-quantity-input item-table-quantity invoive-blank-input" type="number" placeholder="0" /></td>
                <td><span class="table-currency-symbol">${invoiceData.currency === "USD (United States Doller)" ? `<i class="fa-solid fa-dollar-sign"></i>` : `<i class="fa-solid fa-indian-rupee-sign"></i>`}</span><input
                oninput="itemTable(this)" name="itemPrice" value="${x.itemPrice ? x.itemPrice : ""}" class="table-price-rate-input table-price invoive-blank-input" type="number" placeholder="0" /></td>
                <td><button class="table-action-button" onclick="removeItemTableRaw(this)"><i class="fa-regular fa-trash-can"></i></button></td>
            </tr>
        `;
        }
        invoice.itemDetails[findFirstData].id = maxId[0].id + 1;
        localStorage.setItem('invoiceData', JSON.stringify(invoice));
    });
};
const itemTable = (e) => {
    const invoiceData = getInvoiceData();
    let findIndex = invoiceData.itemDetails.findIndex((item) => { var _a, _b; return item.id.toString() === ((_b = (_a = e.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.id); });
    if (!e.value.trim()) {
        e.style.border = "2px solid red";
    }
    else {
        e.style.border = "none";
        if (e.name === "itemName") {
            invoice.itemDetails[findIndex].itemName = e.value;
        }
        else if (e.name === "itemQuantity") {
            invoice.itemDetails[findIndex].itemQuantity = parseFloat(e.value);
        }
        else if (e.name === "itemPrice") {
            invoice.itemDetails[findIndex].itemPrice = e.value;
        }
    }
    if (e.name === "itemDiscription") {
        invoice.itemDetails[findIndex].itemDiscription = e.value;
    }
    localStorage.setItem('invoiceData', JSON.stringify(invoice));
    calculation();
};
const removeItemTableRaw = (e) => {
    var _a, _b;
    (_b = (_a = e.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.remove();
    const invoiceData = getInvoiceData();
    const findData = invoiceData.itemDetails.findIndex((x) => { var _a, _b; return x.id.toString() === ((_b = (_a = e.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.id); });
    invoice.itemDetails.splice(findData, 1);
    localStorage.setItem('invoiceData', JSON.stringify(invoice));
    calculation();
};
const calculation = () => {
    const invoiceData = getInvoiceData();
    let itemPriceSubtotal = 0;
    invoiceData.itemDetails.forEach((invoiceData) => {
        itemPriceSubtotal += (parseFloat(invoiceData.itemPrice) * invoiceData.itemQuantity) ? parseFloat(invoiceData.itemPrice) * invoiceData.itemQuantity : 0;
    });
    const subTotal = document.getElementById("subTotal");
    if (subTotal) {
        subTotal.innerHTML = (invoiceData.currency === "USD (United States Doller)" ? `<i class="fa-solid fa-dollar-sign"></i>` : `<i class="fa-solid fa-indian-rupee-sign"></i>`) + " " + itemPriceSubtotal.toString();
    }
    let discountAmount = (itemPriceSubtotal * (parseFloat(invoiceData.discount ? invoiceData.discount : "0") / 100)).toFixed(2);
    const discountTotal = document.getElementById("discountTotal");
    if (discountTotal) {
        discountTotal.innerHTML = (invoiceData.currency === "USD (United States Doller)" ? `<i class="fa-solid fa-dollar-sign"></i>` : `<i class="fa-solid fa-indian-rupee-sign"></i>`) + " " + (discountAmount ? discountAmount : "0.00");
    }
    let totalAmount = itemPriceSubtotal - itemPriceSubtotal * (parseFloat(invoiceData.discount ? invoiceData.discount : "0") / 100);
    let taxRateTotal = (totalAmount * (parseFloat(invoiceData.taxRate ? invoiceData.taxRate : "0") / 100)).toFixed(2);
    const taxTotal = document.getElementById("taxTotal");
    if (taxTotal) {
        taxTotal.innerHTML = (invoiceData.currency === "USD (United States Doller)" ? `<i class="fa-solid fa-dollar-sign"></i>` : `<i class="fa-solid fa-indian-rupee-sign"></i>`) + " " + (taxRateTotal ? taxRateTotal : "0.00");
    }
    let allTotal = totalAmount + totalAmount * (parseFloat(invoiceData.taxRate ? invoiceData.taxRate : "0") / 100);
    const total = document.getElementById("total");
    if (total) {
        total.innerHTML = (invoiceData.currency === "USD (United States Doller)" ? `<i class="fa-solid fa-dollar-sign"></i>` : `<i class="fa-solid fa-indian-rupee-sign"></i>`) + " " + (allTotal.toFixed(2) ? allTotal.toFixed(2) : "0.00");
    }
    invoice.totalAmount = allTotal.toFixed(2);
    localStorage.setItem('invoiceData', JSON.stringify(invoice));
};
const reviewInvoice = () => {
    const invoiceData = getInvoiceData();
    const reviewInvoiceBody = document.getElementById('reviewInvoiceBody');
    if (reviewInvoiceBody) {
        reviewInvoiceBody.innerHTML = `
            <div class="review-invoice-body">
                <div class="review-invoice-heading-section">
                    <h1 class="review-invoice-heading">INVOICE</h1>
                    <i class="fa-brands fa-pied-piper logo-icon"></i>
                </div>

                <div class="review-invoice-dates-section">
                    <p class="review-invoice-date-title">Date: <span class="review-invoice-date">${invoiceData.invoiceGenerateDate}</span></p>
                    <p class="review-invoice-date-title">Due date: <span class="review-invoice-date">${(invoiceData.dueDate ? new Date(invoiceData.dueDate).toLocaleDateString('en-GB') : "")}</span></p>
                </div>

                <div class="review-invoice-buyer-seller-section">
                    <div class="review-invoice-buyer-seller-detail">
                        <p class="billed-to-or-from">Billed to:</p>
                        <p class="buyer-seller-name">${invoiceData.buyerDetails.buyerName ? invoiceData.buyerDetails.buyerName : ""}</p>
                        <p class="buyer-seller-email">${invoiceData.buyerDetails.buyerEmail ? invoiceData.buyerDetails.buyerEmail : ""}</p>
                        <p class="buyer-seller-address">${invoiceData.buyerDetails.buyerAddress ? invoiceData.buyerDetails.buyerAddress : ""}</p>
                    </div>
                    <div class="review-invoice-buyer-seller-detail">
                        <p class="billed-to-or-from">From:</p>
                        <p class="buyer-seller-name">${invoiceData.sellerDetails.sellerName ? invoiceData.sellerDetails.sellerName : ""}</p>
                        <p class="buyer-seller-email">${invoiceData.sellerDetails.sellerEmail ? invoiceData.sellerDetails.sellerEmail : ""}</p>
                        <p class="buyer-seller-address">${invoiceData.sellerDetails.sellerAddress ? invoiceData.sellerDetails.sellerAddress : ""}</p>
                    </div>
                </div>  

                <div>
                    <table class="review-invoice-item-table" id="reviewInvoiceItemTable">
                        <tr class="review-invoice-table-heading-raw">
                            <th class="review-invoice-item">Item</th>
                            <th class="review-invoice-quantity">Quantity</th>
                            <th class="review-invoice-price">Price</th>
                            <th class="review-invoice-amount">Amount</th>
                        </tr>
                    </table>

                <div class="review-invoice-calculation">
                    <div class="invoice-calculation">
                        <p class="calculation-heading">Subtotal:</p>
                        <p class="calculation-number"><span id="reviewInvoiceSubtotal">${invoiceData.currency === "USD (United States Doller)" ? `<i class="fa-solid fa-dollar-sign"></i>` : `<i class="fa-solid fa-indian-rupee-sign"></i>`}</i></span> 0.00</p>
                    </div>
                    <div class="invoice-calculation">
                        <p class="calculation-heading">Discount:</p>
                        <p class="calculation-number"><span>(${invoiceData.discount ? invoiceData.discount : "0"}%)</span> <span>${invoiceData.currency === "USD (United States Doller)" ? `<i class="fa-solid fa-dollar-sign"></i>` : `<i class="fa-solid fa-indian-rupee-sign"></i>`}</span> <span id="reviewInvoiceDiscount">0.00</span></p>
                    </div>
                    <div class="invoice-calculation">
                        <p class="calculation-heading">Tax:</p>
                        <p class="calculation-number"><span>(${invoiceData.taxRate ? invoiceData.taxRate : "0"}%)</span> <span>${invoiceData.currency === "USD (United States Doller)" ? `<i class="fa-solid fa-dollar-sign"></i>` : `<i class="fa-solid fa-indian-rupee-sign"></i>`}</span> <span id="reviewInvoiceTax">0.00</span></p>
                    </div>

                    <div class="review-invoice-total-section">
                        <p class="review-invoice-total-heading">Total</p>
                        <p class="review-invoice-total"><span>${invoiceData.currency === "USD (United States Doller)" ? `<i class="fa-solid fa-dollar-sign"></i>` : `<i class="fa-solid fa-indian-rupee-sign"></i>`} <span id="reviewInvoiceTotal">0.00</span></p>
                    </div>
                </div>    

                    <div class="review-invoice-note-section">
                        <p class="review-invoice-note-title">Notes: <span class="review-invoice-note">${invoiceData.note ? invoiceData.note : ""}</span></p>
                    </div>

                </div>

            </div>
    `;
    }
    reviewItemTable();
};
const reviewItemTable = () => {
    const data = getInvoiceData();
    const reviewInvoiceItemTable = document.getElementById('reviewInvoiceItemTable');
    data.itemDetails.map((item) => {
        if (reviewInvoiceItemTable) {
            reviewInvoiceItemTable.innerHTML += `
                <tr>
                    <td class="review-invoice-item">${item.itemName ? item.itemName : ""} <span>${item.itemDiscription ? `(${item.itemDiscription})` : ""}</span></td>
                    <td class="review-invoice-quantity">${item.itemQuantity ? item.itemQuantity : ""}</td>
                    <td class="review-invoice-price">${data.currency === "USD (United States Doller)" ? `<i class="fa-solid fa-dollar-sign"></i>` : `<i class="fa-solid fa-indian-rupee-sign"></i>`} ${item.itemPrice ? item.itemPrice : ""}</td>
                    <td class="review-invoice-amount">${data.currency === "USD (United States Doller)" ? `<i class="fa-solid fa-dollar-sign"></i>` : `<i class="fa-solid fa-indian-rupee-sign"></i>`} ${parseFloat(item.itemPrice) * item.itemQuantity ? parseFloat(item.itemPrice) * item.itemQuantity : ""}</td>
                </tr>
            `;
        }
    });
    let itemPriceSubtotal = 0;
    data.itemDetails.forEach((item) => {
        itemPriceSubtotal += (parseFloat(item.itemPrice) * item.itemQuantity) ? parseFloat(item.itemPrice) * item.itemQuantity : 0;
    });
    const reviewInvoiceSubtotal = document.getElementById('reviewInvoiceSubtotal');
    if (reviewInvoiceSubtotal) {
        reviewInvoiceSubtotal.innerHTML = (data.currency === "USD (United States Doller)" ? `<i class="fa-solid fa-dollar-sign"></i>` : `<i class="fa-solid fa-indian-rupee-sign"></i>`) + " " + itemPriceSubtotal.toString();
    }
    const discountAmount = (itemPriceSubtotal * (parseFloat(data.discount ? data.discount : "0") / 100)).toFixed(2);
    const reviewInvoiceDiscount = document.getElementById('reviewInvoiceDiscount');
    if (reviewInvoiceDiscount) {
        reviewInvoiceDiscount.innerHTML = (discountAmount ? discountAmount : "0.00");
    }
    const discountTotal = itemPriceSubtotal - itemPriceSubtotal * (parseFloat(data.discount ? data.discount : "0") / 100);
    const taxRateTotal = (discountTotal * (parseFloat(data.taxRate ? data.taxRate : "0") / 100)).toFixed(2);
    const reviewInvoiceTax = document.getElementById('reviewInvoiceTax');
    if (reviewInvoiceTax) {
        reviewInvoiceTax.innerHTML = (taxRateTotal ? taxRateTotal : "0.00");
    }
    const allTotal = discountTotal + discountTotal * (parseFloat(data.taxRate ? data.taxRate : "0") / 100);
    const reviewInvoiceTotal = document.getElementById('reviewInvoiceTotal');
    if (reviewInvoiceTotal) {
        reviewInvoiceTotal.innerHTML = (allTotal.toFixed(2) ? allTotal.toFixed(2) : "0.00");
    }
};
const submitInvoiceData = () => {
    const invoiceData = getInvoiceData();
    const invoiveBlankInput = document.querySelectorAll('.invoive-blank-input');
    const invoiceEmail = document.querySelectorAll('.invoice-email');
    const itemTableError = document.getElementById('itemTableError');
    let isFlage = false;
    invoiveBlankInput.forEach((item) => {
        if (!item.value) {
            item.style.border = "2px solid red";
            isFlage = true;
        }
        else {
            item.style.border = "none";
        }
    });
    invoiceEmail.forEach((item) => {
        if (!item.value.trim()) {
            item.style.border = "2px solid red";
            isFlage = true;
        }
        else if (!emailPattern.test(item.value)) {
            item.style.border = "2px solid red";
            isFlage = true;
        }
        else {
            item.style.border = "none";
        }
    });
    if (!invoiceData.itemDetails.length) {
        if (itemTableError)
            itemTableError.innerHTML = "Please add item!";
        isFlage = true;
    }
    else {
        if (itemTableError)
            itemTableError.innerHTML = "";
    }
    if (isFlage) {
        return;
    }
    allInvoice.push(invoiceData);
    localStorage.setItem('allInvoiceData', JSON.stringify(allInvoice));
    location.replace('/html/list.html');
};
