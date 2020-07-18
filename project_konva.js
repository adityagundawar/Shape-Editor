"use strict";

var stage, layer;
var objects = { shapes: [] }
var gid = 0;
window.onload = function init() {
    stage = new Konva.Stage({
        container: 'container',   // id of container <div>
        width: 1080,
        height: 720
    });

    layer = new Konva.Layer();
    stage.add(layer);

    var clearButton = document.getElementById('clear');
    clearButton.addEventListener('click', function () {
        objects = { shapes: [] };
        layer.destroyChildren();
        layer.clear();
    }, false);

    var lineButton = document.getElementById("line");
    lineButton.addEventListener('click', function () {
        objects.shapes.push({
            id: gid++,
            shape: 'line',
            points: [20, 20, 100, 100],
            stroke: 'black',
            strokeWidth: 2
        });
        render();
    });

    var rectButton = document.getElementById("rect");
    rectButton.addEventListener('click', function () {
        objects.shapes.push({
            id: gid++,
            shape: 'rectangle',
            x: 100,
            y: 100,
            width: 100,
            height: 50,
            stroke: 'black',
            strokeWidth: 2
        });
        render();
    });

    var triButton = document.getElementById("tri");
    triButton.addEventListener('click', function () {
        objects.shapes.push({
            id: gid++,
            shape: 'triangle',
            points: [23, 20, 23, 160, 70, 93],
            stroke: 'black',
            strokeWidth: 2,
            closed: true
        });
        render();
    });

    var circButton = document.getElementById('circ');
    circButton.addEventListener('click', function () {
        objects.shapes.push({
            id: gid++,
            shape: 'circle',
            x: 100,
            y: 100,
            radius: 70,
            fill: 'red',
            stroke: 'black',
            strokeWidth: 2
        });
        render();
    });

    var polyButton = document.getElementById("poly");
    polyButton.addEventListener('click', function () {
        objects.shapes.push({
            id: gid++,
            shape: 'polygon',
            points: [23, 20, 23, 160, 70, 93, 150, 109, 290, 139, 270, 93],
            stroke: 'black',
            strokeWidth: 2,
            closed: true

        });
        render();
    });

    window.render = function () {
        for (var i = 0; i < objects.shapes.length; i++) {
            switch (objects.shapes[i].shape) {
                case 'line':
                    layer.add(new Konva.Line({
                        points: objects.shapes[i].points,
                        stroke: objects.shapes[i].stroke,
                        strokeWidth: objects.shapes[i].strokeWidth,
                    }));
                    break;
                case 'rectangle':
                    layer.add(new Konva.Rect({
                        x: objects.shapes[i].x,
                        y: objects.shapes[i].y,
                        width: objects.shapes[i].width,
                        height: objects.shapes[i].height,
                        stroke: objects.shapes[i].stroke,
                        strokeWidth: objects.shapes[i].strokeWidth
                    }));
                    break;
                case 'triangle':
                    layer.add(new Konva.Line({
                        points: objects.shapes[i].points,
                        stroke: objects.shapes[i].stroke,
                        strokeWidth: objects.shapes[i].strokeWidth,
                        closed: objects.shapes[i].closed
                    }));
                    break;
                case 'circle':
                    layer.add(new Konva.Circle({
                        x: objects.shapes[i].x,
                        y: objects.shapes[i].y,
                        radius: objects.shapes[i].radius,
                        stroke: objects.shapes[i].stroke,
                        strokeWidth: objects.shapes[i].strokeWidth
                    }));
                    break;
                case 'polygon':
                    layer.add(new Konva.Line({
                        points: objects.shapes[i].points,
                        stroke: objects.shapes[i].stroke,
                        strokeWidth: objects.shapes[i].strokeWidth,
                        closed: objects.shapes[i].closed
                    }));

            }
        }
        layer.draw() 
    }


    //   layer.draw();
}