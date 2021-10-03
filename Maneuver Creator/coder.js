var output_text;
var man_text;

function coder(){
    let cont = ids.main.tab_code.code_pane;
    output_text = ``;

    // Pin Inputs
    let motNum = 1;
    for(let i of robVal.pins.motor){
        let count = 0;
        for(let j of i){
        
            let type = ``
            switch(count){
                case 0:
                    type = "Pl";
                    break;
                case 1:
                    type = "Nl";
                    break;
                case 2:
                    type = "Pr";
                    break;
                case 3:
                    type = "Nr";
                    break;
                case 4:
                    type = "Sl";
                    break;
                case 5:
                    type = "Sr";
                    break;
            }

            output_text += `int M${motNum}_${type} = ${j};
`;         

            count++;
        }
        motNum++;
    }

    // Core Functions

    output_text += `
void mc_line(speed,time){
`
    motNum = 1;
    for(let i of robVal.pins.motor){
        let count = 0;
        for(let j of i){
            let type = ``;
            switch(count){
                case 0:
                    type = "Pl";
                    break;
                case 1:
                    type = "Nl";
                    break;
                case 2:
                    type = "Pr";
                    break;
                case 3:
                    type = "Nr";
                    break;
                case 4:
                    type = "Sl";
                    break;
                case 5:
                    type = "Sr";
                    break;
            }

            if(count != 4 || count != 5){
                output_text += '    digitalWrite(';
            }else{
                output_text += `    analogWrite(`;
            }

            output_text += `M${motNum}_${type},${count > 3 ? 'speed' : (count == 1 || count == 3) ? '0' : '1'});  
`;

            count++;
        }

        motNum++;
    }

    output_text += `    delay(time);
}

`;

    output_text += `void mc_rotate(time, direction){
    int p = 1;
    int n = 0;
    if(direction == "left"){
        p = 0;
        n = 1;
    }
`;

    motNum = 1;
    for(let i of robVal.pins.motor){
        let count = 0;
        for(let j of i){
            let type = ``;
            switch(count){
                case 0:
                    type = "Pl";
                    break;
                case 1:
                    type = "Nl";
                    break;
                case 2:
                    type = "Pr";
                    break;
                case 3:
                    type = "Nr";
                    break;
                case 4:
                    type = "Sl";
                    break;
                case 5:
                    type = "Sr";
                    break;
            }

            if(count < 4){
                output_text += '    digitalWrite(';
            }else{
                output_text += `    analogWrite(`;
            }

            output_text += `M${motNum}_${type},${count > 3 ? '255' : (count == 1 || count == 2) ? 'n' : 'p'});  
`;

            count++;
        }

        motNum++;
    }

    output_text += `    delay(time);
}

`; 

    output_text += `void mc_curve(speedL, speedR, time){
`

motNum = 1;
for(let i of robVal.pins.motor){
    let count = 0;
    for(let j of i){
        let type = ``;
        switch(count){
            case 0:
                type = "Pl";
                break;
            case 1:
                type = "Nl";
                break;
            case 2:
                type = "Pr";
                break;
            case 3:
                type = "Nr";
                break;
            case 4:
                type = "Sl";
                break;
            case 5:
                type = "Sr";
                break;
        }

        if(count < 4){
            output_text += '    digitalWrite(';
        }else{
            output_text += `    analogWrite(`;
        }

        output_text += `M${motNum}_${type},${count == 4 ? "speedL" : count == 5 ? "speedR" : (count == 0 || count == 2) ? "1" : "0"});  
`;

        count++;
    }

    motNum++;
}

output_text += `    delay(time);
}

`
    // Sequence

    output_text += `void ${robVal.manName}(){
`;
    man_text = `void ${robVal.manName}(){
`;

    for(let i of sequence){
        let data = i.data;
        let type = i.type;

        let rotTime, toAngle, direction, lWheel, rWheel;

        // Calculation Part

        let robCircum = robVal.wheelDist * Math.PI;
        let degPerSecond = (robVal.maxSpeed * 360)/robCircum;

        switch(type){ 
            case "line":
                if(!(data.in.angle == 360 || data.in.angle == 0)){
                    rotTime = data.in.angle / degPerSecond;
                    output_text += `    mc_rotate(${Math.abs(rotTime*1000)},${data.in.inverse ? 'left' : 'right'});
`;
                    man_text += `    mc_rotate(${Math.abs(rotTime*1000)},${data.in.inverse ? 'left' : 'right'});
`;
                }
                output_text += `    mc_line(${data.in.time},${parseFloat(data.out.time) * 1000});
`;
                man_text += `    mc_line(${data.in.time},${parseFloat(data.out.time) * 1000});
`;
                break;
            case "curve":
                let onTangent;

                data.in.arcAngle/2 == data.in.angle ? onTangent = true : onTangent = false;

                if(!onTangent){
                    toAngle = data.in.angle - (data.in.arcAngle/2);
                    toAngle < 0 ? direction = 'left' : 'right';
                    rotTime = Math.abs(toAngle / degPerSecond) * 1000;
                    output_text += `    mc_rotate(${rotTime}, ${direction});    
`;
                    man_text += `    mc_rotate(${rotTime}, ${direction});    
`;
                }

                if(data.in.curveDir == "right"){
                    lWheel = 255;
                    rWheel = 255 * (data.out.wheelRatio);
                }else{
                    rWheel = 255;
                    lWheel = 255 * (data.out.wheelRatio);
                }

                output_text += `    mc_curve(${lWheel},${rWheel},${parseFloat(data.out.time) * 1000});
`;
                man_text += `    mc_curve(${lWheel},${rWheel},${parseFloat(data.out.time) * 1000});
`;
                break;
        }
    }

    output_text += `}

`;
    man_text += `}

`;

    // Arduino Main
    output_text += `void setup(){
    Serial.begin(9600)
`;
        
    motNum = 1;
    for(let i of robVal.pins.motor){
        let count = 0;
        for(let {} of i){
            let type = ``;
            switch(count){
                case 0:
                    type = "Pl";
                    break;
                case 1:
                    type = "Nl";
                    break;
                case 2:
                    type = "Pr";
                    break;
                case 3:
                    type = "Nr";
                    break;
                case 4:
                    type = "Sl";
                    break;
                case 5:
                    type = "Sr";
                    break;
            }
    
            output_text += `    pinMode(`;
    
            output_text += `M${motNum}_${type},OUTPUT);
`;
    
            count++;
        }
    
        motNum++;
    }
        output_text += `
    ${robVal.manName}()    
}
`;
        output_text += `void loop(){

}`;

    cont.innerHTML = output_text;
}

