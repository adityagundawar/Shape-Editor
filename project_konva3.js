"use strict";

var stage, layer, tr;
var objects = { shapes: [] }
var gid = 0;
var poly = "";
var nodes;
var polyPts = []
window.onload = function init() {
    stage = new Konva.Stage({
        container: 'canvas-container',   // id of container <div>
        width: 1070,
        height: 700
    });

    layer = new Konva.Layer();
    stage.add(layer);
    tr = new Konva.Transformer({
        borderStroke: 'red',
        borderStrokeWidth: 1,
        anchorSize: 7,
        anchorFill: 'red',
        anchorStroke: 'red',
        padding: 14

    });
    layer.add(tr);
    tr.nodes([]);

    var clearButton = document.getElementById('clear');
    clearButton.addEventListener('click', function () {
        objects = { shapes: [] };
        layer.removeChildren();
        layer.clear();
        layer.add(tr);
    }, false);

    var lineButton = document.getElementById("line");
    lineButton.addEventListener('click', function () {
        layer.add(new Konva.Line({
            points: [20, 20, 100, 100],
            stroke: 'black',
            strokeWidth: 2,
            draggable: true
        }));
        layer.draw();
    });

    var rectButton = document.getElementById("rect");
    rectButton.addEventListener('click', function () {
        layer.add(new Konva.Rect({
            x: 100,
            y: 100,
            width: 100,
            height: 50,
            stroke: 'black',
            strokeWidth: 2,
            draggable: true
        }));
        layer.draw();
    });
    var sqButton = document.getElementById("square");
    sqButton.addEventListener('click', function () {
        layer.add(new Konva.Rect({
            x: 100,
            y: 100,
            width: 100,
            height: 100,
            stroke: 'black',
            strokeWidth: 2,
            draggable: true
        }));
        layer.draw();
    });

    var triButton = document.getElementById("tri");
    triButton.addEventListener('click', function () {
        layer.add(new Konva.Line({
            points: [23, 20, 23, 160, 70, 93],
            stroke: 'black',
            strokeWidth: 2,
            closed: true,
            draggable: true
        }));
        layer.draw();
    });

    var circButton = document.getElementById('circ');
    circButton.addEventListener('click', function () {
        layer.add(new Konva.Circle({
            x: 200,
            y: 200,
            radius: 70,
            stroke: 'black',
            strokeWidth: 2,
            draggable: true
        }));
        layer.draw();
    });

    var ellipseButton = document.getElementById('ellipse');
    ellipseButton.addEventListener('click', function () {
        layer.add(new Konva.Ellipse({
            x: 200,
            y: 200,
            radiusX: 100,
            radiusY: 50,
            stroke: 'black',
            strokeWidth: 2,
            draggable: true
        }));
        layer.draw();
    });

    var polyButton = document.getElementById("poly");
    polyButton.addEventListener('click', function () {
        layer.add(new Konva.RegularPolygon({
            x: 200,
            y: 200,
            sides: 6,
            radius: 100,
            stroke: 'black',
            strokeWidth: 2,
            draggable: true
        }));
        layer.draw();
    });

    var polyLineButton = document.getElementById("polyline");
    polyLineButton.addEventListener('click', function () {
        poly = 'polyline'
    });

    var polyCurveButton = document.getElementById("polycurve");
    polyCurveButton.addEventListener('click', function () {
        poly = 'polycurve'
    });

    var saveList = document.getElementById('saveList')
    saveList.style.visibility = 'hidden';

    var saveButton = this.document.getElementById('save');
    saveButton.addEventListener('click', function () {

        saveList.style.visibility = 'visible';

    });

    var radios = document.forms["saveList"].elements["save"];
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].value == 'txt') {
            radios[i].onclick = function () {
                var json = stage.toJSON();
                var element = document.createElement('a');
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(json));
                element.setAttribute('download', 'download.txt');
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
                saveList.style.visibility = 'hidden';
            }
        }
        else if(radios[i].value == 'image'){
            radios[i].onclick = function () {
                var dataURL = stage.toDataURL({ pixelRatio: 1 });
                var element = document.createElement('a');
                element.setAttribute('href', dataURL);
                element.setAttribute('download', 'download.jpeg');
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
                saveList.style.visibility = 'hidden';
            }
        }
        else if(radios[i].value == 'pdf'){
            radios[i].onclick = function () {
                var pdf = new jsPDF('l', 'px', [stage.width(), stage.height()]);
                pdf.addImage(
                    stage.toDataURL({ pixelRatio: 1 }),
                    0,
                    0,
                    stage.width(),
                    stage.height()
                  );
                  pdf.save('download.pdf');
                saveList.style.visibility = 'hidden';
            }
        }
    }

    var loadButton = this.document.getElementById('load');
    loadButton.addEventListener('change', function (evt) {
        var files = evt.target.files
        var reader = new FileReader();
        reader.onload = (function (theFile) {
            return function (e) {
                console.log(e.target.result);
                var json;
                try {
                    json = JSON.parse(e.target.result)
                }
                catch (err) {
                    alert(err);
                }
                if (json['attrs']) {
                    console.log(json['children'][0])
                    layer = Konva.Node.create(json['children'][0]);
                    layer.add(tr);
                    stage.destroyChildren();
                    stage.add(layer);
                }
                else {
                    alert('Format of this JSON is not supported');
                }
            };
        })(files[0]);
        console.log(typeof (files[0].name));
        if (files[0].name.includes('.txt')) {
            reader.readAsText(files[0]);
        }
        else {
            alert('Only text files are allowed');
        }
    });

    var draw = document.getElementById("draw");
    draw.addEventListener('click', function () {
        switch (poly) {
            case 'polycurve':
                layer.add(new Konva.Line({
                    points: polyPts,
                    stroke: 'black',
                    strokeWidth: 2,
                    draggable: true,
                    tension: 1
                }));
                break;
            case 'polyline':
                layer.add(new Konva.Line({
                    points: polyPts,
                    stroke: 'black',
                    strokeWidth: 2,
                    draggable: true
                }));
                break;
        }
        layer.draw();
        polyPts = [];
        draw.style.visibility = 'hidden';
    });
    draw.style.visibility = 'hidden';


    stage.on('click', function (evt) {
        console.log(evt.target);
        if (poly == 'polycurve' || poly == 'polyline') {
            polyPts.push(evt.evt.layerX);
            polyPts.push(evt.evt.layerY);
        }
        if (polyPts.length > 2) {
            draw.style.visibility = 'visible'
        }
        if (evt.target === stage) {
            tr.nodes([]);
            layer.draw();
            return;
        }
        const metaPressed = evt.evt.shiftKey || evt.evt.ctrlKey || evt.evt.metaKey;
        const isSelected = tr.nodes().indexOf(evt.target) >= 0;

        if (!metaPressed && !isSelected) {
            tr.nodes([evt.target]);
        } else if (metaPressed && isSelected) {
            nodes = tr.nodes().slice();
            nodes.splice(nodes.indexOf(evt.target), 1);
            tr.nodes(nodes);
        } else if (metaPressed && !isSelected) {
            nodes = tr.nodes().concat([evt.target]);
            tr.nodes(nodes);
        }
        else {
            nodes = [];
        }
        layer.draw();

    });

    stage.on('keyup', function (evt) {
        console.log('key pressed');
        if (event.keyCode === 13) {
            evt.preventDefault();
            console.log('key pressed');
        }
    });

}