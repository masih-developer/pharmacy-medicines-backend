const Model = require('./models')

class User extends Model{
  constructor(){
    super("User", {
      firstname: {
        type: String,
        required: true,
      },
      lastname: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
      },
    });
  }
}
module.exports = new User().getModel();
