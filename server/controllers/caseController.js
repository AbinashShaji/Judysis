const Case = require("../models/caseModel");
const multer = require("multer");
const advocateSchema = require("../models/advocateModel");

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "./upload");
  },
  filename: function (req, file, cb) {
    const uniquePrefix = "prefix-";
    const originalname = file.originalname;
    const extension = originalname.split(".").pop();
    const filename =
      uniquePrefix +
      originalname.substring(0, originalname.lastIndexOf(".")) +
      "-" +
      Date.now() +
      "." +
      extension;
    cb(null, filename);
  },
});
const upload = multer({ storage: storage }).single("evidence");
// Create a new case
const createCase = async (req, res) => {
  const newCase = new Case({
    userId: req.body.userId,
    title: req.body.title,
    description: req.body.description,
    type: req.body.type,
    dateOfIncident: req.body.dateOfIncident,
    opponentName: req.body.opponentName,
    opponentAddress: req.body.opponentAddress,
    location: req.body.location,
    evidence: req.file,
  });

  try {
    const savedCase = await newCase.save();

    let advSuggestions = await advocateSchema.find({
      specialization: req.body.type,
      isActive: true,
    });
    res.json({
      status: 200,
      msg: "Case created successfully",
      data: savedCase,
      suggestions: advSuggestions,
    });
  } catch (err) {
    res.json({
      status: 500,
      msg: "Error creating case",
      data: err,
    });
  }
};

// Get all cases
const getAllCases = async (req, res) => {
  try {
    const cases = await Case.find().populate("userId").populate("advocateId");
    res.json({
      status: 200,
      data: cases,
    });
  } catch (err) {
    res.json({
      status: 500,
      msg: "Error retrieving cases",
      data: err,
    });
  }
};

// Get a single case by ID
const getCaseByUserId = async (req, res) => {
  try {
    const caseItem = await Case.find({ userId: req.params.id });
    if (!caseItem) {
      return res.json({
        status: 404,
        msg: "No Cases found",
      });
    }
    res.json({
      status: 200,
      data: caseItem,
    });
  } catch (err) {
    res.json({
      status: 500,
      msg: "Error retrieving case",
      data: err,
    });
  }
};

// Get a single case by ID
const getCaseById = async (req, res) => {
  try {
    const caseItem = await Case.findById({ _id: req.params.id })
      .populate("advocateId")
      .populate("userId");
    if (!caseItem) {
      return res.json({
        status: 404,
        msg: "No Cases found",
      });
    }
    res.json({
      status: 200,
      data: caseItem,
      msg: "data obtained succesfully",
    });
  } catch (err) {
    res.json({
      status: 500,
      msg: "Error retrieving case",
      data: err,
    });
  }
};
// Get all advocateAcceptedCases
const getCaseAdvStatus = async (req, res) => {
  try {
    const caseItem = await Case.find({
      advocateStatus: "true",
      judgeStatus: false,
    })
      .populate("advocateId")
      .populate("userId");
    if (!caseItem) {
      return res.json({
        status: 404,
        msg: "No Cases found",
        data: [],
      });
    }
    res.json({
      status: 200,
      data: caseItem,
      msg: "data obtained succesfully",
    });
  } catch (err) {
    res.json({
      status: 500,
      msg: "Error retrieving case",
      data: err,
    });
  }
};

const getCaseByJudgeId = async (req, res) => {
  try {
    const caseItem = await Case.find({
      judgeId: req.params.id,
      caseStatus: { $ne: "Closed" },
    })
      .populate("advocateId")
      .populate("userId");

    res.json({
      status: 200,
      data: caseItem,
      msg: "data obtained succesfully",
    });
  } catch (err) {
    res.json({
      status: 500,
      msg: "Error retrieving case",
      data: err,
    });
  }
};

const getClosedCaseByJudgeId = async (req, res) => {
  try {
    const caseItem = await Case.find({
      judgeId: req.params.id,
      caseStatus: "Closed",
    })
      .populate("advocateId")
      .populate("userId");

    res.json({
      status: 200,
      data: caseItem,
      msg: "data obtained succesfully",
    });
  } catch (err) {
    res.json({
      status: 500,
      msg: "Error retrieving case",
      data: err,
    });
  }
};
// Update a case by ID
const updateCase = async (req, res) => {
  try {
    const updatedCase = await Case.findByIdAndUpdate(
      { _id: req.params.id },
      {
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        dateOfIncident: req.body.dateOfIncident,
        opponentName: req.body.opponentName,
        opponentAddress: req.body.opponentAddress,
        location: req.body.location,
        evidence: req.file,
      }
    );
    if (!updatedCase) {
      return res.json({
        status: 404,
        msg: "Case not found",
      });
    }
    res.json({
      status: 200,
      msg: "Case updated successfully",
      data: updatedCase,
    });
  } catch (err) {
    res.json({
      status: 500,
      msg: "Error updating case",
      data: err,
    });
  }
};
// Add adv
const assignJudgeCaseById = async (req, res) => {
  try {
    const deletedCase = await Case.findByIdAndUpdate(req.params.id, {
      judgeId: req.body.judgeId,
      judgeStatus: true,
    });

    res.json({
      status: 200,
      msg: "Case Updated successfully",
      data: deletedCase,
    });
  } catch (err) {
    res.json({
      status: 500,
      msg: "Error deleting case",
      data: err,
    });
  }
};
// Delete a case by ID
const deleteCase = async (req, res) => {
  try {
    const deletedCase = await Case.findByIdAndDelete(req.params.id);
    if (!deletedCase) {
      return res.json({
        status: 404,
        msg: "Case not found",
      });
    }
    res.json({
      status: 200,
      msg: "Case deleted successfully",
      data: deletedCase,
    });
  } catch (err) {
    res.json({
      status: 500,
      msg: "Error deleting case",
      data: err,
    });
  }
};

