/* eslint-disable import/prefer-default-export */
import axios from "axios";
// eslint-disable-next-line consistent-return
export const saveUser = async (data) => {
  try {
    console.log("pushed:" + data);
    const response = await axios.post(
      `https://omni.apiblueprint.org/omni/process/approve?interviewId=`,
      data
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
