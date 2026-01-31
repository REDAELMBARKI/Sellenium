<?php

return [
    'application_name' => env('APP_NAME', 'MyEcomApp'),
    'redirect_uri' => 'http://localhost:8000/sheetAuth/google/callback' ,
    'oauth_credentials_path' => storage_path('app/google/google-credentials.json'),
];
