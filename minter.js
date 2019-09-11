//var Canvas = require('./node-canvas');
var Canvas = require('canvas');
const { createCanvas, loadImage } = require('canvas')
var fs = require('fs')
var Image = Canvas.Image;

Canvas.registerFont('fonts/Roboto-Bold.ttf', {family: 'Roboto'});

var specs = require('./json/specs.json');

exports.createCard = createCard;


function createCard(card, cb) {

    var imgPath = __dirname + '/img/';
    var canvas = createCanvas(specs.bgSize[0], specs.bgSize[1]); // new Canvas(specs.bgSize[0], specs.bgSize[1]);
    var ctx = canvas.getContext('2d');


    includeImg(ctx, imgPath + 'card/' + card.image + '.png', specs.imagePosition, specs.imageSize);

    var img = new Image;
    img.onload = function() {
        ctx.drawImage(img, 0, 0, specs.bgSize[0], specs.bgSize[1]);

        //var fontsize = specs.titleFontSize;
        ctx.font = 'bold '+specs.titleFontSize+'px Roboto';
        ctx.textAlign="center";
        ctx.fillText(card.name, specs.titlePosition[0], specs.titlePosition[1]);

        ctx.font = 'bold '+specs.typeFontSize+'px Roboto';
        ctx.fillText(card.type, specs.typePosition[0], specs.typePosition[1]);

        // placement of number specs
        ctx.font = 'bold '+specs.typeFontSize+'px Roboto';
        ctx.fillText(card.speed, specs.speedPosition[0], specs.speedPosition[1]);

        ctx.fillStyle = "rgba(3,192,60,1)";
        ctx.font = 'bold '+specs.typeFontSize+'px Roboto';
        ctx.fillText(card.damage, specs.damagePosition[0], specs.damagePosition[1]);

        ctx.font = 'bold '+specs.typeFontSize+'px Roboto';
        ctx.fillStyle = "rgba(255,100,100,1)";
        ctx.fillText(card.hp, specs.hpPosition[0], specs.hpPosition[1]);


        if(card.cost.lumber) {
        ctx.fillStyle = "rgba(131,105,83,1)";
          ctx.font = 'bold '+specs.typeFontSize+'px Roboto';
          ctx.fillText(card.cost.lumber, specs.lumberPosition[0], specs.lumberPosition[1]);
        }
        if(card.cost.metal) {
          ctx.fillStyle = "rgba(207,207,196,1)";
          ctx.font = 'bold '+specs.typeFontSize+'px Roboto';
          ctx.fillText(card.cost.metal, specs.metalPosition[0], specs.metalPosition[1]);
        }
        if(card.cost.food) {
          ctx.fillStyle = "rgba(255,100,100,1)";
          ctx.font = 'bold '+specs.typeFontSize+'px Roboto';
          ctx.fillText(card.cost.food, specs.foodPosition[0], specs.foodPosition[1]);
        }
        if(card.cost.mana) {
          ctx.fillStyle = "rgba(177,156,217,1)";
          ctx.font = 'bold '+specs.typeFontSize+'px Roboto';
          ctx.fillText(card.cost.mana, specs.manaPosition[0], specs.manaPosition[1]);
        }
        if(card.cost.energy) {
          ctx.fillStyle = "rgba(253,253,150,1)";
          ctx.font = 'bold '+specs.typeFontSize+'px Roboto';
          ctx.fillText(card.cost.energy, specs.energyPosition[0], specs.energyPosition[1]);
        }

        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.font = specs.descriptionFontSize+'px Roboto';
        card.description.forEach(function(text, index) {
            ctx.fillText(text, specs.descriptionPosition[0], specs.descriptionPosition[1] + specs.descriptionLineSpacing * index);
        });
    };
    img.src = imgPath + specs.background + '.png';


    saveImg(canvas, '/generated/cards/' + card.name + '.png', cb);
}



var IMG_CACHE =  {}
function includeImg(ctx, path, offset, size, cb) {
    function writeImg(img)  {
        ctx.drawImage(img, offset[0], offset[1], size[0], size[1]);
        if(cb) cb();
    }
    if(IMG_CACHE[path]) {
        writeImg(IMG_CACHE[path]);
    } else  {
        img = new Image;
        img.onload = function() {
            IMG_CACHE[path] = img;
            writeImg(img);
        };
        img.src = path;
    }
}

function includeImgWithCount(ctx, path, offset, size, count, fontsize = 40, cb) {
    countRelativePosition = [0.5, 0.75];

    img = new Image;
    img.onload = function() {
        ctx.font = 'bold '+fontsize+'px Roboto';
        ctx.drawImage(img, offset[0], offset[1], size[0], size[1]);
        ctx.textAlign="center";
        ctx.fillText(count, offset[0] + size[0]*countRelativePosition[0], offset[1] + size[1]*countRelativePosition[1]);
        if(cb) cb();
    };
    img.src = path;
}

function saveImg(canvas, path, cb) {
    canvas.toBuffer(function(err, buf){
        if (err)
            cb(err);
        else
            fs.writeFile(__dirname + path, buf, function(){
                cb("success");
            });
    });
}
