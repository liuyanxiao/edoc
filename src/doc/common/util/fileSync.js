/**
 * Created by liuyanxiao on 2016/3/30.
 */
/**
 * @class fileSync �ļ�����ͬ���࣬�Լ��ṩnodeȱʧ��Ŀ¼�ݹ鴴����Ŀ¼copy����
 *
 * */
oojs.define({
    name: 'fileSync',
    namespace: 'doc.common.util',
    deps: {
        fs: require('fs'),
        path: require('path')
    },
    option:{
        //�ļ�����
        encoding : 'utf8',
        //�ݹ���ҵĲ����
        recursion: 10,
        //������,ǩ��Ϊfilter(fileName, filePath), ����fileNameΪ�ļ���, filePathΪ�ļ�·��.
        //���Ը���fileName��filePath�жϵ�ǰ�ļ��Ƿ���Ҫ������.����true���ʾ���˵�ǰ�ļ����ļ���.
        filter: null
    },
    /**
     * ���ָ��Ŀ¼�µ��ļ��Ƿ����
     * @param {String} filePath Ŀ¼��ַ
     * @return {Boolean} true or false
     * */
    existsSync: function(filePath){
        return this.fs.existsSync(filePath);
    },

    /**
     * ��ȡ�ļ�����Ϣ
     * @param {String} filePath Ŀ¼�ļ��ĵ�ַ
     * @return {Object}
     * */
    statSync: function(filePath){
        return this.fs.statSync(filePath);
    },

    /**
     * ��ȡһ���ļ�, Ĭ��Ϊutf8����.
     * @param {string} sourceDirPath ����ȡ���ļ�·��.
     * @param {Object} option ������. Ŀǰ��֧��option.encoding����.Ĭ��Ϊutf8����.
     * @return {string} �ļ�����
     */
    readFileSync: function (sourceDirPath, option) {
        var  encoding = option && option.encoding ? option.encoding : 'utf8'
        return this.fs.readFileSync(sourceDirPath, encoding);
    },

    /**
     * ����Ŀ¼, ���Զ��ݹ鴴��Ŀ���ļ���
     * @param {string} sourceDirPath Դ�ļ���
     * @param {string} toDirPath Ŀ���ļ���
     * @param {function} filter ������,ǩ��Ϊfilter(fileName, filePath), ����fileNameΪ�ļ���, filePathΪ�ļ�·��.
     * ���Ը���fileName��filePath�жϵ�ǰ�ļ��Ƿ���Ҫ������.����false���ʾ���˵�ǰ�ļ����ļ���.
     *
     */
    copyDirectorySync: function (sourceDirPath, toDirPath, filter) {

        sourceDirPath = this.path.resolve(sourceDirPath);
        toDirPath = this.path.resolve(toDirPath);

        var  fileList = this.getFileListSync(sourceDirPath, {filter:filter});
        var  sourcePath = this.path.resolve(sourceDirPath);
        var  toPath = this.path.resolve(toDirPath);


        for (var  i = 0, count = fileList.length; i < count; i++) {
            var  sourceFilePath = fileList[i];
            var  toFilePath = sourceFilePath.replace(sourceDirPath, toDirPath);
            this.copyFileSync(sourceFilePath, toFilePath);
        }

        return this;
    },

    /**
     * �����ļ�, ���Զ��ݹ鴴��Ŀ���ļ���
     * @param {string} sourceFilePath Դ�ļ�
     * @param {string} toFilePath Ŀ���ļ�
     */
    copyFileSync: function (sourceFilePath, toFilePath) {
        var  dirPath = this.path.dirname(toFilePath);
        this.mkdirSync(dirPath);
        this.fs.createReadStream(sourceFilePath).pipe(this.fs.createWriteStream(toFilePath));
        //console.log('copy file finished, source:' + sourceFilePath + ',to:' + toFilePath);
        return this;
    },

    /**
     * �����ļ���, ���Զ��ݹ鴴��Ŀ���ļ���
     * @param {string} filePath Ŀ���ļ���
     * @param {number} mode �������ļ��е�Ȩ��, ����: 0755, Ĭ��Ϊ 0777
     */
    mkdirSync: function (filePath, mode) {
        var  filePath = this.path.resolve(filePath);
        mode = mode || 0777;

        //�Ѿ�����, ����Ҫ����
        if (this.fs.existsSync(filePath)) {
            return this;
        }

        //�жϷָ�����
        var  splitChar = '/';
        if (filePath.indexOf('/') === -1) {
            splitChar = '\\';
        }

        filePathArray = filePath.split(splitChar);

        var  currentDir;
        var  currentPath;
        var  previousPath = '';

        for (var  i = 0, count = filePathArray.length; i < count; i++) {
            //��ȡ��ǰ���ļ���������ɵ�Ŀ¼��ַ
            currentDir = filePathArray[i];

            //�����̷�
            if (i === 0) {
                previousPath = currentDir;
                continue;
            }

            currentPath = previousPath + '/' + currentDir;
            previousPath = currentPath;

            if (!this.fs.existsSync(currentPath)) {
                this.fs.mkdirSync(currentPath, mode);
            }
        }

        return this;
    },

    /**
     * ��ȡһ��Ŀ¼�����е��ļ�
     * @param {string} filePath Ŀ���ļ���
     * @param {Object} option ��������. �μ���ǰ���option����
     */
    getFileListSync: function (filePath, option) {
        var  result = [];
        filePath = filePath || './'; //Ĭ��Ϊ��ǰĿ¼

        //�������Ĭ��ֵ
        option = this.util.merge(option, this.option);

        //�жϵݹ���
        if(option.recursion<1){
            return result;
        }

        //��ȡ���ݵ��ļ�·��
        var  basePath = this.path.resolve(filePath);

        //�ж��ļ����Ƿ����.
        if(!this.fs.existsSync(basePath)){
            return result;
        }

        //��ʼ�����ļ���
        var  basePathFiles = this.fs.readdirSync(basePath);

        for (var  i = 0, count = basePathFiles.length; i < count; i++) {
            var  fileName = basePathFiles[i];
            filePath = this.path.resolve( basePath + '/' + fileName );
            var  fileStat = this.fs.statSync(filePath);

            //�����ļ�
            if (fileStat.isFile()) {
                if (option.filter && option.filter(fileName, filePath)) {
                    continue;
                }
                result.push( filePath );
            }

            //�����ļ���
            if (fileStat.isDirectory()) {
                option.recursion = option.recursion-1;
                result = result.concat(this.getFileListSync(filePath, option));
                option.recursion = option.recursion+1;
            }
        }

        return result;
    },

    /**
     * ��ȡһ��Ŀ¼�����е�Ŀ¼
     * @param {string} filePath Ŀ���ļ���
     * @param {Object} option ��������. �μ���ǰ���option����
     */
    getDirectoryListSync: function (filePath, option) {
        var  result = [];
        filePath = filePath || './'; //Ĭ��Ϊ��ǰĿ¼

        //�������Ĭ��ֵ
        option = this.util.merge(option, this.option);

        //�жϵݹ���
        if(option.recursion<1){
            return result;
        }

        //��ȡ���ݵ��ļ�·��
        var  basePath = this.path.resolve(filePath);

        //�ж��ļ����Ƿ����.
        if(!this.fs.existsSync(basePath)){
            return result;
        }

        //��ʼ�����ļ���
        var  basePathFiles = this.fs.readdirSync(basePath);
        for (var  i = 0, count = basePathFiles.length; i < count; i++) {
            var  fileName = basePathFiles[i];
            var  filePath = this.path.resolve( basePath + '/' + fileName );
            var  fileStat = this.fs.statSync(filePath);

            //�����ļ���
            if (fileStat.isDirectory()) {
                if (option.filter && option.filter(fileName, filePath)) {
                    continue;
                }
                result.push( filePath );
                //��ջ
                option.recursion = option.recursion-1;
                result = result.concat(this.getDirectoryListSync(filePath, option));
                //��ջ
                option.recursion = option.recursion+1;
            }
        }

        return result;
    }
});