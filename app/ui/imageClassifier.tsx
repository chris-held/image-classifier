"use client";

import { useState, FormEvent } from "react";

export default function ImageClassifier() {
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [response, setResponse] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [inputKey, setInputKey] = useState(new Date().toString());

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    const formData = new FormData();
    formData.append("file", file as File);
    fetch("/api/classifystream", {
      method: "POST",
      body: formData,
    }).then((res) => {
      const reader = res.body?.getReader();
      return new ReadableStream({
        start(controller) {
          return pump();
          function pump(): any {
            return reader?.read().then(({ done, value }) => {
              if (done) {
                controller.close();
                return;
              }
              controller.enqueue(value);
              const decoded = new TextDecoder("utf-8").decode(value);
              setResponse((prev) => `${prev}${decoded}`);
              return pump();
            });
          }
        },
      });
    });
  };

  const onReset = () => {
    setFile(null);
    setImage(null);
    setResponse("");
    setSubmitted(false);
    setInputKey(new Date().toString());
  };

  return (
    <div className="max-w-4xl">
      {image ? (
        <img
          src={image}
          alt="An image to classify"
          className="mb-8 w-full object-contain"
        />
      ) : null}
      <form onSubmit={onSubmit}>
        <input
          key={inputKey}
          type="file"
          accept="image/jpeg"
          onChange={(e) => {
            if (e.target.files?.length) {
              setFile(e.target?.files[0]);
              setImage(URL.createObjectURL(e.target?.files[0]));
            } else {
              setFile(null);
              setImage(null);
            }
          }}
        />
        <p className="py-8 text-slate-800">
          {submitted && !response ? "Contacting Sir Attenborogh..." : response}
        </p>
        <div className="flex flex-row">
          <button
            className={`${
              submitted || !file ? "opacity-50" : "hover:bg-gray-100"
            } bg-white mr-4 text-slate-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow`}
            type="submit"
            disabled={submitted || !file}
          >
            Describe
          </button>
          <button
            className="bg-white hover:bg-red-100 text-red-800 font-semibold py-2 px-4 border border-red-400 rounded shadow"
            type="button"
            onClick={onReset}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
