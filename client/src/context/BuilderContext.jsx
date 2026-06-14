import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../utils/api';

const BuilderContext = createContext();

export const BuilderProvider = ({ children }) => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const saveTimeoutRef = useRef(null);
  const isInitialMount = useRef(true);

  // Load a resume by ID
  const loadResume = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/resumes/${id}`);
      setResume(res.data.data);
      isInitialMount.current = true; // Avoid auto-saving immediately on load
    } catch (err) {
      console.error('Error loading resume:', err);
      setError(err.response?.data?.message || 'Failed to load resume details.');
    } finally {
      setLoading(false);
    }
  };

  // Sync state and trigger save
  const updateLocalResume = (updatedData) => {
    setResume(prev => {
      if (!prev) return null;
      
      const newResume = typeof updatedData === 'function' ? updatedData(prev) : { ...prev, ...updatedData };
      
      // Trigger debounced auto-save
      triggerAutoSave(newResume);
      return newResume;
    });
  };

  const triggerAutoSave = (resumeData) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setSaving(true);
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await api.put(`/resumes/${resumeData._id}`, resumeData);
      } catch (err) {
        console.error('Auto-save error:', err);
      } finally {
        setSaving(false);
      }
    }, 1500); // Save after 1.5 seconds of inactivity
  };

  // Force synchronous save immediately (e.g. before navigating away or printing)
  const forceSave = async () => {
    if (!resume) return;
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    setSaving(true);
    try {
      await api.put(`/resumes/${resume._id}`, resume);
    } catch (err) {
      console.error('Force save error:', err);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <BuilderContext.Provider value={{
      resume,
      loading,
      saving,
      error,
      loadResume,
      updateLocalResume,
      forceSave,
      setResume
    }}>
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilder = () => useContext(BuilderContext);
