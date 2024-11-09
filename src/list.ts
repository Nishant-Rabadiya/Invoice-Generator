interface BuyerData {
    buyerAddress: string,
    buyerEmail: string,
    buyerName: string
}

interface SellerData {
    sellerAddress: string,
    sellerEmail: string,
    sellerName: string
}

interface ItemDetails {
    id: number,
    itemDiscription?: string,
    itemId: number,
    itemName: string,
    itemPrice: string,
    itemQuantity: number
}

interface InvoiceData {
    currency?: string,
    buyerDetails: BuyerData,
    sellerDetails: SellerData,
    discount: string,
    dueDate: string,
    invoiceGenerateDate: string,
    invoiceId?: number,
    note?: string,
    taxRate: string,
    totalAmount: string,
    itemDetails: ItemDetails[]
}

const createInvoice = () => {
    location.replace('/html/invoice.html');
}
(window as any).createInvoice = createInvoice;


const allInvoiceData = () => {
    let data = localStorage.getItem('allInvoiceData');
    return data ? JSON.parse(data) : [];
}

const noInvoice = () => {
    const data: InvoiceData[] = allInvoiceData();
    const noInvoiceMessage = document.getElementById('noInvoiceMessage') as HTMLElement | null;
    if (!data?.length) {
        if (noInvoiceMessage)
            noInvoiceMessage.style.display = "block";
    } else {
        if (noInvoiceMessage)
            noInvoiceMessage.style.display = "none";
    }
}
noInvoice();

const list = (): void => {
    const data: InvoiceData[] = allInvoiceData();
    const invoiceListSection = document.getElementById('invoiceListSection') as HTMLElement | null;
    if (invoiceListSection)
        invoiceListSection.innerHTML = "";
    data?.map((item: InvoiceData, index: number) => {
        if (invoiceListSection) {
            invoiceListSection.innerHTML += `
        <div class="invoice-list">
            <p class="invoice-list-index">${index + 1}</p>
            <div class="list-name-section">
                <p class="invoice-list-title">${item.buyerDetails.buyerName}</p>
                <p class="invoice-list-id">${item.invoiceId}</p>
            </div>
            <div class="list-amount-section">
                <p class="list-amount-heading">Total Amount:</p>
                <p class="list-amount-total">${(item.currency === "USD (United States Doller)" ? `<i class="fa-solid fa-dollar-sign"></i>` : `<i class="fa-solid fa-indian-rupee-sign"></i>`)} ${item.totalAmount}</p>
            </div>
            <button onclick="editInvoice(${index})" id="editInvoice" class="invoice-list-edit-button" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>
            <button class="invoice-list-print-button" onclick="printInvoice(${index})">Print</button>
            <button onclick="removeInvoice(${index})" class="invoice-list-delete-button">Delete</button>
        </div>
        `
        }
    })
}
list();

const removeInvoice = (index: number): void => {
    const confirmed: boolean = confirm("Are you sure you want to delete this Invoice?");
    if (confirmed) {
        const data: InvoiceData[] = allInvoiceData();
        data.splice(index, 1);
        localStorage.setItem('allInvoiceData', JSON.stringify(data));
        list();
        noInvoice();
    }
}
(window as any).removeInvoice = removeInvoice;

