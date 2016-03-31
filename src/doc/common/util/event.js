/**
 * Created by liuyanxiao on 2016/3/21.
 */
oojs.define({
    name: 'event',
    namespace: 'doc.common.util',
    deps: {

    },
    $event: function () {},
    /*
     * 绑定事件
     *
     * @param {HTMLElement|Window|string} elem 目标元素或目标元素id或者Window对象
     * @param {string} type 事件类型
     * @param {Function} listener 监听函数
     * @return {HTMLElement|Window|null} 目标元素
     */
    bind: function(elem, type, listener) {
        var element = this.dom.isWindow(elem) ? elem : this.dom.g(elem);
        // 因为 g(elem) 原则上有可能返回null，此时便会报错，加一层判断
        if (element) {
            // 事件监听器挂载
            if (element.addEventListener) {
                element.addEventListener(type, listener, false);
            }
            else if (element.attachEvent) {
                element.attachEvent('on' + type, listener);
            }
            else {
                var func = element['on' + type];
                element['on' + type] = function () {
                    func && func.apply(this, arguments);
                    listener.apply(this, arguments);
                };
            }
        }

        return element;
    },
    /*
     * 解除绑定事件
     *
     * @param {HTMLElement|Window|string} elem 目标元素或目标元素id或者Window对象
     * @param {string} type 事件类型
     * @param {Function} listener 监听函数
     * @return {HTMLElement|Window|null} 目标元素
     */
    unBind: function(element, type, listener) {

        if (typeof element == "string") element = this.dom.g(element);
        element = this.off(element, type.replace(/^\s*on/, ""), listener);
        return element;
    },
    off: function(ele, type, handler) {
        var i, list, t = ele._listeners_;
        if (!t) return ele;
        if (typeof type == "undefined") {
            for (i in t) {
                delete t[i];
            }
            return ele;
        }
        type.indexOf("on") && (type = "on" + type);
        if (typeof handler == "undefined") {
            delete t[type];
        } else if (list = t[type]) {
            for (i = list.length - 1; i >= 0; i--) {
                list[i].handler === handler && list.splice(i, 1);
            }
        }
        return ele;
    }
});