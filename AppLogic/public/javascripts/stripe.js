Stripe.setPublishableKey('pk_test_USgvNKLCzYfOxCJesytH1hNt');


$('input.cc-num').payment('formatCardNumber');

function stripeResponseHandler(status, response) {
    var $form = $('#payment-form');

    if (response.error) {
        // Show the errors on the form
        $form.find('.payment-errors').text(response.error.message);
        $form.find('button').prop('disabled', false);
    } else {
        // response contains id and card, which contains additional card details
        var token = response.id;
        // Insert the token into the form so it gets submitted to the server
        $form.append($('<input type="hidden" id="#stripeToken" name="stripeToken" />').val(token));
        $.ajax({
            url: "/async/addPayment",
            type: "POST",
            data: {
                stripeToken: token
            },
            beforeSend: function() {
                $(".save.payment").html("Processing");
            },
            success: function(data) {
                $(".save.payment").addClass("success");
                $(".save.payment").html("Card Added");
            }
        });
    }
}

function stripeChangeCardResponseHandler(status, response) {
    var $form = $('#payment-form');
    if (response.error) {
        // Show the errors on the form
        $("#payment-form").find('.payment-errors').text(response.error.message);
        $(".save.payment").html("Error");
    } else {
        // response contains id and card, which contains additional card details
        var token = response.id;
        // Insert the token into the form so it gets submitted to the server
        $.ajax({
            url: "/async/changePayment",
            type: "POST",
            data: {
                stripeToken: token
            },
            beforeSend: function() {
                $(".save.payment").html("Processing");
            },
            success: function(data) {
                $(".save.payment").addClass("success");
                $(".save.payment").html("Card Added");
            }
        });
    }
}