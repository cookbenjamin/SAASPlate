var Model = function(args) {
    var self = this;
    self.name = "Untitled";
    self.layer_types = {
        "basicLayer": "Fully Connected Layer",
        "convLayer": "Convolutional Layer"
        // "poolLayer": "Pooling Layer",
        // "RNNLayer": "RNN Layer",
        // "LSTMLayer": "LSTM Layer"
    };
    self.activation_types = {
        "rectify": "Rectified Linear",
        "sigmoid": "Sigmoid",
        "tanh": "tanh",
        "softmax": "Softmax",
        "linear": "Linear"
    };

    self.layers = [];

    self.inputLayer = {};
    self.outputLayer = {};
    if (args.outputLayer) {
        self.outputLayer = args.outputLayer
    }


    self.create = function () {
        var save = $(".save");
        save.html("Processing");
        var data = self.maker.getData();
        $.ajax({
            url: "/newModel",
            type: "POST",
            data: {
                data: data
            },
            beforeSend: function () {
                save.html("Processing");
            },
            success: function (data) {
                save.addClass("success");
                save.html("Model Added");
            }
        });
    };

    self.Maker = function() {
        this.getData = function() {
            var layers = self.maker.constructLayers();
            var name = document.getElementById("networkName").value;
            return JSON.stringify({
                name: name,
                layers: layers
            });
        };

        this.addLayer = function() {
            var layerOptions = this.generateOptions(self.layer_types);
            var activationOptions = this.generateOptions(self.activation_types);
            var count = $('#newModelTable tr').length;
            var table = document.getElementById("newModelTable");
            var row = table.insertRow(count - 2);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);
            var num = count - 2;
            cell1.innerHTML = "Layer " + (count - 2).toString();
            cell2.innerHTML = "<select class='layerType'>" + layerOptions + "</select>";
            cell3.innerHTML = "<button class='' onclick='model.maker.removeLayer("+num+")'>Edit</button>";
            cell4.innerHTML = "<select class='activationType'>" + activationOptions + "</select>";
            cell5.innerHTML = "<button class='warning' onclick='model.maker.removeLayer("+num+")'>Remove</button>";
            cell5.className = "right";
        };

        this.removeLayer = function(i) {
            var table = document.getElementById("newModelTable");
            table.deleteRow(i)
        };

        this.generateOptions = function(dictionary) {
            var options = "";
            for (var key in dictionary) {
                options += "<option value='" + key + "'>" + dictionary[key] + "</option>";
            }
            return options;
        };

        this.getValuesFromClass = function() {
            var outArray = [];
            var elements = document.getElementsByClassName(className);
            console.log(elements);
            for (var i = 0; i < elements.length; i++) {
                outArray.push(elements[i].value);
            }
            return outArray;
        };

        this.constructLayers = function() {
            var layerTypes = self.maker.getValuesFromClass("layerType");
            var activationTypes = self.maker.getValuesFromClass("activationType");
            var numNeurons = self.maker.getValuesFromClass("numNeurons");
            var layers = [];
            for (var i = 0; i < layerTypes.length; i++) {
                layers.push({
                    "layerType": layerTypes[i],
                    "activation": activationTypes[i],
                    "numNeurons": numNeurons[i]
                });
            }
            return layers;
        };
        this.generateActivationSelect = function() {
            var activationOptions = this.generateOptions(self.activation_types);
            $('#outputActivationCell').html("<select class='activationType' name='activationType'>"+activationOptions+"</select>");
        };

        this.generateLayerTypeSelect = function() {
            var layerTypes = this.generateOptions(self.layer_types);
            $('#outputLayerTypeCell').html("<select id='layerType' name='layerType' onchange='alertValue()' class='layerType'>"+layerTypes+"</select>");
        };
        this.generateInputs = function() {

        }
    };

    self.maker = new self.Maker();

    self.addLayer = function() {
        var values = {};
        var string = "";
        $.each($("#newLayerForm").serializeArray(), function (i, field) {
            if (field.value) {
                values[field.name] = field.value;
                string += field.name + ": " + field.value + ", ";
            }
        });
        var count = $('#newModelTable tr').length;
        var table = document.getElementById("newModelTable");
        var row = table.insertRow(count - 2);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var num = count - 2;

        cell1.innerHTML = "Layer " + (count - 2).toString();
        cell2.innerHTML = string;
        cell3.innerHTML = "<button onclick='model.maker.removeLayer("+num+")'>Edit</button><button class='warning' onclick='model.maker.removeLayer("+num+")'>Remove</button>";
        cell3.className = "right";
        suppBar.close();
        self.layers.push(values);
    };

    self.save = function() {
        var save = $(".save");
        var data = {
            name: self.name,
            inputLayer : self.inputLayer,
            layers: self.layers,
            outputLayer: self.outputLayer
        };
        console.log(data);
        $.ajax({
            url: "/newModel",
            type: "POST",
            data:  {
                data: JSON.stringify(data)
            },
            beforeSend: function () {
                save.html("Processing");
            },
            success: function (data) {
                save.addClass("success");
                save.html("Model Added");
                window.location.replace("/models");
            }
        });
    };

    self.updateName = function() {
        self.name = $("#modelName").val();
    }




};

function alertValue() {
    var val = $('#layerType').val();
    $(".layerParam").addClass("hidden");
    $("."+val).removeClass("hidden");
    $(".layerParamInput").val("");
}

function save() {
    var data = {
        InputLayer: {
            shape: 0
        },
        Layers: [

        ],
        OutputLayer: {
            activation: 0,
            numUnits: 0
        }
    }
}

var layers = [];


var model = new Model({
    outputLayer: {
        activation: "rectify",
        layerType: "basicLayer"
    }
});