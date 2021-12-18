const {
  checkIfIntegerAndPositive,
  pagination,
  logDir,
  patternCheck,
  failed,
  success,
} = require('../../helpers/index.helper');

describe('Helpers', () => {
  describe('checkIfIntegerAndPositive', () => {
    it('should return false if number is not positive', () => {
      expect(checkIfIntegerAndPositive(-1)).toBeFalsy();
    });
    it('should return false if number is not integer', () => {
      expect(checkIfIntegerAndPositive(1.11)).toBeFalsy();
    });
    it('should return false if number is Infinity', () => {
      expect(checkIfIntegerAndPositive(Infinity)).toBeFalsy();
    });
  });
  describe('pagination', () => {
    it('should return skip 0, limit 10 if nothing provided', () => {
      expect(pagination()).toMatchObject({
        skip: 0,
        limit: 10,
      });
    });
    it('should return skip matching limit calculation for pagination', () => {
      expect(pagination(2, 5)).toMatchObject({
        skip: 5,
        limit: 5,
      });
    });
  });
  describe('logDir', () => {
    it('should return detailed object', () => {
      const date = new Date();
      const weakMap = new WeakMap();
      [weakMap.z, weakMap.y] = [1, 2];
      const set = new Set([1, 2]);

      const testingObject = {
        a: {
          b: {
            c: {
              d: {
                e: {
                  f: 'string',
                  g: 11,
                  h: false,
                  i: date,
                  j: set,
                  k: weakMap,
                },
              },
            },
          },
        },
      };
      const consoleSpy = jest.spyOn(console, 'dir');
      logDir(testingObject);
      expect(consoleSpy).toHaveBeenCalledWith(testingObject, { depth: null });
    });
  });
  describe('patternCheck', () => {
    it('should return true if any of patter exists', () => {
      expect(patternCheck(/$|\(/, 'testing all #*^(*&^^&@#$')).toBeTruthy();
    });
  });
  describe('failed', () => {
    it('should return res with message and status', async () => {
      const status = 404;
      const message = 'not found';
      const res = {
        status: (s) => {
          res.statusCode = s;
          return res;
        },
        message: (m) => {
          res.statusMessage = m;
          return res;
        },
        json: (j) => j,
      };
      const x = await failed(res, status, message);
      expect(x).toMatchObject({
        message,
        status,
      });
    });
  });
  describe('success', () => {
    it('should return res with data, message and status', async () => {
      const status = 200;
      const message = 'OK';
      const data = {
        a: true,
        b: 'string',
      };
      const res = {
        status: (s) => {
          res.statusCode = s;
          return res;
        },
        message: (m) => {
          res.statusMessage = m;
          return res;
        },
        json: (j) => j,
        data: (d) => d,
      };
      const x = await success(res, data, status, message);
      expect(x).toMatchObject({
        message,
        status,
        data,
      });
      await expect(success(res, data, status, message)).toMatchObject({
        message,
        data,
      });
    });
  });
});
