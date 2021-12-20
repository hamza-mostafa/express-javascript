# express-javascript

## Introduction:

This sample project is managing gateways - master devices that control multiple peripheral
devices.  
Your task is to create a REST service (JSON/HTTP) for storing information about these
gateways and their associated devices. This information must be stored in the database.  
When storing a gateway, any field marked as “to be validated” must be validated and an error
returned if it is invalid. Also, no more that 10 peripheral devices are allowed for a gateway.
The service must also offer an operation for displaying information about all stored gateways
(and their devices) and an operation for displaying details for a single gateway. Finally, it must
be possible to add and remove a device from a gateway.


## How to start the application:

Before starting, make sure you have docker and docker-compose installed on your machine,

To start the application, in the main folder run 
```bash
sh start.sh
```
After the docker is done,
[click here to access swagger docs](http://localhost:3000/api-docs/)

To test the application, in the main folder run
```bash
sh test.sh
```

To remove all related docker stuff for this installation to run clean install, in the main folder run
```bash
sh stop.sh
```



### Notes:
 - Only 1 model have been used as the max of attached devices is 10 
and hence no use of doing a relation similar to the relations databases 
one-to-many and use the benefits of document database.
 - Peripherals UID has been intentionally made to uuid`string`, as to make sure it is unique.
