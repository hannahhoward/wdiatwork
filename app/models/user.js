'use strict';


module.exports = function (mongoose, supergoose) {

  var Schema = mongoose.Schema

  /**
   * A Validation function for local strategy properties
   */

  var validatePresenceOf = function(property) {
    return ((this.provider !== 'local' && !this.updated) || property.length);
  };

  /**
   * User Schema
   */
  var UserSchema = new Schema({
    firstName: {
      type: String,
      trim: true,
      default: '',
    },
    lastName: {
      type: String,
      trim: true,
      default: '',
    },
    accessToken: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      trim: true,
      default: '',
      match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    username: {
      type: String,
      unique: true,
      required: 'Please fill in a username',
      trim: true
    },
    updated: {
      type: Date
    },
    created: {
      type: Date,
      default: Date.now
    }
  });

  UserSchema.plugin(supergoose, {});

  return mongoose.model('User', UserSchema);

}