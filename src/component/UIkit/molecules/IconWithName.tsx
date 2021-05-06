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
    titleLogo: {
      width: 200,
      height: 200,
      objectFit: "cover",
      objectPosition: "center",
      textAlign: "center",
      margin: "0 auto",
    },
  })
);

const IconWithName: FC<Props> = ({ name, src, alt, onClick }) => {
  const router = useRouter();
  const classes = useStyles();
  return (
    <div>
      <Avatar src={src} alt={alt} className={`${classes.titleLogo}`} onClick={onClick} />
      <div className="module-spacer--small" />
      <h1 className="u-text-headline">{name}</h1>
    </div>
  );
};

export default IconWithName;
