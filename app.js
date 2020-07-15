const Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Graphics = PIXI.Graphics;

const CANVAS_X = 50,
    CANVAS_Y = 50;
const COLOR_PALETTE = [
    [0x264653, 0x2A9C8F, 0xE9C46A, 0xF4A261, 0xE76F51], // vivid
    [0xD8E2DC, 0xFFE5D9, 0xFFCAD4, 0xF4ACB7, 0x9D8189], // pastel
    [0x494848, 0x636363, 0x909090, 0xB4B4B4, 0xD4D4D4], // gray gradiant
],
    PALETTE_NUM = 1;

const app = new Application({ width: CANVAS_X, height: CANVAS_Y });
document.body.appendChild(app.view);

// prepare 2d Array
let sandpile = Array(CANVAS_Y).fill().map(() => Array(CANVAS_X).fill(0));
let nextSandpile = Array.from(sandpile);
// init
sandpile[(CANVAS_Y / 2) - 1][(CANVAS_X / 2) - 1] = 2 ** 16

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

const container = new PIXI.Container();
app.stage.addChild(container)
const pixel = new Graphics();
drawPixel = (x, y, grain) => {
    pixel.beginFill(color(grain));
    pixel.drawRect(x, y, 1, 1)
    pixel.endFill();
    container.addChild(pixel);
}

drawSandpile = () => {
    for (x = 0; x < CANVAS_X; x++) {
        for (y = 0; y < CANVAS_Y; y++) {
            drawPixel(x, y, sandpile[x][y])
        }
    }
}

topple = () => {
    for (x = 0; x < CANVAS_X; x++) {
        for (y = 0; y < CANVAS_Y; y++) {
            const grain = sandpile[x][y]

            if (grain < 4) {
                nextSandpile[x][y] = grain;
            }
        }
    }

    for (x = 0; x < CANVAS_X; x++) {
        for (y = 0; y < CANVAS_Y; y++) {
            const grain = sandpile[x][y]

            if (grain >= 4) {
                nextSandpile[x][y] += (grain - 4)
                // Toppling exactly
                if (y - 1 >= 0) {
                    nextSandpile[x][y - 1] += 1  // top
                }
                if (x + 1 < CANVAS_X) {
                    nextSandpile[x + 1][y] += 1  // right
                }
                if (x - 1 >= 0) {
                    nextSandpile[x - 1][y] += 1  // left
                }
                if (y + 1 < CANVAS_Y) {
                    nextSandpile[x][y + 1] += 1  // bottom
                }
            }
        }
    }
}

step = () => {
    topple();
    sandpile = Array.from(nextSandpile);
    drawSandpile();
}


// animation loop
app.ticker.add(_ => {
    step();
});