for(let i of ids.main.tab_main.motDriver){
    for(let j of i){
        j.addEventListener('input',function(){
            let motNum = this.parentElement.parentElement.id.split('-')[1];
            switch(motNum){
                case "single":
                    motNum = 1;
                    break;
                case "double":
                    motNum = 2;
                    break;
                case "triple":
                    motNum = 3;
                    break;
            }
            let type = this.placeholder.split('-');
            let base = robVal.pins.motor[motNum-1];
            let location;

            switch(type[0]){
                case "positive":
                    location = type[1] == "left" ? 0 : 2;
                    break;
                case "negative":
                    location = type[1] == "left" ? 1 : 3;
                    break; 
                case "speed":
                    location = type[1] == "left" ? 4 : 5;
                    break;
            }

            base[location] = this.value;
        })
    }
}

ids.main.tab_main.manName.addEventListener('input',function(){
    robVal.manName = this.value.split(' ').join('_').split('-').join('_');
})

ids.main.tab_code.copy_all.addEventListener('click',function(){
    copyToClipboard(output_text);
})

ids.main.tab_code.copy_man.addEventListener('click',function(){
    copyToClipboard(man_text);
})

function copyToClipboard(text) {
    window.prompt("Press Ctrl+C to successfuly copy the chosen text ", text);
}