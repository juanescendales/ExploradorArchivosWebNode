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

        $("body").on("contextmenu", "img", function(e) {
            $contextMenu.css({
                display: "block",
                left: e.pageX,
                top: e.pageY
            });
            if(selected.name==""){
                selectSomething(this);
            }
            return false;
        });

        $('html').click(function() {
            $contextMenu.hide();
        });
    
        $("#contextMenu li a").click(function(e){
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
        });

        $("#cut").click(function(e){
            e.preventDefault();
        });

        $("#paste").click(function(e){
            e.preventDefault();
        });

        $("#delete").click(function(e){
            e.preventDefault();
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
        });

        $("#permissions").click(function(e){
            e.preventDefault();
            $("#permissionsModal").modal("show");
            $("#name-permissions").html(selected.name);
        });

        $("#new-folder").click(function(e){
            e.preventDefault();
            $("#newElementModal").modal("show");
            $("#new-element").html("Nueva Carpeta");
            $("#help-new").html("la nueva carpeta");
        });

        $("#new-file").click(function(e){
            e.preventDefault();
            $("#newElementModal").modal("show");
            $("#new-element").html("Nuevo Archivo");
            $("#help-new").html("el nuevo archivo");
        });

        $("#go-back").click(function(e){
            e.preventDefault();
            $.post("/accessParent", function(result){
                if(result.response=="success"){
                    window.location.replace("/");
                }
              });
        });
    });

});
