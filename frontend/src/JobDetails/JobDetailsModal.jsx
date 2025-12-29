import React from 'react';
import './JobDetailsModal.css';

export default function JobDetailsModal({ job, onClose, onApply, isApplied = false }) {
  return (
    <div className="job-modal">
      <div className="job-modal-content">
        <h2>{job.title}</h2>
        <div className="job-modal-body">
          <p><strong>Type:</strong> {job.type}</p>
          <p><strong>Payment:</strong> ₹{job.payment}</p>
          <p><strong>Description:</strong></p>
          <p>{job.description}</p>

          {job.details && (
            <>
              <p><strong>Job Details:</strong></p>
              <p>{job.details}</p>
            </>
          )}
        </div>

        <div className="modal-buttons">
          {isApplied ? (
            <button className="applied-btn" disabled>✅ Applied</button>
          ) : (
            <button className="apply-btn" onClick={() => onApply(job)}>Apply</button>
          )}
          <button className="back-btn" onClick={onClose}>Back</button>
        </div>
      </div>
    </div>
  );
}
