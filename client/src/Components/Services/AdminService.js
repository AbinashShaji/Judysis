/**
 * ============================================================================
 * SERVICE: AdminService.js
 * HANDOVER SUMMARY:
 * This service file provides dedicated helper functions that the Admin Portal uses
 * to talk to the backend. Instead of writing raw Axios HTTP requests inside individual 
 * React components, the components simply call these clean functions.
 * ============================================================================
 */

import { API_BASE_URL } from './BaseURL';
import { IMG_BASE_URL } from './BaseURL';
import axios from 'axios';

/**
 * FUNCTION: viewCount
 * PURPOSE: Sends an HTTP POST request to fetch dashboard statistics or list data.
 * 
 * ROUTING & RENDERING FLOW:
 * - Used by: AdminDashboard.js, AdminViewUsers.js, and AdminViewAdvReqs.js.
 * - Takes an endpoint name (e.g., 'viewUsersForAdmin') and returns the database records.
 */
export const viewCount = async (api) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/${api}`);
        console.log("api called", response);

        if (response.data.status === 200) {
            return { success: true, user: response.data.data };
        } else {
            return { success: false, message: response.data.msg };
        }
    } catch (error) {
        console.log(error);
        if (error.response && error.response.data) {
            return {
                success: false,
                message: error.response.data.msg || 'view failed',
            };
        }
        return {
            success: false,
            message: 'An unexpected error occurred',
        };
    }
};

/**
 * FUNCTION: adminchangePassword
 * PURPOSE: Sends new password information to update the administrator's credentials.
 */
export const adminchangePassword = async (data, api, id) => {
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
 * FUNCTION: approveById
 * PURPOSE: Sends an approval or activation command for a specific person or case ID.
 * 
 * ROUTING & RENDERING FLOW:
 * - Used by:
 *   - AdminViewAdvReqs.js (calling 'approveAdvocateById')
 *   - AdminViewUserReqs.js (calling 'approveUserById')
 * - If this call succeeds: The approved person immediately receives login access!
 */
export const approveById = async (api, id) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/${api}/${id}`);
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
                message: error.response.data.msg || 'View User failed',
            };
        }
        return {
            success: false,
            message: 'An unexpected error occurred',
        };
    }
};