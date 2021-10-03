

// App Exclusive Functions
function numToLetter(num){
    var s = '', t;
  
    while (num > 0) {
    var  t = (num - 1) % 26;
    var  s = String.fromCharCode(65 + t) + s;
    var  num = (num - t)/26 | 0;
    }
    return s || undefined;
}

function env_change(ind){
    let tabs = document.getElementsByClassName('env-Tab');
    for(let i of tabs){
        i.style.display = 'none';
    }
    tabs[ind].style.display = 'flex';
}

function mot_change(ind){
    let tabs = document.getElementsByClassName('mot-Tab');
    for(let i of tabs){
        i.style.maxHeight = '0';
        i.style.borderWidth = '0';
    }
    for(let i = 0; i <= ind; i++){
        tabs[i].style.maxHeight = '100px';
        tabs[i].style.borderWidth = 'thin';
    }
}

function tabOrganizer(index){
    for(let i of front.nav.buttons){
        i.classList.remove('selected');
    }
    front.nav.buttons[index].classList.add('selected');
    let tabs = document.querySelectorAll('.tab');
    revealer(tabs[parseFloat(index)],'show','tab','grid');

    front.currentTab = index;
}

// Tab Operations 

function tabOperations_1(){
    // The Main Inputs Tab

    let [height, width, mSpeed, wDist] = [robVal.dimY , robVal.dimX, robVal.maxSpeed, robVal.wheelDist];

    if(wDist > width){
        alert(`Wheel Distance should be less than the width. Wheel Distance Value will change from ${wDist} to ${width-1}`);
        wDist = width - 1;
        document.querySelector('#t1-robWhdiam input').value = width - 1;
        robVal.wheelDist = width - 1;
    }

    let dimLineWidth = document.getElementById('t1-dispRob').clientWidth * 0.965;
    let dimLineHeight = document.getElementById('t1-dispRob').clientHeight * 0.895;

    $('#dimLineY > div > div').css('width',`${dimLineWidth}px`);
    $('#dimLineX > div > div').css('height',`${dimLineHeight}px`);
    $('#dimLineWheel > div > div').css('height',`${dimLineHeight * 1.076}px`);

    let [robMod, dimY, dimX, dimWheel, robModel] = [document.getElementById('dimVisual'), document.querySelectorAll('#dimLineY > div') , document.querySelectorAll('#dimLineX > div') , document.querySelectorAll('#dimLineWheel > div'), document.querySelector('#dimVisual > div')];

    let [baseHeight, baseWidth] = [robMod.clientHeight , robMod.clientWidth];
    let baseFull = Math.min(baseHeight,baseWidth);
    let ratio = 0;
    // console.log(baseHeight, baseWidth, baseFull, robMod);
    
    dimY[1].innerHTML  = height.toFixed();
    dimX[1].innerHTML = width.toFixed();
    dimWheel[1].innerHTML = comafy(wDist,',',1);

    [dimY[1], dimX[1], dimWheel[1]].forEach(el => {
        el.classList.add('font-smaller');
    })

    let dimXWidth = (45 * (baseFull / baseWidth));
    let dimYHeight = (45 * (baseFull / baseHeight));

    if(height > width){
        ratio = width / height;
        dimXWidth *= ratio;
    }else if(height < width){
        ratio = height / width;
        dimYHeight *= ratio;
    }else if(height == width){
        ratio = 1;
    }

    let dimXWheel = dimXWidth * (wDist/width);

    dimY[0].style.height = dimYHeight + '%';
    dimY[2].style.height = dimYHeight + '%';
    dimX[0].style.width = dimXWidth + '%' ;
    dimX[2].style.width = dimXWidth + '%' ;
    dimWheel[0].style.width = dimXWheel + '%';
    dimWheel[2].style.width = dimXWheel + '%';

    robModel.style.width = (dimXWidth * 2) + 8 + '%';
    robModel.style.height = (dimYHeight * 2) + 8 + '%';
    // console.log((dimWheel[2].clientWidth * 2) + dimWheel[1].clientWidth);
    robModel.children[0].style.width = (((dimXWheel * 2) + 10)/100) * baseWidth + 'px';

    $(global.display.maxSpeed).html(`: ${robVal.maxSpeed} `);
}

function tabOperations_2(){
    // Just an empty function ( For compatibility )
}


// Core Functions - Part Sequence

function addAction(type){
    type = parseInt(type);
    switch(type){
        case 0:
            addLine();
            break;
        case 1:
            addCurve();
            break;
        case 2:
            addWave();
            break;
        case 3:
            addSoft();
    }
}

