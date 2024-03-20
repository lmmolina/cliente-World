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

});