exports.create = function (eventValue, storyNumber) {
  storyNumber = storyNumber || '1';

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
            value: storyNumber
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
