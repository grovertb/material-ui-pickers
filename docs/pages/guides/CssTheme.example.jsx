import React, { useState } from 'react';
import lime from '@krowdy-ui/core/colors/lime';
import { createMuiTheme } from '@krowdy-ui/core';
import { ThemeProvider } from '@krowdy-ui/styles';
import { DateTimePicker } from '@krowdy-ui/pickers';

const defaultMaterialTheme = createMuiTheme({
  palette: {
    primary: lime,
  },
});

function CssThemeExample() {
  const [selectedDate, handleDateChange] = useState(new Date());

  return (
    <ThemeProvider theme={defaultMaterialTheme}>
      <DateTimePicker
        label="Lime DateTimePicker"
        value={selectedDate}
        onChange={handleDateChange}
        animateYearScrolling={false}
      />
    </ThemeProvider>
  );
}

export default CssThemeExample;