const editInvoiceBody = document.getElementById('editInvoiceBody') as HTMLElement | null;
let currentData: InvoiceData;
const editInvoice = (index: number): void => {
    const data = allInvoiceData();
    currentData = data[index];
    if (editInvoiceBody) {
        editInvoiceBody.innerHTML = `
        <div class="invoice-body">
            <div class="invoice-details-section">

                <div class="invoice-date-section">
                    <p class="invoice-date">Date: <span class="invoice-current-date">${data[index].invoiceGenerateDate}</span>
                    </p>
                    <div>
                        <p class="invoice-date">Due date: <input oninput="editInoiveDetails(this)" name="editDueDateValue" id="editDueDateValue" value="${data[index].dueDate}" type="date" class="invoice-due-date-input invoice-blank-input" id="dueDate" /></p>
                    </div>
                </div>

                <div class="invoice-buyer-seller-detalis">
                    <div>
                        <p class="invoice-bill-to-or-from">Bill to:</p>
                        <input oninput="editInoiveDetails(this)" name="editBuyerName" id="editBuyerName" value="${data[index].buyerDetails.buyerName}" class="invoice-buyer-seller-detalis-input invoice-blank-input" type="text" placeholder="Who is this invoice to?" />
                        <input oninput="editInoiveDetails(this)" name="editBuyerEmail" id="editBuyerEmail" value="${data[index].buyerDetails.buyerEmail}" class="invoice-buyer-seller-detalis-input edit-buyer-seller-email" type="text" placeholder="Email address" />
                        <input oninput="editInoiveDetails(this)" name="editBuyerAddress" id="editBuyerAddress" value="${data[index].buyerDetails.buyerAddress}" class="invoice-buyer-seller-detalis-input invoice-blank-input" type="text" placeholder="Billing address" />
                    </div>
                    <div>
                        <p class="invoice-bill-to-or-from">Bill from:</p>
                        <input oninput="editInoiveDetails(this)" name="editSellerName" id="editSellerName" value="${data[index].sellerDetails.sellerName}" class="invoice-buyer-seller-detalis-input invoice-blank-input" type="text" placeholder="Who is this invoice from?" />
                        <input oninput="editInoiveDetails(this)" name="editSellerEmail" id="editSellerEmail" value="${data[index].sellerDetails.sellerEmail}" class="invoice-buyer-seller-detalis-input edit-buyer-seller-email" type="text" placeholder="Email address" />
                        <input oninput="editInoiveDetails(this)" name="editSellerAddress" id="editSellerAddress" value="${data[index].sellerDetails.sellerAddress}" class="invoice-buyer-seller-detalis-input invoice-blank-input" type="text" placeholder="Billing address" />
                    </div>
                </div>

                <div>
                    <table class="items-table">
                       <thead>
                            <th class="table-item table-data">ITEM</th>
                            <th class="table-quantity table-data">QTY</th>
                            <th class="table-price-rate table-data">PRICE/RATE</th>
                            <th class="table-action table-data">ACTION</th>
                       </thead>
                       <tbody id="itemTable">
                       </tbody>
                    </table>
                </div>
                <p class="item-table-error" id="itemTableError"></p>
                <div>
                    <button class="add-item-button" onclick="editItemTableRaw(${index})">Add Item</button>
                </div>

                <div class="invoice-calculation-section">
                    <div class="invoice-calculation">
                        <p class="calculation-heading">Subtotal:</p>
                        <p class="calculation-number" id="subTotal"><span><i class="fa-solid fa-dollar-sign"></i></span> 0.00</p>
                    </div>
                    <div class="invoice-calculation">
                        <p class="calculation-heading">Discount:</p>
                        <p class="calculation-number"><span id="discountRate">(${data[index].discount}%)</span> <span id="discountTotal"><i class="fa-solid fa-dollar-sign"></i> </span></p>
                    </div>
                    <div class="invoice-calculation">
                        <p class="calculation-heading">Tax:</p>
                        <p class="calculation-number"><span id="taxRate">(${data[index].taxRate}%)</span> <span id="taxTotal"><i class="fa-solid fa-dollar-sign"></i></span> </p>
                    </div>
                    <div class="invoice-calculation final-calculation">
                        <p class="invoice-total-heading">Total:</p>
                        <p class="invoice-total" id="total"><i class="fa-solid fa-dollar-sign"></i> 0</p>
                    </div>
                </div>
                <hr class="horizontal-line">

                <div>
                    <p class="add-invoice-note-heading">Notes:</p>
                    <textarea oninput="editInoiveDetails(this)" name="invoiveNote" id="editNote" class="add-invoice-note" placeholder="Thanks for your business">${data[index].note ? data[index].note : ""}</textarea>
                </div>

                <div class="submit-section">
                    <button class="submit-invoice" onclick="doneInvoice(this,${index})">Done</button>
                </div>
            </div>

            <div class="invoice-currency-discount-tax-section">
                <button class="review-invoice" id="editedReviewInvoice" data-bs-toggle="modal" data-bs-target="#reviewModal" onclick="editedReviewInvoice(${index})">Review Invoice</button>

                <div>
                    <label class="currency-label">Currency:</label>
                    <select onchange="editCurrency(this)" id="editCurrencyValue" value="${data[index].currency}" class="currency-dropdown">
                        <option>USD (United States Doller)</option>
                        <option>INR (Indian Rupee)</option>
                    </select>
                </div>

                <div>
                    <p class="discount-tax-rate-heading">Tax rate:</p>
                    <input oninput="editInoiveDetails(this)" name="editTaxRateValue" id="editTaxRateValue" value="${data[index].taxRate}" type="number" class="discount-tax-rate-input" placeholder="0.0" /><span class="discount-tax-rate-sign">%</span>
                </div>

                <div>
                    <p class="discount-tax-rate-heading">Discount rate:</p>
                    <input oninput="editInoiveDetails(this)" name="editDiscountValue" id="editDiscountValue" value="${data[index].discount}" type="number" class="discount-tax-rate-input" placeholder="0.0" /><span class="discount-tax-rate-sign">%</span>
                </div>
            </div>
        </div>            
    `}

    const itemTable = document.getElementById("itemTable");
    if (itemTable) {
        itemTable.innerHTML = "";
    }

    data[index].itemDetails.map((x: ItemDetails) => {
        if (itemTable) {
            itemTable.innerHTML += `
            <tr id="${x.id}">
                <td><input oninput="editItemTable(this)" name="itemName" id="${x.itemId}" value="${x.itemName ? x.itemName : ""}" class="table-item-input invoice-blank-input" type="text" placeholder="Item name" />
                <input oninput="editItemTable(this)" name="itemDiscription" value="${x.itemDiscription ? x.itemDiscription : ""}" class="table-item-input table-item-discription" type="text" placeholder="Item description" /></td>
                <td><input oninput="editItemTable(this)" name="itemQuantity" value="${x.itemQuantity ? x.itemQuantity : ""}" class="table-quantity-input invoice-blank-input" type="number" placeholder="0" /></td>
                <td><span class="table-currency-symbol">${data[index].currency === "USD (United States Doller)" ? `<i class="fa-solid fa-dollar-sign"></i>` : `<i class="fa-solid fa-indian-rupee-sign"></i>`}</span>
                <input oninput="editItemTable(this)" name="itemPrice" value="${x.itemPrice ? x.itemPrice : ""}" class="table-price-rate-input invoice-blank-input" type="number" placeholder="0" /></td>
                <td><button class="table-action-button" onclick="removeTableRaw(this)"><i class="fa-regular fa-trash-can"></i></button></td>
            </tr>
        `;
        }
    })
    editCalculation(data[index]);
    editDisabledPastDate();
}
(window as any).editInvoice = editInvoice;

