$(document).ready(function () {
    $.get("http://localhost/api/continentes/")
        .done(function (resp) {
            for (const continente of resp) {
                $("#continente select").append("<option value='" + continente + "'>" + continente + "</option>");
            }
        })
        .fail(function () {
            alert("error");
        });


    $.get("http://localhost/api/paises/")
        .done(function (resp) {
            for (const pais of resp) {
                let html = "<tr>" +
                    "<td>"+pais.Name+" </td>" +
                    "<td>"+pais.Capital+" </td>" +
                    "<td>"+pais.Continent+"</td>" +
                    "<td>"+pais.Population+"</td>" +
                    "<td>"+pais.GNP+"</td>" +
                    "<td>"+pais.HeadOfState+"</td>" +
                    "<td>" +
                    '<a href="?mod=625"><i class="bi bi-pencil-square"></i> Modificar</a> |' +
                    '<a href="?del=625"><i class="bi bi-trash"></i> Eliminar</a>' +
                    "</td>" +
                    "</tr>";
                $(".tabla_paises tbody").append(html);
            }
        })
        .fail(function () {
            alert("error");
        });
});