function addLine(){
    // Prepares all the elements needed
    let container = new creator('div,,,,type=line'); // Exclusive Part
    let imgCont = new creator('div,act_Image');
    let img = new creator('img');
    img.setAttribute('src','assets/Pictures/Line.png');
    let title = new creator('div,act_Title');
    title.innerHTML = 'Line'; // Exclusive Part
    let edtBtn = new creator('button,seq_editBtn');
    edtBtn.innerHTML = 'Edit';
    let chkBox = new creator('input,act_checkBox,,type=checkbox');
    let detailsTab = new creator('div,detailsTab'); // Exclusive Part
    // Arrangements of Elements 
    imgCont.append(img);
    container.append(imgCont,title,edtBtn,chkBox,detailsTab);
    $('#seqCont').append(container);
    // Element event listeners
    container.onclick = function(e){
        e.stopPropagation();
        let chkBox = this.querySelector('input[type=checkbox].act_checkBox');
        if(chkBox.checked == false){
            chkBox.checked = true;
            this.classList.add('selectedAction');
        }else{
            chkBox.checked = false;
            this.classList.remove('selectedAction');
        }
        tManager_visual();
    }
    chkBox.onclick = function(e){
        e.stopPropagation();
        if(this.checked == false){
            this.parentElement.classList.remove('selectedAction');
        }else{
            this.parentElement.classList.add('selectedAction');
        }
        tManager_visual();
    }
    edtBtn.onclick = function(e){
        e.stopPropagation();
        editModal(this.parentElement);
    }
    editModal(container);
}

function addCurve(){
    // Prepares all the elements needed
    let container = new creator('div,,,,type=curve'); // Exclusive Part
    let imgCont = new creator('div,act_Image');
    let img = new creator('img');
    img.setAttribute('src','assets/Pictures/Curve.png');
    let title = new creator('div,act_Title');
    title.innerHTML = 'Curve'; // Exclusive Part
    let edtBtn = new creator('button,seq_editBtn');
    edtBtn.innerHTML = 'Edit';
    let chkBox = new creator('input,act_checkBox,,type=checkbox');
    let detailsTab = new creator('div,detailsTab'); // Exclusive Part
    // Arrangements of Elements 
    imgCont.append(img);
    container.append(imgCont,title,edtBtn,chkBox,detailsTab);
    $('#seqCont').append(container);
    // Element event listeners
    container.onclick = function(e){
        e.stopPropagation();
        let chkBox = this.querySelector('input[type=checkbox].act_checkBox');
        if(chkBox.checked == false){
            chkBox.checked = true;
            this.classList.add('selectedAction');
        }else{
            chkBox.checked = false;
            this.classList.remove('selectedAction');
        }
        tManager_visual();
    }
    chkBox.onclick = function(e){
        e.stopPropagation();
        if(this.checked == false){
            this.parentElement.classList.remove('selectedAction');
        }else{
            this.parentElement.classList.add('selectedAction');
        }
        tManager_visual();
    }
    edtBtn.onclick = function(e){
        e.stopPropagation();
        editModal(this.parentElement);
    }
    editModal(container);
}

