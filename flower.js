// Elliot Rippe
// 9/28/17

var canvas;
var gl;
var vbuffer;
var triColor;
var vColorLoc;
var vertices = [];

window.onload = function init() {
	canvas = document.getElementById( "gl-canvas");
	gl = WebGLUtils.setupWebGL( canvas );
	if (!gl ) {alert ("WebGL isn't available" ); }
	
	//	Configure WebGL
	gl.viewport(0, 0, canvas.width, canvas.height );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0);
	
	//	Load shaders and initialize attribute buffers
	var program = initShaders(gl, "vertex-shader", "fragment-shader" );
	gl.useProgram ( program );
	
	//	Set up vertices
	triColor = vec4(1.0, 0.0, 0.0, 1.0); 
	squareVertices();
	
	//	Load the data into the GPU
	vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
	
	//	Set the vPosition data for the shader
	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);
	
	//	Get the color location for the vertex shader
	vColorLoc = gl.getUniformLocation(program, "vColor");
	modelView = gl.getUniformLocation(program, "modelView");
	
	render();
}

function render(){
	gl.clear( gl.COLOR_BUFFER_BIT);
	gl.uniform4fv(vColorLoc, triColor);
	
	var temp = Math.sqrt(0.02);
	var angle = 0;
	var mvMatrix = [];
	
	mvMatrix = scalem(3, 3, 0);
	for (var i = 0; i < 12; i++){ // Makes large petals
		mvMatrix = mult(mvMatrix, translate((Math.sin(angle)*temp), -(Math.cos(angle)*temp), 0)); 
		mvMatrix = mult(mvMatrix, rotate((i*30) + 45, 0, 0, 1)); 
		mvMatrix = mult(mvMatrix, rotate(75, 1, 1, 0));
		
		gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
		gl.drawArrays(gl.LINE_LOOP, 0, 4);
		
		mvMatrix = mult(mvMatrix, rotate(-75, 1, 1, 0));
		mvMatrix = mult(mvMatrix, rotate(-((i*30) + 45), 0, 0, 1));
		mvMatrix = mult(mvMatrix, translate(-(Math.sin(angle)*temp), (Math.cos(angle)*temp), 0));
		angle += Math.PI/6;
	}
	mvMatrix = scalem(2, 2, 0);
	for (var i = 0; i < 12; i++){ // Makes small petals
		mvMatrix = mult(mvMatrix, translate((Math.sin(angle)*temp), -(Math.cos(angle)*temp), 0));
		mvMatrix = mult(mvMatrix, rotate((i*30) + 45, 0, 0, 1));
		mvMatrix = mult(mvMatrix, rotate(78, 1, 1, 0));
		
		gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
		gl.drawArrays(gl.LINE_LOOP, 0, 4);
		
		mvMatrix = mult(mvMatrix, rotate(-78, 1, 1, 0));
		mvMatrix = mult(mvMatrix, rotate(-((i*30) + 45), 0, 0, 1));
		mvMatrix = mult(mvMatrix, translate(-(Math.sin(angle)*temp), (Math.cos(angle)*temp), 0));
		angle += Math.PI/6;
	}
	angle = (15*Math.PI)/180
	mvMatrix = scalem(1, 1, 0);
	for (var i = 0; i < 12; i++){ // Makes boxes and diamonds
		mvMatrix = mult(mvMatrix, translate((Math.sin(angle)*0.75), (Math.cos(angle)*0.75), 0));
		mvMatrix = mult(mvMatrix, rotate(-(angle*(180/Math.PI)), 0, 0, 1));
		
		gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
		gl.drawArrays(gl.LINE_LOOP, 0, 4); // draws boxes
		
		mvMatrix = mult(mvMatrix, rotate(-45, 0, 0, 1));
		mvMatrix = mult(mvMatrix, scalem(0.2/(Math.sqrt(0.09)), 0.2/(Math.sqrt(0.09)), 1));
		
		gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
		gl.drawArrays(gl.LINE_LOOP, 0, 4); // draws diamonds
		
		mvMatrix = mult(mvMatrix, rotate((angle*(180/Math.PI)), 0, 0, 1));
		mvMatrix = mult(mvMatrix, scalem(1/(0.2/(Math.sqrt(0.09))), (1/(0.2/(Math.sqrt(0.09)))), 1));
		mvMatrix = mult(mvMatrix, rotate(45, 0, 0, 1));
		mvMatrix = mult(mvMatrix, translate(-(Math.sin(angle)*0.75), -(Math.cos(angle)*0.75), 0));
		angle += Math.PI/6;
	}
	window.requestAnimFrame(render);
}

function squareVertices(){
	var x = -0.1;	// Lower left corner
	var y = -0.1;
	var side = 0.2;
	
	vertices.push(vec2(x, y));
	vertices.push(vec2(x+side, y));
	vertices.push(vec2(x+side, y+side));
	vertices.push(vec2(x, y+side));
}