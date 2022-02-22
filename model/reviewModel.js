const mongoose = require("mongoose");
const {dbLink} =  process.env || require("../secrets") ; 

mongoose.connect(dbLink).then(function (db) {
    // console.log(db);
    console.log("connected to db 2")
}).catch(function (err) {
    console.log("err", err);
})
const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, "Review can't be empty"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, "Review must contain some rating"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        // info
        type: mongoose.Schema.ObjectId,
        required: [true, "Review must belong to a user"],
        ref:"UserModel"
    },
    plan: {
        // info
        type: mongoose.Schema.ObjectId,
        required: [true, "Review must belong to a plan "],
        ref:"PlanModel"
    }
})
const ReviewModel = mongoose.model("reviewModel", reviewSchema);
module.exports = ReviewModel;