const editCalculation = (item: any) => {
    let itemPriceSubtotal: number = 0;
    item.itemDetails.forEach((item: ItemDetails) => {
        itemPriceSubtotal += (parseFloat(item.itemPrice) * item.itemQuantity) ? parseFloat(item.itemPrice) * item.itemQuantity : 0;
    })
    const subTotal = document.getElementById("subTotal") as HTMLElement | null;
    if (subTotal) {
        subTotal.innerHTML = (item.currency === "USD (United States Doller)" ? `<i class="fa-solid fa-dollar-sign"></i>` : `<i class="fa-solid fa-indian-rupee-sign"></i>`) + " " + itemPriceSubtotal.toString();
    }

    let discountAmount: string = (itemPriceSubtotal * (parseFloat(item.discount ? item.discount : "0") / 100)).toFixed(2);
    const discountTotal = document.getElementById("discountTotal") as HTMLElement | null;
    if (discountTotal) {
        discountTotal.innerHTML = (item.currency === "USD (United States Doller)" ? `<i class="fa-solid fa-dollar-sign"></i>` : `<i class="fa-solid fa-indian-rupee-sign"></i>`) + " " + (discountAmount ? discountAmount : "0.00");
    }

    let totalAmount: number = itemPriceSubtotal - itemPriceSubtotal * (parseFloat(item.discount ? item.discount : "0") / 100);
    let taxRateTotal: string = (totalAmount * (parseFloat(item.taxRate ? item.taxRate : "0") / 100)).toFixed(2);
    const taxTotal = document.getElementById("taxTotal") as HTMLElement | null;
    if (taxTotal) {
        taxTotal.innerHTML = (item.currency === "USD (United States Doller)" ? `<i class="fa-solid fa-dollar-sign"></i>` : `<i class="fa-solid fa-indian-rupee-sign"></i>`) + " " + (taxRateTotal ? taxRateTotal : "0.00");
    }

    let allTotal: number = totalAmount + totalAmount * (parseFloat(item.taxRate ? item.taxRate : "0") / 100);
    const total = document.getElementById("total") as HTMLElement | null;
    if (total) {
        total.innerHTML = (item.currency === "USD (United States Doller)" ? `<i class="fa-solid fa-dollar-sign"></i>` : `<i class="fa-solid fa-indian-rupee-sign"></i>`) + " " + (allTotal.toFixed(2) ? allTotal.toFixed(2) : "0.00");
        currentData.totalAmount = allTotal.toFixed(2);
    }
}

const editDisabledPastDate = (): void => {
    const editDueDateValue = document.getElementById('editDueDateValue') as HTMLInputElement | null;
    const today: string = new Date().toISOString().split('T')[0];
    if (editDueDateValue)
        editDueDateValue.setAttribute('min', today);
}

