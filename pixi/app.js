const Application = PIXI.Application,
    Graphics = PIXI.Graphics,
    Container = PIXI.Container;

const CANVAS_X = 250,
    CANVAS_Y = 250;
const COLOR_PALETTE = [
    [0x264653, 0x2A9C8F, 0xE9C46A, 0xF4A261, 0xE76F51], // vivid
    [0xD8E2DC, 0xFFE5D9, 0xFFCAD4, 0xF4ACB7, 0x9D8189], // pastel
    [0x494848, 0x636363, 0x909090, 0xB4B4B4, 0xFFFFFF], // gray gradient
],
    PALETTE_NUM = 0;

const app = new Application({ width: CANVAS_X, height: CANVAS_Y, clearBeforeRender: false, sharedTicker: true, sharedLoader: true });
document.body.appendChild(app.view);

initPile = () => {
    return Array(CANVAS_Y).fill().map(() => Array(CANVAS_X).fill(0));
}

// prepare 2d Array
let sandpile = initPile();
sandpile[(CANVAS_Y / 2) - 1][(CANVAS_X / 2) - 1] = 2 ** 18 // init

color = (grain) => {
    switch (grain) {
        case 0:
            return COLOR_PALETTE[PALETTE_NUM][0]
            break;
        case 1:
            return COLOR_PALETTE[PALETTE_NUM][1]
            break;
        case 2:
            return COLOR_PALETTE[PALETTE_NUM][2]
            break;
        case 3:
            return COLOR_PALETTE[PALETTE_NUM][3]
            break;
        default:  // grain >= 4
            return COLOR_PALETTE[PALETTE_NUM][4]
            break;
    }
}

let container;
const pixel = new Graphics();
drawPixel = (x, y, grain) => {
    pixel.beginFill(color(grain));
    pixel.drawRect(x, y, 1, 1)
    pixel.endFill();
    container.addChild(pixel)
}

drawSandpile = () => {
    container = new Container();
    for (let y = 0; y < CANVAS_Y; y++) {
        for (let x = 0; x < CANVAS_X; x++) {
            drawPixel(x, y, sandpile[y][x])
        }
    }
    app.stage.removeChildren()
    app.stage.addChild(container)
}

topple = () => {
    let nextSandpile = initPile();

    for (let y = 0; y < CANVAS_Y; y++) {
        for (let x = 0; x < CANVAS_X; x++) {
            const grain = sandpile[y][x]

            if (grain < 4) {
                nextSandpile[y][x] += grain;
            } else {
                nextSandpile[y][x] += (grain - 4);
                // Toppling exactly
                if (y - 1 >= 0) {
                    nextSandpile[y - 1][x]++  // top
                }
                if (x + 1 < CANVAS_X) {
                    nextSandpile[y][x + 1]++  // right
                }
                if (x - 1 >= 0) {
                    nextSandpile[y][x - 1]++ // left
                }
                if (y + 1 < CANVAS_Y) {
                    nextSandpile[y + 1][x]++  // bottom
                }
            }
        }
    }
    sandpile = Array.from(nextSandpile);
}

// animation loop
app.ticker.add(_ => {
    drawSandpile();
    for (let x = 0; x < 1000; x++) {
        topple();
    }
});