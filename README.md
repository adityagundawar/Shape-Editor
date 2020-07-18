# Shape-Editor
It uses an open source library for JavaScript known as KonvaJS.
The shapes were all 2D shapes like triangle, rectangle, polyline to name a few. This whole project was done by using a JavaScript library known as Konva-JS. It is a canvas-based library and all the shapes drawn in this project are derivatives of canvas derivatives. To give a brief introduction of KonvaJS, it contains nested structures with each structure having a specific layer. The three main structures are –
• Stage- This structure houses the canvas DOM object of HTML. It is responsible for handling events triggered by the user.
• Layer- This structure lies within the stage. One stage can house many layers.
• Node- This structure is responsible for producing the shapes in the canvas. Each layer has multiple nodes.
Each shape is produced by KonvaJS primitives. Tasks such as translation, rotation, scaling is handled by using event handlers used in the stage structure. Another useful structure used in this implementation in the transformer structure that is used for scaling and rotating the shapes in the canvas.
In the process of implementing this project, many valuable lessons have been learnt. Multiple operations done on one shape or two should be done by isolating the shape, transforming it, deleting the previous shape, and placing the new shape in the place of the previous shape. This can be extrapolated for multiple selected shapes.
In the future, color and text can be used in this implementation. The same ideology for transforming shapes can be used to change the fill color and stroke color. Text could not be implemented as introducing text into the canvas was a one-way operation, it could not be editable.
I have also implemented extra features in this implementation such as-
• Multiple selection of object
• Grouping objects
• Doing operation on a group of objects
• Saving as PDF.
