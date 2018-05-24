function bindSingleUpload(opts) {
    var def = {
        maxFileSize: "100mb", //最大文件大小
        btnId: "",           //上传控件ID
        chunkSize: null,   //分块上传大小
        container: "",       //容器
        maxWidth: 2000,       //压缩最大宽度
        maxHeight: 100000,      //压缩最大高度
        Quality: 100,        //质量     
        extensions: "png,jpg,jpeg,gif,bmp",
        callbackFunc: null,  //上传成功回调函数
        chunkFunc: null,  //分块上传进度回调函数
        errorFunc: null, //错误回调函数 
        startFunc: null,  //开始上传回调函数
        flash_swf_url: "/page/js/plugins/plupload/Moxie.swf",//Flash地址
        runtimes: "html5,flash,html4",//支持上传模式
        url: "/file/upload",//保存地址
        dir: "file", //上传文件夹分类 ******必填项--保存所在文件夹*******
        multipart_params: {'titlec': '', 'comment': ''}, //设置你的参数
        crop: false,
        isPic: true,//是否为图片文件
        multi: false
    };
    opts = $.extend(def, opts);
    var upLoadedFileSize = 0;
    var uploadingFileSize = 0;
    plupload.formatSize = function (n) {
        if (/\D/.test(n)) {
            return "N/A";
        }
        if (n > 1073741824) {
            return (n / 1073741824.0).toFixed(2) + " GB"
        }
        if (n > 1048576) {
            return (n / 1048576.0).toFixed(2) + " MB"
        }
        if (n > 1024) {
            return (n / 1024).toFixed(1) + " KB"
        }
        return n + " b"
    }

    var args = {};
    args["browse_button"] = opts.btnId;
    args["chunk_size"] = opts.chunkSize;
    args["unique_names"] = true;
    if (opts.container != "") {
        args["container"] = opts.container;
    }
    if (!opts.isPic) {
        opts.chunk_size = null;
    }
    args["max_file_size"] = opts.maxFileSize;
    args["url"] = opts.url + "?dir=" + opts.dir + "&token=" + BaseCookies.get("token");
    args["resize"] = {"width": opts.maxWidth, "height": opts.maxHeight, "quality": opts.Quality, "crop": opts.crop}
    args["runtimes"] = opts.runtimes;
    args["multi_selection"] = opts.multi;
    args["flash_swf_url"] = opts.flash_swf_url;
    args["filters"] = [{title: "Image files", extensions: opts.extensions}];
    args["chunks"] = [{size: opts.chunkSize, send_chunk_number: true}];
    var uploader = new plupload.Uploader(args);
    uploader.init();
    uploader.bind('Error', function (up, args) {
        var err = "上传控件异常";
        switch (args.code) {
            case plupload.FILE_EXTENSION_ERROR:
                err = "请您选择jpg,gif,png,bmp格式的文件";
                break;
            case plupload.FILE_SIZE_ERROR:
                err = "所选文件的大小超过了" + opts.maxFileSize + ",无法上传";
                break;
            case plupload.INIT_ERROR:
                err = "初始化上传控件失败";
                break;
            default:
                for (var p in plupload) {
                    if (plupload[p.toString()] == args.code) {
                        layerMsg.alert(p.toString(), {icon: 2})
                    }
                }
                err = "上传失败,可能您的网络存在问题，请稍后再试。";
                break;
        }
        if (opts.errorFunc)
            opts.errorFunc(args.message);
        else
            layerMsg.msg(args.message, {icon: 0})
    });

    uploader.bind('FilesAdded', function (up, files) {
        if (opts.startFunc)//开始上传
            opts.startFunc();
        uploader.start();  //压缩上传
    });
    uploader.bind('UploadProgress', function (up, file) {
        uploadingFileSize = file.size;
        if (opts.chunkFunc)
            opts.chunkFunc(file.percent);  //上传大小更新
    });
    uploader.bind('ChunkUploaded', function (up, file, res) {
        upLoadedFileSize = file.loaded;
        if (uploadingFileSize == 0) {
            layerMsg.msg("上传中：0%", {icon: 6, time: -1})
        }
        else {
            layerMsg.msg("上传中:" + Math.round(upLoadedFileSize / uploadingFileSize * 100) + "%", {icon: 6, time: -1})
        }

    });
    uploader.bind('FileUploaded', function (up, file, res) {
        uploadingFileSize = 0;
        upLoadedFileSize = 0;
        var json = eval("[" + res.response + "]")[0];
        if (json.ret == 200) {
            opts.callbackFunc(json.data);//成功返回信息
            layerMsg.msg("上传成功", {icon: 1})
        }
        else if (json.ret == 401) {
            layerMsg.alert("登录已失效，请重新登录", {
                title: "系统提示",
                icon: 0
            });
        }
        else {
            if (opts.errorFunc)
                opts.errorFunc("上传图片站服务器错误:" + json.Vals);
            else
                layerMsg.alert("上传图片站服务器错误", {
                    title: "系统提示",
                    icon: 2
                })
        }
    });
    return uploader;
} 