import { Card, CardContent, CardHeader, createStyles, makeStyles } from "@material-ui/core";
import React, { FC } from "react";

const useStyles = makeStyles(
  createStyles({
    title: {
      fontWeight: "bold",
      fontSize: 18,
    },
    cardContent: {
      width: "100%",
      paddingTop: 0,
    },
  })
);

type Props = {
  avatar?: React.ReactNode;
  title: string;
  subTitle: string;
  children: React.ReactNode;
};

const PrimaryCard: FC<Props> = ({ avatar, title, subTitle, children }) => {
  const classes = useStyles();
  return (
    <Card>
      <CardHeader classes={{ title: classes.title }} avatar={avatar} title={title} subheader={subTitle} />
      <CardContent className={classes.cardContent}>{children}</CardContent>
    </Card>
  );
};

export default PrimaryCard;
