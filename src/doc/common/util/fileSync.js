/**
 * Created by liuyanxiao on 2016/3/30.
 */
/**
 * @class fileSync 文件操作同步类，以及提供node缺失的目录递归创建和目录copy功能
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
        //文件编码
        encoding : 'utf8',
        //递归查找的层次数
        recursion: 10,
        //过滤器,签名为filter(fileName, filePath), 其中fileName为文件名, filePath为文件路径.
        //可以根据fileName和filePath判断当前文件是否需要被过滤.返回true则表示过滤当前文件或文件夹.
        filter: null
    },
    /**
     * 检测指定目录下的文件是否存在
     * @param {String} filePath 目录地址
     * @return {Boolean} true or false
     * */
    existsSync: function(filePath){
        return this.fs.existsSync(filePath);
    },

    /**
     * 获取文件的信息
     * @param {String} filePath 目录文件的地址
     * @return {Object}
     * */
    statSync: function(filePath){
        return this.fs.statSync(filePath);
    },

    /**
     * 读取一个文件, 默认为utf8编码.
     * @param {string} sourceDirPath 待读取的文件路径.
     * @param {Object} option 设置项. 目前仅支持option.encoding参数.默认为utf8编码.
     * @return {string} 文件内容
     */
    readFileSync: function (sourceDirPath, option) {
        var  encoding = option && option.encoding ? option.encoding : 'utf8'
        return this.fs.readFileSync(sourceDirPath, encoding);
    },

    /**
     * 拷贝目录, 会自动递归创建目标文件夹
     * @param {string} sourceDirPath 源文件夹
     * @param {string} toDirPath 目标文件夹
     * @param {function} filter 过滤器,签名为filter(fileName, filePath), 其中fileName为文件名, filePath为文件路径.
     * 可以根据fileName和filePath判断当前文件是否需要被过滤.返回false则表示过滤当前文件或文件夹.
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
     * 拷贝文件, 会自动递归创建目标文件夹
     * @param {string} sourceFilePath 源文件
     * @param {string} toFilePath 目标文件
     */
    copyFileSync: function (sourceFilePath, toFilePath) {
        var  dirPath = this.path.dirname(toFilePath);
        this.mkdirSync(dirPath);
        this.fs.createReadStream(sourceFilePath).pipe(this.fs.createWriteStream(toFilePath));
        //console.log('copy file finished, source:' + sourceFilePath + ',to:' + toFilePath);
        return this;
    },

    /**
     * 创建文件夹, 会自动递归创建目标文件夹
     * @param {string} filePath 目标文件夹
     * @param {number} mode 创建的文件夹的权限, 比如: 0755, 默认为 0777
     */
    mkdirSync: function (filePath, mode) {
        var  filePath = this.path.resolve(filePath);
        mode = mode || 0777;

        //已经存在, 不需要创建
        if (this.fs.existsSync(filePath)) {
            return this;
        }

        //判断分隔符号
        var  splitChar = '/';
        if (filePath.indexOf('/') === -1) {
            splitChar = '\\';
        }

        filePathArray = filePath.split(splitChar);

        var  currentDir;
        var  currentPath;
        var  previousPath = '';

        for (var  i = 0, count = filePathArray.length; i < count; i++) {
            //获取当前的文件夹名和完成的目录地址
            currentDir = filePathArray[i];

            //处理盘符
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
     * 获取一个目录中所有的文件
     * @param {string} filePath 目标文件夹
     * @param {Object} option 参数对象. 参见当前类的option属性
     */
    getFileListSync: function (filePath, option) {
        var  result = [];
        filePath = filePath || './'; //默认为当前目录

        //处理参数默认值
        option = this.util.merge(option, this.option);

        //判断递归层次
        if(option.recursion<1){
            return result;
        }

        //获取传递的文件路径
        var  basePath = this.path.resolve(filePath);

        //判断文件夹是否存在.
        if(!this.fs.existsSync(basePath)){
            return result;
        }

        //开始遍历文件名
        var  basePathFiles = this.fs.readdirSync(basePath);

        for (var  i = 0, count = basePathFiles.length; i < count; i++) {
            var  fileName = basePathFiles[i];
            filePath = this.path.resolve( basePath + '/' + fileName );
            var  fileStat = this.fs.statSync(filePath);

            //处理文件
            if (fileStat.isFile()) {
                if (option.filter && option.filter(fileName, filePath)) {
                    continue;
                }
                result.push( filePath );
            }

            //处理文件夹
            if (fileStat.isDirectory()) {
                option.recursion = option.recursion-1;
                result = result.concat(this.getFileListSync(filePath, option));
                option.recursion = option.recursion+1;
            }
        }

        return result;
    },

    /**
     * 获取一个目录中所有的目录
     * @param {string} filePath 目标文件夹
     * @param {Object} option 参数对象. 参见当前类的option属性
     */
    getDirectoryListSync: function (filePath, option) {
        var  result = [];
        filePath = filePath || './'; //默认为当前目录

        //处理参数默认值
        option = this.util.merge(option, this.option);

        //判断递归层次
        if(option.recursion<1){
            return result;
        }

        //获取传递的文件路径
        var  basePath = this.path.resolve(filePath);

        //判断文件夹是否存在.
        if(!this.fs.existsSync(basePath)){
            return result;
        }

        //开始遍历文件名
        var  basePathFiles = this.fs.readdirSync(basePath);
        for (var  i = 0, count = basePathFiles.length; i < count; i++) {
            var  fileName = basePathFiles[i];
            var  filePath = this.path.resolve( basePath + '/' + fileName );
            var  fileStat = this.fs.statSync(filePath);

            //处理文件夹
            if (fileStat.isDirectory()) {
                if (option.filter && option.filter(fileName, filePath)) {
                    continue;
                }
                result.push( filePath );
                //入栈
                option.recursion = option.recursion-1;
                result = result.concat(this.getDirectoryListSync(filePath, option));
                //出栈
                option.recursion = option.recursion+1;
            }
        }

        return result;
    }
});