"use client";

import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const QuillEditor = () => {
  const quillRef = useRef(null);

  useEffect(() => {
    if (quillRef.current) {
      new Quill(quillRef.current, { theme: "snow" });
    }
  }, []);

  return <div ref={quillRef} />;
};

export default QuillEditor;
