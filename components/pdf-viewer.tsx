"use client";

import { useFile } from "@/lib/file-context";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

export function PDFViewer() {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const { fileData } = useFile();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return fileData ? (
    <div className="flex flex-col items-center">
      <Document
        file={`data:application/pdf;base64,${Buffer.from(fileData).toString("base64")}`}
        onLoadSuccess={onDocumentLoadSuccess}
        className="max-h-[calc(100vh-200px)] overflow-auto"
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <p className="mt-4">
        Page {pageNumber} of {numPages}
      </p>
      <div className="mt-4 flex gap-4">
        <button
          onClick={() => setPageNumber((page) => Math.max(page - 1, 1))}
          disabled={pageNumber <= 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <button
          onClick={() =>
            setPageNumber((page) => Math.min(page + 1, numPages || 1))
          }
          disabled={pageNumber >= (numPages || 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  ) : (
    "Loading..."
  );
}
