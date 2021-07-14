/* eslint-disable import/prefer-default-export */
import axios from "axios";
// eslint-disable-next-line consistent-return
export const saveUser = async (data) => {
  const headers = {
    "Content-Type": "application/json",
    "api-version": "1.0",
    "X-Incode-Hardware-Id": data,
    "x-api-key": "570c70d1693636fdc200713415ebc3973afbdf19",
  };
  const body = {
    approveComponents: ["liveness"],
  };
  try {
    console.log("pushed:" + data);
    const response = await axios.post(
      "https://private-anon-e91344c8cb-incodeomni.apiary-mock.com/omni/process/approve?interviewId=" +
        data,
      body,
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
