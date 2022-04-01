import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function CircularLoader() {
  return (
    <Box className="mainCircularLoaderDiv" sx={{ display: 'flex', position: "absolute" }}>
      <CircularProgress />
    </Box>
  );
}