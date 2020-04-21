/*
 * @Author: Maoyao Ye
 * @Date: 2020-04-12 11:07:18
 * @LastEditors: Maoyao Ye
 * @LastEditTime: 2020-04-21 23:41:04
 * @FilePath: \Courses\AI\8puzzle\js\heap.js
 * @Description: 
 */

function Heap(baseArray, cmp) {
    this.cmp = typeof cmp !== 'undefined' ? cmp : less;

    this.pop = pop;
    this.push = push;
    this.top = top;
    this.empty = empty;
    this.build = build;
    this.heapify = heapify;
    this.size = size;

    //alert(typeof baseArray);
    if (typeof baseArray === 'object' && typeof baseArray.length === 'number') {
        this.arr = new Array(baseArray.length + 1);
        for (let i = 1; i <= baseArray.length; i++) {
            this.arr[i] = baseArray[i - 1];
        }
        //console.log(this.arr.length);
        this.build();
    }
    else {
        this.arr = new Array(1);
    }

    function less(a, b) {
        return a < b;
    }

    function empty() {
        return this.arr.length === 1;
    }

    function size() {
        return this.arr.length - 1;
    }

    function push(element) {
        let u = this.arr.length++;
        //this.arr[this.arr.length++] = Element;
        while (u>1 && this.cmp(this.arr[u >> 1], element)) {
            this.arr[u] = this.arr[u >> 1];
            u >>= 1;
        }

        this.arr[u] = element;
    }

    function top() {
        return this.arr[1];
    }

    function pop() {
        let ele = this.arr[this.arr.length - 1];
        this.arr.length--;
        if (this.arr.length > 1)
            this.heapify(1, ele);
    }

    function heapify(u, ele) {
        while ((u << 1) < this.arr.length) {
            if ((u << 1 | 1) < this.arr.length) {
                //console.log("u:" + u + " arr[u<<1]:" + this.arr[u << 1]);
                if (this.cmp(ele, this.arr[u << 1])) {
                    if (this.cmp(this.arr[u << 1 | 1], this.arr[u << 1])) {
                        this.arr[u] = this.arr[u << 1];
                        u <<= 1;
                    }
                    else {
                        this.arr[u] = this.arr[u << 1 | 1];
                        u = u << 1 | 1;
                    }
                }
                else if (this.cmp(ele, this.arr[u << 1 | 1])) {
                    this.arr[u] = this.arr[u << 1 | 1];
                    u = u << 1 | 1;
                }
                else {
                    break;
                }
            }
            else if (this.cmp(ele, this.arr[u << 1])) {
                this.arr[u] = this.arr[u << 1];
                u <<= 1;
            }
            else {
                break;
            }
        }
        this.arr[u] = ele;
    }

    function build() {
        //console.log("miao");
        //console.log(this.arr.length);
        for (let i = (this.arr.length) >> 1; i >= 1; i--) {
            this.heapify(i, this.arr[i]);
        }
    }
}