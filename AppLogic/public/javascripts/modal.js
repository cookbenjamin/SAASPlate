var Modal = function(url) {
    var self = this;

    self.load = function(url) {
        self.open();
        $.ajax({
            url: url,
            type: "GET",
            success: function(data, something) {
                $("#modalPacket").html(data);
            }
        });
    };

    self.open = function() {
        $("#modal").addClass("visible");
        $("#blackout").addClass("visible");
        $("#not-modal").addClass("modal-open");
    };

    self.close = function() {
        $("#modal").removeClass("visible");
        $("#blackout").removeClass("visible");
        $("#not-modal").removeClass("modal-open");
    };

};

var modal = new Modal();