var Ls, ATs, XsMap, YsMap, XcMap, YcMap;
function miniVisual(){
    let board = ids.main.tab_sequence.miniVisual;
    let details = ids.main.tab_sequence.manParagraph;

    board.innerHTML = '';

    let bWidth, bHeight, cWidth, cHeight;

    bWidth = board.clientWidth;
    bHeight = board.clientHeight;

    if(bWidth > bHeight){
        bWidth = bHeight;
    }else{
        bHeight = bWidth;
    }

    let cont = new creatorNS(`svg,,,width=${bWidth * .9}|height=${bHeight * .9}`)
    
    cont.style.margin = "auto";

    // console.log(describeArc(200,200,100,0,180));
    // describeArc(x, y, radius, startAngle, endAngle);

    // let temp = new creatorNS(`path,,,d=${describeArc(200,200,100,270,0)}|fill=none|stroke=red|stroke-width=2`);

    // temp.style.transition = 'none';

    // temp.addEventListener('mouseover',function(){
    //     this.setAttributeNS(null, 'fill' ,'black');
    // });
    // temp.addEventListener('mouseout',function(){
    //     this.setAttributeNS(null, 'fill', 'yellow');
    // })
    // cont.append(temp);

    // cont.style.backgroundColor = 'white';

    // Analyzing and Mapping the Sequence Object
    Ls = sequence.map(function(seq){ return seq.data.in.length;});
    ATs = sequence.map(function(seq){ return seq.data.in.angle});
    visualizeMapper(Ls, ATs);

    board.append(cont);

    let XsMin, XsMax, YsMin, YsMax, locString;

    [XsMin, XsMax] = [Math.min(...XcMap,0), Math.max(...XcMap,0)];
    [YsMin, YsMax] = [Math.min(...YcMap,0), Math.max(...YcMap,0)];

    if(XsMin == XsMax){
        if(XsMax > 0){
            XsMin = 0;
        }else{
            XsMax = 0;
        }
    }
    if(YsMin == YsMax){
        if(YsMax > 0){
            YsMin = 0;
        }else{
            YsMax = 0;
        }
    }

    if(XsMin >= 0 && XsMax >= 0){
        if(YsMin >= 0 && YsMax >= 0){
            locString = "SW";
        }else if(YsMin < 0 && YsMax < 0){
            locString = "NW";
        }else{
            locString = "W";
        }
    }else if(XsMin < 0 && XsMax < 0){
        if(YsMin >= 0 && YsMax >= 0){
            locString = "SE";
        }else if(YsMin < 0 && YsMax < 0){
            locString = "SE";
        }else{
            locString = "E";
        }
    }else{
        if(YsMin > 0 && YsMax > 0){
            locString = "S";
        }else if(YsMin < 0 && YsMax < 0){
            locString = "N";
        }else{
            locString = "C";
        }
    }


    // Rendering

    // Starting Point Initialization
    let  startCoord, stSVG, enSVG;

    cWidth = cont.clientWidth;
    cHeight = cont.clientHeight;

    switch(locString){
        case 'NW':
            startCoord = [0, 0];
            break;
        case 'N':
            startCoord = [cWidth/2, 0];
            break;
        case 'NE':
            startCoord = [cWidth, 0];
            break;
        case 'W':
            startCoord = [0, cHeight/2];
            break;
        case 'C':
            startCoord = [cWidth/2, cHeight/2];
            break;
        case 'E':
            startCoord = [cWidth, cHeight/2];
            break;
        case 'SW':
            startCoord = [0, cHeight];
            break;
        case 'S':
            startCoord = [cWidth/2, cHeight];
            break;
        case 'SE':
            startCoord = [cWidth, cHeight];
            break;
    }

    stSVG = new creatorNS(`circle,,,cx=${startCoord[0]}|cy=${startCoord[1]}|r=3|stroke=white|stroke-width=1|fill=crimson`);

    // Rendering Each Paths

    let inputs, outputs, currentPoint, lineSVG, curveSVG, visualWidth, visualHeight, count, baseVRatio, outlineSVG, endPMemo;

    baseVRatio = Math.abs(XsMax - XsMin);

    if(baseVRatio < Math.abs(YsMax - YsMin)){
        baseVRatio = Math.abs(YsMax - YsMin);
    }

    visualWidth = cWidth / baseVRatio;
    visualHeight = -(cHeight / baseVRatio);
    
    switch(locString){
        case 'C':
        case 'W':
        case 'N':
        case 'S':
        case 'E':
            visualWidth = cWidth/2 / baseVRatio;
            visualHeight = -(cHeight/2 / baseVRatio);
            break;
    }
    details.innerHTML = `Starting point coordinates at (${startCoord[0].toFixed(2)},${startCoord[1].toFixed(2)}). Visual Dimension is ${(cWidth/visualWidth).toFixed(2)} unit square`;

    currentPoint = startCoord;
    endPMemo = [startCoord];

    count = 0;
    for(let i of sequence){
        inputs = i.data.in;
        outputs = i.data.out;
        if(inputs.arcAngle){
            i.type = 'curve';
        }else{
            i.type = 'line';

            let endP = [currentPoint[0]+(XsMap[count]*visualWidth), currentPoint[1]+(YsMap[count]*visualHeight)];

            endPMemo.push([...endP,i.type]);

            lineSVG = new creatorNS(`line,,svgPath-${i.id},x1=${currentPoint[0]}|y1=${currentPoint[1]}|x2=${endP[0]}|y2=${endP[1]}|stroke=crimson|stroke-width=3`);

            currentPoint = endP;
            lineSVG.style.zIndex = 10;
            cont.append(lineSVG);

            // console.log(cWidth, XsMax, XsMin);
        }
        count++;
    }

    let outlineSVGString = `M${startCoord[0]} ${startCoord[1]} `;
    for(let i = 1; i < endPMemo.length; i++){
        let Ptype = endPMemo[i][2];
        if(Ptype == "line"){
            outlineSVGString += `L${endPMemo[i][0]} ${endPMemo[i][1]}`;
        }else if(Ptype == "curve"){
            outlineSVGString += `A`;
        }

        if(i != (endPMemo.length-1)){
            outlineSVGString += ` `;i
        }

    }

    enSVG = new creatorNS(`circle,,,cx=${currentPoint[0]}|cy=${currentPoint[1]}|r=3|stroke=white|stroke-width=1|fill=crimson`);
    outlineSVG = new creatorNS(`path,,svgPath-Outline,d=${outlineSVGString}|stroke=white|stroke-width=6|stroke-linejoin=round|fill=none`);
    cont.append(outlineSVG,stSVG,enSVG);

    // Fix for Outlines

    let allLines = d3.selectAll('line');
    allLines.raise();
}



function visualizeMapper(ls, ats){
    let count, currentAngle, cX, cY, f_Angle;

    XsMap = [];
    YsMap = [];
    XcMap = [];
    YcMap = [];
    count = 0;      
    f_Angle = 0;
    for(let i of ats){
        f_Angle += i;
        currentAngle = (90 - f_Angle);
        if(f_Angle >= 360 || f_Angle <= -360){
            f_Angle = f_Angle % 360;
        }
        
        cX = (Math.cos(degToRad(currentAngle)) * ls[count]).toFixed(3);
        cY = (Math.sin(degToRad(currentAngle)) * ls[count]).toFixed(3);

        XsMap.push(parseFloat(cX));
        YsMap.push(parseFloat(cY));
        if(count != 0){
            XcMap.push(XcMap[count-1]+parseFloat(cX));
            YcMap.push(YcMap[count-1]+parseFloat(cY));
        }else{
            XcMap.push(parseFloat(cX));
            YcMap.push(parseFloat(cY));
        }
        
        count++;
    }

}

miniVisual();