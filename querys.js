var paises = [];
var continente_select = "";
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
    cargarPaises();
});

function cargarPaises() {
    $(".tabla_paises tbody").html("");
    $(".paginacion").html("");
    $.get("http://localhost/api/paises/")
        .done(function (respP) {
            paises = respP;
            for (let i = 0; i < respP.length && i < 25; i++) {
                const pais = paises[i];
                if (pais.Capital) {
                    $.get("http://localhost/api/ciudades/?id=" + pais.Capital)
                        .done(function (respC) {
                            pais.Capital = respC[0].Name;
                            let html = "<tr>" +
                                "<td>" + pais.Name + " </td>" +
                                "<td>" + pais.Capital + " </td>" +
                                "<td>" + pais.Continent + "</td>" +
                                "<td>" + pais.Population + "</td>" +
                                "<td>" + pais.GNP + "</td>" +
                                "<td>" + pais.HeadOfState + "</td>" +
                                "<td>" +
                                '<a href="#" onclick="actualizarPais(\'' + pais.Code + '\')"><i class="bi bi-pencil-square"></i> Modificar</a> |' +
                                '<a href="?del=625"><i class="bi bi-trash"></i> Eliminar</a>' +
                                "</td>" +
                                "</tr>";
                            $(".tabla_paises tbody").append(html);
                        });
                }
            }
            let paginas = Math.ceil(respP.length / 25);
            for (let i = 1; i <= paginas; i++) {
                $(".paginacion").append("<a href='#' onclick='navegarPaginacion(" + i + ")'>" + i + "</a>");
            }

        })
        .fail(function () {
            alert("error");
        });
}

function filtrarContinente() {
    continente_select = $("#continente select").val();
    $(".tabla_paises tbody").html("");
    let cont = 0;
    for (let i = 0; i < paises.length; i++) {
        const pais = paises[i];
        if (pais.Continent == continente_select) {
            cont++;
            if (cont < 25) {
                let html = "<tr>" +
                    "<td>" + pais.Name + " </td>" +
                    "<td>" + pais.Capital + " </td>" +
                    "<td>" + pais.Continent + "</td>" +
                    "<td>" + pais.Population + "</td>" +
                    "<td>" + pais.GNP + "</td>" +
                    "<td>" + pais.HeadOfState + "</td>" +
                    "<td>" +
                    '<a href="#" onclick="actualizarPais(\'' + pais.Code + '\')"><i class="bi bi-pencil-square"></i> Modificar</a> |' +
                    '<a href="?del=625"><i class="bi bi-trash"></i> Eliminar</a>' +
                    "</td>" +
                    "</tr>";
                $(".tabla_paises tbody").append(html);
            }
        }
    }
    let paginas = Math.ceil(cont / 25);
    $(".paginacion").html("");
    for (let i = 1; i <= paginas; i++) {
        $(".paginacion").append("<a href='#' onclick='navegarPaginacion(" + i + ")'>" + i + "</a>");
    }
}

function navegarPaginacion(pag) {
    $(".tabla_paises tbody").html("");
    let ini = 25 * (pag - 1);
    let cont = 0;
    for (let i = 0; i < paises.length; i++) {
        const pais = paises[i];
        if (continente_select != "") {
            if (pais.Continent == continente_select) {
                cont++;
            } else {
                continue;
            }
        } else {
            cont++;
        }
        if (cont >= ini && cont < ini + 25) {
            let html = "<tr>" +
                "<td>" + pais.Name + " </td>" +
                "<td>" + pais.Capital + " </td>" +
                "<td>" + pais.Continent + "</td>" +
                "<td>" + pais.Population + "</td>" +
                "<td>" + pais.GNP + "</td>" +
                "<td>" + pais.HeadOfState + "</td>" +
                "<td>" +
                '<a href="#" onclick="actualizarPais(\'' + pais.Code + '\')"><i class="bi bi-pencil-square"></i> Modificar</a> |' +
                '<a href="?del=625"><i class="bi bi-trash"></i> Eliminar</a>' +
                "</td>" +
                "</tr>";
            $(".tabla_paises tbody").append(html);
        }
    }
}

function mostrarPopUP() {
    $(".popUp").fadeIn();
    $("#code").attr("disabled", false);
    $(".popUp").attr("estado", "registrar");
}

function ocultarPopUP() {
    $(".popUp").fadeOut();
    $(".popUp input").val("");
}

function guardarPais() {
    let code = $("#code").val();
    let nombre = $("#nombre").val();
    let continente = $("#continenteP").val();
    let capital = $("#capital").val();
    let poblacion = $("#poblacion").val();
    let pib = $("#pib").val();
    let jefe = $("#jefe").val();
    if (code.trim() == "" || nombre.trim() == "") {
        alert("Debe introducir al menos el nombre y codigo del pais");
        return;
    }
    let peticion = "POST";
    if ($(".popUp").attr("estado") == "actualizacion") {
        peticion = "PUT";
    }
    $.ajax({
        url: "http://localhost/api/paises/",
        type: peticion,
        data: {
            code,
            nombre,
            continente,
            capital,
            poblacion,
            pib,
            jefe
        }
    }).done(function (resp) {
        if (resp.status == "success") {
            ocultarPopUP();
            cargarPaises();
        }
    }).fail(function () {
        alert("No se pudo insertar los valores en la base de datos.")
    });
}

function actualizarPais(id) {
    mostrarPopUP();
    $("#code").attr("disabled", true);
    $(".popUp").attr("estado", "actualizacion");
    let paisL = null;
    let paisR = null;
    for (const pais of paises) {
        if (pais.Code == id) {
            paisL = pais;
        }
    }
    $.get("http://localhost/api/paises/?pais=" + id)
        .done(function (resp) {
            paisR = resp[0];

            $("#code").val(id);
            $("#nombre").val(paisR.Name);
            $("#continenteP").val(paisR.Continent);
            $("#capital").val(paisR.Capital);
            $("#poblacion").val(paisR.Population);
            $("#pib").val(paisR.GNP);
            $("#jefe").val(paisR.HeadOfState);

        })
        .fail(function () {
            $("#codigo").val(id);
            $("#nombre").val(paisL.Name);
            $("#continenteP").val(paisL.Continent);
            $("#capital").val(paisL.Capital);
            $("#poblacion").val(paisL.Population);
            $("#pib").val(paisL.GNP);
            $("#jefe").val(paisL.HeadOfState);
        });

}
