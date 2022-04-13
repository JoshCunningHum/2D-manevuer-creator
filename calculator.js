// BackEnd Variables
var robVal = {
    dimX: 10,
    dimY: 10,
    maxSpeed: 30,
    wheelDist: 9,
    pins: {
        motor: [[],[],[]],
    },
    env: {
        type: "Default",
        param_1: [0, 0],
        param_2: [0, 0]
    },
    manName : 'No_Name'
}

var global = {
    display: {
        maxSpeed: $('.global_display_maxSpeed')
    }
}

var _tempVal = {
    notDrag: 0
}

var seqRand = 1;
var currentSeqEdit = 0;

var modalValues = {
    addLine: {
        in: {
            epType: `Angle and Length`,
            angle: 0,
            steps: 5,
            inverse: false,
            length: 1,
            x: 0,
            y: 0,
            time: 1,
            codeBefore: ``,
            codeAfter: ``
        },
        out: {
            angleOut: 0,
            distance: 0,
            time: 0,
            speed: 1
        }
    },
    addCurve: {
        in: {
            epType: `Angle and Length`,
            angle: 0,
            steps: 5,
            inverse: false,
            length: 1,
            x: 0,
            y: 0,
            time: 1,
            codeBefore: ``,
            codeAfter: ``,
            arcAngle: 180,
            curveDir: "right"
        },
        out: {
            angleOut: 0,
            distance: 0,
            displacement: 0,
            time: 0,
            speed: 1,
            wheelRatio: 1
        }
    }
}

// Modal Manager

function editModal(container) {
    let type = container.dataset.type;
    if(container.dataset.seqId){
        currentSeqEdit = container.dataset.seqId;
        if(container.dataset.seqData){
            let data = JSON.parse(container.dataset.seqData);
            // console.log(data);
            switch(type){
                case 'line':
                    modalValues.addLine = data;
                    addLineManager(false,false,false,true);
                    setTimeout(function(){
                        addLineManager();
                    },100);
                    break;
                case 'curve':
                    modalValues.addCurve = data;
                    addCurveManager(false,false,false,true);
                    setTimeout(function(){
                        addCurveManager();
                    },100);
                    break;
            }
        }
    }else{
        container.dataset.seqId = numToLetter(seqRand);
        currentSeqEdit = numToLetter(seqRand);
        // console.log('new!');
        let seqTemplate = {
            id: numToLetter(seqRand)
        }
        seqRand++;
    }
    switch (type) {
        case "line":
            ModalRevelear("modal_addLine");
            break;
        case "curve":
            ModalRevelear("modal_addCurve");
            break;
        case "wave":
            break;
        case "soft":
    }

    windowResizer();
}

function ModalRevelear(modalID) {
    let modals = front.modals.modals;
    let main = front.modals.container;
    if(modalID == 0){
        for (let i of modals) {
            i.style.display = 'none';
        }
        main.style.display = 'none';
        return;
    }
    let target = document.getElementById(modalID);
    for (let i of modals) {
        i.style.display = 'none';
    }
    main.style.display = 'block';
    if (target.dataset.display) {
        target.style.display = target.dataset.display;
    } else {
        target.style.display = 'block';
    }
}

// Special Mathematical Elements

var _Special_ArcViewer = document.getElementsByClassName('arc-Canvas');
var _Special_AngleSlider = document.getElementsByClassName('angleRangeSlider');

for(let i of _Special_ArcViewer){
    let width = parseFloat(i.dataset.width);
    let height = parseFloat(i.dataset.height);
    let rangeInput = document.getElementById(`${i.dataset.inputs}-rangeOrigin`);
    let numInput = document.getElementById(i.dataset.inputs);
    i.id = `${i.dataset.inputs}-ArcViewer`;

    (i.dataset.full == true) ? '' : i.style.width = `${width}px`;
    (i.dataset.full == true) ? '' : i.style.height = `${height}px`;
    (i.dataset.full == true) ? i.style.display = 'flex': '';

    let center = [width/2, height/2];
    let max = Math.min(...center);

    let ctx = i.getContext('2d');
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.arc(...center, (max - 1), degToRad(270) , degToRad(90), true);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = "#05775d";
    ctx.moveTo(center[0],0);
    ctx.lineTo(center[0],height);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 20;
    ctx.arc(...center, 10, 0, degToRad(360));
    ctx.stroke();

    ctx.font = "15px Monospace";
    ctx.fillStyle = "white";
    ctx.fillText(`180°`, center[0]-15, center[1]+5);
    ctx.fillText("right", width - 40, height - 5);

    i.addEventListener('click',function(){
        if(this.dataset.direction == "right"){
            this.dataset.direction = "left";
        }else{
            this.dataset.direction = "right";
        }

        arcViewer(this);
    })


}

