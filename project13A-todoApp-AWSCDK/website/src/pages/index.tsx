import React, { useState } from "react";
import LeftSide from '../components/LeftSide'
import RightSide from '../components/RightSide'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


export default function Home() {
  const [isSubmit, setIsSubmit] = useState(false)

  return (
    <div className="container">
      <Typography variant="h3" sx={{ textAlign: 'center' }}>CDK TodoList</Typography>
      <Box
        sx={{ display: "flex", width: '100%' }}
      >
        <LeftSide setIsSubmit={setIsSubmit} />
        <RightSide isSubmit={isSubmit} setIsSubmit={setIsSubmit} />
      </Box>
    </div>)
}
