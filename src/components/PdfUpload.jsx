/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useCallback } from 'react';
import { Document, Page } from 'react-pdf';
import { useDropzone } from 'react-dropzone';
import '../styles/PdfUpload.css';

export const PdfUpload = ({ onFileUpload }) => {
   const [numPages, setNumPages] = useState(null);
   const [file, setFile] = useState(null);
   const [isDragging, setIsDragging] = useState(false);

   const onDocumentLoadSuccess = ({ numPages }) => {
      setNumPages(numPages);
   };

   const onDrop = useCallback(
      acceptedFiles => {
         setIsDragging(false);
         const selectedFile = acceptedFiles[0];
         if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            onFileUpload?.(selectedFile);
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
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                     d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"
                     fill="#2C3E50"
                  />
               </svg>

               <div className="upload-instructions">
                  <p className="drag-text">Click to upload or Drag and drop</p>
                  <p className="file-type">PDF files only</p>
               </div>
            </div>
         </div>

         {file && (
            <div className="pdf-preview">
               <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                  <Page pageNumber={1} width={200} renderTextLayer={false} renderAnnotationLayer={false} />
               </Document>
               <p className="file-name">{file.name}</p>
            </div>
         )}
      </div>
   );
};
