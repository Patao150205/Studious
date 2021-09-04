import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Theme } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/styles";
import React, { FC } from "react";

type Props = {};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.primary.main,
      color: "#444",
      fontSize: 20,
      textAlign: "center",
      padding: "30px 0",
      minWidth: "calc(320px - 2rem)",
      [theme.breakpoints.down("xs")]: {
        fontSize: "1.0rem",
      },
    },
    container: { textAlign: "center", display: "inline-block" },
    TwitterIcon: { color: "#5097f5" },
    GitHubIcon: { color: "black" },
  })
);

const Footer: FC<Props> = ({}) => {
  const classes = useStyles();
  return (
    <section className={classes.root}>
      <div className={classes.container}>
        <h1>
          <FontAwesomeIcon className={classes.TwitterIcon} icon={["fab", "twitter"]} />
          製作者のツイッター
        </h1>
        <div className="module-spacer--very-small" />
        <a href="https://twitter.com/Patao_program">https://twitter.com/Patao_program</a>
        <div className="module-spacer--small" />
        {/* <h1>
          <FontAwesomeIcon className={classes.GitHubIcon} icon={["fab", "github"]} />
          製作者のGitHub
        </h1>
        <div className="module-spacer--very-small" />
        <a href="https://github.com/Patao150205">https://github.com/Patao150205</a> */}
      </div>
    </section>
  );
};

export default Footer;