const editInoiveDetails = (e: HTMLInputElement) => {
    if (e.name === "editDueDateValue") {
        currentData.dueDate = e.value
    } else if (e.name === "editBuyerName") {
        currentData.buyerDetails.buyerName = e.value
    } else if (e.name === "editBuyerEmail") {
        currentData.buyerDetails.buyerEmail = e.value
    } else if (e.name === "editBuyerAddress") {
        currentData.buyerDetails.buyerAddress = e.value
    } else if (e.name === "editSellerName") {
        currentData.sellerDetails.sellerName = e.value
    } else if (e.name === "editSellerEmail") {
        currentData.sellerDetails.sellerEmail = e.value
    } else if (e.name === "editSellerAddress") {
        currentData.sellerDetails.sellerAddress = e.value
    } else if (e.name === "invoiveNote") {
        currentData.note = e.value
    } else if (e.name === "editTaxRateValue") {
        editMaxTaxOrDiscount(e);    
        const taxRate = document.getElementById('taxRate') as HTMLElement | null;
        if (taxRate) {
            taxRate.innerText = e.value ? `(${e.value}%)` : "(0%)";
            currentData.taxRate = e.value;
        }
    } else if (e.name === "editDiscountValue") {
        editMaxTaxOrDiscount(e);
        const discountRate = document.getElementById('discountRate') as HTMLElement | null;
        if (discountRate) {
            discountRate.innerText = e.value ? `(${e.value}%)` : "(0%)";
            currentData.discount = e.value;
        }
    }
    editCalculation(currentData);
}

const editMaxTaxOrDiscount = (e: any) => {
    let value = parseFloat(e.value);
    if (value > 100) {
        value = 100;
        e.value = '100';
    }
}

const editCurrency = (e: HTMLInputElement): void => { currentData.currency = e.value }

const editItemTableRaw = (index: number) => {
    const date = new Date().getTime();
    const data: InvoiceData = currentData;
    data.itemDetails.push({
        itemId: date,
        id: 0,
        itemPrice: "",
        itemName: "",
        itemQuantity: 0
    });

    const itemTable = document.getElementById('itemTable') as HTMLTableElement | null;
    const dataList: InvoiceData = currentData;
    if (itemTable) {
        itemTable.innerHTML = "";
    }

    const findFirstData: number = dataList.itemDetails.findIndex((item: ItemDetails) => item.itemId === date);
    dataList.itemDetails[findFirstData].id = 0;
    const max: InvoiceData = currentData;
    const maxId = max.itemDetails.reduce((max: number, obj: ItemDetails) => (obj.id > max ? obj.id : max), -Infinity);
    dataList.itemDetails.map((x: ItemDetails) => {
        if (itemTable) {
            itemTable.innerHTML += `
            <tr id="${x.id ? x.id : maxId + 1}">
                <td><input oninput="editItemTable(this)" name="itemName" id="${x.itemId}" value="${x.itemName ? x.itemName : ""}" class="table-item-input invoice-blank-input" type="text" placeholder="Item name" />
                <input oninput="editItemTable(this)" name="itemDiscription" value="${x.itemDiscription ? x.itemDiscription : ""}" class="table-item-input table-item-discription" type="text" placeholder="Item description" /></td>
                <td><input oninput="editItemTable(this)" name="itemQuantity" value="${x.itemQuantity ? x.itemQuantity : ""}" class="table-quantity-input invoice-blank-input" type="number" placeholder="0" /></td>
                <td><span class="table-currency-symbol">${dataList.currency === "USD (United States Doller)" ? `<i class="fa-solid fa-dollar-sign"></i>` : `<i class="fa-solid fa-indian-rupee-sign"></i>`}</span>
                <input oninput="editItemTable(this)" name="itemPrice" value="${x.itemPrice ? x.itemPrice : ""}" class="table-price-rate-input invoice-blank-input" type="number" placeholder="0" /></td>
                <td><button class="table-action-button remove-table-raw" onclick="removeTableRaw(this)"><i class="fa-regular fa-trash-can"></i></button></td>
            </tr>
        `;
        }
        dataList.itemDetails[findFirstData].id = maxId + 1;
    })
}
(window as any).editItemTableRaw = editItemTableRaw;

const editItemTable = (e: HTMLInputElement) => {
    const findData: number = currentData.itemDetails.findIndex((x: ItemDetails) => x.id.toString() === e.parentElement?.parentElement?.id);
    if (e.name === "itemName") {
        currentData.itemDetails[findData].itemName = e.value;
    } else if (e.name === "itemQuantity") {
        currentData.itemDetails[findData].itemQuantity = parseFloat(e.value)
    } else if (e.name === "itemPrice") {
        currentData.itemDetails[findData].itemPrice = e.value;
    } else if (e.name === "itemDiscription") {
        currentData.itemDetails[findData].itemDiscription = e.value
    }
    editCalculation(currentData);
}

