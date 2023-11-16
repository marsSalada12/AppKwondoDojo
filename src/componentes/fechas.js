export function diasRestantes(fechaParametro) {
    // Obtener la fecha actual
    var fechaActual = new Date();
    // Convertir la fecha en formato "DD/MM/YYYY" a un objeto Date
    var partesFecha = fechaParametro.split("/");
    var fechaMeta = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]);
    // Calcular la diferencia en milisegundos entre las dos fechas
    var diferenciaMilisegundos = fechaMeta - fechaActual;
    // Calcular el número de días restantes redondeando hacia abajo
    var diasRestantes = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));
    return diasRestantes + 1;
  }