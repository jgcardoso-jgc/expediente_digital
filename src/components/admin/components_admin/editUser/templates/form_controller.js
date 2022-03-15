/* eslint-disable quotes */
class FormController {
  apiUrl = 'https://smtp.seguridata.com:5002/docs';

  header = {
    'Content-Type': 'application/json'
  };

  async getDocumentList() {
    const requestOptions = {
      method: 'GET',
      headers: this.header
    };
    const response = await fetch(`${this.apiUrl}`, requestOptions);

    if (response.status === 200) {
      const data = await response.json();
      const { documents } = data;
      return documents;
    }
    return false;
  }

  async submit(values, docType) {
    const bodyList = [];
    values.forEach((formValue) => {
      const { name, value, label } = formValue;
      bodyList.push({ name, value, label });
    });
    const requestOptions = {
      method: 'POST',
      headers: this.header,
      body: JSON.stringify(bodyList)
    };
    const response = await fetch(`${this.apiUrl}/${docType}`, requestOptions);
    if (response.status === 200) {
      const data = await response.json();
      return data.id;
    }
    return false;
  }
}

export default FormController;
