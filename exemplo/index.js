var elementStars = document.getElementsByTagName( "div" )[0].getElementsByTagName( "span"),

myAnimationSpaceShips = controlAnimation.create();

myAnimationSpaceShips.iterations = Infinity;
myAnimationSpaceShips.duration = 10;
myAnimationSpaceShips.fill = true;
myAnimationSpaceShips.direction = "fluid-random-offset";    

myAnimationSpaceShips[ 0 ] = {
    backgroundColor: "rgb(255, 0, 0)",
    top: "0px",
    left : "0px",
    transform : "rotate(0deg)"
};
myAnimationSpaceShips[ 20 ] = {
    1: "400",
    2: "0",
    0: "rgb(255, 0, 255)"
};
myAnimationSpaceShips[ 30 ] = {
    0: "rgb(255, 100, 0)",
    1: "0",
    2: "300"
};
myAnimationSpaceShips[ 60 ] = {
    0: "rgb(5, 200, 0)",
    1: "200",
    2: "-300"

};
myAnimationSpaceShips[ 80 ] = {
    0: "rgb(5, 200, 100)",
    1: "500",
    2: "200"
};
myAnimationSpaceShips[ 100 ] = {
    0: "rgb(255,0,0)",
    1: "0",
    2: "500",
    3: "rotate(360deg)"
};
controlAnimation.play( myAnimationSpaceShips.clone( elementStars ), true );
