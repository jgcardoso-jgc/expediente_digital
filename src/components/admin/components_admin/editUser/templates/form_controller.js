/* eslint-disable quotes */
class FormController {
  apiUrl = "https://smtp.seguridata.com:5002/docs";

  header = {
    "Content-Type": "application/json",
  };

  async getDocumentList() {
    const requestOptions = {
      method: "GET",
      headers: this.header,
    };
    const response = await fetch(`${this.apiUrl}`, requestOptions);

    if (response.status === 200) {
      const data = await response.json();
      const { documents } = data;
      return documents;
    }
    return false;
  }
}

export default FormController;
