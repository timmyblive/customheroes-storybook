import { useState, useEffect, useCallback } from 'react';
import { Order, Proof, OrderStatus } from '../types/order';

interface UseProofManagementProps {
  orderId: string;
  initialProof?: Proof;
}

interface UseProofManagementReturn {
  uploading: boolean;
  uploadedProofUrl: string;
  handleUploadProof: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  sendProofToCustomer: (proofUrl: string) => Promise<void>;
  resendProof: (proofUrl: string) => Promise<void>;
  resetUploadState: () => void;
}

/**
 * Custom hook for managing proof uploads and persistence
 */
export const useProofManagement = (
  { orderId, initialProof }: UseProofManagementProps,
  onOrderUpdate: (updatedOrder: Order) => void,
  order: Order
): UseProofManagementReturn => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadedProofUrl, setUploadedProofUrl] = useState<string>('');

  // Load any previously uploaded proof URL from localStorage on component mount
  useEffect(() => {
    const savedProofUrl = localStorage.getItem(`proof_url_${orderId}`);
    if (savedProofUrl) {
      setUploadedProofUrl(savedProofUrl);
    }
  }, [orderId]);

  // Reset the upload state
  const resetUploadState = useCallback(() => {
    setUploadedProofUrl('');
    localStorage.removeItem(`proof_url_${orderId}`);
  }, [orderId]);

  // Handle proof upload
  const handleUploadProof = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!order || !event.target.files?.[0]) return;

    const file = event.target.files[0];
    
    // Validate file type
    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploading(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          // 1. First upload the file to blob storage
          const uploadResponse = await fetch(`/api/admin/orders/${orderId}/upload-proof`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              file: reader.result,
              filename: file.name
            }),
          });

          if (!uploadResponse.ok) {
            const error = await uploadResponse.json();
            throw new Error(`Upload failed: ${error.error}`);
          }
          
          const uploadResult = await uploadResponse.json();
          const proofUrl = uploadResult.url;
          
          // Save the uploaded proof URL to localStorage for persistence
          localStorage.setItem(`proof_url_${orderId}`, proofUrl);
          
          // 2. Then update the order with the new proof information
          const updateResponse = await fetch(`/api/admin/orders/${orderId}/update-proof`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              proofUrl,
              status: 'uploaded',
              // If there's already a proof, increment revision count
              revisionCount: order.proof ? (order.proof.revisionCount ?? 0) + 1 : 0
            }),
          });
          
          if (!updateResponse.ok) {
            const error = await updateResponse.json();
            throw new Error(`Failed to update order: ${error.error}`);
          }
          
          const updateResult = await updateResponse.json();
          
          // 3. Update local state with the new proof information
          setUploadedProofUrl(proofUrl);
          
          // Update order with proof info
          const updatedOrder = {
            ...order,
            proof: updateResult.proof
          };
          
          onOrderUpdate(updatedOrder);
          
          // Clear the file input
          if (event.target.form) {
            event.target.form.reset();
          }
          
          alert('Proof PDF uploaded successfully!');
        } catch (error) {
          console.error('Error uploading proof:', error);
          alert(error instanceof Error ? error.message : 'Upload failed. Please try again.');
        } finally {
          setUploading(false);
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Error reading file. Please try again.');
      setUploading(false);
    }
  }, [order, orderId, onOrderUpdate]);

  // Send proof to customer
  const sendProofToCustomer = useCallback(async (proofUrl: string) => {
    if (!order) return;

    try {
      const response = await fetch(`/api/admin/orders/${orderId}/send-proof`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proofUrl: proofUrl,
          isRevision: order.proof && (order.proof.revisionCount ?? 0) > 0
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const sendRecord = result.sendRecord;
        
        // Update order status to proof_sent
        const updatedOrder = {
          ...order,
          status: 'proof_sent' as OrderStatus,
          proof: {
            ...order.proof!,
            status: 'sent' as Proof['status'],
            sentAt: new Date().toISOString(),
            // Add the send record to history
            sendHistory: [
              ...(order.proof?.sendHistory || []),
              sendRecord
            ]
          }
        };
        
        onOrderUpdate(updatedOrder);
        
        // Clear the uploaded proof URL since it's now part of the order
        setUploadedProofUrl('');
        localStorage.removeItem(`proof_url_${orderId}`);
        
        // Reset the form
        const form = document.getElementById('proof-upload-form') as HTMLFormElement;
        if (form) form.reset();
        
        alert(`Proof ${(order.proof?.revisionCount ?? 0) > 0 ? 'revision ' : ''}sent successfully to ${result.sentTo}!`);
      } else {
        const error = await response.json();
        alert(`Failed to send proof: ${error.error}`);
      }
    } catch (error) {
      console.error('Error sending proof:', error);
      alert('Failed to send proof. Please try again.');
    }
  }, [order, orderId, onOrderUpdate]);
  
  // Resend a previous proof
  const resendProof = useCallback(async (proofUrl: string) => {
    if (!order) return;
    
    try {
      // Use the same API endpoint but mark it as a resend
      const response = await fetch(`/api/admin/orders/${orderId}/send-proof`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proofUrl: proofUrl,
          isRevision: order.proof && (order.proof.revisionCount ?? 0) > 0,
          isResend: true
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const sendRecord = result.sendRecord;
        
        // Update the order with the new send record
        const updatedOrder = {
          ...order,
          proof: {
            ...order.proof!,
            // Add the send record to history
            sendHistory: [
              ...(order.proof?.sendHistory || []),
              sendRecord
            ]
          }
        };
        
        onOrderUpdate(updatedOrder);
        
        alert(`Proof resent successfully to ${result.sentTo}!`);
      } else {
        const error = await response.json();
        alert(`Failed to resend proof: ${error.error}`);
      }
    } catch (error) {
      console.error('Error resending proof:', error);
      alert('Failed to resend proof. Please try again.');
    }
  }, [order, orderId, onOrderUpdate]);

  return {
    uploading,
    uploadedProofUrl,
    handleUploadProof,
    sendProofToCustomer,
    resendProof,
    resetUploadState
  };
};