function arcViewer(target,param){
    // console.log(param);
    if(typeof target == "string"){
        target = document.getElementById(`${target}-ArcViewer`);
    }
    if(param){
        let type = param.split(',')[0];
        let value = param.split(',')[1];

        target.dataset[type] = value;
    }

    let direction = target.dataset.direction;
    let angle = parseFloat(target.dataset.value);
    let height = target.dataset.height;
    let width = target.dataset.width;

    if(angle > 360){
        angle = 360;
    }

    let center = [width/2, height/2];
    let max = Math.min(...center);

    let resultAngle = 0;
    if(direction == "right"){
        resultAngle = 90 - angle;
    }else{
        resultAngle = 90 + angle;
    }


    // console.log(90 + angle);

    let ctx = target.getContext('2d');
    ctx.clearRect(0,0,width,height);
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;

    let radius;
    let dist;
    
    if(angle <= 180){
        // Math Section 
        radius = height/(2*(Math.sin(degToRad(angle/2))));
        dist = Math.cos(degToRad(angle/2))*radius;

        // Apply Section
        if(angle != 0){
            ctx.arc((direction == "right") ? center[0] + dist : center[0] - dist, center[1], radius, 0 , degToRad(360), (direction == "right") ? true : false);
        }else{
            ctx.moveTo(center[0],height);
            ctx.lineTo(center[0],0);
        }

        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#05775d";
        ctx.moveTo(center[0],height);
        ctx.lineTo(center[0],0);
        ctx.stroke();
        ctx.clearRect((direction == "right") ? center[0]+1 : -1, 0, center[0], height);
        
        ctx.beginPath();
        ctx.strokeStyle = "#444";
        ctx.lineWidth = 20;
        ctx.arc(...center, 10, 0, degToRad(360));
        ctx.stroke();
    }else{
        let start = 90 - (angle/2);
        let finish =  -(90 - angle/2);
        if(direction == "left"){
            start -= 90;
            finish += 90;
        }else{
            start += 90;
            finish -= 90;
        }
        if(angle == 360){
            start = 0;
            finish = 360;
            ctx.beginPath();
            ctx.strokeStyle = "#444";
            ctx.lineWidth = 20;
            ctx.arc(...center, 10, 0, degToRad(360));
            ctx.stroke();
        }

        let x = Math.cos(degToRad(start))*center[0];
        let y = Math.sin(degToRad(start))*center[0];
        let lineCoord = [center[0] + x,center[1] + y];
        let lineLast = [center[0] + x, center[1] - y];

        

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.arc(...center, max, degToRad(start) , degToRad(finish),false);
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = "#05775d";
        ctx.moveTo(...lineCoord);
        ctx.lineTo(...lineLast);
        ctx.stroke();
        if(360 % angle != 0){
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#444";
            ctx.moveTo(...lineCoord);
            ctx.lineTo(...center);
            ctx.lineTo(...lineLast);
            ctx.stroke();
            ctx.beginPath();
            ctx.lineWidth = 20;
            ctx.arc(...center, 10, 0, degToRad(360));
            ctx.stroke();
        }
    }

    ctx.font = "15px Monospace";
    ctx.fillStyle = "white";
    ctx.fillText(`${angle}°`, center[0]-15, center[1]+5);
    ctx.fillText(`${direction}`,(direction == "right") ? width - 40 : 0, height-5);

    if(target.dataset.resultOutput){
        // console.log("halo");
        eval(target.dataset.resultOutput);
    }
}

for (let i of _Special_AngleSlider) {
    let width = parseFloat(i.dataset.width);
    let height = parseFloat(i.dataset.height);
    let baseId = document.getElementById(i.dataset.outputId);

    (i.dataset.full == true) ? '' : i.style.width = `${width}px`;
    (i.dataset.full == true) ? '' : i.style.height = `${height}px`;
    (i.dataset.full == true) ? i.style.display = 'flex': '';

    let c = new creator('canvas,angleSliderCanvas');
    (i.dataset.align == 'center') ? c.classList.add('mx-auto'): '';
    c.width = width;
    c.height = height;
    let center = [width / 2, height / 2];
    let max = Math.min(...center);

    c.dataset.outputId = i.dataset.outputId;
    c.id = `${i.dataset.outputId}_canvasOrigin`;

    let angle = 0;
    angle -= 90;
    let addX = Math.cos(degToRad(angle)) * max;
    let addY = Math.sin(degToRad(angle)) * max;
    let finalX = center[0] + addX;
    let finalY = center[1] + addY;

    let ctx = c.getContext('2d');
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.arc(...center, (max - 2.5), 0, degToRad(360));
    ctx.moveTo(...center);
    ctx.lineTo(finalX, finalY);
    ctx.stroke();

    c.onmousedown = function (e) {
        _tempVal.notDrag = 1;
        arsManager(this, e);
    }
    c.onmousemove = function (e) {
        if (_tempVal.notDrag == 1) {
            arsManager(this, e);
        }
    }
    c.onmouseup = function (e) {
        _tempVal.notDrag = 0;
        arsManager(this, e);
    }

    // (baseId != undefined && baseId != null) ? baseId.innerHTML = `0` : '';
    if (baseId != undefined) {
        if (baseId.nodeName != 'INPUT') {
            baseId.innerHTML = '0';
        } else {
            baseId.value = 0;
            baseId.oninput = function () {
                let canvas = document.getElementById(`${this.id}_canvasOrigin`);
                let value = parseInt(this.value) % 360;
                if (this.value == "") {
                    value = 0;
                }
                arsManager(canvas, false, value);
                if (baseId.dataset.temp) {
                    eval(baseId.dataset.temp);
                }
            }
        }
    }
    if (i.dataset.resultOutput) {
        c.dataset.resultOutput = i.dataset.resultOutput;
    }

    i.append(c);
}

