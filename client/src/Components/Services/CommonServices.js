/**
 * ============================================================================
 * SERVICE: CommonServices.js
 * HANDOVER SUMMARY:
 * This is the primary API communication hub for the entire frontend application.
 * It provides reusable HTTP functions for logging in, registering, uploading files, 
 * booking appointments, filing cases, and fetching court hearing history across
 * Citizen, Advocate, Judge, and Court Office components.
 * ============================================================================
 */

import React from 'react';
import axios from 'axios';
import { API_BASE_URL } from './BaseURL';
import { IMG_BASE_URL } from './BaseURL';

/**
 * FUNCTION: login
 * PURPOSE: Transmits login credentials (email & password) to the backend.
 * 
 * ROUTING & RENDERING FLOW:
 * - Used by: UserLogin.js, AdvocateLogin.js, JudgeLogin.jsx, and COLogin.jsx.
 * - Endpoint: `${API_BASE_URL}/${api}`
 * - Returns: { success: true, user: userData } on valid credentials.
 */
export const login = async (data, api) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/${api}`, data);
        console.log(response);

        if (response.status === 200) {
            return { success: true, user: response.data.data };
        } else {
            return { success: false, message: response.data.msg };
        }
    } catch (error) {
        if (error.response && error.response.data) {
            return {
                success: false,
                message: error.response.data.msg || 'Login failed',
            };
        }
        return {
            success: false,
            message: 'An unexpected error occurred',
        };
    }
};

/**
 * FUNCTION: register
 * PURPOSE: Submits plain text JSON registration data for user accounts.
 */
export const register = async (data, api) => {
    try {
        console.log(data);
        const response = await axios.post(`${API_BASE_URL}/${api}`, data);
        console.log(response);

        if (response.data.status === 200) {
            return { success: true, user: response.data.data };
        } else {
            return { success: false, message: response.data.msg };
        }
    } catch (error) {
        if (error.response && error.response.data) {
            return {
                success: false,
                message: error.response.data.msg || 'Registration failed',
            };
        }
        return {
            success: false,
            message: 'An unexpected error occurred',
        };
    }
};

/**
 * FUNCTION: registerWithFile
 * PURPOSE: Submits registration forms that include uploaded photos or certificates (multipart/form-data).
 * 
 * ROUTING & RENDERING FLOW:
 * - Used by: UserRegistration.js and AdvocateReg.js.
 */
export const registerWithFile = async (data, api) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/${api}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(response);

        if (response.data.status === 200) {
            return { success: true, user: response.data.data };
        } else {
            return { success: false, message: response.data.msg };
        }
    } catch (error) {
        if (error.response && error.response.data) {
            return {
                success: false,
                message: error.response.data.msg || 'Registration failed',
            };
        }
        return {
            success: false,
            message: 'An unexpected error occurred',
        };
    }
};

/**
 * FUNCTION: AddCase
 * PURPOSE: Submits a new case petition along with supporting proof documents.
 * 
 * ROUTING & RENDERING FLOW:
 * - Used by: Citizen Case Filing screen (UserAddCases.js).
 * - Returns: Newly saved case info plus matching advocate recommendations!
 */
export const AddCase = async (data, api) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/${api}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(response);

        if (response.status === 200) {
            return { 
                success: true, 
                user: response.data.data, 
                suggestions: response.data.suggestions 
            };
        } else {
            return { success: false, message: response.data.msg };
        }
    } catch (error) {
        if (error.response && error.response.data) {
            return {
                success: false,
                message: error.response.data.msg || 'Registration failed',
            };
        }
        return {
            success: false,
            message: 'An unexpected error occurred',
        };
    }
};

/**
 * FUNCTION: forgotPassword
 * PURPOSE: Initiates password recovery by sending user email to backend.
 */
export const forgotPassword = async (data, api) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/${api}`, data);
        console.log(response);

        if (response.status === 200) {
            return { success: true, user: response.data.data };
        } else {
            return { success: false, message: response.data.msg };
        }
    } catch (error) {
        if (error.response && error.response.data) {
            return {
                success: false,
                message: error.response.data.msg || 'Mail Sending failed',
            };
        }
        return {
            success: false,
            message: 'An unexpected error occurred',
        };
    }
};

/**
 * FUNCTION: resetPassword
 * PURPOSE: Submits new password for a verified user ID.
 */
export const resetPassword = async (data, api, id) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/${api}/${id}`, data);
        console.log(response);

        if (response.status === 200) {
            return { success: true, user: response.data.data };
        } else {
            return { success: false, message: response.data.msg };
        }
    } catch (error) {
        if (error.response && error.response.data) {
            return {
                success: false,
                message: error.response.data.msg || 'Reset Password failed',
            };
        }
        return {
            success: false,
            message: 'An unexpected error occurred',
        };
    }
};

/**
 * FUNCTION: fetchHearingsByCaseId
 * PURPOSE: Convenience function to retrieve hearing timeline logs for a case.
 * 
 * ROUTING & RENDERING FLOW:
 * - Used by: UserViewHearingDetails.jsx and AdvocateCaseHearings.jsx.
 */
export const fetchHearingsByCaseId = async (id) => {
    try {
      const result = await ViewById("getStatusByCaseId", id);
      if (result.success) {
        return result.user || [];
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error fetching hearings:", error);
      throw error;
    }
};
  
/**
 * FUNCTION: ViewById
 * PURPOSE: Fetches a single database item by appending an ID to the URL path.
 * 
 * ROUTING & RENDERING FLOW:
 * - Used by: View single user, view advocate profile, view single case details.
 */
export const ViewById = async (api, id) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/${api}/${id}`);
        console.log(response);

        if (response.status === 200) {
            return { success: true, user: response.data.data };
        } else {
            return { success: false, message: response.data.msg };
        }
    } catch (error) {
        if (error.response && error.response.data) {
            return {
                success: false,
                message: error.response.data.msg || 'View User failed',
            };
        }
        return {
            success: false,
            message: 'An unexpected error occurred',
        };
    }
};

/**
 * FUNCTION: ViewByData
 * PURPOSE: Queries an endpoint with query data in the request body.
 */
export const ViewByData = async (api, data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/${api}`, data);
        console.log(response);

        if (response.status === 200) {
            return { success: true, user: response.data.data };
        } else {
            return { success: false, message: response.data.msg };
        }
    } catch (error) {
        if (error.response && error.response.data) {
            return {
                success: false,
                message: error.response.data.msg || 'View User failed',
            };
        }
        return {
            success: false,
            message: 'An unexpected error occurred',
        };
    }
};

/**
 * FUNCTION: editByIdwithFile
 * PURPOSE: Updates an existing profile while allowing a new photo to be uploaded.
 * 
 * ROUTING & RENDERING FLOW:
 * - Used by: UserProfile.js and AdvocateEditProfile.js.
 */
export const editByIdwithFile = async (api, id, data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/${api}/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(response);

        if (response.status === 200) {
            return { success: true, user: response.data.data };
        } else {
            return { success: false, message: response.data.msg };
        }
    } catch (error) {
        if (error.response && error.response.data) {
            return {
                success: false,
                message: error.response.data.msg || 'View User failed',
            };
        }
        return {
            success: false,
            message: 'An unexpected error occurred',
        };
    }
};