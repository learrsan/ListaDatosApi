'use strict';

var context = SP.ClientContext.get_current();
var user = context.get_web().get_currentUser();
var infodatos;
var lista;


function init() {
    lista = context.get_web().get_lists().getByTitle("Datos");
    
}

function crearDatos() {

    
    var ici = SP.ListItemCreationInformation();
    var item = lista.addItem(ici);
    item.set_item("Nombre", $("#txtNombre").val());
    item.set_item("Edad", $("#txtEdad").val());

    item.update();
    context.load(item);
    context.executeQueryAsync(function () {
        alert("Datos creados con exito");
        listadoDatos();
    },
        function (sender, args) {
            alert(args.get_message());
        }

   );

}

function listadoDatos() {
    
    infodatos = lista.getItems(new SP.CamlQuery());
    context.load(infodatos);
    context.executeQueryAsync(function () {
        var html = "<ul>";

        var enumeracion = infodatos.getEnumerator();
        while (enumeracion.moveNext()) {
            var item = enumeracion.get_current();
            html += "<li><a href='#' onclick='cargar(" + item.get_item("ID") + ")'>" +
                item.get_item("Nombre") +
                "</a></li>";
        }

        html += "</ul>";
        $("#listado").html(html);

    }, function (sender, args) {
        alert(args.get_message());
    });

}

function cargar(id) {
    

    var enumeracion = infodatos.getEnumerator();
    while (enumeracion.moveNext()) {
        var item = enumeracion.get_current();
        if (item.get_item("ID") == id) {

            $("#Nombre").html(item.get_item("Nombre"));
            $("#Edad").html(item.get_item("Edad"));
            
            break;
        }
    }
    

}

function CrearApi() {
    var url = _spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getByTitle('Datos')/items";
    var digest = $("#__REQUESTDIGEST").val();
    var obj = {
        Nombre: $("#txtNombre").val(),
        Edad: $("#txtEdad").val()
        

    };
    var objtxt = JSON.stringify(obj);

    $.ajax(
        {
            url: url,
            data: objtxt,
            type: 'POST',
            headers: {
                'accept': 'application/json;odata=verbose',
                'content-type': 'application/json',
                'X-RequestDigest': digest

            },
            success: function () {
                alert("Gracias por crear persona");
                listarRest();

            },
            error: function (err) {

                alert(JSON.stringify(err));

            }

        }
    );


}

function listarRest() {
    var votos = 0;

    var url = _spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getByTitle('Datos')/items";
    $.ajax({
        url: url,
        type: "GET",
        headers: { "accept": "application/json;odata=verbose" },
        success: function (res) {
            var html = "<ul>";
            $.each(res.d.results, function (i, result) {
                html += "<tr>";
                html += "<td>" +
                    result.Nombre + "</td>" +
                    "<td>" +
                    result.Edad + "</td>" +
                    "</tr>";

            });
            html += "<tr>";
            $("#votos").html(votos);
        },
        error: function (err) {
            alert(JSON.stringify(err));
        }
    });

}



$(document).ready(function () {
    $("#btnAddDatos").click(function () {
        crearDatos();
    });
    init();
    listadoDatos();

});
$(document).ready(function () {
    $("#btnEnviarApiRest").click(function () {
        CrearApi();
    });
    init();
    listadoDatos();

});