function arsManager(c, e, inputAngle, abort) {
    let rect = c.getBoundingClientRect();
    let width = c.width;
    let height = c.height;
    let center = [width / 2, height / 2];
    let limit = Math.min(...center);
    let baseId = document.getElementById(c.dataset.outputId);
    let angle = 0;
    let resultFunction;

    let x;
    let y;

    if (!inputAngle) {
        x = e.clientX - rect.left - center[0];
        y = -(e.clientY - rect.top - center[1]);
        angle = radToDeg(Math.atan(y / x));
        angle = (angle - 90) * -1;
        if (x < 0) {
            angle += 180;
        }
        // console.log('haloo');
    } else if (inputAngle) {
        angle = Math.abs(inputAngle);
        if (inputAngle <= 0) {
            angle = 360 - Math.abs(inputAngle);
            c.dataset.inverse = "true";
        }
    }

    if (isNaN(angle)) {
        angle = 0;
    }

    if (c.dataset.steps) {
        let step = parseInt(c.dataset.steps);
        let correction = (angle % step) / step;
        let baseAngle = Math.floor(angle / step) * step;
        angle = baseAngle + (Math.round(correction) * step);
    }else{
        c.dataset.steps = 5;
    }
    angle -= 90;
    let addX = Math.cos(degToRad(angle)) * limit;
    let addY = Math.sin(degToRad(angle)) * limit;
    let finalX = center[0] + addX;
    let finalY = center[1] + addY;

    let ctx = c.getContext('2d');
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.arc(...center, (limit - 2.5), 0, degToRad(360));
    ctx.moveTo(center[0], 0)
    ctx.lineTo(...center);
    ctx.lineWidth = 5;
    ctx.lineTo(finalX, finalY);
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(...center);
    ctx.fillStyle = 'crimson';
    (c.dataset.inverse == "true") ? ctx.arc(...center, (limit - 5), degToRad(-90), degToRad(angle), true): ctx.arc(...center, (limit - 5), degToRad(-90), degToRad(angle));

    //console.log(angle)

    angle = (angle + 90).toFixed();
    if (c.dataset.inverse == 'true') {
        angle = -(360 - (angle)).toFixed();
    }
    //console.log(angle)

    if (baseId != undefined || baseId != '') {
        if (baseId.nodeName != 'INPUT') {
            baseId.innerHTML += angle;
        } else {
            baseId.value = angle;
            if (c.dataset.inverse == 'true') {
                baseId.value = angle;
                baseId.dataset.innerValue = angle;
            }
        }
    }
    ctx.fill();

    if (c.dataset.resultOutput && !abort) {
        resultFunction = eval(c.dataset.resultOutput);
    }

}

function datasetChanger(id, dataType, value) {
    let target = document.getElementById(id);
    target.dataset[dataType] = value;
}

function angleRangeInverser(canvasID, state) {
    let canvas = document.getElementById(canvasID);
    canvas.dataset.inverse = state;
    let valueID = canvasID.split('_')[0];
    let valueCont = document.getElementById(valueID);
    let value = 0;
    if (valueCont.nodeName != 'INPUT') {
        value = parseFloat(valueCont.innerHTML);
    } else {
        value = parseFloat(valueCont.value);
    }
    if (value < 0) {
        value = 360 - Math.abs(value);
    }
    // console.log(canvas.dataset.inverse, state, !state);
    arsManager(canvas, false, value);
}

function rangeToOutput(target, value) {
    if (target.nodeName == 'INPUT') {
        target.value = value;
    } else {
        target.innerHTML = value;
    }
}

function htmlDisplayer(targets, value) {
    if (typeof (targets) == 'string') {
        if (targets.charAt(0) == '#') {
            document.getElementById(targets).innerHTML = value;
        } else {
            $(`${targets}`).html(value);
        }
    } else {
        for (let i of targets) {
            if (i.charAt(0) == '#') {
                document.getElementById(targets).innerHTML = value;
            } else {
                $(`${i}`).html(value);
            }
        }
    }
}

