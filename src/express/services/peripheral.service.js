const uuid = require('uuid');
const { logDir } = require('../helpers/index.helper');
const {
  getGateway,
  updateGateway,
  updateOneGateway,
} = require('./gateway.service');
const { maxDevices } = require('../config/device.config');

const response = { state: -1 };

exports.getPeripheral = async (serialNumber, id) => {
  try {
    const gateway = await getGateway(serialNumber);
    if (!gateway) {
      return response;
    }

    const peripheral = gateway.peripherals.filter((p) => p.id === id);

    if (peripheral.length === 0) {
      response.state = 0;
    } else {
      [response.state, response.data] = [1, peripheral[0]];
    }
    return response;
  } catch (e) {
    logDir(e);
    throw Error(`Error while fetching peripheral -- ${e.message}`);
  }
};

exports.createPeripheral = async (serialNumber, vendor, status) => {
  try {
    const peripheral = {
      vendor,
      status,
      dateCreated: Date.now(),
      id: uuid.v4(),
    };

    const gateway = await getGateway(serialNumber);

    if (!gateway) {
      response.state = -1;
      return response;
    }
    if (gateway.peripherals.length >= maxDevices) {
      response.state = -2;
      return response;
    }

    response.state = 1;
    response.data = await updateGateway(
      { serialNumber },
      {
        $push: {
          peripherals: peripheral,
        },
      },
      {}
    );
    return response;
  } catch (e) {
    logDir(e);
    throw Error(`Error while adding peripheral -- ${e.message}`);
  }
};

exports.updatePeripheral = async (serialNumber, id, updatedData) => {
  try {
    const gateway = await getGateway(serialNumber);

    if (!gateway) {
      response.state = -1;
      return response;
    }

    const peripheral = gateway.peripherals.filter((p) => p.id === id);

    if (peripheral.length === 0) {
      response.state = 0;
      return response;
    }

    const updateDocument = {
      $set: {},
    };
    Object.keys(updatedData).forEach((key) => {
      if (updatedData[key] !== null) {
        updateDocument.$set[`peripherals.$[peripheral].${key}`] =
          updatedData[key];
      }
    });
    const options = {
      arrayFilters: [
        {
          'peripheral.id': id,
        },
      ],
    };
    response.state = 1;
    response.data = await updateGateway(
      { serialNumber },
      updateDocument,
      options
    );
    return response;
  } catch (e) {
    logDir(e);
    throw Error(`Error while updating peripheral -- ${e.message}`);
  }
};

exports.deletePeripheral = async (serialNumber, id) => {
  try {
    const gatewayUpdate = await updateOneGateway(
      { serialNumber },
      {
        $pull: {
          peripherals: { id },
        },
      }
    );
    response.state = 1;

    if (gatewayUpdate.modifiedCount === 0) {
      response.state = 0;
    }

    if (gatewayUpdate.matchedCount === 0) {
      response.state = -1;
    }

    return response;
  } catch (e) {
    logDir(e);
    throw Error(`Error while deleting peripheral -- ${e.message}`);
  }
};
