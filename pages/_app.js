import React, { useEffect, useState } from "react";
import "../styles/reset.css";
import "../styles/styles.css";
import "../styles/swiper.css";
import "../src/fontawesome";
import PropTypes from "prop-types";
import Head from "next/head";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import theme from "../styles/theme";
import { Provider } from "react-redux";
import { store } from "../src/store";
import AuthObserver from "../src/AuthObserver";
import { Header, Sidebar } from "../src/templates/index";
import { useRouter } from "next/router";
import { auth } from "../firebase/firebaseConfig";

const useStyles = makeStyles((theme) => ({
  spaces: {
    marginTop: 55,
    [theme.breakpoints.up("sm")]: {
      marginTop: 65,
    },
  },
  toggleSpace: {
    [theme.breakpoints.up("lg")]: {
      marginLeft: 300,
    },
  },
}));

export default function MyApp(props) {
  const classes = useStyles();
  const router = useRouter();

  const [url, setUrl] = useState("");
  const { Component, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const disabledURL = ["/signin", "/signup", "/reset"];
  useEffect(() => {
    setUrl(router.pathname);
  }, [router.pathname]);

  return (
    <React.Fragment>
      <Head>
        <title>ロード中....</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <Provider store={store}>
        <AuthObserver>
          <ThemeProvider theme={theme}>
            <Header>{disabledURL.includes(url) || <Sidebar />}</Header>
            <div className={`${classes.spaces} ${disabledURL.includes(url) || classes.toggleSpace}`}>
              <Component {...pageProps} />
            </div>
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
