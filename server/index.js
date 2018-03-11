const grpc = require('grpc');

const proto = grpc.load('proto/work_leave.proto');
const server = new grpc.Server();
var leaveStream = new events.EventEmitter();
server.addProtoService(proto.work_leave.EmployeeLeaveDaysService.service, {

  eligibleForLeave(call, callback) {
    if (call.request.requested_leave_days > 0) {
      if (call.request.accrued_leave_days > call.request.requested_leave_days) {
        callback(null, { eligible: true });
      } else {
        callback(null, { eligible: false });
      }
    } else {
      callback(new Error('Invalid requested days'));
    }
  },


  grantLeave(call, callback) {
    let granted_leave_days = call.request.requested_leave_days;
    let accrued_leave_days = call.request.accrued_leave_days - granted_leave_days;

    callback(null, {
      granted: true,
      granted_leave_days,
      accrued_leave_days
    });
  },
   watch: function(stream) {
        leaveStream.on('new_leave', function(granted_leave_days){
            stream.write(granted_leave_days);
        });
   }
});

server.bind('0.0.0.0:50050', grpc.ServerCredentials.createInsecure());

//Start the server
server.start();
console.log('grpc server running on port:', '0.0.0.0:50050');
