import { useEffect } from "react";
import Head from "next/head";

export default function Docs() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js";
    script.onload = () => {
      window.Redoc.init("/openapi.yaml", {}, document.getElementById("redoc-container"));
    };
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <Head>
        <title>API Docs</title>
      </Head>
      <div id="redoc-container" />
    </>
  );
}
