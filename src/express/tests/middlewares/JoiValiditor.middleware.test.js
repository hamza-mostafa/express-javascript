const { getMockReq, getMockRes } = require('@jest-mock/express');
const validationMiddleware = require('../../middlewares/JoiValidator.middleware');
const validations = require('../../requestValidator/index.validation');

describe('Middlewares - Validation', () => {
  it('should receive a wrong validator name and throw Error', async () => {
    try {
      await validationMiddleware('gatewaCreate');
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toBe(`'gatewaCreate' validator doesn't exist`);
    }
  });

  it('should call next(', async () => {
    const firstValidation = Object.keys(validations)[0];
    const validationResponse = await validationMiddleware(firstValidation);
    const req = getMockReq({
      body: {
        serialNumber: '234frasf',
        name: 'adsfasdf',
        IP: '555555555',
      },
    });
    const { res, next } = getMockRes();
    await validationResponse(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should fail and show error message', async () => {
    const firstValidation = Object.keys(validations)[0];
    const validationResponse = await validationMiddleware(firstValidation);
    const req = getMockReq({
      body: {
        serialNumber: '234frasf',
        name: 'adsfasdf',
        IP: '555555555',
      },
    });
    const { res, next } = getMockRes();
    await validationResponse(req, res, next);
    expect(res.json).toBeCalledWith({
      message: '"IP" must match IP pattern e.g: 192.168.1.1',
      status: 400,
    });
  });
});
