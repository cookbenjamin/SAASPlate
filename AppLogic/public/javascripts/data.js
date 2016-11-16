function updateFileName() {
    var file = document.getElementById("dataFileInput");
    $("#fileName").html(file.files[0].name);
    $("#fileSize").html(Math.round(file.files[0].size/1000) + "KB");
    $("#chooseFileButton").html("Change File");
}

function uploadData() {
    $(".save").html("Processing");

    var file = $('#dataFileInput')[0].files[0];
    var formData = new FormData();
    formData.append("dataFile", file);

    console.log(formData);

    var xhr = new XMLHttpRequest();
    (xhr.upload || xhr).addEventListener('progress', function (e) {
        var done = e.position || e.loaded;
        var total = e.totalSize || e.total;
        document.getElementById("myBar").style.width = (done / total * 100) + '%';
        $(".save").html('Uploading... ' + Math.round(done / total * 100) + '% done');
    });
    xhr.addEventListener('load', function (e) {
        $(".save").addClass("success");
        $(".save").html("Upload Complete");
        $(window).location().replace("/data")
    });
    xhr.open('POST', '/uploadData', true);
    xhr.send(formData);
}

