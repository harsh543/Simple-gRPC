var grpc = require('grpc');

const protoPath = require('path').join(__dirname, '../..', 'proto');
const proto = grpc.load({root: protoPath, file: 'work_leave.proto' });

const client = new proto.work_leave.EmployeeLeaveDaysService('localhost:50050', grpc.credentials.createInsecure());

function printResponse(error, response) {
    if (error)
        console.log('Error: ', error);
    else
        console.log(response);
}

function listEmployees() {
    client.list({}, function(error, employees) {
        printResponse(error, employees);
    });
}

function insertEmployee(id, name, desig) {
    var employee = {
        id: parseInt(id),
        name: name,
        desig: desig
    };
    client.insert(employee, function(error, empty) {
        printResponse(error, employee);
    });
}

function getEmployee(id) {
    client.get({
        id: parseInt(id)
    }, function(error, employee) {
        printResponse(error, employee);
    });
}

function deleteEmployee(id) {
    client.delete({
        id: parseInt(id)
    }, function(error, empty) {
        printResponse(error, empty);
    });
}

function watchEmployees() {
    var call = client.watch({});
    call.on('data', function(employee) {
        console.log(employee);
    });
}

var processName = process.argv.shift();
var scriptName = process.argv.shift();
var command = process.argv.shift();

if (command == 'list')
    listEmployees();
else if (command == 'insert')
    insertEmployee(process.argv[0], process.argv[1], process.argv[2]);
else if (command == 'get')
    getEmployee(process.argv[0]);
else if (command == 'delete')
    deleteEmployee(process.argv[0]);
else if (command == 'watch')
    watchEmployees();
