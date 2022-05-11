let start = new Date();
let appstart = new Date();
const exportImgNum = 20;
const mutiRenderNum = 10;

const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

let files = [
    'BACKGROUND/brown#12.3.png',
    'FUR/cyan#13.7.png',
    'CLOTHES/leatherArmor#3.png',
    'NOSES/pink#12.125.png',
    'EYES/gray#10.9.png',
    'HAT/leatherCap#11.65.png',
    'ACCESSORY/doubleBridge#8.3625.png',
]

let imgs = [];
let loadCount = 0;
for (let i = 0; i < files.length; i++) {
    const id = i;
    loadImage(`${__dirname}/layers/${files[id]}`).then((image) => {
        imgs[id] = image;
        loadCount++;
        if(loadCount === files.length) {
            onAllLoad();
        }
    })
}

function onAllLoad() {
    console.log('file load : ', new Date() - start);
    render();
}

let nowRenderCount = 0;
let drawCount = 0
function render() {
    if(
        (nowRenderCount < mutiRenderNum) &&
        (drawCount <= exportImgNum)
    ) {
        nowRenderCount++;
        draw(drawCount++);
        setTimeout(render, 0);
    }
}


function draw(id) {
    console.log(`ID : ${id}, render : ${nowRenderCount}`);
    let start = new Date();
    const canvas = createCanvas(2560, 2880);
    const ctx = canvas.getContext('2d');
    for (let i = 0; i < imgs.length; i++) {
        ctx.drawImage(imgs[i], 0, 0);
    }
    canvas.toBuffer((err, buf) => {
        if (err) {
            console.log('onerror ', id);
            return;
        }
        fs.writeFile(`${__dirname}/render/${id}.png`, buf, function() {
            console.log(`done - ${id} - ${parseInt((new Date() - start) / 1000)}sec`);
            --nowRenderCount;
            setTimeout(render, 0);
            if(id >= exportImgNum) {
                onAllDone();
            }
        })
    })
}

function onAllDone() {
    console.log('ALL Done');
    console.log(`${parseInt((new Date() - start) / 1000)}sec`);
}
