import { useState, useMemo, useCallback, useEffect } from 'react';
import { filterMembers, sortMembers, assignRanks, debounce } from '../utils/helpers';

/**
 * Custom hook for managing leaderboard data, filtering, and sorting
 */
export const useLeaderboard = (initialData) => {
  const [filters, setFilters] = useState({
    search: '',
    track: 'all',
    week: 'all',
    verifiedOnly: false
  });

  const [sortState, setSortState] = useState({
    field: 'points',
    direction: 'desc'
  });

  // Debounced search to improve performance
  const debouncedSetSearch = useCallback(
    debounce((searchTerm) => {
      setFilters(prev => ({ ...prev, search: searchTerm }));
    }, 300),
    []
  );

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = filterMembers(initialData, filters);
    let sorted = sortMembers(filtered, sortState.field, sortState.direction);
    return assignRanks(sorted);
  }, [initialData, filters, sortState]);

  // Update filter functions
  const updateSearch = useCallback((searchTerm) => {
    debouncedSetSearch(searchTerm);
  }, [debouncedSetSearch]);

  const updateTrackFilter = useCallback((track) => {
    setFilters(prev => ({ ...prev, track }));
  }, []);

  const updateWeekFilter = useCallback((week) => {
    setFilters(prev => ({ ...prev, week }));
  }, []);

  const toggleVerifiedOnly = useCallback(() => {
    setFilters(prev => ({ ...prev, verifiedOnly: !prev.verifiedOnly }));
  }, []);

  // Sorting functions
  const updateSort = useCallback((field) => {
    setSortState(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  }, []);

  return {
    data: processedData,
    filters,
    sortState,
    updateSearch,
    updateTrackFilter,
    updateWeekFilter,
    toggleVerifiedOnly,
    updateSort
  };
};

/**
 * Custom hook for managing dropdown state
 */
export const useDropdown = (initialOpen = false) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  return {
    isOpen,
    toggle,
    close,
    open
  };
};

/**
 * Custom hook for managing loading states
 */
export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const response = await asyncFunction(...args);
      setData(response);
      setStatus('success');
      return response;
    } catch (error) {
      setError(error);
      setStatus('error');
      throw error;
    }
  }, [asyncFunction]);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    execute,
    status,
    data,
    error,
    isLoading: status === 'pending',
    isError: status === 'error',
    isSuccess: status === 'success'
  };
};