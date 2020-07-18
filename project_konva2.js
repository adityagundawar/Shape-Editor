"use strict";

var stage, layer, tr;
var objects = { shapes: [] }
var gid = 0;
var poly = "";
var polyPts = [];
var nodes = [];
window.onload = function init() {
    stage = new Konva.Stage({
        container: 'container',   // id of container <div>
        width: 1080,
        height: 720
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

    var clearButton = document.getElementById('clear');
    clearButton.addEventListener('click', function () {
        objects = { shapes: [] };
        layer.destroyChildren();
        layer.clear();
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
            x: 100,
            y: 100,
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
            x: 100,
            y: 100,
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
            x: 150,
            y: 150,
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

    var saveButton = this.document.getElementById('save');
    saveButton.addEventListener('click', function () {
        var json = stage.toJSON();
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(json));
        element.setAttribute('download', 'download.kjs');

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    });
    var loadButton = this.document.getElementById('load');
    loadButton.addEventListener('change', function (evt) {
        var files = evt.target.files
        var reader = new FileReader();
        reader.onload = (function (theFile) {
            return function (e) {
                // console.log(e.target.result);
                var json = JSON.parse(e.target.result)
                console.log(json['children'][0])
                layer = Konva.Node.create(json['children'][0]);
                layer.add(tr);
                stage.destroyChildren();
                stage.add(layer);
            };
        })(files[0]);
        reader.readAsText(files[0]);
    });

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
            tr.detach();
            layer.draw();
            return;
        }
        const metaPressed = evt.evt.shiftKey || evt.evt.ctrlKey || evt.evt.metaKey;
        const isSelected = tr.enabledAnchors().indexOf(evt.target) >= 0;

        if (!metaPressed && !isSelected) {
            tr.attachTo(evt.target);
        } else if (metaPressed && isSelected) {
            nodes = [];
            tr.attachTo(nodes);
        } else if (metaPressed && !isSelected) {
            tr.attachTo(evt.target);
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