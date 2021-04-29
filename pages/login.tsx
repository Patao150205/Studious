import Head from "next/head";
import React, { FC } from "react";
// import "../styles/styles.css";

const Login: FC = () => {
  return (
    <>
      <Head>
        <title>Studious ログイン</title>
      </Head>
      <div className="module-spacer--medium" />
      <section className="c-section-container">
        <img src="/studious-logo.jpg" alt="/studious-logo" className="u-logo-img--general" width="30px" height="30px" />
        <div className="module-spacer--very-small" />
        <h1 className="u-text-headline">STUDIOUS</h1>
        <h2 className="u-text-sub-headline">ログイン</h2>
      </section>
    </>
  );
};

export default Login;
