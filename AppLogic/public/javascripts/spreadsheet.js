$("th.row").on("mousedown", function(event) {
    $(".selected").removeClass("selected");
    $(this).parent().children().addClass("selected");
    $("button").removeClass("disabled");
});

$("th.col").on("mousedown", function(event) {
    $(".selected").removeClass("selected");
    $(this).addClass("selected");
    $("button").removeClass("disabled");
    var index = $(this).index() + 1;
    console.log($(this).parent().children());
    for (var child in $(this).parent().children())  {
        $(child).children().find("td:nth-child("+index+")").addClass("selected");
    }
});

$("td").on("mousedown", function(event) {
    $(".selected").removeClass("selected");
    $(this).addClass("selected");
    $("button").removeClass("disabled");
});

$("th.all").on("mousedown", function(event) {
    $(".selected").removeClass("selected");
    $("th, td").addClass("selected");
    $("button").removeClass("disabled");
});