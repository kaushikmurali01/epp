import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs} from 'react-pdf';
import './pdfDisplay.css'

export const PDFDisplay = ({pdfUrl}) => {

  useEffect(() => { pdfjs.GlobalWorkerOptions.workerSrc =`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;});
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <Document
      file={pdfUrl}
      onLoadSuccess={onDocumentLoadSuccess}
    >
      {Array.from(
        new Array(numPages),
        (el, index) => (
          <Page
            className={'canvas-override'}
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            customTextRenderer={false}
          />
        ),
      )}
    </Document>
  );
}