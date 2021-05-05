$(document).ready(() => {

    var formNoticias = $("#formulario");

    formNoticias.on("submit", () => {
        try {
            var json = retornaJsonNoticia(formNoticias);
            salvaNoticia(json);
            criaLinhaTabela(json);
        } catch (e){
            console.error(e);
        }
        return false;
    });

    const retornaJsonNoticia = (form) => {
        var inputs = form.find('input[type="text"], textarea');
        var json = "";
        inputs.each(function(idx, input){
            var name = $(input).attr("name");
            var value = $(input).val();
            if (json !== "")
                json += ",";
            
            json += `"${name}": "${value.trim()}"`;
        });
        json = `{${json}}`;
        return JSON.parse(json);
    };

    const criaLinhaTabela = (noticiajson) => {
        var tbody = $("#table-noticias tbody");
        var tr = $("<tr></tr>");
        var tdTitulo = $("<td></td>");
        var tdIntroducao = $("<td></td>");
        var tdAcoes = $("<td></td>");
        tdTitulo.text(noticiajson['titulo']);
        tdIntroducao.text(noticiajson['conteudo']);

        var remover = $('<a style="float: right;"></a>');
        remover.html('<i class="bi bi-trash"></i> Remover');
        remover.addClass("btn btn-sm btn-danger");
        tdAcoes.append(remover);

        remover.on("click", () => removeRow(tr));

        tr.append(tdTitulo, tdIntroducao, tdAcoes);
        tbody.append(tr);

        showRowCount();
    };

    //Remove linha
    const removeRow = (tr) => {
        let idx = tr.index();
        
        tr.remove();
        showRowCount();

        let data = carregaNoticiasDb();
        if (data.length > 0) {
            data.splice(idx, 1);
            saveNoticiasDb(data);
        }
    }
    
    //Atualiza contador de linhas
    const showRowCount = () => $("#table-noticias tfoot tr td span").text(countRow());
    
    //Contador de Linhas
    const countRow = () => $("#table-noticias tbody tr").length;

    const STORAGE_NAME = "noticias";

    const salvaNoticia = (record) => {
        let data = carregaNoticiasDb();
        data.push(record);
        saveNoticiasDb(data);
    }

    const saveNoticiasDb = (data) => {
        data = JSON.stringify(data);
        localStorage.setItem(STORAGE_NAME, data);
    }

    const carregaNoticiasDb = () => {
        let data = localStorage.getItem(STORAGE_NAME);
        if (!data)
            data = []
        else
            data = JSON.parse(data);
        return data;
    }

    const carregaTable = () => {
        let data = carregaNoticiasDb();
        for (json of data){
            criaLinhaTabela(json);
        }
    }
    
    carregaTable();
});