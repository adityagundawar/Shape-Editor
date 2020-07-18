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
    'gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );',
    '}'];

var fragmentShaderSource2 = ['precision mediump float;',
    'void main(){',
    'gl_FragColor = vec4( 0.0, 1.0, 0.0, 1.0 );',
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
    var boundingProgram = initShaders(gl, vertexShaderSource, fragmentShaderSource2);
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
            centre: vec2(0, 0),
            primitiveType: gl.LINES,
            program: program,
            isSelected: function (shape, clkPts) {
                var vertices = shape.vertices;
                var lhs = (vertices[1][0] - vertices[0][0]) * clkPts[1] - (vertices[1][1] - vertices[0][1]) * clkPts[0];
                var rhs = vertices[0][1] * vertices[1][0] - vertices[0][1] * vertices[1][0]
                if (lhs == rhs || lhs - rhs > 0 && lhs - rhs < 0.02 || lhs - rhs < 0 && lhs - rhs > -0.02) {
                    shape.program = boundingProgram
                }
            }
        });
        render();
    });

    var rectButton = document.getElementById("rect");
    rectButton.addEventListener('click', function () {
        objects.shapes.push({
            id: gid++,
            shape: 'rectangle',
            vertices: [vec2(0.3, 0), vec2(0, 0.3), vec2(-0.2, 0), vec2(0, -0.2)],
            centre: vec2(0, 0),
            program: program,
            primitiveType: gl.LINE_LOOP
        });
        render();
    });

    var triButton = document.getElementById("tri");
    triButton.addEventListener('click', function () {
        objects.shapes.push({
            id: gid++,
            shape: 'triangle',
            vertices: [vec2(0.2, 0), vec2(0, 0.2), vec2(-0.2, 0)],
            centre: vec2(0, 0),
            program: program,
            primitiveType: gl.LINE_LOOP
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
            centre: vec2(0, 0),
            program: program,
            primitiveType: gl.LINE_LOOP
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
            centre: vec2(0, 0),
            program: program,
            primitiveType: gl.LINE_LOOP
        });
        render();
    });

    canvas.addEventListener("click", function (event) {
        var t = vec2((2 * (event.clientX / canvas.width) - 1), (-2 * (event.clientY / canvas.height) + 1));
        console.log(t);
        for (var j = 0; j < objects.shapes.length; j++) {
            objects.shapes[j].isSelected(objects.shapes[j], t);
        }
        render();
    });

    window.render = function () {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        extractVert(objects);

    };

    window.extractVert = function (objects) {
        for (var i = 0; i < objects.shapes.length; i++) {
            gl.useProgram(objects.shapes[i].program);
            gl.bufferData(gl.ARRAY_BUFFER, flatten(objects.shapes[i].vertices), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(vPosition);
            gl.drawArrays(objects.shapes[i].primitiveType, 0, objects.shapes[i].vertices.length);
        }
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

