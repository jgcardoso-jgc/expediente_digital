import axios from "axios";

export const getImage = async (token) => {
  const headers = {
    "Content-Type": "application/json",
    "api-version": 1.0,
    "X-Incode-Hardware-Id": token,
    "x-api-key": "570c70d1693636fdc200713415ebc3973afbdf19",
  };
  try {
    console.log("fetching...");
    console.log(token);
    const response = await axios.post(
      "https://demo-api.incodesmile.com/omni/get/images",
      {
        images: ["fullFrameFrontID"],
      },
      headers
    );
    return response.data;
  } catch (error) {
    console.log("error:" + error);
  }
};
