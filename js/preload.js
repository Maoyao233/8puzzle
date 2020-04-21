/*
 * @Author: Maoyao Ye
 * @Date: 2020-04-20 22:08:52
 * @LastEditors: Maoyao Ye
 * @LastEditTime: 2020-04-21 21:31:01
 * @FilePath: \Courses\AI\8puzzle\js\preload.js
 * @Description: 
 */
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
    }

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type]);
    }
})