const removeTableRaw = (e: HTMLTableElement): void => {
    e.parentElement?.parentElement?.remove();
    let data = currentData;
    const findData: number = data.itemDetails.findIndex((x: ItemDetails) => x.id.toString() === e.parentElement?.parentElement?.id);
    data.itemDetails.splice(findData, 1);
    editCalculation(data);
}
(window as any).removeTableRaw = removeTableRaw;

const doneInvoice = (e: HTMLButtonElement, index: number): void => {
    const data: InvoiceData[] = allInvoiceData();
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const itemTableError = document.getElementById('itemTableError') as HTMLElement | null;
    const editBuyerSellerEmail = document.querySelectorAll<HTMLInputElement>('.edit-buyer-seller-email');
    const invoiceBlankInput = document.querySelectorAll<HTMLInputElement>('.invoice-blank-input');

    let isFlag: boolean = false;
    invoiceBlankInput.forEach((item: HTMLInputElement) => {
        if (!item.value.trim()) {
            item.style.border = "2px solid red"
            isFlag = true;
        } else {
            item.style.border = "none"
        }
    })

    editBuyerSellerEmail.forEach((item: HTMLInputElement) => {
        if (!item.value.trim()) {
            item.style.border = "2px solid red";
            isFlag = true;
        } else if (!emailPattern.test(item.value)) {
            item.style.border = "2px solid red";
            isFlag = true;
        } else {
            item.style.border = "none";
        }
    })

    if (!data[index].itemDetails.length) {
        if (itemTableError)
            itemTableError.innerHTML = "Please add item!";
        isFlag = true;
    } else {
        if (itemTableError)
            itemTableError.innerHTML = "";
    }

    if (isFlag) {
        return;
    }

    const confirmed: boolean = confirm("Are you sure you want to edit this Invoice?");
    if (confirmed) {
        const invoiceCurrentData = currentData;
        data[index] = invoiceCurrentData
        localStorage.setItem('allInvoiceData', JSON.stringify(data));
        let myModal = document.getElementById('editModal');
        let modal = bootstrap.Modal.getInstance(myModal);
        modal.hide();
    }

    list();
    noInvoice();
}
(window as any).doneInvoice = doneInvoice;

