/* eslint-disable quotes */
import apiUrl from 'utilities/constants';

class FormController {
  header = {
    'Content-Type': 'application/json'
  };

  async getDocumentList() {
    const requestOptions = {
      method: 'GET',
      headers: this.header
    };
    const response = await fetch(`${apiUrl}/docs`, requestOptions);

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
    const response = await fetch(`${apiUrl}/inherit/${uuid}`, requestOptions);

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
    // console.log('form submitting');
    const bodyList = [];
    values.forEach((formValue) => {
      const { name, value, label } = formValue;
      bodyList.push({ name, value, label });
    });
    // console.log(bodyList);
    const requestOptions = {
      method: 'POST',
      headers: this.header,
      body: JSON.stringify(bodyList)
    };
    const response = await fetch(`${apiUrl}/docs/${uuid}`, requestOptions);
    if (response.status === 200) {
      // console.log(response, apiUrl, uuid);
      const data = await response.json();
      // console.log(data.response);
      return data.response;
    }
    // console.log(response);
    return false;
  }
}

export default FormController;
