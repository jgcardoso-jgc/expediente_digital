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
      console.log(data);
      const { documents } = data;
      return documents;
    }
    return false;
  }

  async submit(values, docType) {
    console.log(values, docType);
    const bodyList = [];
    values.forEach((formValue) => {
      const { name, value } = formValue;
      bodyList.push({ name, value });
    });
    let bodyTemporal = [];
    if (docType === "pagare") {
      bodyTemporal = [
        {
          label: "Folio",
          name: "folio",
          type: "text",
          value: "SGDATA1234-01",
        },
        {
          label: "Monto (numero)",
          name: "monto",
          type: "int",
          value: "65,800.00",
        },
        {
          label: "Deudor",
          name: "deudor",
          type: "text",
          value: "Marisol Navarro",
        },
        {
          label: "Acreedor",
          name: "acreedor",
          type: "text",
          value: "Juan Gonzalez",
        },
        {
          label: "Monto (letra)",
          name: "suma",
          type: "text",
          value:
            "$65,800.00 (Sesenta y Cinco Mil Ochocientos Pesos 00/100 M.N.)",
        },
        {
          label: "Fecha de vencimiento",
          name: "vencimiento",
          type: "date",
          value: "15 de febrero 2023",
        },
        {
          label: "Tasa mensual",
          name: "tasaMensual",
          type: "int",
          value: "7% (siete por ciento)",
        },
        {
          label: "Jurisdiccion",
          name: "jurisdiccion",
          type: "text",
          value: "Ciudad de Mexico",
        },
        {
          label: "Fecha de firma",
          name: "fecha",
          type: "date",
          value: "15 de febrero 2022",
        },
        {
          label: "Liga de vinculacion",
          name: "url",
          type: "text",
          value: "https://pagare.seguridata.com/pagare?id=0",
        },
      ];
    } else {
      bodyTemporal = [
        {
          name: "folio",
          label: "Folio",
          type: "text",
          value: "1234",
        },
        {
          name: "nuevoAcreedor",
          label: "Nuevo acreedor",
          type: "text",
          value: "Martha Torres",
        },
        {
          name: "lugarDeFirma",
          label: "Lugar de firma",
          type: "text",
          value: "Ciudad de Mexico",
        },
        {
          name: "fechaEndoso",
          label: "Fecha de firma",
          type: "date",
          value: "09 de febrero 2022",
        },
        {
          name: "endosante",
          label: "Endosante",
          type: "text",
          value: "Marisol Navarro",
        },
        {
          name: "url",
          label: "Liga de vinculacion",
          type: "text",
          value:
            "https://pagare.seguridata.com/pagare?id=B5DF80DE004DB29E636E01C8E0BD2D8EF7D2D2963CFB110313BF4EAFA2A1E9B7",
        },
      ];
    }
    const requestOptions = {
      method: "POST",
      headers: this.header,
      body: JSON.stringify(bodyTemporal),
    };
    console.log(`body:${JSON.stringify(bodyList)}`);
    const response = await fetch(`${this.apiUrl}/${docType}`, requestOptions);
    if (response.status === 200) {
      const data = await response.json();
      return data.id;
    }
    return false;
  }
}

export default FormController;
