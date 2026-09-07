/**
 * ============================================================================
 * CONTROLLER: caseController.js
 * HANDOVER SUMMARY:
 * This is the central legal filing engine for JudiSys.
 * It handles the entire lifecycle of a legal petition:
 * 1. Digital filing with supporting document uploads by citizens.
 * 2. Automated legal category classification based on incident description.
 * 3. Case allocation and docketing for lawyers and judges.
 * 4. Tracking case progress until final courtroom closure.
 * ============================================================================
 */

const Case = require("../models/caseModel");
const multer = require("multer");
const advocateSchema = require("../models/advocateModel");

/**
 * FILE UPLOAD STORAGE (Multer)
 * Configures where uploaded evidence files (PDFs, photos, affidavits) are stored.
 * Files are given a unique timestamp prefix and saved safely into the './upload' folder.
 */
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

// Multer middleware that looks for a single uploaded file named 'evidence'.
const upload = multer({ storage: storage }).single("evidence");

/**
 * FUNCTION: createCase
 * PURPOSE: Submits a brand new legal petition with incident details and evidence proof.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: The 'Submit Case' form on UserAddCases.js.
 * - Endpoint: POST /judisys_api/createCase
 * - Intelligent Feature: Immediately searches for verified, active lawyers whose
 *   specialization matches the case category and returns them as helpful 'suggestions'!
 * - If this data changes:
 *   - The case is recorded in the citizen's recent cases list (UserViewRecentCases.js).
 *   - The citizen is shown recommended lawyers on the confirmation screen.
 */
