$( document ).ready(function() {
    $(function () {
        function resetAll(){
            $(".img").each(function(i) {
                var type=$(this).attr("type");
                if(type=="folder"){
                    $(this).attr('src','static/icons/Folder-icon.png');
                }else{
                    $(this).attr('src','static/icons/Blank-icon.png');
                }
                $(this).removeClass("img-selected");
              });
        }
        function selectSomething(element) {
            if($(element).hasClass("img-selected")){
                $(element).removeClass("img-selected");
                var type=$(element).attr("type");
                if(type=="folder"){
                    $(element).attr('src','static/icons/Folder-icon.png');
                }else{
                    $(element).attr('src','static/icons/Blank-icon.png');
                }
                selected.name="";
                selected.type="";
            }else{
                resetAll();
                $(element).addClass("img-selected");
                var type=$(element).attr("type");
                if(type=="folder"){
                    $(element).attr('src','static/icons/Folder-icon-selected.png');
                }else{
                    $(element).attr('src','static/icons/Blank-icon-selected.png');
                }
                selected.name = $(element).attr("name");
                selected.type = $(element).attr("type");
            }
            console.log(selected);
          }
        var selected = {name:"", type:""};
        for (var key in contenido.directorio) {
            var icon="";
            if(contenido.directorio[key].tipo==0){
                icon='<img class="img-responsive img" type="folder" name="'+contenido.directorio[key].name+'" src="static/icons/Folder-icon.png"\>';
            }else{
                icon='<img class="img-responsive img" type="file" name="'+contenido.directorio[key].name+'" src="static/icons/Blank-icon.png"\>';
            }
            $(".pb-filemng-template-body").append(
                '<div class=\"col-xs-6 col-sm-6 col-md-3 pb-filemng-body-folders\">' +
                icon+ '<br/>' + 
                '<p class="pb-filemng-paragraphs">' + contenido.directorio[key].name + '</p>' + 
                '</div>'
            );
        }

        
        var $contextMenu = $("#contextMenu");
        var $contextMenuGeneral = $("#contextMenuGeneral");

        $("body").on("contextmenu", "img", function(e) {
            $contextMenuGeneral.hide();
            $contextMenu.css({
                display: "block",
                left: e.pageX,
                top: e.pageY
            });
            if($(this).hasClass("img-selected")==false){
                selectSomething(this);
            }
            return false;
        });

        $("body").on("contextmenu", ".div-general-img", function(e) {
            $contextMenu.hide();
            $contextMenuGeneral.css({
                display: "block",
                left: e.pageX,
                top: e.pageY
            });
            return false;
        });

        $('html').click(function() {
            $contextMenu.hide();
            $contextMenuGeneral.hide();
        });
    
        $("#contextMenu li a").click(function(e){
            var  f = $(this);
        });

        $("#contextMenuGeneral li a").click(function(e){
            var  f = $(this);
        });

        $(".img").click(function(){
            selectSomething(this);
        });

        $(".img").dblclick(function(){
            selectSomething(this);
            $.post("/accessChild", {"name": selected.name}, function(result){
                if(result.response=="success"){
                    window.location.replace("/");
                }
              });
          }); 

        $("#copy").click(function(e){
            e.preventDefault();
            $.post("/copy", {"name": selected.name}, function(result){
                if(result.response=="success"){
                    return true;
                }
              });
        });

        $("#cut").click(function(e){
            e.preventDefault();
            $.post("/cut", {"name": selected.name}, function(result){
                if(result.response=="success"){
                    return true;
                }
              });
        });

        $(".paste").click(function(e){
            e.preventDefault();
            $.post("/paste", function(result){
                if(result.response=="success"){
                    window.location.replace("/");
                }
              });
        });

        $("#delete").click(function(e){
            e.preventDefault();
            $.post("/delete", {"name": selected.name}, function(result){
                if(result.response=="success"){
                    window.location.replace("/");
                }
              });
        });

        $("#rename").click(function(e){
            e.preventDefault();
            $("#renameModal").modal("show");
            $("#name-rename").html(selected.name);
            if(selected.type=="folder"){
                $("#help-rename").html("la carpeta");
            }else{
                $("#help-rename").html("el archivo");
            }
        });

        $("#form-rename").submit(function(e){
            e.preventDefault();
            var newName=$("#name-input").val();
            $.post("/rename", {"name": selected.name,"newName":newName}, function(result){
                if(result.response=="success"){
                    window.location.replace("/");
                }
              });
        });

        $("#permissions").click(function(e){
            e.preventDefault();
            $("#permissionsModal").modal("show");
            $("#name-permissions").html(selected.name);
            console.log(contenido);
        });

        $(".new-folder").click(function(e){
            e.preventDefault();
            $("#newElementModal").modal("show");
            $("#new-element").html("Nueva Carpeta");
            $("#help-new").html("la nueva carpeta");
            $("#type").val("folder");
        });

        $(".new-file").click(function(e){
            e.preventDefault();
            $("#newElementModal").modal("show");
            $("#new-element").html("Nuevo Archivo");
            $("#help-new").html("el nuevo archivo");
            $("#type").val("file");
        });

        $("#form-new-element").submit(function(e){
            e.preventDefault();
            var type=$("#type").val();
            var name=$("#new-name-input").val();
            if(type=="folder"){
                $.post("/createDir", {"name": name}, function(result){
                    if(result.response=="success"){
                        window.location.replace("/");
                    }
                  });
            }else if(type=="file"){
                $.post("/createFile", {"name": name}, function(result){
                    if(result.response=="success"){
                        window.location.replace("/");
                    }
                  });
            }
            
        });

        $("#go-back").click(function(e){
            e.preventDefault();
            $.post("/accessParent", function(result){
                if(result.response=="success"){
                    window.location.replace("/");
                }
              });
        });

        $("#change-owner").click(function(e){
            e.preventDefault();
            $("#permissionsModal").modal("hide");
            $("#ownerModal").modal("show");
        });

        $("#cancel-owner").click(function(e){
            e.preventDefault();
            $("#ownerModal").modal("hide");
            $("#permissionsModal").modal("show"); 
        });
    });

});
