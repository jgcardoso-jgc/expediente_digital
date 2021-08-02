import axios from "axios";

export const deleteSession = async (token) => {
  const headers = {
    "api-version": "1.0",
    "X-Incode-Hardware-Id": token,
    "x-api-key": "570c70d1693636fdc200713415ebc3973afbdf19",
  };
  try {
    const response = await axios.post(
      "https://demo-api.incodesmile.com/omni/session/status/set?Action=Deleted",
      headers
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
