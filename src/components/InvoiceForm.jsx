/* eslint-disable no-unused-vars */
import { Formik, Form, Field, FieldArray } from 'formik';
import { useEffect, useState, useCallback } from 'react';
import { Document, Page } from 'react-pdf';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useDropzone } from 'react-dropzone';
import '../styles/Invoice.css';
import PropTypes from 'prop-types';

const validationSchema = Yup.object().shape({
   poNumber: Yup.string().required('Required'),
   invoiceNumber: Yup.string().required('Required'),
   totalAmount: Yup.number().required('Required').min(0),
   paymentTerms: Yup.string().required('Required'),
   dueDate: Yup.date().required('Required'),
   glPostDate: Yup.date().required('Required'),
   invoiceDescription: Yup.string(),
   expenses: Yup.array().of(
      Yup.object().shape({
         lineAmount: Yup.number().required('Required').min(0),
         department: Yup.string().required('Required'),
         account: Yup.string().required('Required'),
         location: Yup.string().required('Required'),
      })
   ),
});

const PdfUpload = ({ onFileUpload }) => {
   const [numPages, setNumPages] = useState(null);
   const [file, setFile] = useState(null);
   const [isDragging, setIsDragging] = useState(false);

   const onDocumentLoadSuccess = ({ numPages }) => setNumPages(numPages);

   const onDrop = useCallback(
      acceptedFiles => {
         const selectedFile = acceptedFiles[0];
         if (selectedFile) {
            setFile(selectedFile);
            onFileUpload(selectedFile);
         }
      },
      [onFileUpload]
   );

   const { getRootProps, getInputProps } = useDropzone({
      onDrop,
      onDragEnter: () => setIsDragging(true),
      onDragLeave: () => setIsDragging(false),
      accept: 'application/pdf',
      multiple: false,
   });

   return (
      <div className="pdf-upload-container">
         <div {...getRootProps()} className={`dropzone ${isDragging ? 'dragging' : ''}`}>
            <input {...getInputProps()} />
            <div className="upload-content">
               <svg width="40" height="40" viewBox="0 0 24 24">
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
               </svg>
               <div className="upload-instructions">
                  <p>Click to upload or Drag and drop</p>
                  <small>PDF files only</small>
               </div>
            </div>
         </div>
         {file && (
            <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
               <Page pageNumber={1} width={200} />
            </Document>
         )}
      </div>
   );
};
PdfUpload.propTypes = {
   onFileUpload: PropTypes.func.isRequired,
};

