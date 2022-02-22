const mongoose = require("mongoose");
const {dbLink} =  require("../secrets") || process.env ; 
    mongoose.connect(dbLink).then(function(db){
        // console.log(db)
        console.log('connected to db 1');
    }).catch(function(err){
        console.log(err)
    });
//mongoose -> data -> exact -> data -> that is required to form an entity 
//  data completness , data validation
// name ,email,password,confirmPassword-> min ,max,confirmPassword,required ,unique 
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: function () {
                // third party library 
                return validator.validate(this.email)
            }
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        }
        ,
        confirmPassword: {
            type: String,
            required: true,
            minlength: 8,
            validate: function () {
                return this.password == this.confirmPassword
            }
        },
        createdAt: {
            type: String,

        },
        token: String,
        validUpto: Date,
        role: {
            type: String,
            enum: ["admin", "ce", "user"],
            default: "user"
        },
        bookings: {
            //   array of object id 
            type: [mongoose.Schema.ObjectId],
            ref: "bookingModel"
        },
    })
// hook
userSchema.pre('save', function (next) {
    // do stuff
    this.confirmPassword = undefined;
    next();
});
// document method
userSchema.methods.resetHandler = function (password, confirmPassword) {
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.token = undefined;
}
// model
let userModel = mongoose.model("UserModel", userSchema);
module.exports = userModel;