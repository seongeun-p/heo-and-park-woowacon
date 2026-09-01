// ═══════════════════════════════════════════════════════════
// BuildRedSquares.jsx
// 빨간 배경에 아주 작은 사각형들이 삐뚤빼뚤 랜덤하게 가득 찬 정적 이미지.
// (움직임 없음)
//
// 성능을 위해 사각형은 하나의 Shape 레이어 안에 그린다.
//
// 사용법: File > Scripts > Run Script File... → 이 파일 선택
// ═══════════════════════════════════════════════════════════

(function buildRedSquares() {

    var COMP_W = 1920;
    var COMP_H = 1080;
    var COMP_DURATION = 5;
    var COMP_FPS = 30;

    var SQ = 14;          // 사각형 한 변 (아주 작게)
    var GAP = 6;          // 간격
    var MARGIN = 30;      // 가장자리 여백
    var POS_JITTER = 4;   // 위치 삐뚤 정도(px)
    var ROT_JITTER = 12;  // 각도 삐뚤 정도(도)
    var SIZE_JITTER = 4;  // 크기 편차(px)

    var stage = "시작";

    try {
        app.beginUndoGroup("Build Red Squares");

        // ─── 컴포 + 빨간 배경 ────────────────────────────
        stage = "컴포 생성";
        var comp = app.project.items.addComp("RedSquares", COMP_W, COMP_H, 1, COMP_DURATION, COMP_FPS);
        comp.openInViewer();

        // 빨간 배경 (레퍼런스의 주황빛 빨강)
        comp.layers.addSolid([0.95, 0.20, 0.05], "BG_Red", COMP_W, COMP_H, 1);

        // ─── 사각형들을 담을 하나의 Shape 레이어 ─────────
        stage = "Shape 레이어 생성";
        var shapeLayer = comp.layers.addShape();
        shapeLayer.name = "Squares";
        var root = shapeLayer.property("ADBE Root Vectors Group");

        // ─── 격자 순회하며 사각형 추가 ───────────────────
        stage = "사각형 생성";
        var step = SQ + GAP;
        var cols = Math.floor((COMP_W - MARGIN * 2 + GAP) / step);
        var rows = Math.floor((COMP_H - MARGIN * 2 + GAP) / step);
        var startX = (COMP_W - (cols * step - GAP)) / 2 + SQ / 2;
        var startY = (COMP_H - (rows * step - GAP)) / 2 + SQ / 2;

        // 시드 고정된 의사난수 (스크립트 실행마다 동일 패턴)
        var seed = 12345;
        function rnd() {
            seed = (seed * 1103515245 + 12345) & 0x7fffffff;
            return seed / 0x7fffffff; // 0~1
        }

        var count = 0;
        for (var r = 0; r < rows; r++) {
            for (var cc = 0; cc < cols; cc++) {
                var baseX = startX + cc * step;
                var baseY = startY + r * step;

                // 랜덤 오프셋
                var px = baseX + (rnd() - 0.5) * 2 * POS_JITTER;
                var py = baseY + (rnd() - 0.5) * 2 * POS_JITTER;
                var rot = (rnd() - 0.5) * 2 * ROT_JITTER;
                var size = SQ + (rnd() - 0.5) * 2 * SIZE_JITTER;

                // 하나의 사각형 = Group(사각형 path + fill + transform)
                var g = root.addProperty("ADBE Vector Group");
                g.name = "sq_" + count;
                var gv = g.property("ADBE Vectors Group");

                var rect = gv.addProperty("ADBE Vector Shape - Rect");
                rect.property("ADBE Vector Rect Size").setValue([size, size]);

                var fill = gv.addProperty("ADBE Vector Graphic - Fill");
                fill.property("ADBE Vector Fill Color").setValue([1, 1, 1, 1]); // 흰색

                // 그룹 transform: 위치 + 회전
                var gt = g.property("ADBE Vector Transform Group");
                gt.property("ADBE Vector Position").setValue([px, py]);
                gt.property("ADBE Vector Rotation").setValue(rot);

                count++;
            }
        }

        app.endUndoGroup();
        alert("완료! 사각형 " + count + "개.\n\n빨간 배경에 삐뚤빼뚤한 작은 사각형이 가득 찼습니다.\n(정적, 움직임 없음)\n\n크기/간격/삐뚤 정도는 스크립트 상단 값으로 조절하세요.");

    } catch (err) {
        try { app.endUndoGroup(); } catch (e) {}
        alert("에러!\n단계: " + stage + "\n메시지: " + err.toString() + "\n라인: " + (err.line || "?"));
    }

})();
