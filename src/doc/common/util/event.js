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
     * ���¼�
     *
     * @param {HTMLElement|Window|string} elem Ŀ��Ԫ�ػ�Ŀ��Ԫ��id����Window����
     * @param {string} type �¼�����
     * @param {Function} listener ��������
     * @return {HTMLElement|Window|null} Ŀ��Ԫ��
     */
    bind: function(elem, type, listener) {
        var element = this.dom.isWindow(elem) ? elem : this.dom.g(elem);
        // ��Ϊ g(elem) ԭ�����п��ܷ���null����ʱ��ᱨ����һ���ж�
        if (element) {
            // �¼�����������
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
     * ������¼�
     *
     * @param {HTMLElement|Window|string} elem Ŀ��Ԫ�ػ�Ŀ��Ԫ��id����Window����
     * @param {string} type �¼�����
     * @param {Function} listener ��������
     * @return {HTMLElement|Window|null} Ŀ��Ԫ��
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