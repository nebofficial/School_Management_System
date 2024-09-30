import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Paper, Box, Checkbox } from '@mui/material';
import { getAllComplains } from '../../../redux/complainRelated/complainHandle';
import TableTemplate from '../../../components/TableTemplate';

const SeeComplains = () => {
  const dispatch = useDispatch();
  const { complainsList, loading, error, response } = useSelector((state) => state.complain);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getAllComplains(currentUser._id, "Complain"));
    }
  }, [currentUser._id, dispatch]);

  if (error) {
    console.error("Error loading complains:", error);
  }

  const complainColumns = [
    { id: 'user', label: 'User', minWidth: 170 },
    { id: 'complaint', label: 'Complaint', minWidth: 100 },
    { id: 'date', label: 'Date', minWidth: 170 },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (date.toString() === "Invalid Date") return "Invalid Date";
    return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(date);
  };

  const complainRows = Array.isArray(complainsList) ? complainsList.map((complain) => ({
    user: complain.user?.name || "N/A",
    complaint: complain.complaint,
    date: formatDate(complain.date),
    id: complain._id,
  })) : [];

  const ComplainButtonHaver = () => <Checkbox inputProps={{ 'aria-label': 'Complaint Checkbox' }} />;

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {response ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              No Complaints Right Now
            </Box>
          ) : (
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              {complainRows.length > 0 ? (
                <TableTemplate buttonHaver={ComplainButtonHaver} columns={complainColumns} rows={complainRows} />
              ) : (
                <Box sx={{ textAlign: 'center', padding: '16px' }}>No Complaints Available</Box>
              )}
            </Paper>
          )}
        </>
      )}
    </>
  );
};

export default SeeComplains;
