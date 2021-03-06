const requestsModel = require("../database/models/requestSchema");
const workerModel = require("../database/models/workerSchema");

const creatNewRequest = (req, res) => {
  const worker = req.params.id;
  const newRequest = new requestsModel({
    requester: req.token.userId,
    worker,
  });

  newRequest
    .save()
    .then((result) => {
      res.status(201).json({
        success: true,
        message: `The request has been created Successfully`,
        Request: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: `Server Error`,
        err: err,
      });
    });
};
/************************************************************************************** */
const getAllRequests = (req, res) => {
  requestsModel
    .find({})
    .populate("worker", "name role _id")
    .populate("requester", "name role _id location phone image")
    .then((result) => {
      if (result.length) {
        res.status(200).json({
          success: true,
          message: `All The Requests`,
          Requests: result,
        });
      } else {
        res.status(404).json({
          success: false,
          message: `No Requests Yet`,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: `No Requests Yet`,
      });
    });
};
/************************************************************************************** */

const getRequestsByWorkerId = (req, res) => {
  const worker_id = req.params.id;
  requestsModel
    .find({ worker: worker_id })
    .populate("worker", "name _id")
    .populate("requester", "name _id location phone image")
    .then((result) => {
      if (!result.length) {
        return res.status(404).json({
          success: false,
          message: `No Requests for this worker with ${worker_id}`,
        });
      }
      res.status(200).json({
        success: true,
        message: `The requests ${worker_id} `,
        requests: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: `Server Error`,
      });
    });
};
/*********************************************** */

module.exports = {
  creatNewRequest,
  getAllRequests,
  getRequestsByWorkerId,
};
