/*
 * @Author: Maoyao Ye
 * @Date: 2020-04-12 10:39:19
 * @LastEditors: Maoyao Ye
 * @LastEditTime: 2020-04-21 23:39:54
 * @FilePath: \Courses\AI\8puzzle\js\solver.js
 * @Description: 
 */

const n = 9;
const maxStateNum = 362880;

function State(st, g, parent) {
    this.st = Array.from(st);
    this.g = typeof (g) === 'number' ? g : 0;
    this.parent = parent;
}

function cmp(A, B) {
    return A.f > B.f;
}


const fact = [1, 1, 2, 6, 24, 120, 720, 5040, 40320];

function solve(startState, endState, evaluate) {
    const INF = 0x3f3f3f3f;
    let vis = new Array(maxStateNum).fill(false);
    if (typeof startState != 'object' || typeof endState != 'object') {
        alert("Error!");
        return;
    }

    let endStateCode = encode(endState);

    //问题是否有解可以通过逆序对数判定，否则必须要遍历状态空间才能确定无解
    if ((getInversion(startState) ^ getInversion(endState)) & 1) {
        //console.log(getInversion(startState) + " " + getInversion(endState));
        return { solvable: false };
    }
    this.evaluate = typeof evaluate === 'undefined' ? defualtEvaluate : evaluate;

    let open = new Heap(Array(), cmp);

    startState.g = 0;
    startState.parent = null;
    vis[encode(startState)] = true;
    startState.f = this.evaluate(startState, endState);
    open.push(startState);
    let stateCnt = 0;
    while (!open.empty()) {
        let u = open.top();
        open.pop();
        //console.log("g:"+u.g+" f:"+u.f);
        let codeU = encode(u);
        if (codeU == -1) {
            continue;
        }
        stateCnt++;
        const dir = [[1, 0, 3], [-1, 0, -3], [0, 1, 1], [0, -1, -1]];
        //找到空白块的位置
        let pos;
        for (let i = 0; i < n; i++) {
            if (u.st[i] === 0) {
                pos = i;
                break;
            }
        }
        //尝试向四个方向移动
        for (let i = 0; i < 4; i++) {
            x = Math.floor(pos / 3);
            y = pos - x * 3;
            if (x + dir[i][0] >= 0 && x + dir[i][0] < 3 &&
                y + dir[i][1] >= 0 && y + dir[i][1] < 3) {
                let v = new State(u.st, u.g + 1, u);
                v.st[pos] = v.st[pos + dir[i][2]];
                v.st[pos + dir[i][2]] = 0;
                let codeV = encode(v);
                if (!vis[codeV]) {
                    //dis[codeV] = dis[codeU] + 1;
                    vis[codeV] = true;
                    if (codeV == endStateCode) {
                        return { path: getPath(v) ,searchedNode:stateCnt,unsearchedNode:open.size(),solvable:true};
                    }
                    v.f = v.g + this.evaluate(v, endState);
                    open.push(v);
                }
            }
        }
    }
}

//使用曼哈顿距离
function defualtEvaluate(curState, endState) {
    let res = 0;
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


function getInversion(state) {
    let cnt = 0;
    for (let i = 0; i < n - 1; i++) {
        for (let j = i + 1; j < n; j++) {
            if (state.st[j] && state.st[j] < state.st[i]) {
                cnt++;
            }
        }
    }
    return cnt;
}

//康托展开
function encode(state) {
    let code = 0;
    for (let i = 0; i < n - 1; i++) {
        let cnt = 0;
        for (let j = i + 1; j < n; j++) {
            if (state.st[j] < state.st[i]) {
                cnt++;
            }
        }
        code += fact[8 - i] * cnt;
    }
    return code;
}

function getPath(curState) {
    let path = new Array(curState.g + 1);
    while (curState) {
        path[curState.g] = curState;
        curState = curState.parent;
    }

    //test
    for (let i = 0; i < path.length; i++) {
        console.log(path[i].st);
    }

    return path;
}