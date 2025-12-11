// =========================================================
// PIXI v8 — MAIN APPLICATION
// =========================================================
async function start() {

    // Create PIXI application
    const app = new PIXI.Application();
    await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        background: "#000000",
        antialias: true
    });

    document.body.appendChild(app.canvas);

    // =====================================================
    // 1️⃣ LOAD MAP BACKGROUND
    // =====================================================
    const mapTexture = await PIXI.Assets.load("assets/map.jpg");
    const map = new PIXI.Sprite(mapTexture);

    map.eventMode = "static";
    app.stage.addChild(map);

    enableDragging(map);
    enableZoom(map);

    // =====================================================
    // 2️⃣ LOAD CHARACTERS FROM /assets/characters/
    // =====================================================
    // 👉 Tự động load danh sách từ list.json
    const characterFiles = await fetch("assets/characters/list.json").then(r => r.json());

    for (const file of characterFiles) {
        await addCharacter(app, "assets/characters/" + file);
    }

    // =====================================================
    // 3️⃣ HOẶC THÊM THỦ CÔNG (ví dụ 1 GIF mèo)
    // =====================================================
    // await addCharacter(app, "assets/meo_1.gif");
}

start();


// =========================================================
// ADD CHARACTER (GIF / PNG / JPG)
// =========================================================
async function addCharacter(app, filePath) {
    const texture = await PIXI.Assets.load(filePath);
    const sprite = new PIXI.Sprite(texture);

    // Random vị trí
    sprite.x = 200 + Math.random() * 800;
    sprite.y = 200 + Math.random() * 600;
    sprite.scale.set(1);

    sprite.eventMode = "static";

    sprite.on("pointerdown", (e) => {
        const g = e.global;
        const name = filePath.split("/").pop();
        showInfo(g.x, g.y, name, "GIF/PNG Character");
    });

    app.stage.addChild(sprite);
}


// =========================================================
// DRAG MAP
// =========================================================
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


// =========================================================
// ZOOM MAP
// =========================================================
function enableZoom(target) {
    window.addEventListener("wheel", (e) => {
        const factor = e.deltaY < 0 ? 1.1 : 0.9;
        target.scale.set(target.scale.x * factor);
    });
}


// =========================================================
// POPUP INFO
// =========================================================
function showInfo(x, y, name, series) {
    const box = document.getElementById("infoBox");
    box.style.left = x + "px";
    box.style.top = y + "px";
    box.innerHTML = `<b>${name}</b><br>${series}`;
    box.style.display = "block";

    setTimeout(() => box.style.display = "none", 2000);
}
