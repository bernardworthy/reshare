var app = require('../reshare-app'),
    userStore = require('../data/user-store');

app.get('/api/users', listUsers);
app.get('/api/users/:id', getUser);
app.post('/api/users', upsertUser);
app.delete('/api/users/:id', disableUser);

function promiseResponse(promise, res) {
  promise.then(function (result) {
    res.json(result || {});
  }).catch(function (err) {
    res.status(500).json(err);
  })
}

// listUsers lists all users in the system
function listUsers (req, res) {
  promiseResponse(userStore.list({}), res);
}

// getUser gets a user by id
function getUser (req, res) {
  promiseResponse(userStore.list({ userId: req.params.id }), res);
}

// Adds/updates a user in a format like this:
// {
//   userId: 'gihubid',
//   role: 'admin'
// }
function upsertUser (req, res) {
  promiseResponse(userStore.save(req.body), res);
}

// disableUser disables the specified user
function disableUser (req, res) {
  var query = { userId: req.params.id },
      update = { $set: { disabled: true } };

  promiseResponse(userStore.update(query, update), res);
}

// Export the index view so it can optionally
// be configured as a default route
module.exports = function () {
  return {
    index: listUsers
  };
};
