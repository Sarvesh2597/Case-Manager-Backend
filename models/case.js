const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var CounterSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 1 }
});
var counter = mongoose.model('counter', CounterSchema);

CaseSchema = new Schema({
  caseId: {
    unique: true,
    type: String
  },
  provider: String,
  claimantFirstName: String,
  claimantLastName: String,
  claimantAddress: String,
  insuredFirstName: String,
  insuredLastName: String,
  insuredAddress: String,
  policyNo: String,
  insuranceCompany: String,
  caseStatus: String,
  courtName: String,
  amountInDispute: String,
  insuranceClaimNo: String,
  dateOfAccident: Date,
  AAA: String,
  AAA_awardDate: Date,
  minDateOfService: Date,
  maxDateOfService: Date,
  claimAmount: String,
  dateBillSentEnd: String,
  denialReason: String,
  interest: String,
  numberOfBills: String,
  settlementAdjuster: String,
  settlementAmount: String,
  settlementDate: Date,
  settlementOfferDate: Date,
  attorneyFee: String,
  caseAge: String,
  paid: String,
  arbitary: String,
  adjuster: String,
  serviceRenderedLocation: String,
  hearingDate: Date,
  representativeContact: String,
  DefendantAttorneyFileNo: String,
  settlementNotice: String,
  dateBillSentStart: Date,
  date_AAA_ARB_field: Date,
  dateExtension: Date,
  AAA_ConfirmedDate: Date,
  dateAffidavitField: Date,
  date_AAA_response_received: Date,
  date_AAA_concilliationOver: Date,
  files: Array,
});

CaseSchema.pre("save", function(next) {
    console.log('dfdsfsfdsdsds')
  var doc = this;
  counter
    .findByIdAndUpdate(
      { _id: "entityId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    )
    .then(function(count) {

      console.log("...count: " + JSON.stringify(count));
      doc.caseId = 'C' + count.seq;
      next();
    })
    .catch(function(error) {
      console.error("counter error-> : " + error);
      throw error;
    });
});

module.exports = mongoose.model("Case", CaseSchema);