function saveSeq(type){
    let angle, length, x, y, distance, time, speed, data, arcAngle, container, details, exData, count;

    switch(type){
        case 'line':
            data = modalValues.addLine;
            container = document.querySelector(`div[data-seq-id=${currentSeqEdit}]`);
            details = container.querySelector('div > .detailsTab');

            angle = new creator('div,colspan-2 border px-1 text-middle space-between');
            length = new creator('div,colspan-2 border px-1 text-middle space-between');
            x = new creator('div,colspan-2-4 border px-1 text-middle space-between');
            y = new creator('div,colspan-2-4 border px-1 text-middle space-between');
            time = new creator('div,colspan-2-4 border px-1 text-middle space-between');
            speed = new creator('div,colspan-2 border px-1 text-middle space-between');

            if(data.in.epType == "Angle and Length"){
                angle.classList.add(...'bg-white text-333'.split(' '));
                length.classList.add(...'bg-white text-333'.split(' '));
            }else{
                x.classList.add(...'bg-white text-333'.split(' '));
                y.classList.add(...'bg-white text-333'.split(' '));
            }

            angle.innerHTML = `<span>Angle:</span><span> ${data.in.angle}°<span>`;
            length.innerHTML = `<span> Length: </span><span>${data.in.length} units</span>`;
            x.innerHTML = `<span> X:</span><span> ${data.in.x} units</span>`
            y.innerHTML = `<span> Y: </span><span>${data.in.y} units</span>`
            time.innerHTML = `<span> Time: </span><span>${data.out.time}s</span>`;
            speed.innerHTML = `<span> Speed:</span><span> ${data.out.speed} units/s</span>`;

            details.innerHTML = '';
            details.append(angle,x,length,y,speed,time);

            container.dataset.seqData = JSON.stringify(data);
            container.dataset.seqType = "line";
            
            exData = {
                id : currentSeqEdit,
                data: data,
                type: "line"
            }

            let stringedData = JSON.stringify(exData);

            count = 0;
            if(sequence.length == 0){
                sequence.push(JSON.parse(stringedData));
            }else{
                for(let i of sequence){
                    let seq = sequence.map(function(seq){ return seq.id;});
                    if(i.id == currentSeqEdit){
                        let idIndex = seq.indexOf(currentSeqEdit);
                        // console.log(idIndex, currentSeqEdit);
                        sequence[idIndex].data = JSON.parse(container.dataset.seqData);
                        // console.log('Ok I found One');

                        break;
                    }else if(count == sequence.length-1){
                        sequence.push(JSON.parse(stringedData));
                        // console.log('Oops, Nothing was found');
                        break;
                    }
                    count++;
                }
            }
            break;
        case 'curve':
            data = modalValues.addCurve;
            container = document.querySelector(`div[data-seq-id=${currentSeqEdit}]`);
            details = container.querySelector('div > .detailsTab');

            angle = new creator('div,colspan-2 border px-1 text-middle space-between');
            length = new creator('div,colspan-2 border px-1 text-middle space-between');
            x = new creator('div,colspan-2-4 border px-1 text-middle space-between');
            y = new creator('div,colspan-2-4 border px-1 text-middle space-between');
            time = new creator('div,border px-1 text-middle space-between');
            speed = new creator('div,border px-1 text-middle space-between');
            arcAngle = new creator('div,border px-1 text-middle space-between');

            speed.style.gridColumn = '1 / 3';
            time.style.gridColumn = '3 / 5';
            arcAngle.style.gridColumn = '5 / 7';

            if(data.in.epType == "Angle and Length"){
                angle.classList.add(...'bg-white text-333'.split(' '));
                length.classList.add(...'bg-white text-333'.split(' '));
            }else{
                x.classList.add(...'bg-white text-333'.split(' '));
                y.classList.add(...'bg-white text-333'.split(' '));
            }

            // Exlusive Part - Calculation
            distance = parseFloat(data.in.length)/parseFloat(data.out.distance);
            distance *= 2*(data.in.arcAngle/360)*Math.PI;
            
            data.out.wheelRatio = Math.abs(((data.in.length/2) - (robVal.wheelDist/2))  / ((data.in.length/2) + (robVal.wheelDist/2)));
            
            actualSpeed = ((data.out.wheelRatio+1)/2) * data.in.time * robVal.maxSpeed;

            data.out.speed = actualSpeed;
            data.out.time = (distance/actualSpeed).toFixed(2);

            data.out.displacement = data.in.length;
            data.out.distance = distance;


            angle.innerHTML = `<span>Angle:</span><span> ${data.in.angle}°<span>`;
            length.innerHTML = `<span> Length: </span><span>${data.in.length}units</span><span> Distance: </span><span> ${distance.toFixed(1)}units </span>`;
            x.innerHTML = `<span> X:</span><span> ${data.in.x}units</span>`
            y.innerHTML = `<span> Y: </span><span>${data.in.y}units</span>`
            time.innerHTML = `<span> Time: </span><span>${data.out.time}s</span>`;
            speed.innerHTML = `<span> Speed: </span><span> ${data.out.speed.toFixed(1)} unit/s </span>`
            arcAngle.innerHTML = `<span> Arc Angle:</span><span> ${data.in.arcAngle}°</span>`;

            details.innerHTML = '';
            details.append(angle,x,length,y,speed,time,arcAngle);

            container.dataset.seqData = JSON.stringify(data);
            container.dataset.seqType = "curve";
            
            exData = {
                id : currentSeqEdit,
                data: data,
                type: 'curve'
            }

            count = 0;
            if(sequence.length == 0){
                sequence.push(exData);
            }else{
                for(let i of sequence){
                    let seq = sequence.map(function(seq){ return seq.id;});
                    if(i.id == currentSeqEdit){
                        let idIndex = seq.indexOf(currentSeqEdit);
                        // console.log(idIndex, currentSeqEdit);
                        sequence[idIndex].data = data;
                        // console.log('Ok I found One');

                        break;
                    }else if(count == sequence.length-1){
                        sequence.push(exData);
                        // console.log('Oops, Nothing was found');
                        break;
                    }
                    count++;
                }
            }
            break;
        case 'wave':
            break;
        case 'turn':
            break;
    }

    miniVisual();
}

