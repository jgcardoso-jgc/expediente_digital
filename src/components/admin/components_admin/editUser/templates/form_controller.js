/* eslint-disable quotes */
class FormController {
  apiUrl = "https://smtp.seguridata.com:5002/docs";

  async getDocumentList() {
    const requestOptions = {
      method: "GET",
      body: JSON.stringify(),
    };
    const response = await fetch(`${this.apiUrl}`, requestOptions);
    const data = await response.json();
    return data;
  }
}

export default FormController;