function angleRangeSliderData(id, type, val) {
    let target = document.getElementById(id);
    target.dataset[type] = val;
}
// Individual Modals

function addLineManager(param, abort, opt, refresh) {
    
    let lineData = modalValues.addLine.in;
    let outputs = ids.mdl.line;

    let angle, length, x, y;

    if(refresh){
        angle = lineData.angle;
        length = lineData.length;
        x = lineData.x;
        y = lineData.y;

        outputs.alType[0].innerHTML = `x = ${x}`;
        outputs.alType[1].innerHTML = `y = ${y}`;
        outputs.alType[2].innerHTML = `Angle = ${angle}`;
        outputs.alType[3].innerHTML = `Length = ${length}`;
        outputs.rcType[0].innerHTML = `x = ${x}`;
        outputs.rcType[1].innerHTML = `y = ${y}`;
        outputs.rcType[2].innerHTML = `Angle = ${angle}`;
        outputs.rcType[3].innerHTML = `Length = ${length}`;

        $(outputs.rc_input[0]).data('ionRangeSlider').update({
            from: x
        })
        $(outputs.rc_input[2]).data('ionRangeSlider').update({
            from: y
        })

        outputs.rc_input[1].value = x;
        outputs.rc_input[3].value = y;

        if (lineData.inverse == true) {
            outputs.al_angle[2].checked = true;
        } else {
            outputs.al_angle[2].checked = false;
        }

        outputs.al_angle[1].value = angle;
        (!opt) && (arsManager(outputs.al_angle[0], false, angle, true));

        $(outputs.al_length[0]).data('ionRangeSlider').update({
            from: length
        })

        outputs.al_length[1].value = length;
        return;
    }
    if (param) {
        let type = param.split(',')[0];
        let value = param.split(',')[1];

        if (!isNaN(parseFloat(value))) {
            value = parseFloat(value);
        }

        if (value == "true") {
            value = true;
        } else if (value == "false") {
            value = false;
        }

        switch (value) {
            case "":
                switch (type) {
                    case "time":
                        value = 1;
                }
                break;
            case "undefined":
                switch (type) {
                    default:
                        value = false;
                        break;
                }
        }

        modalValues.addLine.in[type] = value;
    }

    if (abort) {
        return;
    }

    if (lineData.epType == "Angle and Length") {
        angle = lineData.angle;
        length = lineData.length;

        let angleRad = degToRad(angle - 90);
        x = (Math.cos(angleRad) * length).toFixed(2);
        y = -(Math.sin(angleRad) * length).toFixed(2);

        outputs.alType[0].innerHTML = `x = ${x}`;
        outputs.alType[1].innerHTML = `y = ${y}`;
        outputs.alType[2].innerHTML = `Angle = ${angle}`;
        outputs.alType[3].innerHTML = `Length = ${length}`;
        outputs.rcType[0].innerHTML = `x = ${x}`;
        outputs.rcType[1].innerHTML = `y = ${y}`;
        outputs.rcType[2].innerHTML = `Angle = ${angle}`;
        outputs.rcType[3].innerHTML = `Length = ${length}`;

        $(outputs.rc_input[0]).data('ionRangeSlider').update({
            from: x
        })
        $(outputs.rc_input[2]).data('ionRangeSlider').update({
            from: y
        })

        outputs.rc_input[1].value = x;
        outputs.rc_input[3].value = y;

        lineData.x = x;
        lineData.y = y;
    } else {
        x = lineData.x;
        y = lineData.y;

        angle = Math.atan2(y, x);
        angle = parseFloat(radToDeg(angle).toFixed());
        length = parseFloat(Math.sqrt((x ** 2) + (y ** 2)).toFixed(2));
        if (isNaN(angle)) {
            angle = 0;
        }
        angle = -(angle - 90);
        if (angle > 180) {
            angle = -(360 - angle);
        }

        outputs.rcType[0].innerHTML = `x = ${x}`;
        outputs.rcType[1].innerHTML = `y = ${y}`;
        outputs.rcType[2].innerHTML = `Angle = ${angle}`;
        outputs.rcType[3].innerHTML = `Lengt = ${length}`;
        outputs.alType[0].innerHTML = `x = ${x}`;
        outputs.alType[1].innerHTML = `y = ${y}`;
        outputs.alType[2].innerHTML = `Angle = ${angle}`;
        outputs.alType[3].innerHTML = `Length = ${length}`;

        if (angle <= 0) {
            outputs.al_angle[2].checked = true;
        } else {
            outputs.al_angle[2].checked = false;
        }

        outputs.al_angle[1].value = angle;
        (!opt) && (arsManager(outputs.al_angle[0], false, angle, true));

        $(outputs.al_length[0]).data('ionRangeSlider').update({
            from: length
        })

        outputs.al_length[1].value = length;

        lineData.angle = angle;
        lineData.length = length;
    }

    let canvas = outputs.prev.children[0];
    let scaleCont = canvas.nextElementSibling;
    let cWidth = (canvas.parentElement.clientWidth * .8);

    canvas.width = cWidth;
    canvas.height = cWidth;

    let lineCoord = [0, 0];
    let center = [cWidth / 2, cWidth / 2];

    let ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,cWidth,cWidth);

    let nX = cWidth - (center[0] + ((x/length)*center[0]));
    let nY = cWidth - (center[1] - ((y/length)*center[1]));

    lineCoord = [nX, nY];

    let direction = [0, 0];
    let lineRatio = ((10 - (length+5))/10);
    if(length > 10){
        lineRatio = (-5/10);
    }
    direction[1] = cWidth - (center[1] - ((y*lineRatio/length)*cWidth));
    direction[0] = cWidth - (center[0] + ((x*lineRatio/length)*cWidth));

    ctx.beginPath();
    ctx.moveTo(...direction);
    ctx.lineTo(...lineCoord);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(...lineCoord, 7, 0 ,degToRad(360));
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "crimson";
    ctx.arc(...direction, 3, 0 ,degToRad(360));
    ctx.fill();

    scaleCont.innerHTML = `Preview Dimension = ${(length > 10) ? length : 10}`;

    outputs.cSpeed[0].innerHTML = `Current Speed: ${(robVal.maxSpeed*lineData.time).toFixed(2)} units/s`;

    modalValues.addLine.out.speed = (robVal.maxSpeed * lineData.time).toFixed(2);
    modalValues.addLine.out.time = (lineData.length/modalValues.addLine.out.speed).toFixed(2);
}