function tManager_visual(param){
    let cont = document.getElementById('seqCont');
    
    let selected = cont.querySelectorAll('.selectedAction');
    let toolCont = document.getElementById('t2-toolCont');
    if(selected.length == 0){
        for(let i = 1; i < 7; i++){
            toolCont.children[i].classList.add('t2-muted');
        }
        return;
    }

    for(let i = 1; i < 7; i++){
        toolCont.children[i].classList.remove('t2-muted');
    }

    if(!param){
        return;
    }

    // console.log(param);
    switch(param){
        case "Move Up":
            for(let i of selected){
                Mover(i, i.parentElement, -1);
            }
            break;
        case "Move Down":
            for(let i = selected.length-1; i >= 0; i--){
                Mover(selected[i], selected[i].parentElement, 1);
            }
            break;
        case "Move Up++":
            for(let i of selected){
                Mover(i, i.parentElement, -5);
            }
            break;
        case "Move Down++":
            for(let i = selected.length-1; i >= 0; i--){
                Mover(selected[i], selected[i].parentElement, 5);
            }
            break;
        case "Paste":
            let asdf = [];
            for(let i of selected){

                let temp = i.cloneNode(true);
                temp.onclick = function(e){
                    
                 e.stopPropagation();
                 let chkBox = this.querySelector('input[type=checkbox].act_checkBox');
                 if(chkBox.checked == false){
                    chkBox.checked = true;
                    this.classList.add('selectedAction');
                 }else{
                    chkBox.checked = false;
                    this.classList.remove('selectedAction');
                }
                tManager_visual();

                };

                let chkBox = temp.querySelector('input[type="checkbox"]');

                chkBox.onclick = function(e){
                    e.stopPropagation();
                    if(this.checked == false){
                        this.parentElement.classList.remove('selectedAction');
                    }else{
                        this.parentElement.classList.add('selectedAction');
                    }
                    tManager_visual();
                }
                let edtBtn = temp.querySelector('button.seq_editBtn');

                edtBtn.onclick = function(e){
                    e.stopPropagation();
                    editModal(this.parentElement);
                }

                currentSeqEdit = numToLetter(seqRand);
                temp.dataset.seqId = currentSeqEdit;
                seqRand++;

                asdf.push(temp);
            }
            document.getElementById('seqCont').append(...asdf);
            break;
        case "Delete":
            for(let i of selected){
                i.remove();
            }
    }
    

    let sequenceDOM = document.getElementById('seqCont').children;
    sequence = [];
    for(let i of sequenceDOM){
        let DomData = {
            id : i.dataset.seqId,
            data : JSON.parse(i.dataset.seqData),
            type : i.dataset.seqType
        };
        sequence.push(DomData);
    }

    miniVisual();
}

// Core Functions - Modals Part

front.modals.container.addEventListener('click',function(e){
    e.stopPropagation();
    this.style.display = 'none';
    // cancelAdd();
})
for(let i = 0; i < front.modals.modals.length ; i++){
    front.modals.modals[i].onclick = function(e){
        e.stopPropagation();
    }
}
// Plugin Supports

var rangeTemplate = {
    min: 0,
    max: 10,
    grid: true,
    from: 0,
    step: .5,
    hide_min_max: true
};

for(let i of document.querySelectorAll('input[type=range].range-type1')){
    rangeTemplate.id = i.id;
    if(i.dataset.oninput){
        rangeTemplate.oninputData = i.dataset.oninput;
    }else{
        rangeTemplate.oninputData = false;
    }
    if(i.dataset.temp){
        rangeTemplate.temp = i.dataset.temp;
    }
    rangeTemplate.output = i.id.split('-')[0];
    rangeTemplate.onChange = function(val){
        let target = document.getElementById(this.output);
        rangeToOutput(target,val.from);
        if(this.oninputData){
            eval(this.oninputData);
        }
        if(this.temp){
            eval(this.temp);
        }
    };
    document.getElementById(rangeTemplate.output).oninput = function(){
        let range = document.getElementById(`${this.id}-rangeOrigin`);
        let passed = this.value;
        if(passed > rangeTemplate.max){
            passed = rangeTemplate.max;
        }
        $(range).data('ionRangeSlider').update({
            from: passed
        })
        if(this.dataset.temp){
            eval(this.dataset.temp);
        }
    }
    $(i).ionRangeSlider(rangeTemplate);
}

// StartUp Functions 


tabOperations_1();

tabOrganizer(1);
env_change(0);
mot_change(0);

// ModalRevelear('modal_addCurve');
thisDimensionthisDimension();