/* eslint-disable quotes */
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles(() => ({
  block: { display: "block" },
  navmain: { top: "0px", position: "absolute !important", width: "100%" },
  logoNav: { width: "45px", height: "45px", paddingTop: "10px" },
  container: {
    maxWidth: 400,
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "left",
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: 50,
  },
  inputStyle: {
    width: "100%",
    border: "0",
    borderBottom: "1px solid rgb(194, 194, 194)",
    fontSize: "16px",
  },
  rfcText: {
    marginBottom: 0,
  },
  left: {
    textAlign: "left",
  },
  right: {
    textAlign: "right",
  },
  regBt: {
    backgroundColor: "rgb(75, 75, 75)",
    color: "white",
    border: "1px solid black",
    display: "block",
    marginLeft: "auto",
    minWidth: "150px",
    paddingTop: "10px",
    marginTop: "20px",
    paddingBottom: "10px",
    fontSize: "15px",
    borderRadius: "10px",
  },
  link: {
    display: "block",
    textAlign: "right",
    paddingTop: "10px",
    marginLeft: "auto",
  },
  pt10: {
    paddingTop: "10px",
  },
  regText: { marginBottom: "4px", paddingTop: "20px" },
  expText: { marginTop: "4px" },
  pb4: { paddingBottom: "4px" },
  pt20: { paddingTop: "20px" },
  pb10: { paddingBottom: "10px" },
}));

export default useStyles;
