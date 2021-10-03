
var sequence = [

]

var ids = {
    mdl: {
        line : {
            alType: document.getElementById('micro-display-1').children,
            rcType: document.getElementById('micro-display-2').children,
            prev: document.getElementById('add_line_pathPrev'),
            al_angle: [document.getElementById('lineAdd-fIG-angle_canvasOrigin'),document.getElementById('lineAdd-fIG-angle'),document.getElementById('random_1')],
            al_length: [document.getElementById('random_2-rangeOrigin'),document.getElementById('random_2')],
            rc_input: [document.getElementById('random_3-rangeOrigin'),document.getElementById('random_3'),document.getElementById('random_4-rangeOrigin'),document.getElementById('random_4')],
            cSpeed: document.getElementsByClassName('addLine_display_currentSpeed')
        },
        curve: {
            alType: document.getElementById('micro-display-3').children,
            rcType: document.getElementById('micro-display-4').children,
            prev: document.getElementById('add_curve_pathPrev'),
            al_angle: [document.getElementById('curveAdd-fIG-angle_canvasOrigin'),document.getElementById('curveAdd-fIG-angle'),document.getElementById('random_5')],
            al_length: [document.getElementById('random_6-rangeOrigin'),document.getElementById('random_6')],
            rc_input: [document.getElementById('random_7-rangeOrigin'),document.getElementById('random_7'),document.getElementById('random_4-rangeOrigin'),document.getElementById('random_8')],
            cSpeed: document.getElementsByClassName('addCurve_display_currentSpeed')
        }
    },
    main: {
        tab_main: {
            motDriver: [document.getElementById('t1_mot-single').querySelectorAll('input'),document.getElementById('t1_mot-double').querySelectorAll('input'),document.getElementById('t1_mot-triple').querySelectorAll('input')],
            motTitles: [document.getElementById('t1_mot-single').querySelectorAll('div.p-1'),document.getElementById('t1_mot-double').querySelectorAll('div.p-1'),document.getElementById('t1_mot-triple').querySelectorAll('div.p-1')],
            manName : document.getElementById('maneuver_name_input')
        },
        tab_code: {
            code_pane: document.querySelector('#tab-c pre'),
            copy_all: document.getElementById('tab-4-btn-copyAll'),
            copy_man: document.getElementById('tab-4-btn-copyMOnly')
        },
        tab_sequence: {
            miniVisual : document.getElementById('t2-miniVisual').children[0],
            manParagraph : document.getElementById('t2-miniVisual').querySelector('p')
        }
    }
} 

// Small Features

function Mover( target,array = target.parentElement, change){
    // console.log(target, array);

    if(array.childElementCount < 2){
        return;
    }
    if(!change){
        return;
    }
    let index = $(target).index();
    // console.log(index);
    let finalIndex = index + change;
    if(finalIndex < 0){
        finalIndex = 0;
    }else if(finalIndex > (array.childElementCount - 1)){
        finalIndex = array.childElementCount - 1;
    }

    // console.log(finalIndex,array.children[finalIndex]);
    // console.log(finalIndex, index, change);

    if(isElement(target)){
        if(finalIndex > index){
            $(target).insertAfter(array.children[finalIndex]);
        }else{
            $(target).insertBefore(array.children[finalIndex]);
        }
        // console.log("It's an element!");
    }else{
        return array_move(array, index, finalIndex);
    }
}