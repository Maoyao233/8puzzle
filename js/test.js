/*
 * @Author: Maoyao Ye
 * @Date: 2020-04-12 16:23:57
 * @LastEditors: Maoyao Ye
 * @LastEditTime: 2020-04-21 23:33:05
 * @FilePath: \Courses\AI\8puzzle\js\test.js
 * @Description: 
 */

function run() {
    var startState = {
        st: [1, 8, 3,
            2, 0, 4,
            7, 6, 5]
    };
    var endState = {
        st: [1, 2, 3
            , 4, 5, 6
            , 7, 8, 0]
    };

    let randomlyStart = true;
    if (randomlyStart) {
        var randomState = new Array(9), vis = new Array(9).fill(0);
        for (var i = 0; i < n; i++) {
            var x;
            do {
                x = Math.floor(Math.random() * 9);
            }
            while (vis[x]);
            vis[x] = true;
            randomState[i] = x;
        }
        startState.st = Array.from(randomState);
    }

    for (let i = 0; i < 9; i++) {
        if (startState.st[i]) {
            let u = document.getElementById("r" + startState.st[i]);
            u.style.gridRow = ~~(i / 3) + 1;
            u.style.girdColumn = i % 3 + 1;
            console.log(u.style.gridRow + " " + u.style.gridColumn)
        }
    }
    
    solve(startState, endState, evaluateByManhattan);


    
    
    
    function Move(num, dir) {

        let u = document.getElementById("r" + num);
        if (dir == 'r') {
            u.style.width = "50px";
            u.style.gridColumn = 3;
        }
    }


}

