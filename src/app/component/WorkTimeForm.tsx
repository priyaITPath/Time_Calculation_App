"use client"
import React, { useState } from 'react';
import { TextField, Button, IconButton, Box, Snackbar, Alert } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

interface BreakTime {
  breakStart: string;
  breakEnd: string;
}

const WorkTimeForm = () => {
  const [loginTime, setLoginTime] = useState('');
  const [breakTimes, setBreakTimes] = useState<BreakTime[]>([]);
  const [logoutTime, setLogoutTime] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleAddBreakTime = () => {
    setBreakTimes([...breakTimes, { breakStart: '', breakEnd: '' }]);
  };

  const handleRemoveBreakTime = (index: number) => {
    const updatedBreakTimes = breakTimes.filter((_, i) => i !== index);
    setBreakTimes(updatedBreakTimes);
  };

  const handleCalculateLogoutTime = () => {
    if (!loginTime) {
      setSnackbarMessage('Please enter the login time');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
  
    const hasEmptyBreakTime = breakTimes.some(({ breakStart, breakEnd }) => !breakStart || !breakEnd);
    if (hasEmptyBreakTime) {
      setSnackbarMessage('Please enter all break start and end times');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
  
    const isBreakValid = breakTimes.every(({ breakStart, breakEnd }) => {
      const breakStartDate = new Date(`2025-01-01T${breakStart}:00`);
      const breakEndDate = new Date(`2025-01-01T${breakEnd}:00`);
      return breakEndDate > breakStartDate; // Break end should be after break start
    });
  
    if (!isBreakValid) {
      setSnackbarMessage('Break end time must be after break start time');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
  
    const loginDate = new Date(`2025-01-01T${loginTime}:00`);
    let totalBreakTimeInMinutes = 0;
  
    breakTimes.forEach(({ breakStart, breakEnd }) => {
      const breakStartDate = new Date(`2025-01-01T${breakStart}:00`);
      const breakEndDate = new Date(`2025-01-01T${breakEnd}:00`);
      totalBreakTimeInMinutes += (breakEndDate.getTime() - breakStartDate.getTime()) / 60000;
    });
  
    const workTimeInMinutes = 8.5 * 60;
    const logoutDate = new Date(loginDate.getTime() + (workTimeInMinutes + totalBreakTimeInMinutes) * 60000);
  
    let hours = logoutDate.getHours();
    const minutes = logoutDate.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12; 
    hours = hours ? hours : 12; 
    
    const formattedLogoutTime = `${hours}:${minutes} ${ampm}`;
    setLogoutTime(formattedLogoutTime);
    setSnackbarMessage('Logout time calculated successfully!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };  

  return (
    <div className="max-w-md mx-auto mt-10 p-9 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold text-center mb-4">Work Time Calculator</h2>

      <Box mb={4}>
        <TextField
          fullWidth
          label="Login Time"
          type="time"
          value={loginTime}
          onChange={(e) => setLoginTime(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>

      {breakTimes.map((_, index) => (
        <Box key={index} mb={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
            <Box width="48%">
              <TextField
                fullWidth
                label={`Break Start ${index + 1}`}
                type="time"
                value={breakTimes[index].breakStart}
                onChange={(e) => {
                  const newBreakTimes = [...breakTimes];
                  newBreakTimes[index].breakStart = e.target.value;
                  setBreakTimes(newBreakTimes);
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>

            <Box width="48%">
              <TextField
                fullWidth
                label={`Break End ${index + 1}`}
                type="time"
                value={breakTimes[index].breakEnd}
                onChange={(e) => {
                  const newBreakTimes = [...breakTimes];
                  newBreakTimes[index].breakEnd = e.target.value;
                  setBreakTimes(newBreakTimes);
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: breakTimes[index].breakStart,
                }}
              />
            </Box>

            <IconButton
              onClick={() => handleRemoveBreakTime(index)}
              color="error"
              sx={{ marginLeft: 1 }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      ))}

      <Button
        variant="contained"
        fullWidth
        color="primary"
        onClick={handleAddBreakTime}
        sx={{ mb: 4 }}
      >
        Add Break Time
      </Button>

      <Button
        variant="contained"
        fullWidth
        color="success"
        onClick={handleCalculateLogoutTime}
      >
        Calculate Logout Time
      </Button>

      {logoutTime && (
        <Box mt={4} textAlign="center" sx={{ color: 'darkslategrey' }}>
          <h3>Your Logout Time:</h3>
          <p className="text-lg">{logoutTime}</p>
        </Box>
      )}

      <Snackbar open={snackbarOpen} onClose={() => setSnackbarOpen(false)} autoHideDuration={6000}>
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default WorkTimeForm;
