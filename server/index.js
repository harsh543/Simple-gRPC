var grpc = require('grpc');

const proto = grpc.load('proto/work_leave.proto');

var events = require('events');
var employeeStream = new events.EventEmitter();

// In-memory array of employee objects
var employees = [{
    id: 123,
    name: 'John Kariuki',
    desig: 'Developer'
}];

var server = new grpc.Server();
server.addProtoService(proto.work_leave.EmployeeLeaveDaysService.service, {
    list: function(call, callback) {
        callback(null, employees);
    },
    insert: function(call, callback) {
        var employee = call.request;
        employees.push(employee);
        employeeStream.emit('new_employee', employee);
        callback(null, {});
    },
    get: function(call, callback) {
        for (var i = 0; i < employees.length; i++)
            if (employees[i].id == call.request.id)
                return callback(null, employees[i]);
        callback({
            code: grpc.status.NOT_FOUND,
            details: 'Not found'
        });
    },
    delete: function(call, callback) {
        for (var i = 0; i < employess.length; i++) {
            if (employees[i].id == call.request.id) {
                employees.splice(i, 1);
                return callback(null, {});
            }
        }
        callback({
            code: grpc.status.NOT_FOUND,
            details: 'Not found'
        });
    },
    watch: function(stream) {
        employeeStream.on('new_employee', function(employee){
            stream.write(employee);
        });
    }
});

server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
server.start();
