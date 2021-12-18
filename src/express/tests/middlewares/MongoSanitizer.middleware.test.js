const { getMockReq, getMockRes } = require('@jest-mock/express');
const {
  MongoInputSanitizer,
} = require('../../middlewares/MongoSanitizer.middleware');

describe('Middlewares - MongoDB sanitization', () => {
  it('should call next()', async () => {
    const req = getMockReq({
      body: {
        serialNumber: '234frasf',
        name: 'adsfasdf',
        IP: '555555555',
      },
      params: {},
    });
    const { res, next } = getMockRes();
    await MongoInputSanitizer(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should fail, show error message, and call next()', async () => {
    const req = getMockReq({
      body: {
        serialNumber: ')234frasf',
        name: '$adsfasdf',
        IP: '555555555',
      },
      params: {},
    });
    const { res, next } = getMockRes();
    await MongoInputSanitizer(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.json).toBeCalledWith({
      message:
        'The field name cannot contain any of  (  ]  $  {  }  (  ) [  ) ',
      status: 400,
    });
  });
});
