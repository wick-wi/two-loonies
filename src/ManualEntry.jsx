import React, { useState, useEffect, useCallback } from 'react';

const ManualEntry = () => {
  const STORAGE_KEY = 'twoLoonies.manualEntries.v1';

  // Load saved data from localStorage
  const loadSavedData = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
    return null;
  };

  // Initialize state with saved data or defaults
  const initializeState = () => {
    const savedData = loadSavedData();
    if (savedData) {
      return {
        incomeData: savedData.incomeData || {},
        expenseData: savedData.expenseData || {},
        customFields: savedData.customFields || { income: [], expense: [] },
        customFieldData: savedData.customFieldData || {}
      };
    }
    return {
      incomeData: {
        biweeklyPaycheque: '',
        rentalIncome: '',
        investmentIncome: '',
        sideHustle: '',
        governmentBenefits: ''
      },
      expenseData: {
        rentMortgage: '',
        groceries: '',
        restaurants: '',
        utilities: '',
        carPayment: '',
        insurance: '',
        subscriptions: '',
        miscellaneous: ''
      },
      customFields: { income: [], expense: [] },
      customFieldData: {}
    };
  };

  const initialState = initializeState();

  const [incomeData, setIncomeData] = useState(initialState.incomeData);
  const [expenseData, setExpenseData] = useState(initialState.expenseData);
  const [customFields, setCustomFields] = useState(initialState.customFields);
  const [customFieldData, setCustomFieldData] = useState(initialState.customFieldData);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const [modalValue, setModalValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Custom field modal state
  const [customFieldModalOpen, setCustomFieldModalOpen] = useState(false);
  const [customFieldName, setCustomFieldName] = useState('');
  const [customFieldAmount, setCustomFieldAmount] = useState('');
  const [customFieldType, setCustomFieldType] = useState('');
  const [customFieldError, setCustomFieldError] = useState('');

  // Submit modal state
  const [submitModalOpen, setSubmitModalOpen] = useState(false);

  // Toast state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Animation state
  const [animatingBubbles, setAnimatingBubbles] = useState(new Set());
  const [fallingTokens, setFallingTokens] = useState([]);

  // Save all data to localStorage whenever state changes
  const saveToLocalStorage = useCallback(() => {
    try {
      const dataToSave = {
        incomeData,
        expenseData,
        customFields,
        customFieldData,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [incomeData, expenseData, customFields, customFieldData]);

  // Auto-save whenever relevant state changes
  useEffect(() => {
    saveToLocalStorage();
  }, [saveToLocalStorage]);

  const incomeFields = [
    { key: 'biweeklyPaycheque', label: 'Bi-weekly Paycheque', isBiweekly: true },
    { key: 'rentalIncome', label: 'Rental Income', isBiweekly: false },
    { key: 'investmentIncome', label: 'Investment Income', isBiweekly: false },
    { key: 'sideHustle', label: 'Side Hustle', isBiweekly: false },
    { key: 'governmentBenefits', label: 'Government Benefits', isBiweekly: false }
  ];

  const expenseFields = [
    { key: 'rentMortgage', label: 'Rent/Mortgage' },
    { key: 'groceries', label: 'Groceries' },
    { key: 'restaurants', label: 'Restaurants/Drinks' },
    { key: 'utilities', label: 'Utilities' },
    { key: 'carPayment', label: 'Car Payment' },
    { key: 'insurance', label: 'Insurance' },
    { key: 'subscriptions', label: 'Subscriptions' },
    { key: 'miscellaneous', label: 'Miscellaneous' }
  ];

  const handleIncomeChange = (key, value) => {
    setIncomeData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleExpenseChange = (key, value) => {
    setExpenseData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCustomFieldChange = (key, value) => {
    setCustomFieldData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const openCustomFieldModal = (type) => {
    setCustomFieldType(type);
    setCustomFieldName('');
    setCustomFieldAmount('');
    setCustomFieldError('');
    setCustomFieldModalOpen(true);
  };

  const closeCustomFieldModal = () => {
    setCustomFieldModalOpen(false);
    setCustomFieldName('');
    setCustomFieldAmount('');
    setCustomFieldType('');
    setCustomFieldError('');
  };

  const addCustomField = () => {
    const trimmedName = customFieldName.trim();
    if (!trimmedName) {
      setCustomFieldError('Field name cannot be empty');
      return;
    }

    // Validate amount if provided
    const amount = parseFloat(customFieldAmount);
    if (customFieldAmount && (isNaN(amount) || amount < 0)) {
      setCustomFieldError('Amount must be a valid number greater than or equal to 0');
      return;
    }

    // Check for duplicates in default fields
    const defaultFields = customFieldType === 'income' ? incomeFields : expenseFields;
    const isDuplicateDefault = defaultFields.some(field => 
      field.label.toLowerCase() === trimmedName.toLowerCase()
    );

    // Check for duplicates in custom fields
    const isDuplicateCustom = customFields[customFieldType].some(field => 
      field.label.toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicateDefault || isDuplicateCustom) {
      setCustomFieldError('A field with this name already exists');
      return;
    }

    // Create new custom field
    const newField = {
      key: `custom_${Date.now()}`,
      label: trimmedName,
      isCustom: true,
      isBiweekly: false
    };

    setCustomFields(prev => ({
      ...prev,
      [customFieldType]: [...prev[customFieldType], newField]
    }));

    // Set the initial value if provided
    if (customFieldAmount && amount > 0) {
      setCustomFieldData(prev => ({
        ...prev,
        [newField.key]: amount.toString()
      }));

      // Trigger animation for the new field
      triggerBubbleAnimation(newField.key);
    }

    closeCustomFieldModal();
  };

  const removeCustomField = (type, fieldKey) => {
    setCustomFields(prev => ({
      ...prev,
      [type]: prev[type].filter(field => field.key !== fieldKey)
    }));

    // Remove associated data
    setCustomFieldData(prev => {
      const newData = { ...prev };
      delete newData[fieldKey];
      return newData;
    });
  };

  const openModal = (field, type) => {
    let currentValue;
    if (field.isCustom) {
      currentValue = customFieldData[field.key];
    } else {
      currentValue = type === 'income' ? incomeData[field.key] : expenseData[field.key];
    }
    
    const hasValue = currentValue && parseFloat(currentValue) > 0;
    
    setCurrentField({ ...field, type });
    // For editing, show the stored value (which is the original input value)
    setModalValue(hasValue ? currentValue : '');
    setIsEditing(hasValue);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentField(null);
    setModalValue('');
    setIsEditing(false);
  };

  const handleModalSubmit = () => {
    const value = parseFloat(modalValue);
    if (isNaN(value) || value < 0) {
      return; // Invalid input
    }

    const fieldKey = currentField.key;
    
    // Store the original value (don't convert here - let the calculation function handle it)
    // Update the data with the raw value
    if (currentField.isCustom) {
      handleCustomFieldChange(fieldKey, value.toString());
    } else if (currentField.type === 'income') {
      handleIncomeChange(fieldKey, value.toString());
    } else {
      handleExpenseChange(fieldKey, value.toString());
    }

    // Trigger animations if not editing
    if (!isEditing) {
      triggerBubbleAnimation(fieldKey);
    }

    closeModal();
  };

  const triggerBubbleAnimation = (fieldKey) => {
    // Add to animating bubbles
    setAnimatingBubbles(prev => new Set([...prev, fieldKey]));

    // Create falling token
    const tokenId = Date.now();
    setFallingTokens(prev => [...prev, { id: tokenId, fieldKey }]);

    // Remove animation state after animation completes
    setTimeout(() => {
      setAnimatingBubbles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fieldKey);
        return newSet;
      });
    }, 600);

    // Remove falling token after animation
    setTimeout(() => {
      setFallingTokens(prev => prev.filter(token => token.id !== tokenId));
    }, 1000);
  };

  const calculateMonthlyIncome = () => {
    let total = 0;
    
    // Default income fields
    incomeFields.forEach(field => {
      const value = parseFloat(incomeData[field.key]) || 0;
      if (field.isBiweekly) {
        // Convert bi-weekly to monthly (26 pay periods / 12 months)
        total += (value * 26) / 12;
      } else {
        total += value;
      }
    });
    
    // Custom income fields
    customFields.income.forEach(field => {
      const value = parseFloat(customFieldData[field.key]) || 0;
      total += value;
    });
    
    return total;
  };

  const calculateMonthlyExpenses = () => {
    let total = 0;
    
    // Default expense fields
    expenseFields.forEach(field => {
      total += parseFloat(expenseData[field.key]) || 0;
    });
    
    // Custom expense fields
    customFields.expense.forEach(field => {
      total += parseFloat(customFieldData[field.key]) || 0;
    });
    
    return total;
  };

  const totalIncome = calculateMonthlyIncome();
  const totalExpenses = calculateMonthlyExpenses();
  const netAmount = totalIncome - totalExpenses;

  const handleClearAll = () => {
    // Reset all state to defaults
    setIncomeData({
      biweeklyPaycheque: '',
      rentalIncome: '',
      investmentIncome: '',
      sideHustle: '',
      governmentBenefits: ''
    });
    setExpenseData({
      rentMortgage: '',
      groceries: '',
      restaurants: '',
      utilities: '',
      carPayment: '',
      insurance: '',
      subscriptions: '',
      miscellaneous: ''
    });
    // Clear custom fields and their data
    setCustomFields({ income: [], expense: [] });
    setCustomFieldData({});
    // Reset animation states
    setAnimatingBubbles(new Set());
    setFallingTokens([]);
    
    // Wipe localStorage
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };

  // Toast helper functions
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Check if there are any entries
  const hasEntries = () => {
    // Check default income fields
    const hasIncomeEntries = Object.values(incomeData).some(value => value && parseFloat(value) > 0);
    // Check default expense fields  
    const hasExpenseEntries = Object.values(expenseData).some(value => value && parseFloat(value) > 0);
    // Check custom field entries
    const hasCustomEntries = Object.values(customFieldData).some(value => value && parseFloat(value) > 0);
    
    return hasIncomeEntries || hasExpenseEntries || hasCustomEntries;
  };

  // Serialize entries to JSON format
  const serializeEntries = () => {
    const entries = [];

    // Add default income entries
    incomeFields.forEach(field => {
      const value = parseFloat(incomeData[field.key]);
      if (value > 0) {
        entries.push({
          category: 'income',
          field: field.key,
          label: field.label,
          amount: value,
          monthlyAmount: field.isBiweekly ? Math.round((value * 26 / 12) * 100) / 100 : value,
          isBiweekly: field.isBiweekly || false,
          isCustom: false
        });
      }
    });

    // Add custom income entries
    customFields.income.forEach(field => {
      const value = parseFloat(customFieldData[field.key]);
      if (value > 0) {
        entries.push({
          category: 'income',
          field: field.key,
          label: field.label,
          amount: value,
          monthlyAmount: value,
          isBiweekly: false,
          isCustom: true
        });
      }
    });

    // Add default expense entries
    expenseFields.forEach(field => {
      const value = parseFloat(expenseData[field.key]);
      if (value > 0) {
        entries.push({
          category: 'expense',
          field: field.key,
          label: field.label,
          amount: value,
          monthlyAmount: value,
          isBiweekly: false,
          isCustom: false
        });
      }
    });

    // Add custom expense entries
    customFields.expense.forEach(field => {
      const value = parseFloat(customFieldData[field.key]);
      if (value > 0) {
        entries.push({
          category: 'expense',
          field: field.key,
          label: field.label,
          amount: value,
          monthlyAmount: value,
          isBiweekly: false,
          isCustom: true
        });
      }
    });

    return {
      version: 1,
      entries: entries,
      totals: {
        income: totalIncome,
        expenses: totalExpenses,
        net: netAmount
      },
      submittedAt: new Date().toISOString()
    };
  };

  const handleSubmit = () => {
    if (!hasEntries()) {
      showToast('No entries to submit', 'error');
      return;
    }
    
    setSubmitModalOpen(true);
  };

  const confirmSubmit = () => {
    const serializedData = serializeEntries();
    console.log('Serialized Entries:', serializedData);
    
    setSubmitModalOpen(false);
    showToast('Saved!', 'success');
  };

  const BubbleField = ({ field, value, type }) => {
    const hasValue = value && parseFloat(value) > 0;
    const isAnimating = animatingBubbles.has(field.key);
    
    const getAriaLabel = () => {
      if (hasValue) {
        const amount = field.isBiweekly 
          ? (Math.round((parseFloat(value) * 26 / 12) * 100) / 100).toFixed(2)
          : parseFloat(value).toFixed(2);
        return `${field.label}, ${hasValue ? 'filled with $' + amount : 'empty'}, click to ${hasValue ? 'edit' : 'add'} amount`;
      }
      return `${field.label}, empty, click to add amount${field.isBiweekly ? ', converts to monthly' : ''}`;
    };
    
    return (
      <div className="flex flex-col items-center relative group">
        {field.isCustom && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeCustomField(type, field.key);
            }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 flex items-center justify-center focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
            aria-label={`Remove custom field ${field.label}`}
            tabIndex={0}
          >
            ×
          </button>
        )}
        <button
          onClick={() => openModal(field, type)}
          className={`
            bg-white rounded-full px-4 py-2 shadow-sm border transition-all duration-200
            hover:shadow-md hover:-translate-y-0.5 active:scale-95 active:translate-y-0
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${isAnimating ? 'animate-bubble-pop' : ''}
            ${hasValue 
              ? 'border-green-600 bg-green-50 text-green-800 hover:bg-green-100 hover:border-green-700 hover:shadow-green-100' 
              : 'border-gray-300 text-gray-800 hover:border-gray-400'
            }
          `}
          aria-label={getAriaLabel()}
          type="button"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium whitespace-nowrap">
              {field.label}
            </span>
            {hasValue && (
              <div className="w-3 h-3 bg-green-600 rounded-full flex items-center justify-center">
                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </button>
        {hasValue && (
          <div className="mt-1 text-xs font-semibold text-green-700 text-center" aria-live="polite">
            ${field.isBiweekly 
              ? (Math.round((parseFloat(value) * 26 / 12) * 100) / 100).toFixed(2)
              : parseFloat(value).toFixed(2)
            }
            {field.isBiweekly && <div className="text-xs text-gray-600">/month</div>}
          </div>
        )}
        {field.isBiweekly && !hasValue && (
          <div className="mt-1 text-xs text-blue-700 text-center">
            converts to monthly
          </div>
        )}
      </div>
    );
  };

  const Modal = () => {
    if (!modalOpen || !currentField) return null;

    const helperText = currentField.isBiweekly 
      ? "Enter your bi-weekly paycheque amount. We'll convert it to monthly for calculations."
      : "Enter monthly amount.";

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'Enter' && modalValue && parseFloat(modalValue) >= 0) {
        handleModalSubmit();
      }
    };

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6" onKeyDown={handleKeyDown}>
          <h3 id="modal-title" className="text-lg font-semibold text-gray-900 mb-4">
            {isEditing ? 'Edit' : 'Add'} {currentField.label}
          </h3>
          
          <div className="mb-4">
            <label htmlFor="modal-amount" className="block text-sm font-medium text-gray-800 mb-2">
              Amount ($)
            </label>
            <input
              id="modal-amount"
              type="number"
              step="0.01"
              min="0"
              value={modalValue}
              onChange={(e) => setModalValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              autoFocus
              aria-describedby="modal-description"
              aria-required="true"
            />
          </div>

          <p id="modal-description" className="text-sm text-gray-700 mb-6">
            {helperText}
          </p>

          <div className="flex gap-3 justify-end">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-gray-800 bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleModalSubmit}
              disabled={!modalValue || parseFloat(modalValue) < 0}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 focus:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              type="button"
            >
              {isEditing ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const CustomFieldModal = () => {
    if (!customFieldModalOpen) return null;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeCustomFieldModal();
      } else if (e.key === 'Enter' && customFieldName.trim()) {
        addCustomField();
      }
    };

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="custom-modal-title"
        aria-describedby="custom-modal-description"
      >
        <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6" onKeyDown={handleKeyDown}>
          <h3 id="custom-modal-title" className="text-lg font-semibold text-gray-900 mb-4">
            Add Custom {customFieldType === 'income' ? 'Income' : 'Expense'} Field
          </h3>
          
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="custom-field-name" className="block text-sm font-medium text-gray-800 mb-2">
                Field Name
              </label>
              <input
                id="custom-field-name"
                type="text"
                value={customFieldName}
                onChange={(e) => {
                  setCustomFieldName(e.target.value);
                  setCustomFieldError('');
                }}
                onKeyDown={handleKeyDown}
                placeholder="e.g., Freelance Work"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                autoFocus
                aria-describedby={customFieldError ? 'custom-field-error' : 'custom-modal-description'}
                aria-required="true"
                aria-invalid={customFieldError ? 'true' : 'false'}
              />
            </div>

            <div>
              <label htmlFor="custom-field-amount" className="block text-sm font-medium text-gray-800 mb-2">
                Amount ($) <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <input
                id="custom-field-amount"
                type="number"
                step="0.01"
                min="0"
                value={customFieldAmount}
                onChange={(e) => {
                  setCustomFieldAmount(e.target.value);
                  setCustomFieldError('');
                }}
                onKeyDown={handleKeyDown}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {customFieldError && (
              <p id="custom-field-error" className="text-sm text-red-700" role="alert">
                {customFieldError}
              </p>
            )}
          </div>

          <p id="custom-modal-description" className="text-sm text-gray-700 mb-6">
            Create a custom field for tracking additional {customFieldType === 'income' ? 'income sources' : 'expenses'}. 
            {customFieldAmount ? ' The field will be created with the amount you specified.' : ' You can add an amount now or leave it blank to fill in later.'}
          </p>

          <div className="flex gap-3 justify-end">
            <button
              onClick={closeCustomFieldModal}
              className="px-4 py-2 text-gray-800 bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={addCustomField}
              disabled={!customFieldName.trim()}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 focus:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              type="button"
            >
              {customFieldAmount ? 'Add Field & Amount' : 'Add Field'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const SubmitModal = () => {
    if (!submitModalOpen) return null;

    const entries = serializeEntries().entries;
    const entryCount = entries.length;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSubmitModalOpen(false);
      } else if (e.key === 'Enter') {
        confirmSubmit();
      }
    };

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="submit-modal-title"
        aria-describedby="submit-modal-description"
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6" onKeyDown={handleKeyDown}>
          <h3 id="submit-modal-title" className="text-lg font-semibold text-gray-900 mb-4">
            Confirm Submission
          </h3>
          
          <div className="mb-6">
            <p id="submit-modal-description" className="text-gray-800 mb-4">
              You're about to submit {entryCount} entr{entryCount !== 1 ? 'ies' : 'y'} with the following totals:
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-2" role="table" aria-label="Financial summary">
              <div className="flex justify-between items-center" role="row">
                <span className="text-sm font-medium text-gray-800" role="rowheader">Monthly Income:</span>
                <span className="text-sm font-semibold text-green-700" role="cell">${totalIncome.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center" role="row">
                <span className="text-sm font-medium text-gray-800" role="rowheader">Monthly Expenses:</span>
                <span className="text-sm font-semibold text-red-700" role="cell">${totalExpenses.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200" role="row">
                <span className="text-sm font-medium text-gray-900" role="rowheader">Net Income:</span>
                <span className={`text-sm font-bold ${netAmount >= 0 ? 'text-green-700' : 'text-red-700'}`} role="cell">
                  ${netAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setSubmitModalOpen(false)}
              className="px-4 py-2 text-gray-800 bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={confirmSubmit}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 focus:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              type="button"
              autoFocus
            >
              Confirm Submit
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Toast = () => {
    if (!toast.show) return null;

    return (
      <div className="fixed top-4 right-4 z-50 animate-fade-in">
        <div 
          className={`
            px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-sm
            ${toast.type === 'success' 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white'
            }
          `}
          role="alert"
          aria-live="polite"
          aria-atomic="true"
        >
          {toast.type === 'success' ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      </div>
    );
  };

  const FallingToken = ({ token }) => {
    return (
      <div 
        key={token.id}
        className="fixed top-1/3 left-1/2 transform -translate-x-1/2 pointer-events-none z-40"
        style={{
          animation: 'fall-to-results 1s ease-in forwards'
        }}
      >
        <div className="w-8 h-8 bg-green-600 rounded-full shadow-md flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manual Entry</h1>
          <p className="text-gray-600">Enter your monthly income and expenses to see your financial overview</p>
        </div>

        {/* Income and Expenses Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Income Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
              Monthly Income
            </h2>
            <div className="flex flex-wrap gap-3 justify-start">
              {incomeFields.map((field) => (
                <BubbleField
                  key={field.key}
                  field={field}
                  value={incomeData[field.key]}
                  type="income"
                />
              ))}
              {customFields.income.map((field) => (
                <BubbleField
                  key={field.key}
                  field={field}
                  value={customFieldData[field.key]}
                  type="income"
                />
              ))}
              <button
                onClick={() => openCustomFieldModal('income')}
                className="bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 border-2 border-dashed border-gray-300 hover:border-gray-400 focus:border-gray-400 rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 focus:text-gray-800 transition-all duration-200 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                type="button"
                aria-label="Add custom income field"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Custom Field
              </button>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Monthly Total:</span>
                <span className="text-lg font-bold text-green-600">${totalIncome.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Expenses Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
              Monthly Expenses
            </h2>
            <div className="flex flex-wrap gap-3 justify-start">
              {expenseFields.map((field) => (
                <BubbleField
                  key={field.key}
                  field={field}
                  value={expenseData[field.key]}
                  type="expense"
                />
              ))}
              {customFields.expense.map((field) => (
                <BubbleField
                  key={field.key}
                  field={field}
                  value={customFieldData[field.key]}
                  type="expense"
                />
              ))}
              <button
                onClick={() => openCustomFieldModal('expense')}
                className="bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 border-2 border-dashed border-gray-300 hover:border-gray-400 focus:border-gray-400 rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 focus:text-gray-800 transition-all duration-200 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                type="button"
                aria-label="Add custom expense field"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Custom Field
              </button>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Monthly Total:</span>
                <span className="text-lg font-bold text-red-600">${totalExpenses.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div id="results-section" className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Results</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Category</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Amount</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Percentage</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-900">Total Income</td>
                  <td className="py-3 px-4 text-right text-green-600 font-semibold">${totalIncome.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-gray-600">100%</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-900">Total Expenses</td>
                  <td className="py-3 px-4 text-right text-red-600 font-semibold">${totalExpenses.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-gray-600">
                    {totalIncome > 0 ? ((totalExpenses / totalIncome) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
                <tr className="border-b-2 border-gray-300 bg-gray-50">
                  <td className="py-3 px-4 font-semibold text-gray-900">Net Income</td>
                  <td className={`py-3 px-4 text-right font-bold ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${netAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600">
                    {totalIncome > 0 ? ((netAmount / totalIncome) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal />

      {/* Custom Field Modal */}
      <CustomFieldModal />

      {/* Submit Modal */}
      <SubmitModal />

      {/* Toast */}
      <Toast />

      {/* Falling Tokens */}
      {fallingTokens.map((token) => (
        <FallingToken key={token.id} token={token} />
      ))}

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <button
              onClick={handleClearAll}
              className="text-gray-700 hover:text-gray-900 focus:text-gray-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded px-2 py-1"
              type="button"
              aria-label="Clear all entries and reset form"
            >
              Clear All
            </button>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
              <div className="flex items-center gap-4">
                <span className="text-gray-600">
                  Income: <span className="font-semibold text-green-600">${totalIncome.toFixed(2)}</span>
                </span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">
                  Expenses: <span className="font-semibold text-red-600">${totalExpenses.toFixed(2)}</span>
                </span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">
                  Net: <span className={`font-semibold ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${netAmount.toFixed(2)}
                  </span>
                </span>
              </div>
            </div>
            
            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 focus:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              type="button"
              aria-label="Submit financial entries"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualEntry;
