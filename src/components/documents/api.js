import axios from "axios";

export const getImage = async (token) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "content-type": "application/json",
    "api-version": 1.0,
    "x-incode-hardware-id": token,
    "x-api-key": "570c70d1693636fdc200713415ebc3973afbdf19",
  };
  const body = {
    images: ["fullFrameFrontID"],
  };
  try {
    console.log("fetching...");
    console.log(token);
    const response = await axios.post(
      "https://demo-api.incodesmile.com/omni/get/images",
      body,
      headers
    );
    return response.data;
  } catch (error) {
    console.log("error:" + error);
  }
};
