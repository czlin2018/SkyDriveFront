import axios from 'axios';
/**
 * 封装axios发送请求
 */
export default {
  /**
   * get请求
   * @param {访问地址} url
   * @param {请求数据} params
   */
  get(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.get(url, { params: params }).then(
        res => {
          if (res.data.code === 0) {
            resolve(res);
          }
          else {
            reject(res);
          }
        },
        err => {
          reject(err);
        }
      ).catch(res => {

      });
    });
  },
  /**
   * post请求
   * @param {访问地址} url
   * @param {请求数据} data
 
   */
  post(url, data = {}) {
    return new Promise((resolve, reject) => {
      axios.post(url, data).then(
        res => {
          if (res.data.code === 0) {
            resolve(res);
          }
          else {
            reject(res);
          }
        },
        err => {
          reject(err);
        }
      ).catch(res => {

      });
    });
  }
};