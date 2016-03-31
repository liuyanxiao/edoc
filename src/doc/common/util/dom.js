/**
 * Created by liuyanxiao on 2016/3/21.
 */
oojs.define({
    name: 'dom',
    namespace: 'doc.common.util',
    deps: {},
    $dom: function () {

    },
    /**
     * #### 从文档中获取指定的DOM元素
     *
     * @example require('util').g(id[, window])
     * @param {string|HTMLElement} id 元素的id或目标元素
     * @param {Window=} win 可选的Window对象
     * @return {HTMLElement|HTMLDocument|null} 获取的元素，查找不到时返回null
     */
    g: function (id, win) {
        if (!id) return null;
        if (this.lang.getType(id) === 'string' && id.length > 0) {
            win = win || window;
            return win.document.getElementById( /**@type {string}*/ (id));
        } else if (id.nodeName && (id.nodeType === 1 || id.nodeType === 9)) {
            return /**@type {HTMLElement|HTMLDocument}*/ (id);
        }
        return null;
    },
    /**
     * #### 获取目标元素所属的document对象
     *
     * @param {HTMLElement|HTMLDocument} element 目标元素或者document对象
     * @return {HTMLDocument} document对象
     */
    getDocument: function(element) {
        // ELEMENT_NODE  : 1
        // DOCUMENT_NODE : 9
        return element['nodeType'] === 9 ? element : element['ownerDocument'] || element['document'];
    },
    /**
     * #### 获取目标元素所在文档的window对象
     *
     * @param {HTMLElement|HTMLDocument} element 目标元素
     * @return {Window|null} window对象
     */
    getWindow: function(element) {
        var doc = this.getDocument(element);

        // 没有考虑版本低于safari2的情况
        // @see goog/dom/dom.js#goog.dom.DomHelper.prototype.getWindow
        return doc.parentWindow || doc.defaultView || null;
    },
});