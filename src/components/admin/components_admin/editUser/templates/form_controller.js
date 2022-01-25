/* eslint-disable quotes */
class FormController {
  apiUrl = "https://200.66.66.214:5002/docs";

  header = {
    "Content-Type": "application/json",
    'Access-Control-Allow-Origin': '*',
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
