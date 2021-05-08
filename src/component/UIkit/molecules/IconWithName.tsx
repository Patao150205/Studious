import { Avatar, createStyles, makeStyles } from "@material-ui/core";
import { useRouter } from "next/router";
import React, { FC } from "react";

type Props = {
  name: string;
  src: string;
  alt: string;
  onClick: () => void;
};

const useStyles = makeStyles(
  createStyles({
    root: {
      maxWidth: 300,
      widht: "100%",
      wordBreak: "break-word",
    },
    titleLogo: {
      width: 200,
      height: 200,
      objectFit: "cover",
      objectPosition: "center",
      textAlign: "center",
      margin: "0 auto",
    },
    profileName: {
      fontSize: "1.6rem",
    },
    profileName__small: {
      fontSize: "1.3rem",
    },
  })
);

const IconWithName: FC<Props> = ({ name, src, alt, onClick }) => {
  const classes = useStyles();

  const changeFontsize = (): string => {
    switch (!!name.length) {
      case name.length <= 14:
        return classes.profileName;
      default:
        return classes.profileName__small;
    }
  };

  return (
    <div className={classes.root}>
      <Avatar src={src} alt={alt} className={`${classes.titleLogo}`} onClick={onClick} />
      <div className="module-spacer--small" />
      <h1 className={changeFontsize()}>{name}</h1>
    </div>
  );
};

export default IconWithName;
