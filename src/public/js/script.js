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
        console.log(contenido.directorio);
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
            var id=0;
            for (var key in contenido.directorio) {
                if(contenido.directorio[key].name==selected.name){
                    id=key;
                }
            }
            $("#propietario").html(contenido.directorio[key].propietario);
            var user = "";
            user=user.concat(contenido.directorio[key].permissions.user.read ? "1" : "0");
            user=user.concat(contenido.directorio[key].permissions.user.write ? "1" : "0");
            $("#read-write-user").val(user);
            if(contenido.directorio[key].permissions.user.execution){
                $("#exec-input-user").select(true);
            }else{
                $("#exec-input-user").select(false);
            }
            var group = "";
            group=group.concat(contenido.directorio[key].permissions.group.read ? "1" : "0");
            group=group.concat(contenido.directorio[key].permissions.group.write ? "1" : "0");
            $("#read-write-group").val(group);
            if(contenido.directorio[key].permissions.group.execution){
                $("#exec-input-group").select(true);
            }else{
                $("#exec-input-group").select(false);
            }
            var others = "";
            others=others.concat(contenido.directorio[key].permissions.others.read ? "1" : "0");
            others=others.concat(contenido.directorio[key].permissions.others.write ? "1" : "0");
            $("#read-write-others").val(others);
            if(contenido.directorio[key].permissions.others.execution){
                $("#exec-input-others").select(true);
            }else{
                $("#exec-input-others").select(false);
            }
        });

        $("#form-permissions").submit(function(e){
            event.preventDefault();
            var user=$("#read-write-user").val();
            if($("#exec-input-user").prop("checked")){
                user=user.concat("1");
            }else{
                user=user.concat("0");
            }
            var group=$("#read-write-group").val();
            if($("#exec-input-group").prop("checked")){
                group=group.concat("1");
            }else{
                group=group.concat("0");
            }
            var others=$("#read-write-others").val();
            if($("#exec-input-others").prop("checked")){
                others=others.concat("1");
            }else{
                others=others.concat("0");
            }
            var permissions=user+group+others;
            $.post("/chmod", {"name": selected.name,"permissions":permissions}, function(result){
                if(result.response=="success"){
                    window.location.replace("/");
                }
              });
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

        $("#form-owner").submit(function(e){
            e.preventDefault();
            var newOwner=$("#name-owner").val();
            $.post("/chown", {"name": selected.name,"newOwner":newOwner}, function(result){
                if(result.response=="success"){
                    window.location.replace("/");
                }
              });
        });
    });

});
