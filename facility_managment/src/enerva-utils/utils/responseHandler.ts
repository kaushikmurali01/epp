export class ResponseHandler {
  static async getResponse(code: number, msg: string,  data: any = {}) {
    try {
      let res: any;
      res = {
        message: msg,
        statusCode: code,
        data: data ,
      };
      return res;
    } catch (err: any) {
      throw new Error(err);
    }
  };
}


