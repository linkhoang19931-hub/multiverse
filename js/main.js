// ==========================
// PIXI v8 — Main App
// ==========================
async function start() {

    // Create PIXI v8 Application
    const app = new PIXI.Application();
    await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        background: "#000000",
        antialias: true
    });

    document.body.appendChild(app.canvas);

    // Load map (static background)
    const mapTexture = await PIXI.Assets.load("assets/map.jpg");
    const map = new PIXI.Sprite(mapTexture);
    map.eventMode = "static";
    app.stage.addChild(map);

    enableDragging(map);
    enableZoom(map);

    // ==========================
    // LOAD GIF CHARACTER (DANCING)
    // ==========================
    const gifTexture = await PIXI.Assets.load("assets/naruto.gif");  // GIF động
    const naruto = new PIXI.Sprite(gifTexture);

    naruto.x = 600;
    naruto.y = 400;
    naruto.scale.set(0.7);
    naruto.eventMode = "static";

    naruto.on("pointerdown", (e) => {
        const g = e.global;
        showInfo(g.x, g.y, "Naruto GIF", "Animated GIF");
    });

    app.stage.addChild(naruto);
}

start();


// ==========================
// DRAG LOGIC (PIXI v8)
// ==========================
function enableDragging(target) {
    let dragging = false;
    let startGlobal, startX, startY;

    target.on("pointerdown", (event) => {
        dragging = true;
        startGlobal = event.global.clone();
        startX = target.x;
        startY = target.y;
    });

    target.on("pointerup", () => dragging = false);
    target.on("pointerupoutside", () => dragging = false);

    target.on("pointermove", (event) => {
        if (!dragging) return;

        const dx = event.global.x - startGlobal.x;
        const dy = event.global.y - startGlobal.y;

        target.x = startX + dx;
        target.y = startY + dy;
    });
}


// ==========================
// ZOOM
// ==========================
function enableZoom(target) {
    window.addEventListener("wheel", (e) => {
        const factor = e.deltaY < 0 ? 1.1 : 0.9;
        target.scale.set(target.scale.x * factor);
    });
}


// ==========================
// POPUP
// ==========================
function showInfo(x, y, name, series) {
    const box = document.getElementById("infoBox");
    box.style.left = x + "px";
    box.style.top = y + "px";
    box.innerHTML = `<b>${name}</b><br>${series}`;
    box.style.display = "block";

    setTimeout(() => box.style.display = "none", 2000);
}
