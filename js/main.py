// ===== INIT APP =====
const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    background: "#000"
});
document.body.appendChild(app.view);

// ===== INFO POPUP =====
const infoBox = document.getElementById("infoBox");

// ===== LOAD MAP =====
const mapImage = "https://pixijs.com/assets/bg_scene.jpg";
let map;

(async () => {
    const texture = await PIXI.Assets.load(mapImage);

    map = new PIXI.Sprite(texture);
    map.interactive = true;
    map.x = 0;
    map.y = 0;
    app.stage.addChild(map);

    enableDragging(map);
    enableZoom(map);

    // Load characters after map is ready
    loadCharacters();
})();

// ===== DRAGGING FUNCTION =====
function enableDragging(target) {
    let dragging = false;
    let dragData;
    let startPos;

    target.on("pointerdown", event => {
        dragging = true;
        dragData = event.data;
        startPos = dragData.getLocalPosition(target.parent);
        startPos.mapStartX = target.x;
        startPos.mapStartY = target.y;
    });

    target.on("pointerup", () => dragging = false);
    target.on("pointerupoutside", () => dragging = false);

    target.on("pointermove", () => {
        if (!dragging) return;
        const newPos = dragData.getLocalPosition(target.parent);
        target.x = startPos.mapStartX + (newPos.x - startPos.x);
        target.y = startPos.mapStartY + (newPos.y - startPos.y);
    });
}

// ===== ZOOM FUNCTION =====
function enableZoom(target) {
    window.addEventListener("wheel", e => {
        const direction = e.deltaY < 0 ? 1.1 : 0.9;
        target.scale.set(target.scale.x * direction);
    });
}

// ===== LOAD CHARACTERS =====
async function loadCharacters() {
    const data = await fetch("data/characters.json").then(r => r.json());

    for (const char of data) {
        const texture = await PIXI.Assets.load(char.sprite);
        const sprite = new PIXI.Sprite(texture);

        sprite.x = char.x;
        sprite.y = char.y;
        sprite.scale.set(0.5);
        sprite.interactive = true;
        sprite.charInfo = char;

        sprite.on("pointerdown", evt => {
            const pos = evt.data.global;
            showInfo(pos.x, pos.y, char);
        });

        app.stage.addChild(sprite);
    }
}

function showInfo(x, y, char) {
    infoBox.style.left = x + "px";
    infoBox.style.top = y + "px";
    infoBox.innerHTML = `<b>${char.name}</b><br>${char.series}`;
    infoBox.style.display = "block";

    setTimeout(() => infoBox.style.display = "none", 2500);
}
