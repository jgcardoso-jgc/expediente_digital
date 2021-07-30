import axios from "axios";

export const getSession = async () => {
  const headers = {
    "Content-Type": "application/json",
    "api-version": "1.0",
    "X-Incode-Hardware-Id": "",
    "x-api-key": "570c70d1693636fdc200713415ebc3973afbdf19",
  };
  try {
    const response = await axios.get(
      "https://demo-api.incodesmile.com/omni/session/status/set",
      headers
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
