import React, { useState } from 'react';
import { createMuiTheme } from '@krowdy-ui/core';
import { ThemeProvider } from '@krowdy-ui/styles';
import { DateTimePicker } from '@krowdy-ui/pickers';

const defaultMaterialTheme = createMuiTheme({
  spacing: 2,
});

function CssThemeExample() {
  const [selectedDate, handleDateChange] = useState(new Date());

  return (
    <ThemeProvider theme={defaultMaterialTheme}>
      <DateTimePicker label="2px spacing" value={selectedDate} onChange={handleDateChange} />
    </ThemeProvider>
  );
}

export default CssThemeExample;
