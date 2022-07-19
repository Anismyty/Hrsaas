/* 
管理所有自定义指令
*/
export const imagerror = {
  //inserted：会在当前dom插入到节点之后执行
  inserted(dom, options) {
    //如果有src不过为null
    dom.src = dom.src || options.value
    //dom表示当前指令的dom对象
    //options是指令传入变量的解释,value的属性就是传入的值
    //当图片地址出现错误，会触发img标签的【onerror】事件
    dom.onerror = function () {
      dom.src = options.value
    }
  },
  update(dom, options) {
    dom.onerror = function () {
      dom.src = options.value
    }
  }
}
