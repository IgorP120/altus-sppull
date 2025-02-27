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
var fs = require("fs");
var path = require("path");
var https = require("https");
var mkdirp = require("mkdirp");
var colors = require("colors");
var sprequest = require("sp-request");
var request = require("request");
var node_sp_auth_1 = require("node-sp-auth");
var utils_1 = require("./../utils");
var RestAPI = (function () {
    function RestAPI(context, options) {
        this.context = context;
        this.options = __assign(__assign({}, options), { dlRootFolder: options.dlRootFolder || '.downloads', metaFields: options.metaFields || [] });
        this.utils = new utils_1.Utils();
        this.agent = new https.Agent({
            rejectUnauthorized: false,
            keepAlive: true,
            keepAliveMsecs: 10000
        });
    }
    RestAPI.prototype.downloadFile = function (spFilePath, metadata) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.spr = _this.getCachedRequest();
            var spBaseFolderRegEx = new RegExp(decodeURIComponent('^' + _this.options.spBaseFolder), 'gi');
            var spFilePathRelative = decodeURIComponent(spFilePath);
            if (['', '/'].indexOf(_this.options.spBaseFolder) === -1) {
                spFilePathRelative = decodeURIComponent(spFilePath).replace(spBaseFolderRegEx, '');
            }
            var saveFilePath = path.join(_this.options.dlRootFolder, spFilePathRelative);
            if (typeof _this.options.omitFolderPath !== 'undefined') {
                saveFilePath = path.join(saveFilePath.replace(_this.options.omitFolderPath, ''));
            }
            if (_this.needToDownload(saveFilePath, metadata)) {
                var saveFolderPath = path.dirname(saveFilePath);
                mkdirp(saveFolderPath)
                    .then(function () {
                    var filesize = parseInt(metadata.Length + '');
                    if (filesize > 20000000) {
                        _this.downloadAsStream(spFilePath, saveFilePath)
                            .then(function () { return resolve(saveFilePath); })
                            .catch(function (error) {
                            console.log(colors.red.bold('\nError in operations.downloadFile:'), colors.red(error.message));
                            reject(error);
                        });
                    }
                    else {
                        _this.downloadSimple(spFilePath, saveFilePath)
                            .then(function () { return resolve(saveFilePath); })
                            .catch(function (error) {
                            console.log(colors.red.bold('\nError in operations.downloadFile:'), colors.red(error.message));
                            reject(error);
                        });
                    }
                })
                    .catch(function (err) {
                    console.log(colors.red.bold('\nError in operations.downloadFile:'), colors.red(err));
                    reject(err);
                });
            }
            else {
                resolve(saveFilePath);
            }
        });
    };
    RestAPI.prototype.getFolderContent = function (spRootFolder) {
        return __awaiter(this, void 0, void 0, function () {
            var restUrl, folderInDocLibrary, metadataStr;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.spr = this.getCachedRequest();
                        if (spRootFolder.charAt(spRootFolder.length - 1) === '/') {
                            spRootFolder = spRootFolder.substring(0, spRootFolder.length - 1);
                        }
                        return [4, this.checkIfFolderInDocLibrary(spRootFolder).catch(function () { return false; })];
                    case 1:
                        folderInDocLibrary = _a.sent();
                        if (folderInDocLibrary) {
                            restUrl = this.utils.trimMultiline("\n        " + this.context.siteUrl + "/_api/Web/GetFolderByServerRelativeUrl(@FolderServerRelativeUrl)\n          ?$expand=Folders,Files,Folders/ListItemAllFields,Files/ListItemAllFields\n          &$select=##MetadataSrt#\n            Folders/ListItemAllFields/Id,\n            Folders/Name,Folders/UniqueID,Folders/ID,Folders/ItemCount,Folders/ServerRelativeUrl,Folder/TimeCreated,Folder/TimeLastModified,\n            Files/Name,Files/UniqueID,Files/ID,Files/ServerRelativeUrl,Files/Length,Files/TimeCreated,Files/TimeLastModified,Files/ModifiedBy\n          &@FolderServerRelativeUrl='" + this.utils.escapeURIComponent(spRootFolder) + "'\n      ");
                            metadataStr = this.options.metaFields.map(function (fieldName) {
                                return 'Files/ListItemAllFields/' + fieldName;
                            }).join(',');
                            if (metadataStr.length > 0) {
                                metadataStr += ',';
                            }
                            restUrl = restUrl.replace(/##MetadataSrt#/g, metadataStr);
                        }
                        else {
                            restUrl = this.utils.trimMultiline("\n        " + this.context.siteUrl + "/_api/Web/GetFolderByServerRelativeUrl(@FolderServerRelativeUrl)\n          ?$expand=Folders,Files\n          &$select=\n            Folders/Name,Folders/UniqueID,Folders/ID,Folders/ItemCount,Folders/ServerRelativeUrl,Folder/TimeCreated,Folder/TimeLastModified,\n            Files/Name,Files/UniqueID,Files/ID,Files/ServerRelativeUrl,Files/Length,Files/TimeCreated,Files/TimeLastModified,Files/ModifiedBy\n          &@FolderServerRelativeUrl='" + this.utils.escapeURIComponent(spRootFolder) + "'\n      ");
                        }
                        return [2, new Promise(function (resolve, reject) {
                                _this.spr.get(restUrl, {
                                    agent: _this.utils.isUrlHttps(restUrl) ? _this.agent : undefined
                                })
                                    .then(function (response) {
                                    var results = {
                                        folders: (response.body.d.Folders.results || []).filter(function (folder) {
                                            if (folderInDocLibrary) {
                                                return typeof folder.ListItemAllFields.Id !== 'undefined';
                                            }
                                            else {
                                                return true;
                                            }
                                        }),
                                        files: (response.body.d.Files.results || []).map(function (file) {
                                            if (folderInDocLibrary) {
                                                return __assign(__assign({}, file), { metadata: _this.options.metaFields.reduce(function (meta, field) {
                                                        if (typeof file.ListItemAllFields !== 'undefined') {
                                                            if (file.ListItemAllFields.hasOwnProperty(field)) {
                                                                meta[field] = file.ListItemAllFields[field];
                                                            }
                                                        }
                                                        return meta;
                                                    }, {}) });
                                            }
                                            else {
                                                return __assign(__assign({}, file), { metafata: {} });
                                            }
                                        })
                                    };
                                    resolve(results);
                                })
                                    .catch(function (err) {
                                    console.log(colors.red.bold('\nError in getFolderContent:'), colors.red(err.message));
                                    reject(err.message);
                                });
                            })];
                }
            });
        });
    };
    RestAPI.prototype.getContentWithCaml = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.spr = _this.getCachedRequest();
            _this.spr.requestDigest(_this.context.siteUrl)
                .then(function (digest) {
                var restUrl = _this.utils.trimMultiline("\n            " + _this.context.siteUrl + "/_api/Web/GetList(@DocLibUrl)/GetItems\n              ?$select=##MetadataSrt#\n                Name,UniqueID,ID,FileDirRef,FileRef,FSObjType,TimeCreated,TimeLastModified,Length,ModifiedBy\n              &$expand=Files/ListItemAllFields\n              &@DocLibUrl='" + _this.utils.escapeURIComponent(_this.options.spDocLibUrl) + "'\n          ");
                var metadataStr = _this.options.metaFields.map(function (fieldName) {
                    return "" + fieldName;
                }).join(',');
                if (metadataStr.length > 0) {
                    metadataStr += ',';
                }
                restUrl = restUrl.replace(/##MetadataSrt#/g, metadataStr);
                return _this.spr.post(restUrl, {
                    body: {
                        query: {
                            __metadata: {
                                type: 'SP.CamlQuery'
                            },
                            ViewXml: "<View Scope=\"Recursive\"><Query><Where>" + _this.options.camlCondition + "</Where></Query></View>"
                        }
                    },
                    headers: {
                        'X-RequestDigest': digest,
                        'Accept': 'application/json; odata=verbose',
                        'Content-Type': 'application/json; odata=verbose'
                    },
                    agent: _this.utils.isUrlHttps(restUrl) ? _this.agent : undefined
                });
            })
                .then(function (response) {
                var spRootFolder = _this.options.spRootFolder
                    ? decodeURIComponent(_this.options.spRootFolder)
                    : undefined;
                var filesData = [];
                var foldersData = [];
                response.body.d.results.forEach(function (item) {
                    if (spRootFolder && item.FileRef.indexOf(spRootFolder) !== 0) {
                        return;
                    }
                    item.metadata = _this.options.metaFields.reduce(function (meta, field) {
                        if (item.hasOwnProperty(field)) {
                            meta[field] = item[field];
                        }
                        return meta;
                    }, {});
                    if (item.FSObjType === 0) {
                        item.ServerRelativeUrl = item.FileRef;
                        filesData.push(item);
                    }
                    else {
                        foldersData.push(item);
                    }
                });
                var results = {
                    files: filesData,
                    folders: foldersData
                };
                resolve(results);
            })
                .catch(function (err) {
                console.log(colors.red.bold('\nError in getContentWithCaml:'), colors.red(err.message));
                reject(err.message);
            });
        });
    };
    RestAPI.prototype.checkIfFolderInDocLibrary = function (spFolder) {
        var _this = this;
        this.spr = this.getCachedRequest();
        if (spFolder.charAt(spFolder.length - 1) === '/') {
            spFolder = spFolder.substring(0, spFolder.length - 1);
        }
        var restUrl = this.utils.trimMultiline("\n      " + this.context.siteUrl + "/_api/Web/GetFolderByServerRelativeUrl(@FolderServerRelativeUrl)/listItemAllFields\n        ?@FolderServerRelativeUrl='" + this.utils.escapeURIComponent(spFolder) + "'\n    ");
        return new Promise(function (resolve) {
            _this.spr.get(restUrl, {
                agent: _this.utils.isUrlHttps(restUrl) ? _this.agent : undefined
            })
                .then(function () { return resolve(true); })
                .catch(function () { return resolve(false); });
        });
    };
    RestAPI.prototype.downloadAsStream = function (spFilePath, saveFilePath) {
        var _this = this;
        var restUrl = this.context.siteUrl + "/_api/Web/" +
            "GetFileByServerRelativeUrl(@FileServerRelativeUrl)/$value" +
            ("?@FileServerRelativeUrl='" + this.utils.escapeURIComponent(spFilePath) + "'");
        var envProcessHeaders = {};
        try {
            envProcessHeaders = JSON.parse(process.env['_sp_request_headers'] || '{}');
        }
        catch (ex) { }
        return new Promise(function (resolve, reject) {
            node_sp_auth_1.getAuth(_this.context.siteUrl, _this.context.creds)
                .then(function (auth) {
                var options = __assign({ url: restUrl, method: 'GET', headers: __assign(__assign(__assign({}, envProcessHeaders), auth.headers), { 'User-Agent': 'sppull' }), encoding: null, strictSSL: false, gzip: true, agent: _this.utils.isUrlHttps(_this.context.siteUrl) ? _this.agent : undefined }, auth.options);
                request(options)
                    .pipe(fs.createWriteStream(saveFilePath))
                    .on('error', reject)
                    .on('finish', function () { return resolve(saveFilePath); });
            })
                .catch(reject);
        });
    };
    RestAPI.prototype.downloadSimple = function (spFilePath, saveFilePath) {
        var _this = this;
        var restUrl = this.context.siteUrl + "/_api/Web/" +
            "GetFileByServerRelativeUrl(@FileServerRelativeUrl)/OpenBinaryStream" +
            ("?@FileServerRelativeUrl='" + this.utils.escapeURIComponent(spFilePath) + "'");
        var envProcessHeaders = {};
        try {
            envProcessHeaders = JSON.parse(process.env['_sp_request_headers'] || '{}');
        }
        catch (ex) { }
        return new Promise(function (resolve, reject) {
            node_sp_auth_1.getAuth(_this.context.siteUrl, _this.context.creds)
                .then(function (auth) {
                var options = __assign({ url: restUrl, method: 'GET', headers: __assign(__assign(__assign({}, envProcessHeaders), auth.headers), { 'User-Agent': 'sppull' }), encoding: null, strictSSL: false, gzip: true, agent: _this.utils.isUrlHttps(_this.context.siteUrl) ? _this.agent : undefined }, auth.options);
                request(options)
                    .pipe(fs.createWriteStream(saveFilePath))
                    .on('error', reject)
                    .on('finish', function () { return resolve(saveFilePath); });
            })
                .catch(reject);
        });
    };
    RestAPI.prototype.needToDownload = function (saveFilePath, metadata) {
        var stats = null;
        var needDownload = true;
        if (typeof metadata !== 'undefined') {
            if (fs.existsSync(saveFilePath)) {
                stats = fs.statSync(saveFilePath);
                needDownload = false;
                if (typeof metadata.Length !== 'undefined') {
                    if (stats.size !== parseInt(metadata.Length + '', 10)) {
                        needDownload = true;
                    }
                }
                else {
                    needDownload = true;
                }
                if (typeof metadata.TimeLastModified !== 'undefined') {
                    var timeLastModified = new Date(metadata.TimeLastModified);
                    if (stats.mtime < timeLastModified) {
                        needDownload = true;
                    }
                }
            }
            else {
                needDownload = true;
            }
        }
        return needDownload;
    };
    RestAPI.prototype.getCachedRequest = function () {
        return this.spr || sprequest.create(this.context.creds);
    };
    return RestAPI;
}());
exports.default = RestAPI;
//# sourceMappingURL=index.js.map