const invoiceModal = (data: any): any => {
    const reviewInvoiceBody = document.getElementById('reviewInvoiceBody') as HTMLElement | null;
    if (reviewInvoiceBody) {
        reviewInvoiceBody.innerHTML = `
            <div class="review-invoice-body" id="invoiceBody">
                <div class="review-invoice-heading-section">
                    <h1 class="review-invoice-heading">INVOICE</h1>
                    <i class="fa-brands fa-pied-piper logo-icon"></i>
                </div>

                <div class="review-invoice-dates-section">
                    <p class="review-invoice-date-title">Date: <span class="review-invoice-date">${data.invoiceGenerateDate}</span></p>
                    <p class="review-invoice-date-title">Due date: <span class="review-invoice-date">${(data.dueDate ? new Date(data.dueDate).toLocaleDateString('en-GB') : "")}</span></p>
                </div>

                <div class="review-invoice-buyer-seller-section">
                    <div class="review-invoice-buyer-seller-detail">
                        <p class="billed-to-or-from">Billed to:</p>
                        <p class="buyer-seller-name">${data.buyerDetails.buyerName ? data.buyerDetails.buyerName : ""}</p>
                        <p class="buyer-seller-email">${data.buyerDetails.buyerEmail ? data.buyerDetails.buyerEmail : ""}</p>
                        <p class="buyer-seller-address">${data.buyerDetails.buyerAddress ? data.buyerDetails.buyerAddress : ""}</p>
                    </div>
                    <div class="review-invoice-buyer-seller-detail">
                        <p class="billed-to-or-from">From:</p>
                        <p class="buyer-seller-name">${data.sellerDetails.sellerName ? data.sellerDetails.sellerName : ""}</p>
                        <p class="buyer-seller-email">${data.sellerDetails.sellerEmail ? data.sellerDetails.sellerEmail : ""}</p>
                        <p class="buyer-seller-address">${data.sellerDetails.sellerAddress ? data.sellerDetails.sellerAddress : ""}</p>
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
                        <p class="calculation-number"><span id="reviewInvoiceSubtotal">${data.currency === "USD (United States Doller)" ? `<i class="fa-solid fa-dollar-sign"></i>` : `<i class="fa-solid fa-indian-rupee-sign"></i>`}</i></span></p>
                    </div>
                    <div class="invoice-calculation">
                        <p class="calculation-heading">Discount:</p>
                        <p class="calculation-number"><span>(${data.discount ? data.discount : "0"}%)</span> <span>${data.currency === "USD (United States Doller)" ? `<i class="fa-solid fa-dollar-sign"></i>` : `<i class="fa-solid fa-indian-rupee-sign"></i>`}</span> <span id="reviewInvoiceDiscount">0.00</span></p>
                    </div>
                    <div class="invoice-calculation">
                        <p class="calculation-heading">Tax:</p>
                        <p class="calculation-number"><span>(${data.taxRate ? data.taxRate : "0"}%)</span> <span>${data.currency === "USD (United States Doller)" ? `<i class="fa-solid fa-dollar-sign"></i>` : `<i class="fa-solid fa-indian-rupee-sign"></i>`}</span> <span id="reviewInvoiceTax">0.00</span></p>
                    </div>

                    <div class="review-invoice-total-section">
                        <p class="review-invoice-total-heading">Total</p>
                        <p class="review-invoice-total"><span>${data.currency === "USD (United States Doller)" ? `<i class="fa-solid fa-dollar-sign"></i>` : `<i class="fa-solid fa-indian-rupee-sign"></i>`} <span id="reviewInvoiceTotal">0.00</span></p>
                    </div>
                </div>    

                    <div class="review-invoice-note-section">
                        <p class="review-invoice-note-title">Notes: <span class="review-invoice-note">${data.note ? data.note : ""}</span></p>
                    </div>

                </div>

            </div>
        `
    }

    const reviewInvoiceItemTable = document.getElementById('reviewInvoiceItemTable') as HTMLElement | null;
    data.itemDetails.map((item: ItemDetails) => {
        if (reviewInvoiceItemTable) {
            reviewInvoiceItemTable.innerHTML += `
                <tr>
                    <td class="review-invoice-item">${item.itemName ? item.itemName : ""} <span>${item.itemDiscription ? `(${item.itemDiscription})` : ""}</span></td>
                    <td class="review-invoice-quantity">${item.itemQuantity ? item.itemQuantity : ""}</td>
                    <td class="review-invoice-price">${data.currency === "USD (United States Doller)" ? `<i class="fa-solid fa-dollar-sign"></i>` : `<i class="fa-solid fa-indian-rupee-sign"></i>`} ${item.itemPrice ? item.itemPrice : ""}</td>
                    <td class="review-invoice-amount">${data.currency === "USD (United States Doller)" ? `<i class="fa-solid fa-dollar-sign"></i>` : `<i class="fa-solid fa-indian-rupee-sign"></i>`} ${parseFloat(item.itemPrice) * item.itemQuantity ? parseFloat(item.itemPrice) * item.itemQuantity : ""}</td>
                </tr>
        `}
    })

    let itemPriceSubtotal: number = 0;
    data.itemDetails.forEach((item: ItemDetails) => {
        itemPriceSubtotal += (parseFloat(item.itemPrice) * item.itemQuantity) ? parseFloat(item.itemPrice) * item.itemQuantity : 0;
    })
    const reviewInvoiceSubtotal = document.getElementById('reviewInvoiceSubtotal');
    if (reviewInvoiceSubtotal) {
        reviewInvoiceSubtotal.innerHTML = (data.currency === "USD (United States Doller)" ? `<i class="fa-solid fa-dollar-sign"></i>` : `<i class="fa-solid fa-indian-rupee-sign"></i>`) + " " + itemPriceSubtotal.toString();
    }

    const discountAmount: string = (itemPriceSubtotal * (parseFloat(data.discount ? data.discount : "0") / 100)).toFixed(2);
    const reviewInvoiceDiscount = document.getElementById('reviewInvoiceDiscount');
    if (reviewInvoiceDiscount) {
        reviewInvoiceDiscount.innerHTML = (discountAmount ? discountAmount : "0.00");
    }

    const discountTotal: number = itemPriceSubtotal - itemPriceSubtotal * (parseFloat(data.discount ? data.discount : "0") / 100);
    const taxRateTotal: string = (discountTotal * (parseFloat(data.taxRate ? data.taxRate : "0") / 100)).toFixed(2);
    const reviewInvoiceTax = document.getElementById('reviewInvoiceTax');
    if (reviewInvoiceTax) {
        reviewInvoiceTax.innerHTML = (taxRateTotal ? taxRateTotal : "0.00");
    }

    const allTotal: number = discountTotal + discountTotal * (parseFloat(data.taxRate ? data.taxRate : "0") / 100);
    const reviewInvoiceTotal = document.getElementById('reviewInvoiceTotal');
    if (reviewInvoiceTotal) {
        reviewInvoiceTotal.innerHTML = (allTotal.toFixed(2) ? allTotal.toFixed(2) : "0.00");
    }
    // debugger
    // editCalculation(data);

    if (reviewInvoiceBody) {
        // console.log(reviewInvoiceBody.innerHTML);
        return reviewInvoiceBody

    }
}

