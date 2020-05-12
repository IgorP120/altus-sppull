import { ISPPullOptions, ISPPullContext } from './interfaces';
import { IFolder } from './interfaces/content';
export declare class Download {
    sppull: (context: ISPPullContext, options: ISPPullOptions) => Promise<IFolder[]>;
    private createFolder;
    private createFoldersQueue;
    private downloadFilesQueue;
    private getStructureRecursive;
    private runCreateFoldersRecursively;
    private runDownloadFilesRecursively;
    private runDownloadFilesFlat;
    private runDownloadStrictObjects;
    private runDownloadCamlObjects;
    private downloadMyFilesHandler;
    private initOptions;
}
export { ISPPullOptions, ISPPullContext } from './interfaces';
