const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const { User } = require("./user");
const listingSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  image: {
    filename: { type: String, default: "listingimage" },
    url: {
      type: String,
      default:
        "https://plus.unsplash.com/premium_photo-1747371476846-1af8fbc9f3c3?q=80&w=1720&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      set: v =>
        v === ""
          ? "https://plus.unsplash.com/premium_photo-1747371476846-1af8fbc9f3c3?q=80&w=1720&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          : v
    }
  },
  price: Number,
  location: String,
  country: String,
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review"
  }],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  latitude: {
    type: Number,
    default: 28.6139
  },
  longitude: {
    type: Number,
    default: 77.2090
  }

});
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: listing.reviews });
  }
})
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;