const InvoiceForm = () => {
   const { logout } = useAuth();
   const navigate = useNavigate();
   const [totalExpenses, setTotalExpenses] = useState(0);
   const [vendors] = useState({
      'A + 1 Externalhaiters': 'S50 Main St., Lynn',
      'Vendor 2': '123 Business Rd., Boston',
   });

   const initialValues = JSON.parse(localStorage.getItem('invoiceData')) || {
      poNumber: '',
      invoiceNumber: '',
      totalAmount: '',
      paymentTerms: '',
      dueDate: '',
      glPostDate: '',
      invoiceDescription: '',
      vendor: '',
      expenses: [
         {
            lineAmount: '',
            department: '',
            account: '',
            location: '',
         },
      ],
      comments: '',
      pdfFile: null,
   };

   const handleSubmit = (values, { resetForm }) => {
      localStorage.setItem('invoiceData', JSON.stringify(values));
      resetForm();
      alert('Invoice submitted successfully!');
   };

   const loadDummyData = setValues => {
      setValues({
         poNumber: 'PO-123',
         invoiceNumber: 'INV-001',
         totalAmount: 1500,
         paymentTerms: 'Net 30',
         dueDate: '2023-12-31',
         glPostDate: '2023-12-01',
         invoiceDescription: 'Monthly services invoice',
         vendor: 'A + 1 Externalhaiters',
         expenses: [
            {
               lineAmount: 1500,
               department: 'Marketing',
               account: 'Advertising',
               location: 'HQ',
            },
         ],
         comments: 'Approved by @Manager',
         pdfFile: null,
      });
   };

   useEffect(() => {
      const total = initialValues.expenses.reduce((sum, expense) => sum + Number(expense.lineAmount || 0), 0);
      setTotalExpenses(total);
   }, [initialValues.expenses]);

   return (
      <div className="invoice-container">
         <h1>Create New Invoice</h1>

         <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
            {({ values, errors, touched, setValues, setFieldValue }) => (
               <Form className="form-wrapper">
                  <div className="left-section">
                     <div className="upload-card section-card">
                        <h3>Upload Your Invoice</h3>
                        <p>To auto-populate fields and save time</p>
                        <PdfUpload onFileUpload={file => setFieldValue('pdfFile', file)} />
                        <button type="button" className="dummy-btn secondary-btn" onClick={() => loadDummyData(setValues)}>
                           Load Dummy Data
                        </button>
                     </div>
                  </div>

                  <div className="right-section">
                     <div className="vendor-card section-card">
                        <div className="vendor-header">
                           <h2>Vendor Details</h2>
                           <button type="button" className="outline-btn secondary-btn">
                              View Vendor Details
                           </button>
                        </div>
                        <div className="vendor-info">
                           <Field as="select" name="vendor" className="form-input">
                              <option value="">Select Vendor</option>
                              {Object.keys(vendors).map(vendor => (
                                 <option key={vendor} value={vendor}>
                                    {vendor}
                                 </option>
                              ))}
                           </Field>
                           {values.vendor && (
                              <div className="vendor-address">
                                 <h4>{values.vendor}</h4>
                                 <p>{vendors[values.vendor]}</p>
                              </div>
                           )}
                        </div>
                     </div>

                     <div className="details-card section-card">
                        <h2>Invoice Details</h2>
                        <div className="form-grid">
                           <div className="form-group">
                              <label>Purchase Order Number *</label>
                              <Field as="select" name="poNumber" className="form-input">
                                 <option value="">Select PO Number</option>
                                 <option value="PO-123">PO-123</option>
                              </Field>
                              {errors.poNumber && touched.poNumber && <div className="error">{errors.poNumber}</div>}
                           </div>

                           <div className="form-group">
                              <label>Invoice Number *</label>
                              <Field name="invoiceNumber" className="form-input" />
                              {errors.invoiceNumber && touched.invoiceNumber && <div className="error">{errors.invoiceNumber}</div>}
                           </div>

                           <div className="form-group">
                              <label>Total Amount *</label>
                              <div className="currency-input">
                                 <span>$</span>
                                 <Field type="number" name="totalAmount" className="form-input" />
                              </div>
                              {errors.totalAmount && touched.totalAmount && <div className="error">{errors.totalAmount}</div>}
                           </div>

                           <div className="form-group">
                              <label>Payment Terms *</label>
                              <Field as="select" name="paymentTerms" className="form-input">
                                 <option value="">Select</option>
                                 <option value="Net 30">Net 30</option>
                              </Field>
                              {errors.paymentTerms && touched.paymentTerms && <div className="error">{errors.paymentTerms}</div>}
                           </div>

                           <div className="date-group">
                              <div className="form-group">
                                 <label>GL Post Date *</label>
                                 <Field type="date" name="glPostDate" className="form-input" />
                                 {errors.glPostDate && touched.glPostDate && <div className="error">{errors.glPostDate}</div>}
                              </div>
                              <div className="form-group">
                                 <label>Invoice Due Date *</label>
                                 <Field type="date" name="dueDate" className="form-input" />
                                 {errors.dueDate && touched.dueDate && <div className="error">{errors.dueDate}</div>}
                              </div>
                           </div>
                        </div>

                        <div className="form-group">
                           <label>Invoice Description</label>
                           <Field style={{ width: '100%' }} as="textarea" name="invoiceDescription" className="form-textarea" />
                        </div>
                     </div>

                     <div className="expense-card section-card">
                        <h2>Expense Details</h2>
                        <div className="expense-summary">
                           <span>Total: ${totalExpenses.toFixed(2)}</span>
                        </div>
                        <FieldArray name="expenses">
                           {({ push, remove }) => (
                              <>
                                 {values.expenses.map((expense, index) => (
                                    <div key={index}>
                                       <div className="expense-row">
                                          <div className="form-group">
                                             <label>Line Amount *</label>
                                             <div className="currency-input">
                                                <span>$</span>
                                                <Field type="number" name={`expenses.${index}.lineAmount`} className="form-input" />
                                             </div>
                                          </div>
                                          <div className="form-group">
                                             <label>Department *</label>
                                             <Field as="select" name={`expenses.${index}.department`} className="form-input">
                                                <option value="">Select Department</option>
                                                <option value="Marketing">Marketing</option>
                                             </Field>
                                          </div>
                                          <div className="form-group">
                                             <label>Account *</label>
                                             <Field as="select" name={`expenses.${index}.account`} className="form-input">
                                                <option value="">Select Account</option>
                                                <option value="Advertising">Advertising</option>
                                             </Field>
                                          </div>
                                          <div className="form-group">
                                             <label>Location *</label>
                                             <Field as="select" name={`expenses.${index}.location`} className="form-input">
                                                <option value="">Select Location</option>
                                                <option value="HQ">HQ</option>
                                             </Field>
                                          </div>
                                          {index > 0 && (
                                             <button type="button" onClick={() => remove(index)} className="remove-btn">
                                                ×
                                             </button>
                                          )}
                                       </div>
                                       <hr className="expense-divider" />
                                    </div>
                                 ))}
                                 <button
                                    type="button"
                                    onClick={() => push({ lineAmount: '', department: '', account: '', location: '' })}
                                    className="add-btn primary-btn"
                                 >
                                    + Add Expense Coding
                                 </button>
                              </>
                           )}
                        </FieldArray>
                     </div>

                     <div className="comments-card section-card">
                        <h2>Comments</h2>
                        <Field
                           style={{ width: '100%' }}
                           as="textarea"
                           name="comments"
                           placeholder="Add a comment and use @Name to tag someone"
                           className="form-textarea"
                        />
                     </div>

                     <div className="action-buttons">
                        <button type="button" className="secondary-btn">
                           Save as Draft
                        </button>
                        <div className="primary-actions">
                           <button type="submit" className="primary-btn">
                              Submit & New
                           </button>
                           <button type="button" onClick={logout} className="logout-btn">
                              Logout
                           </button>
                        </div>
                     </div>
                  </div>
               </Form>
            )}
         </Formik>
      </div>
   );
};

export default InvoiceForm;
