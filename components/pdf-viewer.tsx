"use client";

import { useEffect, useState } from "react";

type PDFViewerProps = {
  dataUrl: string;
};

export function PDFViewer({ dataUrl }: PDFViewerProps) {
  const [objUrl, setObjUrl] = useState("");
  const [isLoading, setLoading] = useState(true);

  if (isLoading) return <p>Loading...</p>;
  if (!objUrl) return <p>No data</p>;

  useEffect(() => {
    console.log("useEffect");
    fetch(dataUrl)
      .then((res) => {
        console.log(res.blob());
        return res.blob();
      })
      .then((blob) => {
        console.log(URL.createObjectURL(blob));
        return URL.createObjectURL(blob);
      })
      .then((url) => {
        setObjUrl(url);
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full h-full">
      {objUrl ? (
        <object className="w-full h-full" data={objUrl} type="application/pdf">
          <embed src={objUrl} type="application/pdf" />
        </object>
      ) : (
        "Loading..."
      )}
    </div>
  );
}
