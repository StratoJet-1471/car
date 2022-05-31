class Renderable {
    createStyleStrFromStyleDataObject(styleDataObj) {
        let styleStr = "";
        for(let key in styleDataObj) {
            const cssProperty = key + ": " + styleDataObj[key] + "; ";
            styleStr += cssProperty;
        }
        return styleStr;
    }
}
class Wheel extends Renderable {
    constructor(radius = 5) {
        super();
        this._radius = radius;
        this._rotationPeriod = null;
        this._node = null;
    }

    calcRotationPeriodViaSpeed(speed) {        
        const circleLength = 2*Math.PI*this._radius;
        this._rotationPeriod =  (speed > 0) ? circleLength/speed : null;
    }

    render({carNode, left, bottom, animationName, speed}) {
        if(!this._node) {
            const wheelNode = document.createElement("img");
            const styleData = {
                position: "absolute",
                bottom: bottom + "px",
                left: left + "px",
            };

            this.calcRotationPeriodViaSpeed(speed);
            if(this._rotationPeriod!==null) styleData.animation = animationName + " " + this._rotationPeriod + "s linear infinite";

            let styleStr = this.createStyleStrFromStyleDataObject(styleData);

            wheelNode.setAttribute("src", "img/wheel.png");
            wheelNode.setAttribute("style", styleStr);
            this._node = wheelNode;
            carNode.appendChild(wheelNode);
        }
        else {
            const styleData = {
                position: "absolute",
                bottom: bottom + "px",
                left: left + "px",
            };
            this.calcRotationPeriodViaSpeed(speed);
            if(this._rotationPeriod!==null) styleData.animation = animationName + " " + this._rotationPeriod + "s linear infinite";

            const styleStr = this.createStyleStrFromStyleDataObject(styleData);

            this._node.setAttribute("style", styleStr);
        }
    }
}
export class Car extends Renderable {
    constructor(carBrand = "Bugatty") {
        super();
        
        /*
        //Не работает - тег добавляется, но стили не работают. Видимо, это потому, что по факту они не загружаются, т.к. тег был добавлен уже после создания документа.
        let linkStyleSheet = document.createElement('link');
        linkStyleSheet.setAttribute('rel', "stylesheet");
        linkStyleSheet.setAttribute('src', "car-style.css");
        document.getElementsByTagName("head")[0].appendChild(linkStyleSheet);
        */

        this._wheels = [{wheelObject: new Wheel(), left: 120, bottom: 0}, {wheelObject: new Wheel(), left: 666, bottom: 0}];
        this._speed = 10;
        this._width = 886;
        this._height = 284;
        this._parentNode = null;
        this._wheelAnimationName = 'wheel';//null;
        this._node = null;
        this._carImgSrc = "img/car.png";

        
        //Источник: https://stackoverflow.com/questions/3328933/set-the-webkit-keyframes-from-to-parameter-with-javascript
        if(!document.querySelector("style#wheel-animation")) {
            let cssAnimation = document.createElement('style');
            cssAnimation.setAttribute('id', "wheel-animation");
            const rules = document.createTextNode('@keyframes ' + this._wheelAnimationName + '{100% { transform: rotate(360deg); }}');
            cssAnimation.appendChild(rules);
            document.getElementsByTagName("head")[0].appendChild(cssAnimation);        
        }
    }

    render({parentNode, speed}) { 
        this._speed = speed;
        
        if(!this._node) {
            const carStyleData = {
                position: "relative",
                display: "flex",
                width: this._width + "px",
                height: this._height + "px",
                background: "red"
            };
            const carImgStyleData = {
                width: this._width + "px",
                height: this._height + "px",
            };
            const carStyleStr = this.createStyleStrFromStyleDataObject(carStyleData);
            const carImgStyleStr = this.createStyleStrFromStyleDataObject(carImgStyleData);                        
            const carNode = document.createElement("div");
            const carImgNode = document.createElement("img");

            carNode.setAttribute("style", carStyleStr);
            carImgNode.setAttribute("src", this._carImgSrc);
            carImgNode.setAttribute("style", carImgStyleStr);

            this._node = carNode;
            this._parentNode = parentNode;

            carNode.appendChild(carImgNode);

            parentNode.appendChild(carNode); 
        }
        else {
            if(parentNode!==this._parentNode) { //Понятно, что такая ситуация может возникнуть лишь если мы уже рендерили раньше.
                this._parentNode.removeChild(this._node);
                parentNode.appendChild(this._node); 
                this._parentNode = parentNode;
            }
        }
        this._wheels.forEach((wheel) => wheel.wheelObject.render({carNode: this._node, left: wheel.left, bottom: wheel.bottom, animationName: this._wheelAnimationName, speed}));
    }
}