const editedReviewInvoice = (): void => {
    const myModal1 = new bootstrap.Modal(document.getElementById('editModal'));
    myModal1.show();

    let data: InvoiceData = currentData;
    invoiceModal(data)

    // const reviewInvoiceBody = document.getElementById('reviewInvoiceBody') as HTMLElement | null;

    // if (reviewInvoiceBody) {
    //     reviewInvoiceBody.innerHTML = `
    //         <div class="review-invoice-body" id="invoiceBody">
    //             <div class="review-invoice-heading-section">
    //                 <h1 class="review-invoice-heading">INVOICE</h1>
    //                 <i class="fa-brands fa-pied-piper logo-icon"></i>
    //             </div>

    //             <div class="review-invoice-dates-section">
    //                 <p class="review-invoice-date-title">Date: <span class="review-invoice-date">${data.invoiceGenerateDate}</span></p>
    //                 <p class="review-invoice-date-title">Due date: <span class="review-invoice-date">${(data.dueDate ? new Date(data.dueDate).toLocaleDateString('en-GB') : "")}</span></p>
    //             </div>

    //             <div class="review-invoice-buyer-seller-section">
    //                 <div class="review-invoice-buyer-seller-detail">
    //                     <p class="billed-to-or-from">Billed to:</p>
    //                     <p class="buyer-seller-name">${data.buyerDetails.buyerName ? data.buyerDetails.buyerName : ""}</p>
    //                     <p class="buyer-seller-email">${data.buyerDetails.buyerEmail ? data.buyerDetails.buyerEmail : ""}</p>
    //                     <p class="buyer-seller-address">${data.buyerDetails.buyerAddress ? data.buyerDetails.buyerAddress : ""}</p>
    //                 </div>
    //                 <div class="review-invoice-buyer-seller-detail">
    //                     <p class="billed-to-or-from">From:</p>
    //                     <p class="buyer-seller-name">${data.sellerDetails.sellerName ? data.sellerDetails.sellerName : ""}</p>
    //                     <p class="buyer-seller-email">${data.sellerDetails.sellerEmail ? data.sellerDetails.sellerEmail : ""}</p>
    //                     <p class="buyer-seller-address">${data.sellerDetails.sellerAddress ? data.sellerDetails.sellerAddress : ""}</p>
    //                 </div>
    //             </div>  

    //             <div>
    //                 <table class="review-invoice-item-table" id="reviewInvoiceItemTable">
    //                     <tr class="review-invoice-table-heading-raw">
    //                         <th class="review-invoice-item">Item</th>
    //                         <th class="review-invoice-quantity">Quantity</th>
    //                         <th class="review-invoice-price">Price</th>
    //                         <th class="review-invoice-amount">Amount</th>
    //                     </tr>
    //                 </table>

    //             <div class="review-invoice-calculation">
    //                 <div class="invoice-calculation">
    //                     <p class="calculation-heading">Subtotal:</p>
    //                     <p class="calculation-number"><span id="reviewInvoiceSubtotal">${data.currency === "USD (United States Doller)" ? `<i class="fa-solid fa-dollar-sign"></i>` : `<i class="fa-solid fa-indian-rupee-sign"></i>`}</i></span></p>
    //                 </div>
    //                 <div class="invoice-calculation">
    //                     <p class="calculation-heading">Discount:</p>
    //                     <p class="calculation-number"><span>(${data.discount ? data.discount : "0"}%)</span> <span>${data.currency === "USD (United States Doller)" ? `<i class="fa-solid fa-dollar-sign"></i>` : `<i class="fa-solid fa-indian-rupee-sign"></i>`}</span> <span id="reviewInvoiceDiscount">0.00</span></p>
    //                 </div>
    //                 <div class="invoice-calculation">
    //                     <p class="calculation-heading">Tax:</p>
    //                     <p class="calculation-number"><span>(${data.taxRate ? data.taxRate : "0"}%)</span> <span>${data.currency === "USD (United States Doller)" ? `<i class="fa-solid fa-dollar-sign"></i>` : `<i class="fa-solid fa-indian-rupee-sign"></i>`}</span> <span id="reviewInvoiceTax">0.00</span></p>
    //                 </div>

    //                 <div class="review-invoice-total-section">
    //                     <p class="review-invoice-total-heading">Total</p>
    //                     <p class="review-invoice-total"><span>${data.currency === "USD (United States Doller)" ? `<i class="fa-solid fa-dollar-sign"></i>` : `<i class="fa-solid fa-indian-rupee-sign"></i>`} <span id="reviewInvoiceTotal">0.00</span></p>
    //                 </div>
    //             </div>    

    //                 <div class="review-invoice-note-section">
    //                     <p class="review-invoice-note-title">Notes: <span class="review-invoice-note">${data.note ? data.note : ""}</span></p>
    //                 </div>

    //             </div>

    //         </div>
    //     `}

    // const reviewInvoiceItemTable = document.getElementById('reviewInvoiceItemTable') as HTMLElement | null;
    // data.itemDetails.map((item: ItemDetails) => {
    //     if (reviewInvoiceItemTable) {
    //         reviewInvoiceItemTable.innerHTML += `
    //             <tr>
    //                 <td class="review-invoice-item">${item.itemName ? item.itemName : ""} <span>${item.itemDiscription ? `(${item.itemDiscription})` : ""}</span></td>
    //                 <td class="review-invoice-quantity">${item.itemQuantity ? item.itemQuantity : ""}</td>
    //                 <td class="review-invoice-price">${data.currency === "USD (United States Doller)" ? `<i class="fa-solid fa-dollar-sign"></i>` : `<i class="fa-solid fa-indian-rupee-sign"></i>`} ${item.itemPrice ? item.itemPrice : ""}</td>
    //                 <td class="review-invoice-amount">${data.currency === "USD (United States Doller)" ? `<i class="fa-solid fa-dollar-sign"></i>` : `<i class="fa-solid fa-indian-rupee-sign"></i>`} ${parseFloat(item.itemPrice) * item.itemQuantity ? parseFloat(item.itemPrice) * item.itemQuantity : ""}</td>
    //             </tr>
    //     `}
    // })

    // let itemPriceSubtotal: number = 0;
    // data.itemDetails.forEach((item: ItemDetails) => {
    //     itemPriceSubtotal += (parseFloat(item.itemPrice) * item.itemQuantity) ? parseFloat(item.itemPrice) * item.itemQuantity : 0;
    // })
    // const reviewInvoiceSubtotal = document.getElementById('reviewInvoiceSubtotal');
    // if (reviewInvoiceSubtotal) {
    //     reviewInvoiceSubtotal.innerHTML = (data.currency === "USD (United States Doller)" ? `<i class="fa-solid fa-dollar-sign"></i>` : `<i class="fa-solid fa-indian-rupee-sign"></i>`) + " " + itemPriceSubtotal.toString();
    // }

    // const discountAmount: string = (itemPriceSubtotal * (parseFloat(data.discount ? data.discount : "0") / 100)).toFixed(2);
    // const reviewInvoiceDiscount = document.getElementById('reviewInvoiceDiscount');
    // if (reviewInvoiceDiscount) {
    //     reviewInvoiceDiscount.innerHTML = (discountAmount ? discountAmount : "0.00");
    // }

    // const discountTotal: number = itemPriceSubtotal - itemPriceSubtotal * (parseFloat(data.discount ? data.discount : "0") / 100);
    // const taxRateTotal: string = (discountTotal * (parseFloat(data.taxRate ? data.taxRate : "0") / 100)).toFixed(2);
    // const reviewInvoiceTax = document.getElementById('reviewInvoiceTax');
    // if (reviewInvoiceTax) {
    //     reviewInvoiceTax.innerHTML = (taxRateTotal ? taxRateTotal : "0.00");
    // }

    // const allTotal: number = discountTotal + discountTotal * (parseFloat(data.taxRate ? data.taxRate : "0") / 100);
    // const reviewInvoiceTotal = document.getElementById('reviewInvoiceTotal');
    // if (reviewInvoiceTotal) {
    //     reviewInvoiceTotal.innerHTML = (allTotal.toFixed(2) ? allTotal.toFixed(2) : "0.00");
    // }
}
(window as any).editedReviewInvoice = editedReviewInvoice;



// const { jsPDF } = (window as any).jspdf;

// import { jsPDF } from "jspdf";
// var doc: any = new jsPDF();



const printInvoice = (index: number) => {
    let data: InvoiceData[] = allInvoiceData();
    
    let printInvoice = invoiceModal(data[index]);
    console.log(printInvoice.firstElementChild.id);
    var elementHTML = document.querySelector("#printInvoice.firstElementChild.id");
    
    var doc: any = new jsPDF({
        orientation: 'landscape'
    });
    
    doc.text(20, 20, 'Hello world!');
    doc.text(20, 30, 'This is client-side Javascript to generate a PDF.');
    
    // Add new page
    doc.addPage();
    doc.text(20, 20, 'Visit CodexWorld.com');
    
    // Save the PDF
    doc.save('document.pdf');

    doc.html(elementHTML, {
        callback: function(doc: any) {
            // Save the PDF
            doc.save('sample-document.pdf');
        },
        x: 15,
        y: 15,
        width: 170, //target width in the PDF document
        windowWidth: 650 //window width in CSS pixels
    });

}
// printInvoice(0);
// (window as any).printInvoice = printInvoice;

(window as any).jsPDF = (window as any).jspdf.jsPDF;
