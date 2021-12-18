const supertest = require('supertest');
const { DB_NAME, DB_PORT, DB_HOST } = require('dotenv').config({
  path: '.env.testing',
}).parsed;
const mongoose = require('mongoose');
const app = require('../../app');
const Gateway = require('../../models/gateway.model');
const { logDir } = require('../../helpers/index.helper');

const prefix = '/api/v1-0-0';
const serialNumber = 'Sa-1639347606029';
const data = {
  serialNumber,
  name: 'gateway-x9',
  IP: '255.255.255.1',
  peripherals: [
    {
      vendor: 'cisco',
      status: false,
    },
  ],
};
const wrongData = {
  serialNumber,
  name: 'gateway-x9',
  IP: '2552552551',
  peripherals: [
    {
      vendor: 'cisco',
      status: false,
    },
  ],
};

beforeAll(async () => {
  await mongoose
    // eslint-disable-next-line
        .connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`).then(() => {
      // eslint-disable-next-line no-console
      console.log('TEST DB connection opened successfully');
    })
    .catch((err) => {
      logDir(err);
    });
});

beforeEach(async () => {
  await Gateway.deleteMany({});
});

afterAll(async () => {
  await Gateway.deleteMany({});
  await mongoose.connection.close();
  // eslint-disable-next-line
    console.log('TEST DB connection closed successfully');
});

describe('index', () => {
  it('should succeed in fetching empty data', async () => {
    await supertest(app)
      .get(`${prefix}/gateway`)
      .expect(200)
      .then((response) => {
        expect(response.body.data.length).toBe(0);
        expect(response.body.status).toBe(200);
        expect(response.body.message).toBe('Successfully Gateways Retrieved');
      });
  });

  it('should succeed in fetching exact data', async () => {
    await Gateway.create(data);

    await supertest(app)
      .get(`${prefix}/gateway`)
      .expect(200)
      .then((response) => {
        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0]).toMatchObject(data);
        expect(response.body.status).toBe(200);
        expect(response.body.message).toBe('Successfully Gateways Retrieved');
      });
  });
});

describe('create', () => {
  it('should succeed in creating gateway with correct data', async () => {
    await supertest(app)
      .post(`${prefix}/gateway`)
      .send(data)
      .expect(201)
      .then((response) => {
        expect(response.body.data).toMatchObject(data);
        expect(response.body.status).toBe(201);
        expect(response.body.message).toBe('Successfully Gateway Created');
      });
  });

  it('should succeed in creating gateway without peripherals', async () => {
    const { peripherals } = data;
    delete data.peripherals;

    await supertest(app)
      .post(`${prefix}/gateway`)
      .send(data)
      .expect(201)
      .then((response) => {
        expect(response.body.data).toMatchObject(data);
        expect(response.body.status).toBe(201);
        expect(response.body.message).toBe('Successfully Gateway Created');
      });

    data.peripherals = peripherals;
  });

  it('should fail in creating gateway with repeated serial number', async () => {
    await Gateway.create(data);
    await supertest(app)
      .post(`${prefix}/gateway`)
      .send(data)
      .expect(400)
      .then((response) => {
        expect(response.body.status).toBe(400);
        expect(response.body.message).toBe(
          `Error while creating gateway -- E11000 duplicate key error collection: testing.gateways index: serialNumber_1 dup key: { serialNumber: "${serialNumber}" }`
        );
      });
  });

  it('should fail in creating gateway with wrong serial number', async () => {
    data.serialNumber = 1231241231;
    await Gateway.create(data);
    await supertest(app)
      .post(`${prefix}/gateway`)
      .send(data)
      .expect(400)
      .then((response) => {
        expect(response.body.status).toBe(400);
        expect(response.body.message).toBe('"serialNumber" must be a string');
      });

    data.serialNumber = serialNumber;
  });

  it('should fail in creating gateway with wrong IP format', async () => {
    await supertest(app)
      .post(`${prefix}/gateway`)
      .send(wrongData)
      .expect(400)
      .then((response) => {
        expect(response.body.status).toBe(400);
        expect(response.body.message).toBe(
          '"IP" must match IP pattern e.g: 192.168.1.1'
        );
      });
  });

  it('should fail in creating gateway with missing IP', async () => {
    wrongData.IP = null;
    await supertest(app)
      .post(`${prefix}/gateway`)
      .send(wrongData)
      .expect(400)
      .then((response) => {
        expect(response.body.status).toBe(400);
        expect(response.body.message).toBe('"IP" must be a string');
      });
    wrongData.IP = '1234234234';
  });

  it('should fail in creating gateway with missing name', async () => {
    wrongData.name = null;
    wrongData.IP = '255.255.255.1';
    await supertest(app)
      .post(`${prefix}/gateway`)
      .send(wrongData)
      .expect(400)
      .then((response) => {
        expect(response.body.status).toBe(400);
        expect(response.body.message).toBe('"name" must be a string');
      });
    wrongData.name = 'bla bla';
    wrongData.IP = '1234234234';
  });

  it('should fail in creating gateway with missing serial number', async () => {
    wrongData.serialNumber = null;
    wrongData.IP = '255.255.255.1';
    await supertest(app)
      .post(`${prefix}/gateway`)
      .send(wrongData)
      .expect(400)
      .then((response) => {
        expect(response.body.status).toBe(400);
        expect(response.body.message).toBe('"serialNumber" must be a string');
      });
    wrongData.serialNumber = serialNumber;
    wrongData.IP = '123412341234';
  });
});

describe('show', () => {
  it('should succeed in fetching correct data', async () => {
    await Gateway.create(data);
    await supertest(app)
      .get(`${prefix}/gateway/${serialNumber}`)
      .expect(200)
      .then((response) => {
        expect(response.body.data).toMatchObject(data);
        expect(response.body.status).toBe(200);
        expect(response.body.message).toBe('Successfully Gateway Retrieved');
      });
  });

  it('should fail in fetching data with wrong serial number', async () => {
    await Gateway.create(data);
    await supertest(app)
      .get(`${prefix}/gateway/ssd`)
      .expect(404)
      .then((response) => {
        expect(response.body.status).toBe(404);
        expect(response.body.message).toBe(
          'No gateway found with this serial number'
        );
      });
  });
});

describe('update', () => {
  it('should succeed in updating gateway with correct data', async () => {
    await Gateway.create(data);
    data.name = 'new name';
    await supertest(app)
      .put(`${prefix}/gateway/${serialNumber}`)
      .send(data)
      .expect(200)
      .then((response) => {
        expect(response.body.status).toBe(200);
        expect(response.body.data.name).toBe(data.name);
        expect(response.body.message).toBe('Successfully Gateway Updated');
      });
  });

  it('should fail in updating gateway with wrong IP format', async () => {
    await Gateway.create(data);
    await supertest(app)
      .put(`${prefix}/gateway/${serialNumber}`)
      .send(wrongData)
      .expect(400)
      .then((response) => {
        expect(response.body.status).toBe(400);
        expect(response.body.message).toBe(
          '"IP" must match IP pattern e.g: 192.168.1.1'
        );
      });
  });

  it('should fail in updating gateway with missing IP', async () => {
    await Gateway.create(data);
    wrongData.IP = null;
    await supertest(app)
      .put(`${prefix}/gateway/${serialNumber}`)
      .send(wrongData)
      .expect(400)
      .then((response) => {
        expect(response.body.status).toBe(400);
        expect(response.body.message).toBe('"IP" must be a string');
      });

    wrongData.IP = '123412341234';
  });

  it('should fail in updating gateway with missing name', async () => {
    await Gateway.create(data);
    wrongData.name = null;
    wrongData.IP = '255.255.255.1';
    await supertest(app)
      .put(`${prefix}/gateway/${serialNumber}`)
      .send(wrongData)
      .expect(400)
      .then((response) => {
        expect(response.body.status).toBe(400);
        expect(response.body.message).toBe('"name" must be a string');
      });

    wrongData.name = 'bla bla';
    wrongData.IP = '123412341234';
  });

  it('should fail in updating gateway with missing serial number', async () => {
    wrongData.serialNumber = null;
    wrongData.IP = '255.255.255.1';
    await Gateway.create(data);
    await supertest(app)
      .put(`${prefix}/gateway/${serialNumber}`)
      .send(wrongData)
      .expect(400)
      .then((response) => {
        expect(response.body.status).toBe(400);
        expect(response.body.message).toBe('"serialNumber" must be a string');
      });

    wrongData.serialNumber = serialNumber;
    wrongData.IP = '123412341234';
  });
});

describe('delete', () => {
  it('should succeed in deleting with correct serial number', async () => {
    await Gateway.create(data);
    await supertest(app)
      .delete(`${prefix}/gateway/${serialNumber}`)
      .expect(204);
    const dbFetch = await Gateway.find({ serialNumber });
    expect(dbFetch).toStrictEqual([]);
  });

  it('should succeed in deleting related peripherals', async () => {
    const created = await Gateway.create(data);
    await supertest(app)
      .delete(`${prefix}/gateway/${serialNumber}`)
      .expect(204);
    const dbFetch = await Gateway.find({ serialNumber });
    const peripheral =
      dbFetch.length > 0
        ? dbFetch[0].peripherals.filter(
            (p) => p.id === created.peripherals[0].id
          )
        : [];
    expect(peripheral).toStrictEqual([]);
  });

  it('should fail in deleting with wrong serial number', async () => {
    const created = await Gateway.create(data);
    await supertest(app)
      .delete(`${prefix}/gateway/ssssd`)
      .expect(404)
      .then((response) => {
        expect(response.body.status).toBe(404);
        expect(response.body.message).toBe(
          'No gateway found with this serial number'
        );
      });
    const dbFetch = await Gateway.find({ serialNumber });
    expect(dbFetch[0].serialNumber).toBe(created.serialNumber);
  });
});
