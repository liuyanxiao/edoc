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
     * #### ���ĵ��л�ȡָ����DOMԪ��
     *
     * @example require('util').g(id[, window])
     * @param {string|HTMLElement} id Ԫ�ص�id��Ŀ��Ԫ��
     * @param {Window=} win ��ѡ��Window����
     * @return {HTMLElement|HTMLDocument|null} ��ȡ��Ԫ�أ����Ҳ���ʱ����null
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
     * #### ��ȡĿ��Ԫ��������document����
     *
     * @param {HTMLElement|HTMLDocument} element Ŀ��Ԫ�ػ���document����
     * @return {HTMLDocument} document����
     */
    getDocument: function(element) {
        // ELEMENT_NODE  : 1
        // DOCUMENT_NODE : 9
        return element['nodeType'] === 9 ? element : element['ownerDocument'] || element['document'];
    },
    /**
     * #### ��ȡĿ��Ԫ�������ĵ���window����
     *
     * @param {HTMLElement|HTMLDocument} element Ŀ��Ԫ��
     * @return {Window|null} window����
     */
    getWindow: function(element) {
        var doc = this.getDocument(element);

        // û�п��ǰ汾����safari2�����
        // @see goog/dom/dom.js#goog.dom.DomHelper.prototype.getWindow
        return doc.parentWindow || doc.defaultView || null;
    },
});