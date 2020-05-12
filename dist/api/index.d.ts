import { ISPPullOptions, ISPPullContext, IFileBasicMetadata } from '../interfaces';
import { IContent } from '../interfaces/content';
export default class RestAPI {
    private context;
    private options;
    private spr;
    private agent;
    private utils;
    constructor(context: ISPPullContext, options: ISPPullOptions);
    downloadFile(spFilePath: string, metadata?: IFileBasicMetadata): Promise<string>;
    getFolderContent(spRootFolder: string): Promise<IContent>;
    getContentWithCaml(): Promise<IContent>;
    private checkIfFolderInDocLibrary;
    private downloadAsStream;
    private downloadSimple;
    private needToDownload;
    private getCachedRequest;
}
