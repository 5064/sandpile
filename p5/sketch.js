const CANVAS_SIDE = 200;
const COLOR_PALETTE = [
    ["#264653", "#2A9C8F", "#E9C46A", "#F4A261", "#E76F51"], // vivid
    ["#D8E2DC", "#FFE5D9", "#FFCAD4", "#F4ACB7", "#9D8189"], // pastel
    ["#494848", "#636363", "#909090", "#B4B4B4", "#FFFFFF"], // gray gradient
],
    PALETTE_NUM = 1;

initPile = () => {
    return Array(CANVAS_SIDE).fill().map(() => Array(CANVAS_SIDE).fill(0));
}

// prepare 2d Array
let sandpile = initPile();
sandpile[(CANVAS_SIDE / 2) - 1][(CANVAS_SIDE / 2) - 1] = 2 ** 16  // canvas(200,200)の時、丁度使いきる！！

chooseColor = (grain) => {
    switch (grain) {
        case 0:
            return COLOR_PALETTE[PALETTE_NUM][0]
        case 1:
            return COLOR_PALETTE[PALETTE_NUM][1]
        case 2:
            return COLOR_PALETTE[PALETTE_NUM][2]
        case 3:
            return COLOR_PALETTE[PALETTE_NUM][3]
        default:  // grain >= 4
            return COLOR_PALETTE[PALETTE_NUM][4]
    }
}

drawPixel = (x, y, grain) => {
    push()
    stroke(color(chooseColor(grain)));
    point(x, y)
    pop()
}

drawSandpile = () => {
    for (let y = 0; y < CANVAS_SIDE; y++) {
        for (let x = 0; x < CANVAS_SIDE; x++) {
            drawPixel(x, y, sandpile[y][x])
        }
    }
}

topple = () => {
    let nextSandpile = initPile();

    for (let y = 0; y < CANVAS_SIDE; y++) {
        for (let x = 0; x < CANVAS_SIDE; x++) {
            const grain = sandpile[y][x]

            if (grain < 4) {
                nextSandpile[y][x] += grain;
            } else {
                nextSandpile[y][x] += (grain - 4);
                // Toppling exactly
                if (y - 1 >= 0) {
                    nextSandpile[y - 1][x]++  // top
                }
                if (x + 1 < CANVAS_SIDE) {
                    nextSandpile[y][x + 1]++  // right
                }
                if (x - 1 >= 0) {
                    nextSandpile[y][x - 1]++ // left
                }
                if (y + 1 < CANVAS_SIDE) {
                    nextSandpile[y + 1][x]++  // bottom
                }
            }
        }
    }
    sandpile = Array.from(nextSandpile);
}

setup = () => {
    createCanvas(CANVAS_SIDE, CANVAS_SIDE)
}

draw = () => {
    for (let x = 0; x < 1000; x++) {
        topple();
    }
    drawSandpile();
}