const createCase = async (req, res) => {
  // Step 1: Package form data and uploaded evidence file into a new Case document.
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
    // Step 2: Save the petition in MongoDB.
    const savedCase = await newCase.save();

    // Step 3: Find matching lawyers to recommend to the citizen right away.
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

/**
 * FUNCTION: getAllCases
 * PURPOSE: Retrieves every case in the judicial system with full citizen and lawyer profiles.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: Administrative oversight tables in AdminViewAllCases.js and COViewAllCases.jsx.
 * - Endpoint: POST /judisys_api/getAllCases
 */
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

/**
 * FUNCTION: getCaseByUserId
 * PURPOSE: Retrieves all legal petitions filed by a specific citizen.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: Citizen Case History screen (UserViewRecentCases.js).
 * - Endpoint: POST /judisys_api/getCaseByUserId/:id
 * - If this data changes: Feeds the case cards where citizens check their case progress.
 */
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

/**
 * FUNCTION: getCaseById
 * PURPOSE: Fetches the complete dossier of a single case by its unique database ID.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: AdminViewSingleCase.js, JudgeViewSingleCase.jsx, and COViewSinglecase.jsx.
 * - Endpoint: POST /judisys_api/getCaseById/:id
 * - Populates complete details for both the client (userId) and lawyer (advocateId).
 */
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

/**
 * FUNCTION: getCaseAdvStatus
 * PURPOSE: Finds cases that have been accepted by a lawyer but are still awaiting a judge assignment.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: Court Office overview (COViewAllCasesAccepted.js).
 * - Endpoint: POST /judisys_api/getCaseAdvStatus
 * - If this data changes: Shows the court clerk which cases are ready to be scheduled for trial.
 */
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

/**
 * FUNCTION: getCaseByJudgeId
 * PURPOSE: Retrieves all active, ongoing court cases assigned to a specific judge.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: Component load on JudgeViewCases.js.
 * - Endpoint: POST /judisys_api/getCaseByJudgeId/:id
 * - Filters out cases where 'caseStatus: Closed' so the judge only sees pending trials.
 */
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

/**
 * FUNCTION: getClosedCaseByJudgeId
 * PURPOSE: Retrieves historical cases that have reached a final verdict by this judge.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: Component load on JudgeViewClosedCases.jsx.
 * - Endpoint: POST /judisys_api/getClosedCaseByJudgeId/:id
 * - Displays the completed judicial archive and judgments.
 */
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

/**
 * FUNCTION: updateCase
 * PURPOSE: Updates an existing case petition with revised details or new evidence.
 */
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

/**
 * FUNCTION: assignJudgeCaseById
 * PURPOSE: Court Office assigns a presiding judge to take charge of a case.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: The 'Assign Judge' button in Court Office (COViewSinglecase.jsx).
 * - Endpoint: POST /judisys_api/assignJudgeCaseById/:id
 * - If this data changes: Sets 'judgeId' and 'judgeStatus: true'.
 *   The case moves directly into the Judge's active trial docket (JudgeViewCases.js)!
 */
const assignJudgeCaseById = async (req, res) => {
  try {
    const updatedCase = await Case.findByIdAndUpdate(req.params.id, {
      judgeId: req.body.judgeId,
      judgeStatus: true,
    });

    res.json({
      status: 200,
      msg: "Case Updated successfully",
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

/**
 * FUNCTION: deleteCase
 * PURPOSE: Deletes a case petition from the system.
 */
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

/**
 * FUNCTION: getCaseType
 * PURPOSE: Intelligent keyword assistant that suggests legal categories based on words in a story.
 * 
 * HOW IT WORKS (IN PLAIN ENGLISH):
 * 1. A citizen writes a story like: "Someone broke into my house and stole my laptop."
 * 2. This function scans their text for keywords like 'stole', 'burglary', or 'crime'.
 * 3. It automatically returns "Criminal Law" so the citizen selects the right case category!
 */
const getCaseType = (req, res) => {
  // Dictionary of keywords mapped to official legal branches
  const keywords = {
    "Criminal Law": [
      "burglary", "murder", "theft", "arrested", "defendant", "charged", "crime", "criminal", "missing",
    ],
    "Tax Law": [
      "tax", "taxes", "IRS", "revenue", "taxpayer", "deductions", "income tax", "corporate tax",
      "capital gains", "estate tax", "property tax", "sales tax", "tax audit", "tax evasion", "tax fraud",
    ],
    "Real Estate Law": [
      "real estate", "property", "landlord", "tenant", "lease", "rental", "eviction", "foreclosure",
      "title deed", "mortgage", "property tax", "boundary dispute", "zoning", "land use", "condominium",
    ],
    "Civil Law": [
      "sued", "contract", "breach", "plaintiff", "company", "liability",
    ],
    "Family Law": [
      "divorce", "custody", "marriage", "spouse", "parents", "family",
    ],
    "Environmental Law": [
      "pollution", "environment", "waste", "ecology", "conservation", "emissions",
    ],
    "Banking and Finance Law": [
      "loan", "interest", "bank", "mortgage", "investment", "finance",
    ],
    "Human Rights Law": [
      "rights", "discrimination", "freedom", "justice", "equality",
    ],
    "Constitutional Law": [
      "constitution", "amendment", "bill of rights", "federal", "government",
    ],
    "Immigration Law": [
      "visa", "immigration", "deportation", "citizenship", "asylum",
    ],
    "International Law": [
      "treaty", "international", "foreign", "diplomatic", "global",
    ],
    "Intellectual Property Law": [
      "patent", "copyright", "trademark", "intellectual property", "infringement",
    ],
    "Corporate Law": [
      "corporate", "business", "merger", "acquisition", "shareholder", "company",
    ],
  };

  const suggestCaseType = () => {
    let arr = [];
    const lowerDescription = req.params.description.toLowerCase();
    const caseTypes = Object.keys(keywords);

    for (const type of caseTypes) {
      const words = keywords[type];
      for (const word of words) {
        if (lowerDescription.includes(word)) {
          if (!arr.includes(type)) arr.push(type);
        }
      }
    }
    return arr;
  };

  let data = suggestCaseType();
  res.json({
    status: 200,
    data: data,
  });
};

/**
 * FUNCTION: getCasesJudgeAssign
 * PURPOSE: Retrieves cases that have BOTH an advocate and a judge assigned.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: Court Office hearing coordination view.
 * - Endpoint: POST /judisys_api/getCasesJudgeAssign
 */
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
