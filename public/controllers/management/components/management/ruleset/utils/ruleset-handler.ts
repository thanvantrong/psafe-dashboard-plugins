import { PaRequest } from '../../../../../../react-services';

type DECODERS = 'decoders';
type LISTS = 'lists';
type RULES = 'rules';
export type Resource = DECODERS | LISTS | RULES;
export const RulesetResources = {
  DECODERS: 'decoders',
  LISTS: 'lists',
  RULES: 'rules',
};

export const resourceDictionary = {
  [RulesetResources.DECODERS]: {    
    resourcePath: '/decoders',    
    permissionResource: (value) => `decoder:file:${value}`
  },
  [RulesetResources.LISTS]: {    
    resourcePath: '/lists',
    permissionResource: (value) => `list:file:${value}`
  },
  [RulesetResources.RULES]: {    
    resourcePath: '/rules',
    permissionResource: (value) => `rule:file:${value}`
  },
};

export class RulesetHandler {
  resource: Resource;
  constructor(_resource: Resource) {
    this.resource = _resource;
  }

  private getResourcePath = () => {
    return `${resourceDictionary[this.resource].resourcePath}`;
  };

  private getResourceFilesPath = (fileName?: string) => {
    const basePath = `${this.getResourcePath()}/files`;
    return `${basePath}${ fileName? `/${fileName}`: ''}`;
  };

  /**
   * Get info of any type of resource Rules, Decoders, CDB lists...
   */
  async getResource(filters = {}) {
    try {      
      const result: any = await PaRequest.apiReq('GET', this.getResourcePath(), filters);
      return (result || {}).data || false ;
    } catch (error) {
      throw error
    }
  }
  

  /**
   * Get the content of any type of file Rules, Decoders, CDB lists...
   * @param {String} fileName
   */
  async getFileContent(fileName) {
    try {
      const result: any = await PaRequest.apiReq('GET', this.getResourceFilesPath(fileName), {
        params:{
          raw: true
        }
      });
      return ((result || {}).data || '');      
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update the content of any type of file Rules, Decoders, CDB lists...
   * @param {String} fileName
   * @param {String} content
   * @param {Boolean} overwrite
   */
  async updateFile(fileName: string, content: string, overwrite: boolean) {    
    try {
      const result = await PaRequest.apiReq('PUT', this.getResourceFilesPath(fileName), {
        params: {
          overwrite: overwrite
        },
        body: content.toString(),
        origin: 'raw'
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
  

  /**
   * Delete any type of file Rules, Decoders, CDB lists...
   * @param {Resource} resource
   * @param {String} fileName
   */
  async deleteFile(fileName: string) {
    let fullPath = `${resourceDictionary[this.resource].resourcePath}/files/${fileName}`;
    try {
      const result = await PaRequest.apiReq('DELETE', fullPath, {});
      return result;
    } catch (error) {
      throw error;
    }
  }

}
