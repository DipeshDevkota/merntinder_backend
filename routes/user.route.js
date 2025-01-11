const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest.model");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

// Get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // Find connection requests sent to the logged-in user with status 'interested'
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName photoUrl about gender age");

    if (!connectionRequests || connectionRequests.length === 0) {
      return res.status(404).json({ message: "No connection requests found" });
    }

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // Find accepted connection requests where the logged-in user is either the sender or receiver
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    console.log("Connection Requests:", connectionRequests);

    // Map through the connection requests to get the IDs of the connected users
    const connectedUserIds = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId._id;  // If logged-in user is the sender, get the receiver's ID
      }
      return row.fromUserId._id;    // Otherwise, get the sender's ID
    });

    // Fetch the details of the connected users
    const userDetails = await User.find({ _id: { $in: connectedUserIds } }).select(USER_SAFE_DATA);

    // If no user details are found, send a 404 response
    if (!userDetails || userDetails.length === 0) {
      return res.status(404).json({ message: "No connections found!" });
    }

    console.log("User Details:", userDetails);

    // Send back the user details
    res.status(200).json({
      message: "Data fetched successfully!",
      data: userDetails, // Changed 'message' to 'data' for clarity
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});


userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
   console.log("loggeidn user",loggedInUser)
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 25;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId  toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
module.exports = userRouter;