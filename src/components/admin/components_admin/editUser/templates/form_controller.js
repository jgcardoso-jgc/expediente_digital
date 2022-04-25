/* eslint-disable quotes */
class FormController {
  apiUrl = 'https://smtp.seguridata.com:5002/';

  header = {
    'Content-Type': 'application/json'
  };

  async getDocumentList() {
    const requestOptions = {
      method: 'GET',
      headers: this.header
    };
    const response = await fetch(`${this.apiUrl}/docs`, requestOptions);

    if (response.status === 200) {
      const data = await response.json();
      const { documents } = data;
      return documents;
    }
    return false;
  }

  async getDocInheritance(uuid) {
    const requestOptions = {
      method: 'GET',
      headers: this.header
    };
    const response = await fetch(
      `${this.apiUrl}/inherit/${uuid}`,
      requestOptions
    );

    if (response.status === 200) {
      const data = await response.json();
      const { documents } = data;
      if (documents.length === 0) {
        return false;
      }
      return documents;
    }
    return false;
  }

  async submit(values, uuid) {
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
    const response = await fetch(`${this.apiUrl}/docs/${uuid}`, requestOptions);
    console.log(response);
    if (response.status === 200) {
      const data = await response.json();
      console.log(data, bodyList);
      return data.id;
    }
    return false;
  }
}

export default FormController;
