import { getSensors } from "../../api/readings";

export async function generateSensorData() {
  const sensoresBase = await getSensors();

  return sensoresBase.map((sensor) => {
    let valor = "";
    let status = "OK";

    switch (sensor.tipo) {
      case "pressao":
        const pressao = parseFloat((Math.random() * 10 + 1).toFixed(2));
        valor = `${pressao}`;
        if (pressao > 9) status = "Alerta";
        break;

      case "magnetico":
      case "indutivo":
        const ativo = Math.random() > 0.5;
        valor = ativo ? "1" : "0";
        if (!ativo) status = "Alerta";
        break;

      default:
        valor = "0";
    }

    return {
      id: sensor.id.toString(),
      nome: sensor.nome,
      tipo: sensor.tipo,
      valor,
      status,
    };
  });
}
