(function () {

    var width, height, largeHeader, canvas, ctx, points, target, animateHeader = true;

    var startState = {
        st: [1, 8, 3,
            2, 0, 4,
            7, 6, 5]
    }, endState = {
        st: [1, 2, 3,
            4, 5, 6,
            7, 8, 0]
        };
    var curState = {
        st: Array.from(startState.st)
    };

    var evaluaters = [{ func: noneEvaluate, name: "不使用估价函数" },
        { func: evaluateByHamming, name: "使用汉明距离作为估价函数" },
    { func: evaluateByManhattan, name: "使用曼哈顿距离作为估价函数" }
    ];

    var curEvaluaterNumber = 0;

    var displayTimer = null;

    var displayAnimationRunning = false;

    var solution;

    // Main
    initHeader();
    initAnimation();
    addListeners();
    randomizeState();

    function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = { x: width / 2, y: height / 2 };


        largeHeader = document.getElementById('large-header');
        largeHeader.style.height = height + 'px';

        canvas = document.getElementById('demo-canvas');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');

        // create points
        points = [];
        for (var x = 0; x < width; x = x + width / 20) {
            for (var y = 0; y < height; y = y + height / 20) {
                var px = x + Math.random() * width / 20;
                var py = y + Math.random() * height / 20;
                var p = { x: px, originX: px, y: py, originY: py };
                points.push(p);
            }
        }

        // for each point find the 5 closest points
        for (var i = 0; i < points.length; i++) {
            var closest = [];
            var p1 = points[i];
            for (var j = 0; j < points.length; j++) {
                var p2 = points[j]
                if (!(p1 == p2)) {
                    var placed = false;
                    for (var k = 0; k < 5; k++) {
                        if (!placed) {
                            if (closest[k] == undefined) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }

                    for (var k = 0; k < 5; k++) {
                        if (!placed) {
                            if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }
                }
            }
            p1.closest = closest;
        }

        // assign a circle to each point
        for (var i in points) {
            var c = new Circle(points[i], 2 + Math.random() * 2, 'rgba(255,255,255,0.3)');
            points[i].circle = c;
        }

    }

    function printSolution() {
        if (!solution.solvable) {
            document.getElementById("solution").innerText = "无解";
        }
        else {
            document.getElementById("solution").innerText = "解步长：" + (solution.path.length - 1) + "\n扩展结点数：" +
                (solution.searchedNode) + "\n未扩展结点数：" + (solution.unsearchedNode);
        }
    }

    function displayStep() {
        if (!solution.solvable || solution.curStep >= solution.path.length - 1) {
            return;
        }
        curState = solution.path[++solution.curStep];
        updateBoard();
    }

    function displaySolution() {
        if (solution.solvable) {
            displayStep();
            displayAnimationRunning = true;
            displayTimer = setInterval(displayStep, 1000);
        }
    }

    function changeEvaluater() {
        curEvaluaterNumber = (curEvaluaterNumber + 1) % evaluaters.length;
        solution = solve(startState, endState, evaluaters[curEvaluaterNumber].func);
        document.getElementById("curEvaluater").innerText = "当前："+evaluaters[curEvaluaterNumber].name;
        document.getElementById("changeEvaluater").innerText = evaluaters[(curEvaluaterNumber + 1) % evaluaters.length].name;
        reset();
        printSolution();
    }

    // Event handling
    function addListeners() {
        if (!('ontouchstart' in window)) {
            window.addEventListener('mousemove', mouseMove);
        }
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);
        document.getElementById("random").
            addEventListener('click', randomizeState, false);
        document.getElementById("display").
            addEventListener('click', displaySolution, false);
        document.getElementById("nextStep").
            addEventListener('click', function () {
                if (!displayAnimationRunning)
                    displayStep();
            }
                , false);
        document.getElementById("changeEvaluater").
            addEventListener('click', changeEvaluater, false);
    }

    function mouseMove(e) {
        var posx = posy = 0;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        target.x = posx;
        target.y = posy;
    }

    function scrollCheck() {
        if (document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        largeHeader.style.height = height + 'px';
        canvas.width = width;
        canvas.height = height;
    }

    function updateBoard() {
        for (let i = 0; i < 9; i++) {
            if (curState.st[i]) {
                let u = document.getElementById("r" + curState.st[i]);
                u.style.gridRow = ~~(i / 3) + 1;
                u.style.gridColumn = i % 3 + 1;
                console.log(u.style.gridRow + " " + u.style.gridColumn)
            }
        }
    }

    function randomizeState() {
        let vis = new Array(9).fill(false);
        for (let i = 0; i < 9; i++) {
            let x;
            do {
                x = Math.floor(Math.random() * 9);
            }
            while (vis[x]);
            vis[x] = true;
            startState.st[i] = x;
        }
        curState.st = Array.from(startState.st);
        updateBoard();
        solution = solve(startState, endState, evaluaters[curEvaluaterNumber].func);
        printSolution();
        if (displayAnimationRunning) {
            clearInterval(displayTimer);
            displayAnimationRunning = false;
        }
    }

    function noneEvaluate(curState, endState) {
        return 0;
    }

    function evaluateByHamming(curState, endState) {
        let cnt = 0;
        for (let i = 0; i < n; i++) {
            if (curState.st[i] && curState.st[i] != endState.st[i]) {
                cnt++;
            }
        }
        return cnt;
    }

    function evaluateByManhattan(curState, endState) {
        let res = 0, c;
        let posx = new Array(9), posy = new Array(9);
        for (let i = 0; i < n; i++) {
            posy[curState.st[i]] = i % 3;
            posx[curState.st[i]] = Math.floor(i / 3)
        }
        for (let i = 0; i < n; i++) {
            if (endState.st[i])
                res += Math.abs(posx[endState.st[i]] - Math.floor(i / 3)) + Math.abs(posy[endState.st[i]] - i % 3)
        }

        return res;
    }


    // animation
    function initAnimation() {
        animate();
        for (let i in points) {
            shiftPoint(points[i]);
        }
    }

    function animate() {
        if (animateHeader) {
            ctx.clearRect(0, 0, width, height);
            for (let i in points) {
                // detect points in range
                if (Math.abs(getDistance(target, points[i])) < 4000) {
                    points[i].active = 0.3;
                    points[i].circle.active = 0.6;
                } else if (Math.abs(getDistance(target, points[i])) < 20000) {
                    points[i].active = 0.1;
                    points[i].circle.active = 0.3;
                } else if (Math.abs(getDistance(target, points[i])) < 40000) {
                    points[i].active = 0.02;
                    points[i].circle.active = 0.1;
                } else {
                    points[i].active = 0;
                    points[i].circle.active = 0;
                }

                drawLines(points[i]);
                points[i].circle.draw();
            }
        }
        requestAnimationFrame(animate);
    }

    function reset() {
        curState.st = Array.from(startState.st);
        if (displayAnimationRunning) {
            displayAnimationRunning = false;
            clearInterval(displayTimer);
        }
        updateBoard();
    }

    function shiftPoint(p) {
        TweenLite.to(p, 1 + 1 * Math.random(), {
            x: p.originX - 50 + Math.random() * 100,
            y: p.originY - 50 + Math.random() * 100, ease: Circ.easeInOut,
            onComplete: function () {
                shiftPoint(p);
            }
        });
    }

    // Canvas manipulation
    function drawLines(p) {
        if (!p.active) return;
        for (let i in p.closest) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.closest[i].x, p.closest[i].y);
            ctx.strokeStyle = 'rgba(156,217,249,' + p.active + ')';
            ctx.stroke();
        }
    }

    function Circle(pos, rad, color) {
        let _this = this;

        // constructor
        (function () {
            _this.pos = pos || null;
            _this.radius = rad || null;
            _this.color = color || null;
        })();

        this.draw = function () {
            if (!_this.active) return;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(156,217,249,' + _this.active + ')';
            ctx.fill();
        };
    }

    // Util
    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }

})();