function addCurveManager(param, abort, opt, refresh){
    let Data = modalValues.addCurve.in;
    let outputs = ids.mdl.curve;

    let angle, length, x, y, arc, dir;

    if(refresh){
        angle = Data.angle;
        length = Data.length;
        x = Data.x;
        y = Data.y;

        outputs.alType[0].innerHTML = `x = ${x}`;
        outputs.alType[1].innerHTML = `y = ${y}`;
        outputs.alType[2].innerHTML = `Angle = ${angle}`;
        outputs.alType[3].innerHTML = `Length = ${length}`;
        outputs.rcType[0].innerHTML = `x = ${x}`;
        outputs.rcType[1].innerHTML = `y = ${y}`;
        outputs.rcType[2].innerHTML = `Angle = ${angle}`;
        outputs.rcType[3].innerHTML = `Length = ${length}`;

        $(outputs.rc_input[0]).data('ionRangeSlider').update({
            from: x
        })
        $(outputs.rc_input[2]).data('ionRangeSlider').update({
            from: y
        })

        outputs.rc_input[1].value = x;
        outputs.rc_input[3].value = y;

        if (Data.inverse == true) {
            outputs.al_angle[2].checked = true;
        } else {
            outputs.al_angle[2].checked = false;
        }

        outputs.al_angle[1].value = angle;
        (!opt) && (arsManager(outputs.al_angle[0], false, angle, true));

        $(outputs.al_length[0]).data('ionRangeSlider').update({
            from: length
        })

        outputs.al_length[1].value = length;
        return;
    }
    if(param){
        let type = param.split(',')[0];
        let value = param.split(',')[1];

        if (!isNaN(parseFloat(value))) {
            value = parseFloat(value);
        }

        if (value == "true") {
            value = true;
        } else if (value == "false") {
            value = false;
        }

        switch (value) {
            case "":
                switch (type) {
                    case "time":
                        value = 1;
                }
                break;
            case "undefined":
                switch (type) {
                    default:
                        value = false;
                        break;
                }
        }

        Data[type] = value;
    }
    if(abort){
        return;
    }
    if (Data.epType == "Angle and Length") {
        angle = Data.angle;
        length = Data.length;

        let angleRad = degToRad(angle - 90);
        x = (Math.cos(angleRad) * length).toFixed(2);
        y = -(Math.sin(angleRad) * length).toFixed(2);

        outputs.alType[0].innerHTML = `x = ${x}`;
        outputs.alType[1].innerHTML = `y = ${y}`;
        outputs.alType[2].innerHTML = `Angle = ${angle}`;
        outputs.alType[3].innerHTML = `Length = ${length}`;
        outputs.rcType[0].innerHTML = `x = ${x}`;
        outputs.rcType[1].innerHTML = `y = ${y}`;
        outputs.rcType[2].innerHTML = `Angle = ${angle}`;
        outputs.rcType[3].innerHTML = `Length = ${length}`;

        $(outputs.rc_input[0]).data('ionRangeSlider').update({
            from: x
        })
        $(outputs.rc_input[2]).data('ionRangeSlider').update({
            from: y
        })

        outputs.rc_input[1].value = x;
        outputs.rc_input[3].value = y;

        Data.x = x;
        Data.y = y;
    } else {
        x = Data.x;
        y = Data.y;

        angle = Math.atan2(y, x);
        angle = parseFloat(radToDeg(angle).toFixed());
        length = parseFloat(Math.sqrt((x ** 2) + (y ** 2)).toFixed(2));
        if (isNaN(angle)) {
            angle = 0;
        }
        angle = -(angle - 90);
        if (angle > 180) {
            angle = -(360 - angle);
        }

        outputs.rcType[0].innerHTML = `x = ${x}`;
        outputs.rcType[1].innerHTML = `y = ${y}`;
        outputs.rcType[2].innerHTML = `Angle = ${angle}`;
        outputs.rcType[3].innerHTML = `Lengt = ${length}`;
        outputs.alType[0].innerHTML = `x = ${x}`;
        outputs.alType[1].innerHTML = `y = ${y}`;
        outputs.alType[2].innerHTML = `Angle = ${angle}`;
        outputs.alType[3].innerHTML = `Length = ${length}`;

        if (angle <= 0) {
            outputs.al_angle[2].checked = true;
        } else {
            outputs.al_angle[2].checked = false;
        }

        outputs.al_angle[1].value = angle;
        (!opt) && (arsManager(outputs.al_angle[0], false, angle, true));

        $(outputs.al_length[0]).data('ionRangeSlider').update({
            from: length
        })

        outputs.al_length[1].value = length;

        Data.angle = angle;
        Data.length = length;
    }

    let canvas = outputs.prev.children[0];
    let scaleCont = canvas.nextElementSibling;
    let cWidth = (canvas.parentElement.clientWidth * .8);

    canvas.width = cWidth;
    canvas.height = cWidth;

    let lineCoord = [0, 0];
    let center = [cWidth / 2, cWidth / 2];

    let ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,cWidth,cWidth);
    ctx.scale(0.5,0.5);
    ctx.translate((cWidth/2),(cWidth/2));

    let nX = cWidth - (center[0] + ((x/length)*center[0]));
    let nY = cWidth - (center[1] - ((y/length)*center[1]));

    lineCoord = [nX, nY];

    let direction = [0, 0];
    let lineRatio = ((10 - (length+5))/10);
    if(length > 10){
        lineRatio = (-5/10);
    }
    direction[1] = cWidth - (center[1] - ((y*lineRatio/length)*cWidth));
    direction[0] = cWidth - (center[0] + ((x*lineRatio/length)*cWidth));

    
    
    // Path
    let distanceCoord = [direction[0]-lineCoord[0], lineCoord[1] - direction[1]];
    let distance = Math.sqrt((distanceCoord[0]**2)+(distanceCoord[1]**2))/2;
    
    let circleRadius = (2*(Math.sin(degToRad(Data.arcAngle/2))));
    let Cradius = distance*2/circleRadius;
    let dist = Math.cos(degToRad(Data.arcAngle/2))*Cradius;

    let xAdd = Math.cos(degToRad(Data.angle + 90))*dist;
    let yAdd = Math.sin(degToRad(Data.angle + 90))*dist;
    
    let circularCenter = [(direction[0]+lineCoord[0])/2 , (direction[1]+lineCoord[1])/2];

    if(Data.curveDir == "right"){
        xAdd *= -1;
        yAdd *= -1;
    }

    circularCenter[0] -= yAdd;
    circularCenter[1] += xAdd;

    ctx.beginPath();
    ctx.strokeStyle = "black";
    // console.log(circularCenter);
    ctx.lineWidth = 3;
    ctx.arc(...circularCenter,Cradius,degToRad(0),degToRad(360));
    ctx.stroke();

    // Displacement
    ctx.beginPath();    
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#05775d";
    ctx.moveTo(...direction);
    ctx.lineTo(...lineCoord);
    ctx.closePath();
    ctx.stroke();

    // Start Circle
    ctx.beginPath();
    ctx.fillStyle = "cyan";
    ctx.arc(...lineCoord, 3, 0 ,degToRad(360));
    ctx.fill();

    // End Point
    ctx.beginPath();
    ctx.fillStyle = "crimson";
    ctx.arc(...direction, 3, 0 ,degToRad(360));
    ctx.fill();

    scaleCont.innerHTML = `Prevew Dimension = ${(length > 10) ? length*2 : 20}`;

    ctx.globalCompositeOperation = 'destination-out';
    cHalf = cWidth/2;
    ctx.beginPath();
    ctx.moveTo(...lineCoord);
    ctx.lineTo(...direction);
    ctx.translate(-cWidth/2,-cWidth/2);
    cWidth *= 2;
    angle = Data.angle;
    let none = 0;
    // console.log(angle);
    // Hellish Switch Statement Below
    if(Data.curveDir == "left"){
        if(Data.arcAngle <= 180){
         switch(true){
               case (angle >= 0 && angle < 22.5) || (angle <= 360 && angle >= 337.5):
                  ctx.lineTo(cWidth/2,none); // North
                  ctx.lineTo(none,none); // NorthWest
                  ctx.lineTo(none,cWidth); // SouthWest
                  ctx.lineTo(cWidth/2,cWidth); // South
                  ctx.closePath();
                  break;
              case (angle >= 22.5 && angle < 67.5):
                  ctx.lineTo(cWidth,none); // NorthEast
                  ctx.lineTo(none,none); // NorthWest
                  ctx.lineTo(none,cWidth); // SouthWest
                  break;
              case (angle >= 67.5 && angle < 112.5):
                  ctx.lineTo(cWidth,cWidth/2); // East
                  ctx.lineTo(cWidth,none); // NorthEast
                  ctx.lineTo(none,none); // NorthWest
                  ctx.lineTo(none,cWidth/2); // West
                  break;
              case (angle >= 112.5 && angle < 157.5):
                  ctx.lineTo(cWidth,cWidth); // SouthEast
                  ctx.lineTo(cWidth,none); // NorthEast
                  ctx.lineTo(none,none); // NorthWest
                  break;
              case (angle >= 157.5 && angle < 202.5):
                  ctx.lineTo(cWidth/2,cWidth); // South
                  ctx.lineTo(cWidth,cWidth); // SouthEast
                  ctx.lineTo(cWidth,none); // NorthEast
                  ctx.lineTo(cWidth/2,none); // North
                  break;
              case (angle >= 202.5 && angle < 247.5):
                  ctx.lineTo(none,cWidth); // SouthWest
                  ctx.lineTo(cWidth,cWidth); // SouthEast
                  ctx.lineTo(cWidth,none); // NorthEast
                  break;
              case (angle >= 247.5 && angle < 292.5):
                  ctx.lineTo(none,cWidth/2); // West
                  ctx.lineTo(none,cWidth); // SouthWest
                  ctx.lineTo(cWidth,cWidth); // SouthEast
                  ctx.lineTo(cWidth,cWidth/2); // East
                  break;
              case (angle >= 292.5 && angle < 337.5):
                  ctx.lineTo(none,none); // NorthWest
                  ctx.lineTo(none,cWidth); // SouthWest
                  ctx.lineTo(cWidth,cWidth); // SouthEast
                  break;
            }
        }else{

            switch(true){
                case (angle >= 0 && angle < 22.5) || (angle <= 360 && angle >= 337.5):
                   ctx.lineTo(cWidth/2,none); // North
                   ctx.lineTo(none,none); // NorthWest
                   ctx.lineTo(none,cWidth); // SouthWest
                   ctx.lineTo(cWidth/2,cWidth); // South
                   ctx.closePath();
                   break;
               case (angle >= 22.5 && angle < 67.5):
                   ctx.lineTo(cWidth,none); // NorthEast
                   ctx.lineTo(none,none); // NorthWest
                   ctx.lineTo(none,cWidth); // SouthWest
                   break;
               case (angle >= 67.5 && angle < 112.5):
                   ctx.lineTo(cWidth,cWidth/2); // East
                   ctx.lineTo(cWidth,none); // NorthEast
                   ctx.lineTo(none,none); // NorthWest
                   ctx.lineTo(none,cWidth/2); // West
                   break;
               case (angle >= 112.5 && angle < 157.5):
                   ctx.lineTo(cWidth,cWidth); // SouthEast
                   ctx.lineTo(cWidth,none); // NorthEast
                   ctx.lineTo(none,none); // NorthWest
                   break;
               case (angle >= 157.5 && angle < 202.5):
                   ctx.lineTo(cWidth/2,cWidth); // South
                   ctx.lineTo(cWidth,cWidth); // SouthEast
                   ctx.lineTo(cWidth,none); // NorthEast
                   ctx.lineTo(cWidth/2,none); // North
                   break;
               case (angle >= 202.5 && angle < 247.5):
                   ctx.lineTo(none,cWidth); // SouthWest
                   ctx.lineTo(cWidth,cWidth); // SouthEast
                   ctx.lineTo(cWidth,none); // NorthEast
                   break;
               case (angle >= 247.5 && angle < 292.5):
                   ctx.lineTo(none,cWidth/2); // West
                   ctx.lineTo(none,cWidth); // SouthWest
                   ctx.lineTo(cWidth,cWidth); // SouthEast
                   ctx.lineTo(cWidth,cWidth/2); // East
                   break;
               case (angle >= 292.5 && angle < 337.5):
                   ctx.lineTo(none,none); // NorthWest
                   ctx.lineTo(none,cWidth); // SouthWest
                   ctx.lineTo(cWidth,cWidth); // SouthEast
                   break;
             }
        }
    }else{
        
        if(Data.arcAngle <= 180){
            switch(true){
                  case (angle >= 0 && angle < 22.5) || (angle <= 360 && angle >= 337.5):
                      ctx.lineTo(cWidth/2,none); // North
                      ctx.lineTo(cWidth,none); // NorthEast
                      ctx.lineTo(cWidth,cWidth); // SouthEast
                    ctx.lineTo(cWidth/2,cWidth); // South
                     break;
                 case (angle >= 22.5 && angle < 67.5):
                     ctx.lineTo(cWidth,none); // NorthEast
                     ctx.lineTo(cWidth,cWidth); // SouthEast
                    ctx.lineTo(none,cWidth); // SouthWest
                     break;
                 case (angle >= 67.5 && angle < 112.5):
                     ctx.lineTo(cWidth,cWidth/2); // East
                     ctx.lineTo(cWidth,cWidth); // SouthEast
                     ctx.lineTo(none,cWidth); // SouthWest
                    ctx.lineTo(none,cWidth/2); // West
                     break;
                 case (angle >= 112.5 && angle < 157.5):
                     ctx.lineTo(cWidth,cWidth); // SouthEast
                     ctx.lineTo(none,cWidth); // SouthWest
                    ctx.lineTo(none,none); // NorthWest
                     break;
                 case (angle >= 157.5 && angle < 202.5):
                     ctx.lineTo(cWidth/2,cWidth); // South
                     ctx.lineTo(none,cWidth); // SouthWest
                     ctx.lineTo(none,none); // NorthWest
                     ctx.lineTo(cWidth/2,none); // North
                     break;
                 case (angle >= 202.5 && angle < 247.5):
                     ctx.lineTo(none,cWidth); // SouthWest
                     ctx.lineTo(none,none); // NorthWest
                     ctx.lineTo(cWidth,none); // NorthEast
                     break;
                 case (angle >= 247.5 && angle < 292.5):
                     ctx.lineTo(none,cWidth/2); // West
                     ctx.lineTo(none,none); // NorthWest
                     ctx.lineTo(cWidth,none); // NorthEast
                     ctx.lineTo(cWidth,cWidth/2); // East
                     break;
                 case (angle >= 292.5 && angle < 337.5):
                     ctx.lineTo(none,none); // NorthWest
                     ctx.lineTo(cWidth,none); // NorthEast
                     ctx.lineTo(cWidth,cWidth); // SouthEast
                     break;
               }
           }else{
   
            switch(true){
                case (angle >= 0 && angle < 22.5) || (angle <= 360 && angle >= 337.5):
                    ctx.lineTo(cWidth/2,none); // North
                    ctx.lineTo(cWidth,none); // NorthEast
                    ctx.lineTo(cWidth,cWidth); // SouthEast
                  ctx.lineTo(cWidth/2,cWidth); // South
                   break;
               case (angle >= 22.5 && angle < 67.5):
                   ctx.lineTo(cWidth,none); // NorthEast
                   ctx.lineTo(cWidth,cWidth); // SouthEast
                  ctx.lineTo(none,cWidth); // SouthWest
                   break;
               case (angle >= 67.5 && angle < 112.5):
                   ctx.lineTo(cWidth,cWidth/2); // East
                   ctx.lineTo(cWidth,cWidth); // SouthEast
                   ctx.lineTo(none,cWidth); // SouthWest
                  ctx.lineTo(none,cWidth/2); // West
                   break;
               case (angle >= 112.5 && angle < 157.5):
                   ctx.lineTo(cWidth,cWidth); // SouthEast
                   ctx.lineTo(none,cWidth); // SouthWest
                  ctx.lineTo(none,none); // NorthWest
                   break;
               case (angle >= 157.5 && angle < 202.5):
                   ctx.lineTo(cWidth/2,cWidth); // South
                   ctx.lineTo(none,cWidth); // SouthWest
                   ctx.lineTo(none,none); // NorthWest
                   ctx.lineTo(cWidth/2,none); // North
                   break;
               case (angle >= 202.5 && angle < 247.5):
                   ctx.lineTo(none,cWidth); // SouthWest
                   ctx.lineTo(none,none); // NorthWest
                   ctx.lineTo(cWidth,none); // NorthEast
                   break;
               case (angle >= 247.5 && angle < 292.5):
                   ctx.lineTo(none,cWidth/2); // West
                   ctx.lineTo(none,none); // NorthWest
                   ctx.lineTo(cWidth,none); // NorthEast
                   ctx.lineTo(cWidth,cWidth/2); // East
                   break;
               case (angle >= 292.5 && angle < 337.5):
                   ctx.lineTo(none,none); // NorthWest
                   ctx.lineTo(cWidth,none); // NorthEast
                   ctx.lineTo(cWidth,cWidth); // SouthEast
                   break;
             }
           }
    }
    ctx.fillStyle = "opaque";
    ctx.fill();


    modalValues.addCurve.out.distance = circleRadius;
    
    // modalValues.addCurve.out.speed = (robVal.maxSpeed * Data.time).toFixed(2);
    // modalValues.addCurve.out.time = (Data.length/modalValues.addCurve.out.speed).toFixed(2);
}