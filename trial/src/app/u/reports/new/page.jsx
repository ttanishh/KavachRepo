import React, { useState } from 'react';
import Button from '../../../components/Button';

export default function NewReportPage() {
  const [formData, setFormData] = useState({
    isUrgent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Handle form submission logic here
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="isUrgent"
                    name="isUrgent"
                    type="checkbox"
                    onChange={handleChange}
                    checked={formData.isUrgent}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="isUrgent" className="font-medium text-gray-700 dark:text-gray-200">
                    Mark as Urgent
                  </label>
                  <p className="text-gray-500 dark:text-gray-400">
                    This will prioritize your report for immediate attention
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Submit */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Submit Report
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}