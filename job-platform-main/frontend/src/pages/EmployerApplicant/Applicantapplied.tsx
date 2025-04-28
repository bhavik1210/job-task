import React, { useEffect, useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { backendurl } from '../../server';
import { Card, CardContent, CardHeader } from '../../ui/components/ui/card';
import { Label } from '../../ui/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/components/ui/select';
import { Application } from '../../types';

const Applicantapplied: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState<boolean>(false);
  
  const [applicants, setApplicants] = useState<Application[]>([]);
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(`${backendurl}/application/get-all-applicants`);
        if (response.data.success) {
          setApplicants(response.data.applicants);
        } else {
          setError('No applicants found.');
        }
      } catch {
        setError('Failed to fetch applicants.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  const handleStatusChange = async (applicantId: string, newStatus: string) => {
    if (!applicantId) {
      swal("Error", "Invalid applicant ID.", "error");
      return;
    }

    setStatusUpdating(true);

    try {
      const response = await axios.put(
        `${backendurl}/application/update-status/${applicantId}`,
        { status: newStatus }
      );

      if (response.data.success) {
        setApplicants((prev) =>
          prev.map((applicant) =>
            applicant.id === applicantId ? { ...applicant, status: newStatus } : applicant
          )
        );
        swal("Success", "Status updated successfully!", "success");
      } else {
        swal("Error", "Failed to update status.", "error");
      }
    } catch {
      swal("Error", "Something went wrong. Please try again.", "error");
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg font-medium">
        Loading applicants...
      </div>
    );
  }

  return (
    <div className="font-poppins p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">All Applicants</h1>

      {error && <p className="text-red-500 mb-6">{error}</p>}

      {applicants.length === 0 ? (
        <p className="text-gray-500">No applicants found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applicants.map((applicant) => (
            <Card
              key={applicant.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <CardHeader className="pb-0">
                <h2 className="text-xl font-semibold text-gray-900">{applicant.userId.name}</h2>
                <p className="text-sm text-gray-500">{applicant.userId.email}</p>
              </CardHeader>

              <CardContent className="space-y-3 mt-4 text-sm text-gray-700">
                <p>
                  <strong className="text-gray-600">Position:</strong> {applicant.job.title}
                </p>
                <p>
                  <strong className="text-gray-600">Company:</strong> {applicant.job.company}
                </p>
                <p>
                  <strong className="text-gray-600">Location:</strong> {applicant.job.location}
                </p>

                <div className="mt-4">
                  <Label
                    htmlFor={`status-${applicant.id}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Application Status
                  </Label>

                  <Select
                    value={applicant.status}
                    onValueChange={(newStatus) =>
                      handleStatusChange(applicant.id, newStatus)
                    }
                  >
                    <SelectTrigger
                      id={`status-${applicant.id}`}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-800 bg-white"
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>

                    <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg">
                      <SelectItem
                        value="pending"
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <span className="text-gray-700">Pending</span>
                      </SelectItem>
                      <SelectItem
                        value="reviewed"
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                      >
                        <span className="text-blue-600">Reviewed</span>
                      </SelectItem>
                      <SelectItem
                        value="rejected"
                        className="px-4 py-2 hover:bg-red-50 cursor-pointer"
                      >
                        <span className="text-red-600">Rejected</span>
                      </SelectItem>
                      <SelectItem
                        value="accepted"
                        className="px-4 py-2 hover:bg-green-50 cursor-pointer"
                      >
                        <span className="text-green-600">Accepted</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applicantapplied;
