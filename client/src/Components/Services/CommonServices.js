import React from 'react'
import axios from 'axios';
import { API_BASE_URL } from './BaseURL'
import { IMG_BASE_URL } from './BaseURL'

export const login = async (data, api) => {
    try {


        const response = await axios.post(`${API_BASE_URL}/${api}`, data);
        console.log(response);

        if (response.status === 200) {
            const { result } = response.data;
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

export const register = async (data, api) => {
    try {

console.log(data);

        const response = await axios.post(`${API_BASE_URL}/${api}`, data);
        console.log(response);

        if (response.data.status === 200) {
            const { result } = response.data;
            return { success: true, user: response.data.data };
        } else {
            return { success: false, message: response.data.msg };
        }
    } catch (error) {
        if (error.response && error.response.data) {
            return {
                success: false,
                message: error.response.data.msg || 'Registration  failed',
            };
        }
        return {
            success: false,
            message: 'An unexpected error occurred',
        };
    }
};

export const registerWithFile = async (data, api) => {
    try {


        const response = await axios.post(`${API_BASE_URL}/${api}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(response);

        if (response.data.status === 200) {
            const { result } = response.data;
            return { success: true, user: response.data.data };
        } else {
            return { success: false, message: response.data.msg };
        }
    } catch (error) {
        if (error.response && error.response.data) {
            return {
                success: false,
                message: error.response.data.msg || 'Registration  failed',
            };
        }
        return {
            success: false,
            message: 'An unexpected error occurred',
        };
    }
};
export const AddCase = async (data, api) => {
    try {


        const response = await axios.post(`${API_BASE_URL}/${api}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(response);

        if (response.status === 200) {
            const { result } = response.data;
            return { success: true, user: response.data.data,suggestions:response.data.suggestions };
        } else {
            return { success: false, message: response.data.msg };
        }
    } catch (error) {
        if (error.response && error.response.data) {
            return {
                success: false,
                message: error.response.data.msg || 'Registration  failed',
            };
        }
        return {
            success: false,
            message: 'An unexpected error occurred',
        };
    }
};
export const forgotPassword = async (data, api) => {
    try {


        const response = await axios.post(`${API_BASE_URL}/${api}`, data);
        console.log(response);

        if (response.status === 200) {
            const { result } = response.data;
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

export const resetPassword = async (data, api, id) => {
    try {


        const response = await axios.post(`${API_BASE_URL}/${api}/${id}`, data);
        console.log(response);

        if (response.status === 200) {
            const { result } = response.data;
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
// CommonServices.js
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
  
export const ViewById = async (api, id) => {
    try {


        const response = await axios.post(`${API_BASE_URL}/${api}/${id}`);
        console.log(response);

        if (response.status === 200) {
            const { result } = response.data;
           
            
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


export const ViewByData = async (api, data) => {
    try {


        const response = await axios.post(`${API_BASE_URL}/${api}`,data);
        console.log(response);

        if (response.status === 200) {
            const { result } = response.data;
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

export const editByIdwithFile = async (api, id,data) => {
    try {


        const response = await axios.post(`${API_BASE_URL}/${api}/${id}`, data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        console.log(response);

        if (response.status === 200) {
            const { result } = response.data;
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