const getCaseType = (req, res) => {
  console.log("p");
  const keywords = {
    "Criminal Law": [
      "burglary",
      "murder",
      "theft",
      "arrested",
      "defendant",
      "charged",
      "crime",
      "criminal",
      "missing",
    ],
    "Tax Law": [
      "tax",
      "taxes",
      "IRS",
      "revenue",
      "taxpayer",
      "deductions",
      "income tax",
      "corporate tax",
      "capital gains",
      "estate tax",
      "property tax",
      "sales tax",
      "tax audit",
      "tax evasion",
      "tax fraud",
      "tax return",
      "withholding",
      "tax code",
      "tax compliance",
    ],
    "Real Estate Law": [
      "real estate",
      "property",
      "landlord",
      "tenant",
      "lease",
      "rental",
      "eviction",
      "foreclosure",
      "title deed",
      "mortgage",
      "property tax",
      "boundary dispute",
      "zoning",
      "land use",
      "condominium",
      "co-op",
      "deed restrictions",
      "easement",
    ],

    "Civil Law": [
      "sued",
      "contract",
      "breach",
      "plaintiff",
      "company",
      "liability",
    ],
    "Family Law": [
      "divorce",
      "custody",
      "marriage",
      "spouse",
      "parents",
      "family",
    ],
    "Environmental Law": [
      "pollution",
      "environment",
      "waste",
      "ecology",
      "conservation",
      "emissions",
    ],
    "Banking and Finance Law": [
      "loan",
      "interest",
      "bank",
      "mortgage",
      "investment",
      "finance",
    ],
    "Human Rights Law": [
      "rights",
      "discrimination",
      "freedom",
      "justice",
      "equality",
    ],
    "Constitutional Law": [
      "constitution",
      "amendment",
      "bill of rights",
      "federal",
      "government",
    ],
    "Immigration Law": [
      "visa",
      "immigration",
      "deportation",
      "citizenship",
      "asylum",
    ],
    "International Law": [
      "treaty",
      "international",
      "foreign",
      "diplomatic",
      "global",
    ],
    "Intellectual Property Law": [
      "patent",
      "copyright",
      "trademark",
      "intellectual property",
      "infringement",
    ],
    "Corporate Law": [
      "corporate",
      "business",
      "merger",
      "acquisition",
      "shareholder",
      "company",
    ],
  };
  const suggestCaseType = () => {
    let arr = [];
    const lowerDescription = req.params.description.toLowerCase();
    console.log("p");
    const caseTypes = Object.keys(keywords);

    for (const type of caseTypes) {
      const words = keywords[type];
      for (const word of words) {
        if (lowerDescription.includes(word)) {
          console.log(type);
          if (!arr.includes(type)) arr.push(type);
          // return type;
        }
      }
    }

    return arr; // Default if no keywords match
  };
  let data = [];
  data = suggestCaseType();
  res.json({
    status: 200,
    data: data,
  });
};

//get cases by judge and advocate assign
const getCasesJudgeAssign = async (req, res) => {
  try {
    const caseItem = await Case.find({
      advocateStatus: "true",
      judgeStatus: true,
    })
      .populate("advocateId")
      .populate("userId");
    if (!caseItem) {
      return res.json({
        status: 404,
        msg: "No Cases found",
        data: [],
      });
    }
    res.json({
      status: 200,
      data: caseItem,
      msg: "data obtained succesfully",
    });
  } catch (err) {
    res.json({
      status: 500,
      msg: "Error retrieving case",
      data: err,
    });
  }
};

module.exports = {
  createCase,
  getAllCases,
  getCaseById,
  updateCase,
  deleteCase,
  upload,
  getCaseType,
  getCaseAdvStatus,
  getCaseByUserId,
  assignJudgeCaseById,
  getCaseByJudgeId,
  getClosedCaseByJudgeId,
  getCasesJudgeAssign,
};
