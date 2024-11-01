'use client';
import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

const Home = () => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleDeleteFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      alert('Please upload at least two PDF files');
      return;
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const fileBytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(fileBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Merge PDFs</h1>
      <input type="file" multiple accept="application/pdf" onChange={handleFileChange} />
      <ul>
        {files.map((file, index) => (
          <li key={index} style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
            <span>{file.name}</span>
            <button
              onClick={() => handleDeleteFile(index)}
              style={{
                marginLeft: '10px',
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
              }}
            >
              ✖️
            </button>
          </li>
        ))}
      </ul>
      <button onClick={mergePDFs} style={{ marginTop: '10px' }}>Merge PDFs</button>
    </div>
  );
};

export default Home;
