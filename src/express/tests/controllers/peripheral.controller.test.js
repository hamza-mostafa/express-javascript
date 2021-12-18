const supertest = require('supertest');
const mongoose = require('mongoose');

const { DB_NAME, DB_PORT, DB_HOST } = require('dotenv').config({
  path: '.env.testing',
}).parsed;
const app = require('../../app');
const Gateway = require('../../models/gateway.model');
const { createPeripheral } = require('../../services/peripheral.service');
const { logDir } = require('../../helpers/index.helper');

const prefix = '/api/v1-0-0';
const serialNumber = 'Sa-1639347606029';
const data = {
  serialNumber,
  name: 'gateway-x9',
  IP: '255.255.255.1',
  peripherals: [
    {
      vendor: 'CISCO',
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

describe('create', () => {
  it('should succeed in creating peripheral with correct data', async () => {
    await Gateway.create(data);
    await supertest(app)
      .post(`${prefix}/peripheral/gateway/${serialNumber}`)
      .send(data.peripherals[0])
      .expect(201)
      .then((response) => {
        expect(response.body.data.peripherals[0]).toMatchObject(
          data.peripherals[0]
        );
        expect(response.body.status).toBe(201);
        expect(response.body.message).toBe(
          'Successfully Peripheral Created and added to Gateway'
        );
      });
  });

  it('should fail in creating peripheral with wrong gateway serial number', async () => {
    await Gateway.create(data);
    await supertest(app)
      .post(`${prefix}/peripheral/gateway/ssssss`)
      .send(data.peripherals[0])
      .expect(422)
      .then((response) => {
        expect(response.body.status).toBe(422);
        expect(response.body.message).toBe(
          'No gateway found with this serial number'
        );
      });
  });

  it('should fail in creating peripheral with missing vendor', async () => {
    data.peripherals[0].vendor = null;
    await Gateway.create(data);
    await supertest(app)
      .post(`${prefix}/peripheral/gateway/${serialNumber}`)
      .send(data.peripherals[0])
      .expect(400)
      .then((response) => {
        expect(response.body.status).toBe(400);
        expect(response.body.message).toBe('"vendor" must be a string');
      });

    data.peripherals[0].vendor = 'cisco';
  });

  it('should fail in creating peripheral with wrong status', async () => {
    await Gateway.create(data);
    data.peripherals[0].status = 'null';
    await supertest(app)
      .post(`${prefix}/peripheral/gateway/${serialNumber}`)
      .send(data.peripherals[0])
      .expect(400)
      .then((response) => {
        expect(response.body.status).toBe(400);
        expect(response.body.message).toBe('"status" must be a boolean');
      });

    data.peripherals[0].status = false;
  });
});

describe('show', () => {
  it('should succeed in fetching correct data', async () => {
    await Gateway.create(data);
    const { vendor, status } = data.peripherals[0];
    const created = await createPeripheral(serialNumber, vendor, status);
    const { id } = created.data.peripherals[0];
    await supertest(app)
      .get(`${prefix}/peripheral/${id}/gateway/${serialNumber}`)
      .expect(200)
      .then((response) => {
        expect(response.body.status).toBe(200);
        expect(response.body.data).toMatchObject(data.peripherals[0]);
        expect(response.body.message).toBe('Successfully Peripheral Retrieved');
      });
  });

  it('should fail in fetching data with wrong id', async () => {
    await Gateway.create(data);
    const { vendor, status } = data.peripherals[0];
    await createPeripheral(serialNumber, vendor, status);
    await supertest(app)
      .get(`${prefix}/peripheral/234df234wdfsdf/gateway/${serialNumber}`)
      .expect(404)
      .then((response) => {
        expect(response.body.status).toBe(404);
        expect(response.body.message).toBe('No peripheral found with this id');
      });
  });
});

describe('update', () => {
  it('should succeed in updating peripheral with correct data', async () => {
    await Gateway.create(data);
    const { vendor, status } = data.peripherals[0];
    const created = await createPeripheral(serialNumber, vendor, status);
    const { id } = created.data.peripherals[0];
    data.peripherals[0].vendor = 'updated';
    await supertest(app)
      .put(`${prefix}/peripheral/${id}/gateway/${serialNumber}`)
      .send(data.peripherals[0])
      .expect(200)
      .then((response) => {
        expect(response.body.status).toBe(200);
        expect(response.body.message).toBe('Successfully Peripheral Updated');
      });
  });

  it('should fail in updating peripheral with wrong gateway serial number', async () => {
    const created = await Gateway.create(data);
    data.peripherals[0].vendor = 'updated';
    await supertest(app)
      .put(`${prefix}/peripheral/${created.peripherals[0].id}/gateway/ssssssss`)
      .send(data.peripherals[0])
      .expect(422)
      .then((response) => {
        expect(response.body.status).toBe(422);
        expect(response.body.message).toBe(
          'No gateway found with this serial number'
        );
      });
  });

  it('should fail in updating peripheral with wrong status', async () => {
    await Gateway.create(data);
    const { vendor, status } = data.peripherals[0];
    const created = await createPeripheral(serialNumber, vendor, !!status);
    const { id } = created.data.peripherals[0];
    data.peripherals[0].status = 'updated';
    await supertest(app)
      .put(`${prefix}/peripheral/${id}/gateway/${serialNumber}`)
      .send(data.peripherals[0])
      .expect(400)
      .then((response) => {
        expect(response.body.status).toBe(400);
        expect(response.body.message).toBe('"status" must be a boolean');
      });
    data.peripherals[0].status = false;
  });
});

describe('delete', () => {
  it('should succeed in deleting with correct serial number and requested peripheral id', async () => {
    await Gateway.create(data);
    const { vendor, status } = data.peripherals[0];
    const created = await createPeripheral(serialNumber, vendor, status);
    const { id } = created.data.peripherals[0];
    await supertest(app)
      .delete(`${prefix}/peripheral/${id}/gateway/${serialNumber}`)
      .expect(204);
  });

  it('should fail in deleting with wrong serial number', async () => {
    await Gateway.create(data);
    const { vendor, status } = data.peripherals[0];
    const created = await createPeripheral(serialNumber, vendor, status);
    const { id } = created.data.peripherals[0];
    await supertest(app)
      .delete(`${prefix}/peripheral/${id}/gateway/asdfasdfasdfasdf`)
      .expect(422)
      .then((response) => {
        expect(response.body.status).toBe(422);
        expect(response.body.message).toBe(
          'No gateway found with this serial number'
        );
      });
  });
  it('should fail in deleting with wrong peripheral id', async () => {
    await Gateway.create(data);
    const { vendor, status } = data.peripherals[0];
    await createPeripheral(serialNumber, vendor, status);
    await supertest(app)
      .delete(`${prefix}/peripheral/asdfasdfasdf/gateway/${serialNumber}`)
      .expect(404)
      .then((response) => {
        expect(response.body.status).toBe(404);
        expect(response.body.message).toBe('No peripheral found with this id');
      });
  });
});
