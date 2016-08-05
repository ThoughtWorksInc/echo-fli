exports.create = function (eventValue) {
  return {
    session: {},
    version: '1.0',
    request: {
      type: 'IntentRequest',
      intent: {
        name: 'FliIntent',
        slots: {
          Number: {
            name: 'Number',
            value: '1'
          },
          Event: {
            name: 'Event',
            value: eventValue
          }
        }
      }
    }
  };
};
