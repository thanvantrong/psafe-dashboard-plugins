// To launch this file
// yarn test:jest --testEnvironment node --verbose server/routes/psafe-reporting
import axios from 'axios';
import { PLUGIN_PLATFORM_REQUEST_HEADERS } from '../../common/constants';

function buildAxiosOptions(method: string, path: string, data: any = {}, headers: any = {}){
  return {
    method: method,
    headers: { ...PLUGIN_PLATFORM_REQUEST_HEADERS, 'content-type': 'application/json', ...headers },
    url: `http://localhost:5601${path}`,
    data: data
  };
};

describe.skip('Psafe Reporting', () => {
  describe('Psafe API - /reports', () => {
    test('[200] Returns the available reports for user', () => {
      const options = buildAxiosOptions('get', '/reports', {}, {
        cookie: 'pa-user=elastic'
      });
      return axios(options).then(response => {
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data.reports)).toBe(true);
      }).catch(error => {throw error})
    });
  });

  //TODO: do the test for these endpoints
  // describe('Psafe API - /reports/{name}', () => {
  //   test('[200] Returns the available reports for user and name', () => {
  //     const options = buildAxiosOptions('get', '/reports/psafe-report.pdf', {}, {
  //       cookie: 'pa-user=elastic'
  //     });
  //     return axios(options).then(response => {
  //       expect(response.status).toBe(200);
  //       expect(Array.isArray(response.data.reports)).toBe(true);
  //     }).catch(error => {throw error})
  //   });

  //   test('[200] Returns the available reports for user and name', () => {
  //     const options = buildAxiosOptions('delete', '/reports/psafe-report.pdf', {}, {
  //       cookie: 'pa-user=elastic'
  //     });
  //     return axios(options).then(response => {
  //     }).catch(error => {throw error})
  //   });
  // });

  // describe('Psafe API - /reports/modules/{moduleID}', () => {
  //   test('[200] Generates a modules reports the available reports for user and name', () => {
  //     const options = buildAxiosOptions('post', '/reports/modules/{moduleID}', {}, {
  //       cookie: 'pa-user=elastic'
  //     });
  //     return axios(options).then(response => {
  //       expect(response.status).toBe(200);
  //       expect(Array.isArray(response.data.reports)).toBe(true);
  //     }).catch(error => {throw error})
  //   });
  // });

  // describe('Psafe API - /reports/groups/{groupID}', () => {
  //   test('[200] Generates a modules reports the available reports for user and name', () => {
  //     const options = buildAxiosOptions('post', '/reports/groups/{groupID}', {}, {
  //       cookie: 'pa-user=elastic'
  //     });
  //     return axios(options).then(response => {
  //       expect(response.status).toBe(200);
  //       expect(Array.isArray(response.data.reports)).toBe(true);
  //     }).catch(error => {throw error})
  //   });
  // });

  // describe('Psafe API - /reports/agents/{agentID}', () => {
  //   test('[200] Generates a modules reports the available reports for user and name', () => {
  //     const options = buildAxiosOptions('post', '/reports/agents/{agentID}', {}, {
  //       cookie: 'pa-user=elastic'
  //     });
  //     return axios(options).then(response => {
  //       expect(response.status).toBe(200);
  //       expect(Array.isArray(response.data.reports)).toBe(true);
  //     }).catch(error => {throw error})
  //   });
  // });

  // describe('Psafe API - /reports/agents/{agentID}/inventory', () => {
  //   test('[200] Generates a modules reports the available reports for user and name', () => {
  //     const options = buildAxiosOptions('post', '/reports/agents/{agentID}/inventory', {}, {
  //       cookie: 'pa-user=elastic'
  //     });
  //     return axios(options).then(response => {
  //       expect(response.status).toBe(200);
  //       expect(Array.isArray(response.data.reports)).toBe(true);
  //     }).catch(error => {throw error})
  //   });
  // });
});
