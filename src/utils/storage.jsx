export const saveInvoiceData = data => {
   localStorage.setItem('invoiceData', JSON.stringify(data));
};

export const loadInvoiceData = () => {
   return JSON.parse(localStorage.getItem('invoiceData')) || {};
};
