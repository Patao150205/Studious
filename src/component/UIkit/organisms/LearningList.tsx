import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { List, ListItem } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/styles";
import React, { FC } from "react";
import { FormContents, Registration } from "../../../../pages/record/edit";
import { PrimaryCard } from "../atoms";

const useStyles = makeStyles((theme: any) =>
  createStyles({
    list: {
      paddingTop: 0,
    },
    listItem: {
      marginTop: 15,
      background: theme.palette.primary[100],
      display: "flex",
      flexFlow: "column",
    },
    listItemTitle: {
      color: "red",
      textAlign: "center",
    },
    icons: {
      margin: "0 10px",
      fontSize: 20,
      "&:hover": {
        color: theme.palette.primary[500],
        cursor: "pointer",
        opacity: "0.8",
      },
    },
    pencil: {
      marginRight: 15,
    },
  })
);

type Props = {
  registration: Registration;
  editLearnedEle: (learningContent: string) => void;
  deleteLearnedEle: (learningContent: string) => void;
};

const LearningList: FC<Props> = ({ registration, editLearnedEle, deleteLearnedEle }) => {
  const classes = useStyles();
  return (
    <PrimaryCard title="学習内容一覧" subTitle="learning list">
      <List className={classes.list}>
        {registration.map((ele: FormContents) => {
          return (
            <ListItem key={ele.learningContent} className={classes.listItem}>
              <p className={classes.listItemTitle}>{ele.learningContent}</p>
              <div className="module-spacer--very-small" />
              <p>{`${ele.hours} h ${ele.minutes} m`}</p>
              <div className="module-spacer--very-small" />
              <div>
                <FontAwesomeIcon
                  className={`classes.pencil ${classes.icons}`}
                  icon={["fas", "pencil-alt"]}
                  onClick={() => editLearnedEle(ele.learningContent)}
                />
                <FontAwesomeIcon
                  className={classes.icons}
                  icon={["fas", "trash"]}
                  onClick={() => deleteLearnedEle(ele.learningContent)}
                />
              </div>
            </ListItem>
          );
        })}
      </List>
    </PrimaryCard>
  );
};

export default LearningList;
