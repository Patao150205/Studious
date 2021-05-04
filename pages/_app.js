import React from "react";
import "../styles/reset.css";
import "../styles/styles.css";
import "../src/fontawesome";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "../styles/theme";
import { Provider } from "react-redux";
import { store } from "../src/store";
import AuthObserver from "../src/AuthObserver";
import { Header, Sidebar } from "../src/templates/index";

export default function MyApp(props) {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>My page</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <Provider store={store}>
        <AuthObserver>
          <ThemeProvider theme={theme}>
            <Header>
              <Sidebar />
            </Header>
            <Component {...pageProps} />
          </ThemeProvider>
        </AuthObserver>
      </Provider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
