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
    // 👉 Bạn CHỈ cần thả file vào folder này → nó tự xuất hiện
    const characterFiles = await fetch("assets/characters/list.json").then(r => r.json());

    for (const file of characterFiles) {
        await addCharacter(app, "assets/characters/" + file);
    }

    // =====================================================
    // 3️⃣ HOẶC BẠN CÓ THỂ ADD NHÂN VẬT THỦ CÔNG
    // =====================================================
    // await addCharacter(app, "assets/meo_1.gif");
}

start();


// =========================================================
// HÀM THÊM NHÂN VẬT VÀO MAP
// =========================================================
async function addCharacter(app, filePath) {
    // Load GIF/PNG
    const texture = await PIXI.Assets.load(filePath);
    const sprite = new PIXI.Sprite(texture);

    // Random vị trí để dễ thấy
    sprite.x = 200 + Math.random() * 800;
    sprite.y = 200 + Math.random() * 600;
    sprite.scale.set(1);

    sprite.eventMode = "static";

    // Khi click vào → hiện popup
    sprite.on("pointerdown", (e) => {
        const g = e.global;
        const name = filePath.split("/").pop(); // lấy tên file
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
        st
