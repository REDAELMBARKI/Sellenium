<?php

return [
    'application_name' => env('GOOGLE_APPLICATION_NAME', 'Laravel Google Sheets'),
    'credentials_path' => storage_path('app/google/credentials.json'),
    'spreadsheet_id' => env('GOOGLE_SPREADSHEET_ID'),
];
// ```

// Add to `.env`:
// ```
// GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here