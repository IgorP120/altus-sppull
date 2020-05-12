"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var mkdirp = require("mkdirp");
var colors = require("colors");
var readline = require("readline");
var url_1 = require("url");
var api_1 = require("./api");
var Download = (function () {
    function Download() {
        var _this = this;
        this.sppull = function (context, options) {
            options = _this.initOptions(context, options);
            var ctx = {
                context: context,
                options: options,
                api: new api_1.default(context, options)
            };
            if (typeof options.camlCondition !== 'undefined' && options.camlCondition !== '' &&
                typeof options.spDocLibUrl !== 'undefined' && options.spDocLibUrl !== '') {
                return _this.runDownloadCamlObjects(ctx);
            }
            else {
                if (typeof options.strictObjects !== 'undefined' && Array.isArray([options.strictObjects])) {
                    options.strictObjects.forEach(function (strictObject, i) {
                        if (typeof strictObject === 'string') {
                            if (strictObject.indexOf(options.spRootFolder) !== 0) {
                                strictObject = (options.spRootFolder + '/' + strictObject).replace(/\/\//g, '/');
                            }
                            options.strictObjects[i] = strictObject;
                        }
                    });
                    return _this.runDownloadStrictObjects(ctx);
                }
                else {
                    if (!options.foderStructureOnly) {
                        if (options.recursive) {
                            return _this.runDownloadFilesRecursively(ctx);
                        }
                        else {
                            return _this.runDownloadFilesFlat(ctx);
                        }
                    }
                    else {
                        return _this.runCreateFoldersRecursively(ctx);
                    }
                }
            }
        };
    }
    Download.prototype.createFolder = function (ctx, spFolderPath, downloadRoot) {
        return new Promise(function (resolve, reject) {
            var spBaseFolderRegEx = new RegExp(decodeURIComponent(ctx.options.spBaseFolder), 'gi');
            var spFolderPathRelative = decodeURIComponent(spFolderPath);
            if (['', '/'].indexOf(ctx.options.spBaseFolder) === -1) {
                spFolderPathRelative = decodeURIComponent(spFolderPath).replace(spBaseFolderRegEx, '');
            }
            var saveFolderPath = path.join(downloadRoot, spFolderPathRelative);
            mkdirp(saveFolderPath)
                .then(function () { return resolve(saveFolderPath); })
                .catch(function (err) {
                console.log(colors.red.bold('Error creating folder ' + '`' + saveFolderPath + ' `'), colors.red(err));
                reject(err);
            });
        });
    };
    Download.prototype.createFoldersQueue = function (ctx, foldersList, index) {
        if (index === void 0) { index = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var spFolderPath, downloadRoot, localFolderPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spFolderPath = foldersList[index].ServerRelativeUrl;
                        downloadRoot = ctx.options.dlRootFolder;
                        if (!ctx.options.muteConsole) {
                            readline.clearLine(process.stdout, 0);
                            readline.cursorTo(process.stdout, 0, undefined);
                            process.stdout.write(colors.green.bold('Creating folders: ') + (index + 1) + ' out of ' + foldersList.length);
                        }
                        return [4, this.createFolder(ctx, spFolderPath, downloadRoot)];
                    case 1:
                        localFolderPath = _a.sent();
                        foldersList[index].SavedToLocalPath = localFolderPath;
                        index += 1;
                        if (index < foldersList.length) {
                            return [2, this.createFoldersQueue(ctx, foldersList, index)];
                        }
                        else {
                            if (!ctx.options.muteConsole) {
                                process.stdout.write('\n');
                            }
                            return [2, foldersList];
                        }
                        return [2];
                }
            });
        });
    };
    Download.prototype.downloadFilesQueue = function (ctx, filesList, index) {
        if (index === void 0) { index = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var spFilePath, localFilePath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spFilePath = filesList[index].ServerRelativeUrl;
                        if (!ctx.options.muteConsole) {
                            readline.clearLine(process.stdout, 0);
                            readline.cursorTo(process.stdout, 0, undefined);
                            process.stdout.write(colors.green.bold('Downloading files: ') + (index + 1) + ' out of ' + filesList.length);
                        }
                        return [4, ctx.api.downloadFile(spFilePath, filesList[index])];
                    case 1:
                        localFilePath = _a.sent();
                        filesList[index].SavedToLocalPath = localFilePath;
                        index += 1;
                        if (index < filesList.length) {
                            return [2, this.downloadFilesQueue(ctx, filesList, index)];
                        }
                        else {
                            if (!ctx.options.muteConsole) {
                                process.stdout.write('\n');
                            }
                            return [2, filesList];
                        }
                        return [2];
                }
            });
        });
    };
    Download.prototype.getStructureRecursive = function (ctx, root, foldersQueue, filesList) {
        if (root === void 0) { root = true; }
        if (foldersQueue === void 0) { foldersQueue = []; }
        if (filesList === void 0) { filesList = []; }
        return __awaiter(this, void 0, void 0, function () {
            var exitQueue, spRootFolder, cntInQueue_1, results, foldersList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        exitQueue = true;
                        if (typeof ctx.options.spRootFolder === 'undefined' || ctx.options.spRootFolder === '') {
                            throw Error('The `spRootFolder` property should be provided in options.');
                        }
                        if (foldersQueue.length === 0) {
                            spRootFolder = ctx.options.spRootFolder;
                            exitQueue = !root;
                        }
                        else {
                            foldersQueue.some(function (fi) {
                                if (typeof fi.processed === 'undefined') {
                                    fi.processed = false;
                                }
                                if (!fi.processed) {
                                    spRootFolder = fi.serverRelativeUrl;
                                    fi.processed = true;
                                    exitQueue = false;
                                    return true;
                                }
                                return false;
                            });
                        }
                        if (!!exitQueue) return [3, 2];
                        cntInQueue_1 = 0;
                        foldersQueue.forEach(function (folder) {
                            if (folder.processed) {
                                cntInQueue_1 += 1;
                            }
                        });
                        if (!ctx.options.muteConsole) {
                            readline.clearLine(process.stdout, 0);
                            readline.cursorTo(process.stdout, 0, undefined);
                            process.stdout.write(colors.green.bold('Folders proceeding: ') + cntInQueue_1 + ' out of ' + foldersQueue.length + colors.gray(' [recursive scanning...]'));
                        }
                        return [4, ctx.api.getFolderContent(spRootFolder)];
                    case 1:
                        results = _a.sent();
                        (results.folders || []).forEach(function (folder) {
                            var folderElement = {
                                folder: folder,
                                serverRelativeUrl: folder.ServerRelativeUrl,
                                processed: false
                            };
                            foldersQueue.push(folderElement);
                        });
                        filesList = filesList.concat(results.files || []);
                        return [2, this.getStructureRecursive(ctx, false, foldersQueue, filesList)];
                    case 2:
                        if (!ctx.options.muteConsole) {
                            process.stdout.write('\n');
                        }
                        foldersList = foldersQueue.map(function (folder) {
                            return folder.folder;
                        });
                        return [2, {
                                files: filesList,
                                folders: foldersList
                            }];
                }
            });
        });
    };
    Download.prototype.runCreateFoldersRecursively = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getStructureRecursive(ctx)];
                    case 1:
                        data = _a.sent();
                        if ((data.folders || []).length > 0) {
                            return [2, this.createFoldersQueue(ctx, data.folders, 0)];
                        }
                        return [2, []];
                }
            });
        });
    };
    Download.prototype.runDownloadFilesRecursively = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var data, folders;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getStructureRecursive(ctx)];
                    case 1:
                        data = _a.sent();
                        if (!ctx.options.createEmptyFolders) return [3, 3];
                        folders = data.folders || [];
                        if (!(folders.length > 0)) return [3, 3];
                        return [4, this.createFoldersQueue(ctx, folders, 0)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2, this.downloadMyFilesHandler(ctx, data)];
                }
            });
        });
    };
    Download.prototype.runDownloadFilesFlat = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof ctx.options.spRootFolder === 'undefined' || ctx.options.spRootFolder === '') {
                            throw Error('The `spRootFolder` property should be provided in options.');
                        }
                        return [4, ctx.api.getFolderContent(ctx.options.spRootFolder)];
                    case 1:
                        data = _a.sent();
                        if (!ctx.options.createEmptyFolders) return [3, 3];
                        if (!((data.folders || []).length > 0)) return [3, 3];
                        return [4, this.createFoldersQueue(ctx, data.folders, 0)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2, this.downloadMyFilesHandler(ctx, data)];
                }
            });
        });
    };
    Download.prototype.runDownloadStrictObjects = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var filesList;
            return __generator(this, function (_a) {
                filesList = ctx.options.strictObjects
                    .filter(function (d) { return d.split('/').slice(-1)[0].indexOf('.') !== -1; })
                    .map(function (ServerRelativeUrl) { return ({ ServerRelativeUrl: ServerRelativeUrl }); });
                if (filesList.length > 0) {
                    return [2, this.downloadFilesQueue(ctx, filesList, 0)];
                }
                return [2, []];
            });
        });
    };
    Download.prototype.runDownloadCamlObjects = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, ctx.api.getContentWithCaml()];
                    case 1:
                        data = _a.sent();
                        if (!ctx.options.createEmptyFolders) return [3, 3];
                        if (!((data.folders || []).length > 0)) return [3, 3];
                        return [4, this.createFoldersQueue(ctx, data.folders, 0)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2, this.downloadMyFilesHandler(ctx, data)];
                }
            });
        });
    };
    Download.prototype.downloadMyFilesHandler = function (ctx, data) {
        return __awaiter(this, void 0, void 0, function () {
            var files, fileRegExp;
            return __generator(this, function (_a) {
                files = data.files || [];
                fileRegExp = ctx.options.fileRegExp;
                if (typeof fileRegExp === 'object' && typeof fileRegExp.test === 'function') {
                    files = files.filter(function (f) { return fileRegExp.test(f.ServerRelativeUrl); });
                }
                if (files.length > 0) {
                    return [2, this.downloadFilesQueue(ctx, files, 0)];
                }
                return [2, []];
            });
        });
    };
    Download.prototype.initOptions = function (context, options) {
        if (typeof context.creds === 'undefined') {
            context.creds = __assign({}, context);
        }
        var url = new url_1.URL(context.siteUrl);
        options.spHostName = url.hostname;
        options.spRelativeBase = url.pathname;
        if (options.spRootFolder) {
            if (options.spRootFolder.indexOf(options.spRelativeBase) !== 0) {
                options.spRootFolder = (options.spRelativeBase + '/' + options.spRootFolder).replace(/\/\//g, '/');
            }
            else {
                if (options.spRootFolder.charAt(0) !== '/') {
                    options.spRootFolder = '/' + options.spRootFolder;
                }
            }
        }
        if (options.spBaseFolder) {
            if (options.spBaseFolder.indexOf(options.spRelativeBase) !== 0) {
                options.spBaseFolder = (options.spRelativeBase + '/' + options.spBaseFolder).replace(/\/\//g, '/');
            }
        }
        else {
            options.spBaseFolder = options.spRootFolder;
        }
        options.dlRootFolder = options.dlRootFolder || './Downloads';
        options.recursive = typeof options.recursive !== 'undefined' ? options.recursive : true;
        options.foderStructureOnly = typeof options.foderStructureOnly !== 'undefined' ? options.foderStructureOnly : false;
        options.createEmptyFolders = typeof options.createEmptyFolders !== 'undefined' ? options.createEmptyFolders : true;
        options.metaFields = options.metaFields || [];
        if (options.spDocLibUrl) {
            if (options.spDocLibUrl.indexOf(options.spRelativeBase) !== 0) {
                options.spDocLibUrl = (options.spRelativeBase + '/' + options.spDocLibUrl).replace(/\/\//g, '/');
            }
            else {
                if (options.spDocLibUrl.charAt(0) !== '/') {
                    options.spDocLibUrl = '/' + options.spDocLibUrl;
                }
            }
            options.spDocLibUrl = encodeURIComponent(options.spDocLibUrl);
        }
        if (typeof options.muteConsole === 'undefined') {
            options.muteConsole = false;
        }
        return options;
    };
    return Download;
}());
exports.Download = Download;
//# sourceMappingURL=SPPull.js.map