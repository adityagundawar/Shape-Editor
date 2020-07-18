"use strict";

var gl;
var objects = { shapes: [] };
var gid = 0;
var pointN = 0;
var primitiveType;
var operation = 0;
var theta = 0;
var bufferId;

var vertexShaderSource = ['attribute vec4 vPosition;',
    'void main(){',
    'gl_PointSize = 1.0;',
    'gl_Position = vPosition;',
    '}'];

var fragmentShaderSource = ['precision mediump float;',
    'void main(){',
    'gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );',
    '}'];

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    //
    //  Configure WebGL
    //

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    var program = initShaders(gl, vertexShaderSource, fragmentShaderSource);
    gl.useProgram(program);
    bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);


    var clearButton = document.getElementById('clear');
    clearButton.addEventListener('click', function () {
        console.log("in clear");
        gl.clearColor(1.0, 1.0, 1.0, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT);
        objects = { shapes: [] };
    }, false);

    var lineButton = document.getElementById("line");
    lineButton.addEventListener('click', function () {
        objects.shapes.push({
            id: gid++,
            shape: 'line',
            vertices: [vec2(-0.2, -0.2), vec2(0.2, 0.2)],
            centre: vec2(0, 0)
        });
        render();
    });

    var rectButton = document.getElementById("rect");
    rectButton.addEventListener('click', function () {
        objects.shapes.push({
            id: gid++,
            shape: 'rectangle',
            vertices: [vec2(0.3, 0), vec2(0, 0.3), vec2(-0.2, 0), vec2(0, -0.2)],
            centre: vec2(0, 0)
        });
        render();
    });

    var triButton = document.getElementById("tri");
    triButton.addEventListener('click', function () {
        objects.shapes.push({
            id: gid++,
            shape: 'triangle',
            vertices: [vec2(0.2, 0), vec2(0, 0.2), vec2(-0.2, 0)],
            centre: vec2(0, 0)
        });
        render();
    });

    var circButton = document.getElementById('circ');
    circButton.addEventListener('click', function () {
        var circlePoints = []
        var radius = 0.2;
        var definition = 125;
        var dTheta = (2 * Math.PI) / definition;
        for (var i = 0; i < definition + 1; i = i + dTheta) {
            circlePoints.push(vec2(radius * Math.cos(i), radius * Math.sin(i)));
        }
        objects.shapes.push({
            id: gid++,
            shape: 'circle',
            vertices: circlePoints,
            centre: vec2(0, 0)
        });
        render();
    });

    var polyButton = document.getElementById("poly");
    polyButton.addEventListener('click', function () {
        objects.shapes.push({
            id: gid++,
            shape: 'circle',
            vertices: [
                vec2(0.2, 0),
                vec2(0, -0.3),
                vec2(-0.3, 0),
                vec2(-0.1, 0.4),
                vec2(0, -0.2)
            ],
            centre: vec2(0, 0)
        });
        render();
    });

    // var translation = this.document.getElementById("translate");
    // translation.addEventListener('click', function () {
    //     operation = 'translation';
    // });
    // var rotation = this.document.getElementById("rotate");
    // rotation.addEventListener('click', function () {
    //     operation = 'rotation';
    // });

    canvas.addEventListener("click", function (event) {
        var t = vec2((2 * (event.clientX / canvas.width) - 1), (-2 * (event.clientY / canvas.height) + 1));
        console.log(t);
        switch (operation) {
            case 'translation':
                console.log('in translate');
                var transMatrix = mat4();
                transMatrix[0] = [1, 0, 0, t[0]];
                transMatrix[1] = [0, 1, 0, t[1]];
                transMatrix[2] = [0, 0, 1, 0];
                transMatrix[3] = [0, 0, 0, 1];
                var numOfVertices = vertices.length;
                var newVertices = [];
                for (var i = 0; i < numOfVertices; i++) {
                    var tempVertex = vec4(vertices[i], 0, 1);
                    newVertices.push(mult(transMatrix, tempVertex).splice(0, 2));
                }
                console.log(newVertices);
                gl.bufferData(gl.ARRAY_BUFFER, flatten(newVertices), gl.STATIC_DRAW);
                render();
                break;
            case 'rotation':
                console.log('in rotation');
                var base = t[0];
                var height = t[1];
                var hypotenuse = Math.sqrt(t[0] * t[0] + t[1] * t[1]);
                var rotateMatrix = mat4();
                rotateMatrix[0] = [(base / hypotenuse), -(height / hypotenuse), 0, 0];
                rotateMatrix[1] = [(height / hypotenuse), (base / hypotenuse), 0, 0];
                rotateMatrix[2] = [0, 0, 1, 0];
                rotateMatrix[3] = [0, 0, 0, 1];
                var newVertices = [];
                for (var i = 0; i < vertices.length; i++) {
                    var tempVertex = vec4(vertices[i], 0, 1);
                    newVertices.push(mult(rotateMatrix, tempVertex).splice(0, 2));
                }
                console.log(newVertices);
                gl.bufferData(gl.ARRAY_BUFFER, flatten(newVertices), gl.STATIC_DRAW);
                // vertices = newVertices;
                render();
                break;
            default:
                // console.log('default');
                break;
        }

    });

    window.render = function () {
        var vertObj = extractVert(objects)
        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertObj.vertices), gl.STATIC_DRAW);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enableVertexAttribArray(vPosition);
        gl.drawArrays(gl.LINES, 0, vertObj.count);
    };

    window.extractVert = function (objects) {
        var vertices = []
        var count = 0;
        for (var i = 0; i < objects.shapes.length; i++) {
            console.log()
            for (var j = 0; j < objects.shapes[i].vertices.length; j++) {
                count++;
                vertices.push(objects.shapes[i].vertices[j])
            }
        }
        return { vertices: vertices, count: count }
    }
}

function sliderInputChange(value) {
    // console.log(value);
    var scaleMatrix = mat4();
    scaleMatrix[0] = [value, 0, 0, 0];
    scaleMatrix[1] = [0, value, 0, 0];
    scaleMatrix[2] = [0, 0, value, 0];
    scaleMatrix[3] = [0, 0, 0, 1];
    // console.log(scaleMatrix);
    var newVertices = [];
    for (var i = 0; i < vertices.length; i++) {
        var tempVertex = vec4(vertices[i], 0, 1);
        // console.log(tempVertex);
        newVertices.push(mult(scaleMatrix, tempVertex).splice(0, 2))
    }
    // console.log(newVertices);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(newVertices), gl.STATIC_DRAW);
    window.render();
}

