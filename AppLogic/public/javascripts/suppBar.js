var SuppBar = function() {
    var self = this;

    self.load = function(url, fullScreen) {
        if ($("#mainBar").hasClass("supp")) {
            setTimeout(self.close(), 100);
            self.open();
        } else {
            if (fullScreen == "fullScreen") {
                self.open({fullScreen: true});
            } else {
                self.open({fullScreen: false});
            }
        }
        $.ajax({
            url: url,
            type: "GET",
            success: function(data, something) {
                $("#suppBarPacket").html(data);
            }
        });
    };

    self.open = function(options) {
        $("#mainBar").addClass("supp");
        if (options.fullScreen) {
            $("#mainBar").addClass("fullScreen");
        }
    };

    self.close = function() {
        $("#suppBarPacket").html("");
        $("#mainBar").removeClass("supp");
    };

};

var suppBar = new SuppBar();